import { z } from 'zod';
import { issues, projects, teams } from '~/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  protectedProcedure,
  companyProcedure,
} from '~/server/api/trpc';

export const issueRouter = createTRPCRouter({
  getAllIssues: companyProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: issues.id,
        name: issues.name,
        description: issues.description,
        projectId: issues.projectId,
        projectName: projects.name,
        assignedTo: issues.assignedTo,
        assigneeName: teams.name,
        priority: issues.priority,
        status: issues.status,
        createdAt: issues.createdAt,
        updatedAt: issues.updatedAt,
      })
      .from(issues)
      .leftJoin(projects, eq(issues.projectId, projects.id))
      .leftJoin(teams, eq(issues.assignedTo, teams.id))
      .where(eq(projects.companyId, ctx.companyId))
      .orderBy(desc(issues.createdAt));
  }),

  getIssuesByProject: companyProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // First verify the project belongs to the user's company
      const project = await ctx.db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!project.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found or you do not have access to it',
        });
      }

      return await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          projectId: issues.projectId,
          projectName: projects.name,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          priority: issues.priority,
          status: issues.status,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(eq(issues.projectId, input.projectId))
        .orderBy(desc(issues.createdAt));
    }),

  getIssueById: companyProcedure
    .input(
      z.object({
        issueId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          projectId: issues.projectId,
          projectName: projects.name,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          priority: issues.priority,
          status: issues.status,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(
          and(
            eq(issues.id, input.issueId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!result.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Issue not found or you do not have access to it',
        });
      }

      return result[0];
    }),

  create: companyProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        projectId: z.number(),
        assignedTo: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']),
        status: z.enum(['open', 'in_progress', 'closed']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!project.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found or you do not have access to it',
        });
      }

      let assignedToId = null;
      if (input.assignedTo) {
        assignedToId = input.assignedTo;
        const teamMember = await ctx.db
          .select()
          .from(teams)
          .where(
            and(eq(teams.id, assignedToId), eq(teams.companyId, ctx.companyId)),
          )
          .limit(1);

        if (!teamMember.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Team member not found or you do not have access to it',
          });
        }
      }

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

      if (!result[0]) {
        throw new Error('Failed to create issue');
      }

      const createdIssue = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          projectId: issues.projectId,
          projectName: projects.name,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          priority: issues.priority,
          status: issues.status,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(eq(issues.id, result[0].id))
        .limit(1);

      return createdIssue[0] || { id: result[0].id };
    }),

  updateStatus: companyProcedure
    .input(
      z.object({
        issueId: z.number(),
        status: z.enum(['open', 'in_progress', 'closed']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify the issue belongs to a project in the user's company
      const issue = await ctx.db
        .select()
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .where(
          and(
            eq(issues.id, input.issueId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!issue.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Issue not found or you do not have access to it',
        });
      }

      await ctx.db
        .update(issues)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, input.issueId));

      const updatedIssue = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          projectId: issues.projectId,
          projectName: projects.name,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          priority: issues.priority,
          status: issues.status,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(eq(issues.id, input.issueId))
        .limit(1);

      return updatedIssue[0];
    }),

  updatePriority: companyProcedure
    .input(
      z.object({
        issueId: z.number(),
        priority: z.enum(['low', 'medium', 'high']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const issue = await ctx.db
        .select()
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .where(
          and(
            eq(issues.id, input.issueId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!issue.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Issue not found or you do not have access to it',
        });
      }

      await ctx.db
        .update(issues)
        .set({
          priority: input.priority,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, input.issueId));

      const updatedIssue = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          projectId: issues.projectId,
          projectName: projects.name,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          priority: issues.priority,
          status: issues.status,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(eq(issues.id, input.issueId))
        .limit(1);

      return updatedIssue[0];
    }),
});
