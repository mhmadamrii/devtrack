import { z } from 'zod';
import { user } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  updateOnboardingStatus: protectedProcedure
    .input(
      z.object({
        onboarded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Make sure we have a session and user
      if (!ctx.session || !ctx.session.user) {
        throw new Error('Not authenticated');
      }

      const userId = ctx.session.user.id;

      // Update the user's onboarded status
      await ctx.db
        .update(user)
        .set({
          onboarded: input.onboarded,
          updatedAt: new Date(),
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
