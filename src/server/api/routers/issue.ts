import { z } from 'zod';
import { issues, projects, teams } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const issueRouter = createTRPCRouter({
  getAllIssues: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(issues);
  }),

  getIssuesByProject: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(issues)
        .where(eq(issues.projectId, input.projectId));
    }),

  getIssueById: publicProcedure
    .input(
      z.object({
        issueId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(issues)
        .where(eq(issues.id, input.issueId))
        .limit(1);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        projectId: z.number(),
        assignedTo: z.string().optional(), // This will be converted to number
        priority: z.enum(['low', 'medium', 'high']),
        status: z.enum(['open', 'in_progress', 'closed']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate project exists
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (project.length === 0) {
        throw new Error('Project not found');
      }

      // Validate team member exists if provided
      let assignedToId = null;
      if (input.assignedTo) {
        assignedToId = parseInt(input.assignedTo, 10);
        const teamMember = await ctx.db
          .select()
          .from(teams)
          .where(eq(teams.id, assignedToId))
          .limit(1);

        if (teamMember.length === 0) {
          throw new Error('Team member not found');
        }
      }

      // Insert the issue
      const result = await ctx.db
        .insert(issues)
        .values({
          name: input.name,
          description: input.description,
          projectId: input.projectId,
          assignedTo: assignedToId,
          priority: input.priority,
          status: input.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: issues.id });

      return result[0];
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        issueId: z.number(),
        status: z.enum(['open', 'in_progress', 'closed']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(issues)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, input.issueId));
    }),

  updatePriority: protectedProcedure
    .input(
      z.object({
        issueId: z.number(),
        priority: z.enum(['low', 'medium', 'high']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(issues)
        .set({
          priority: input.priority,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, input.issueId));
    }),

  updateAssignee: protectedProcedure
    .input(
      z.object({
        issueId: z.number(),
        assignedTo: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validate team member exists if provided
      if (input.assignedTo !== null) {
        const teamMember = await ctx.db
          .select()
          .from(teams)
          .where(eq(teams.id, input.assignedTo))
          .limit(1);

        if (teamMember.length === 0) {
          throw new Error('Team member not found');
        }
      }

      await ctx.db
        .update(issues)
        .set({
          assignedTo: input.assignedTo,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, input.issueId));
    }),
});
