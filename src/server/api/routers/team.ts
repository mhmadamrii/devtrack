import { z } from 'zod';
import { teams, issues, projectMembers, projects } from '~/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  companyProcedure,
} from '~/server/api/trpc';

export const teamRouter = createTRPCRouter({
  getAllTeams: companyProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(teams)
      .where(eq(teams.companyId, ctx.companyId));
  }),
  getTeamById: companyProcedure
    .input(
      z.object({
        teamId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the team member details
      const teamMember = await ctx.db
        .select()
        .from(teams)
        .where(
          and(eq(teams.id, input.teamId), eq(teams.companyId, ctx.companyId)),
        )
        .limit(1);

      if (!teamMember.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team member not found or you do not have access to it',
        });
      }

      // Get the team member's projects
      const memberProjects = await ctx.db
        .select({
          projectId: projects.id,
          projectName: projects.name,
          projectRole: projectMembers.role,
        })
        .from(projectMembers)
        .innerJoin(projects, eq(projectMembers.projectId, projects.id))
        .where(
          and(
            eq(projectMembers.teamId, input.teamId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(3);

      // Get the team member's assigned issues
      const assignedIssues = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          priority: issues.priority,
          status: issues.status,
          projectId: issues.projectId,
          projectName: projects.name,
        })
        .from(issues)
        .leftJoin(projects, eq(issues.projectId, projects.id))
        .where(
          and(
            eq(issues.assignedTo, input.teamId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .orderBy(desc(issues.createdAt))
        .limit(3);

      return [
        {
          ...teamMember[0],
          projects: memberProjects,
          assignedIssues: assignedIssues,
        },
      ];
    }),
  create: companyProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        status: z.string().default('Active'),
        role: z
          .enum([
            'Developer',
            'Designer',
            'QA Engineer',
            'Project Manager',
            'Frontend Developer',
            'Backend Developer',
            'Fullstack Developer',
            'Mobile Developer',
            'DevOps Engineer',
            'Other',
          ])
          .default('Developer'),
        department: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(teams).values({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        role: input.role ?? 'Developer',
        department: input.department ?? null,
        companyId: ctx.companyId,
      });
    }),
});
