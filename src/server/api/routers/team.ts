import { z } from 'zod';
import { teams, issues, projectMembers, projects } from '~/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const teamRouter = createTRPCRouter({
  getAllTeams: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(teams);
  }),
  getTeamById: publicProcedure
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
        .where(eq(teams.id, input.teamId))
        .limit(1);

      if (!teamMember.length) {
        return [];
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
        .where(eq(projectMembers.teamId, input.teamId))
        .limit(3); // Limit to 3 most recent projects

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
        .where(eq(issues.assignedTo, input.teamId))
        .orderBy(desc(issues.createdAt))
        .limit(3); // Limit to 3 most recent issues

      // Return the team member with their projects and issues
      return [
        {
          ...teamMember[0],
          projects: memberProjects,
          assignedIssues: assignedIssues,
        },
      ];
    }),
  create: protectedProcedure
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
        // status: input.status ?? 'Active', // add this later on
      });
    }),
});
