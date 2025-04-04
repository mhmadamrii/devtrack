import { z } from 'zod';
import { projects } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const projectRouter = createTRPCRouter({
  getAllProjects: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(projects);
  }),
  getProjectById: protectedProcedure
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
  create: publicProcedure
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
      await ctx.db.insert(projects).values({
        name: input.name,
        description: input.description,
        status: input.status,
        progress: input.progress,
        dueDate: input.dueDate,
      });
    }),
});
