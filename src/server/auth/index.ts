import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI, admin } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { db } from '~/server/db';
import { cache } from 'react';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7, // 7 days
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {},
  rateLimit: {
    window: 60, // time window in seconds
    max: 5, // max requests in the window
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
} satisfies BetterAuthOptions);

export const getServerSession = cache(
  async () =>
    await auth.api.getSession({
      headers: await headers(),
    }),
);

export type Session = typeof auth.$Infer.Session;
export type AuthUserType = Session['user'];
