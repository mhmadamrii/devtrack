import { z } from 'zod';
import { teams } from '~/server/db/schema';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const teamRouter = createTRPCRouter({
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(teams);
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
