import { z } from 'zod';
import { teams, user } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

import {
  companyProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  updateOnboardingStatus: companyProcedure
    .input(
      z.object({
        name: z.string().min(1),
        onboarded: z.boolean(),
        role: z.string().min(1),
        companyId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new Error('Not authenticated');
      }

      const userId = ctx.session.user.id;

      const newTeam = await ctx.db
        .insert(teams)
        .values({
          name: input.name,
          email: ctx.session.user.email,
          phone: null,
          role: 'Developer',
          department: null,
          companyId: ctx.companyId,
        })
        .returning({ id: teams.id });

      if (!newTeam) {
        return;
      }

      await ctx.db
        .update(user)
        .set({
          name: input.name,
          emailVerified: true,
          onboarded: input.onboarded,
          role: input.role,
          updatedAt: new Date(),
          companyId: input.companyId,
        })
        .where(eq(user.id, userId));

      return { success: true };
    }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    // Make sure we have a session and user
    if (!ctx.session || !ctx.session.user) {
      throw new Error('Not authenticated');
    }

    const userId = ctx.session.user.id;

    // Get the user from the database
    const userData = await ctx.db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData || userData.length === 0) {
      throw new Error('User not found');
    }

    return userData[0];
  }),
});
