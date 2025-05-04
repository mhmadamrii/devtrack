import { z } from 'zod';
import { companies } from '~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';

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
        company_password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(companies).values({
        name: input.name,
        company_password: input.company_password,
      });

      return result;
    }),
  verifyCompany: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        company_password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const mycompanies = await ctx.db.select().from(companies);
      console.log('-------->', mycompanies);
      const company = await ctx.db
        .select({
          id: companies.id,
          name: companies.name,
          company_password: companies.company_password,
        })
        .from(companies)
        .where(
          and(
            eq(companies.id, input.companyId),
            eq(companies.company_password, input.company_password),
          ),
        )
        .limit(1);

      console.log('company', company);
      if (company.length === 0) {
        return {
          error: true,
          message: 'Invalid company password',
        };
      }

      return company[0];
    }),
});
