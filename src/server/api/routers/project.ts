import { z } from 'zod';
import { projects, teams, issues, projectMembers } from '~/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, companyProcedure } from '~/server/api/trpc';

export const projectRouter = createTRPCRouter({
  getAllProjects: companyProcedure.query(async ({ ctx }) => {
    const allProjects = await ctx.db
      .select()
      .from(projects)
      .where(eq(projects.companyId, ctx.companyId))
      .orderBy(desc(projects.createdAt));

    const projectsWithTeamMembers = await Promise.all(
      allProjects.map(async (project) => {
        const teamMembers = await ctx.db
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
          .where(eq(projectMembers.projectId, project.id));

        const projectIssues = await ctx.db
          .select()
          .from(issues)
          .where(eq(issues.projectId, project.id));

        return {
          ...project,
          issues: projectIssues,
          teamMembers,
        };
      }),
    );

    return projectsWithTeamMembers;
  }),
  getProjectById: companyProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      const projectDetails = await ctx.db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.companyId, ctx.companyId),
          ),
        )
        .limit(1);

      if (!projectDetails.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found or you do not have access to it',
        });
      }

      return { ...projectDetails[0], teamMembers: projectTeamMembers };
    }),
  getDetailProjectById: companyProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      return {
        ...project[0],
        issues: projectIssues,
        teamMembers: projectTeamMembers,
      };
    }),

  createProjectWithTeamMembers: companyProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(['planning', 'in_progress', 'completed', 'pending']),
        progress: z.number().default(0),
        dueDate: z.number().optional(),
        teamMembers: z.array(z.string().min(1)),
        role: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [project] = await tx
          .insert(projects)
          .values({
            name: input.name,
            description: input.description,
            status: input.status,
            progress: input.progress,
            dueDate: input.dueDate,
            companyId: ctx.companyId,
          })
          .returning({ id: projects.id });

        if (!project?.id) {
          throw new Error('Failed to create project');
        }

        const projectMembersToInsert = input.teamMembers.map((teamId) => ({
          projectId: project.id,
          teamId,
          createdAt: new Date(),
        }));

        await tx.insert(projectMembers).values(projectMembersToInsert);

        return project;
      });
    }),

  editProject: companyProcedure
    .input(
      z.object({
        projectId: z.number(),
        name: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(['planning', 'in_progress', 'completed', 'pending']),
        progress: z.number().default(0),
        dueDate: z.number().optional(),
        teamMembers: z.array(z.string().min(1)),
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

      return await ctx.db.transaction(async (tx) => {
        await tx
          .update(projects)
          .set({
            name: input.name,
            description: input.description,
            status: input.status,
            progress: input.progress,
            dueDate: input.dueDate,
          })
          .where(eq(projects.id, input.projectId));

        await tx
          .delete(projectMembers)
          .where(eq(projectMembers.projectId, input.projectId));

        if (input.teamMembers.length > 0) {
          const projectMembersToInsert = input.teamMembers.map((teamId) => ({
            projectId: input.projectId,
            teamId,
            createdAt: new Date(),
          }));

          await tx.insert(projectMembers).values(projectMembersToInsert);
        }

        const updatedTeamMembers = await tx
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

        return {
          projectId: input.projectId,
          teamMembers: updatedTeamMembers,
        };
      });
    }),
});
