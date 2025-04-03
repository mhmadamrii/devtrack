import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { projects } from '~/server/db/schema';

export const projectRouter = createTRPCRouter({
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
