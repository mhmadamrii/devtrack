import { z } from 'zod';
import { projects, teams, issues, projectMembers } from '~/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const projectRouter = createTRPCRouter({
  getAllProjects: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(projects);
  }),
  getProjectById: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);
    }),
  getDetailProjectById: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the project details
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project.length) {
        throw new Error('Project not found');
      }

      // Get the project issues
      const projectIssues = await ctx.db
        .select({
          id: issues.id,
          name: issues.name,
          description: issues.description,
          priority: issues.priority,
          status: issues.status,
          assignedTo: issues.assignedTo,
          assigneeName: teams.name,
          createdAt: issues.createdAt,
          updatedAt: issues.updatedAt,
        })
        .from(issues)
        .leftJoin(teams, eq(issues.assignedTo, teams.id))
        .where(eq(issues.projectId, input.projectId))
        .orderBy(desc(issues.createdAt));

      // Get the project team members
      const projectTeamMembers = await ctx.db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          teamEmail: teams.email,
          teamRole: teams.role,
          teamDepartment: teams.department,
          projectRole: projectMembers.role,
        })
        .from(projectMembers)
        .innerJoin(teams, eq(projectMembers.teamId, teams.id))
        .where(eq(projectMembers.projectId, input.projectId));

      // Return the project with its related data
      return {
        ...project[0],
        issues: projectIssues,
        teamMembers: projectTeamMembers,
      };
    }),
  editProject: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        name: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(['planning', 'in_progress', 'completed', 'pending']),
        progress: z.number().default(0),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projects)
        .set({
          name: input.name,
          description: input.description,
          status: input.status,
          progress: input.progress,
          dueDate: input.dueDate,
        })
        .where(eq(projects.id, input.projectId));
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(['planning', 'in_progress', 'completed', 'pending']),
        progress: z.number().default(0),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(projects)
        .values({
          name: input.name,
          description: input.description,
          status: input.status,
          progress: input.progress,
          dueDate: input.dueDate,
        })
        .returning({ id: projects.id });

      return result[0];
    }),

  addTeamMember: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        teamId: z.number(),
        role: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if project exists
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project.length) {
        throw new Error('Project not found');
      }

      // Check if team member exists
      const teamMember = await ctx.db
        .select()
        .from(teams)
        .where(eq(teams.id, input.teamId))
        .limit(1);

      if (!teamMember.length) {
        throw new Error('Team member not found');
      }

      // Check if the team member is already assigned to the project
      const existingMembers = await ctx.db
        .select()
        .from(projectMembers)
        .where(eq(projectMembers.projectId, input.projectId));

      const existingMember = existingMembers.filter(
        (member) => member.teamId === input.teamId,
      );

      if (existingMember.length) {
        throw new Error('Team member is already assigned to this project');
      }

      // Add team member to project
      await ctx.db.insert(projectMembers).values({
        projectId: input.projectId,
        teamId: input.teamId,
        role: input.role || null,
        createdAt: new Date(),
      });

      // Return the updated project with team members
      return await ctx.db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          teamEmail: teams.email,
          teamRole: teams.role,
          teamDepartment: teams.department,
          projectRole: projectMembers.role,
        })
        .from(projectMembers)
        .innerJoin(teams, eq(projectMembers.teamId, teams.id))
        .where(eq(projectMembers.projectId, input.projectId));
    }),

  removeTeamMember: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        teamId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if project exists
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project.length) {
        throw new Error('Project not found');
      }

      // Check if team member exists
      const teamMember = await ctx.db
        .select()
        .from(teams)
        .where(eq(teams.id, input.teamId))
        .limit(1);

      if (!teamMember.length) {
        throw new Error('Team member not found');
      }

      // Check if the team member is assigned to the project
      const existingMembers = await ctx.db
        .select()
        .from(projectMembers)
        .where(eq(projectMembers.projectId, input.projectId));

      const existingMember = existingMembers.filter(
        (member) => member.teamId === input.teamId,
      );

      if (!existingMember.length) {
        throw new Error('Team member is not assigned to this project');
      }

      // Remove team member from project
      await ctx.db
        .delete(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, input.projectId),
            eq(projectMembers.teamId, input.teamId),
          ),
        );

      // Return the updated project with team members
      return await ctx.db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          teamEmail: teams.email,
          teamRole: teams.role,
          teamDepartment: teams.department,
          projectRole: projectMembers.role,
        })
        .from(projectMembers)
        .innerJoin(teams, eq(projectMembers.teamId, teams.id))
        .where(eq(projectMembers.projectId, input.projectId));
    }),
});
