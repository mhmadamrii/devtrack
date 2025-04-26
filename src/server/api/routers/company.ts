import { z } from 'zod';
import { projects, companies } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const companyRouter = createTRPCRouter({
  getAvailableCompanies: publicProcedure.query(async ({ ctx }) => {
    const allCompanies = await ctx.db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));

    return allCompanies;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        referral: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(companies).values({
        name: input.name,
      });

      return result;
    }),
});
