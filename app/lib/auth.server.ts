import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, twoFactor, genericOAuth, customSession } from "better-auth/plugins";
import { env } from "~/lib/env";
import { db } from "~/server/db";
import * as schema from "~/../drizzle/schema";

const trustedOrigins = [
  env.BETTER_AUTH_URL,
  env.PUBLIC_APP_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://0.0.0.0:5173",
  "http://localhost:*",
  "http://127.0.0.1:*",
  "http://0.0.0.0:*",
].filter((origin): origin is string => Boolean(origin));

// Build OAuth providers from env — only enabled when credentials are present
const oAuthProviders: { providerId: string; clientId: string; clientSecret: string; scope?: string[] }[] = [];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  oAuthProviders.push({
    providerId: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    scope: ["openid", "email", "profile"],
  });
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  oAuthProviders.push({
    providerId: "github",
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    scope: ["read:user", "user:email"],
  });
}

if (env.SLACK_CLIENT_ID && env.SLACK_CLIENT_SECRET) {
  oAuthProviders.push({
    providerId: "slack",
    clientId: env.SLACK_CLIENT_ID,
    clientSecret: env.SLACK_CLIENT_SECRET,
    scope: ["openid", "email", "profile"],
  });
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      // TODO: Integrate with Resend or your email provider
      console.log(`[Auth] Password reset for ${user.email}: ${url}`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // TODO: Integrate with Resend or your email provider
      console.log(`[Auth] Email verification for ${user.email}: ${url}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [
    admin(),
    twoFactor(),
    ...oAuthProviders.map((p) =>
      genericOAuth({
        config: [
          {
            providerId: p.providerId,
            clientId: p.clientId,
            clientSecret: p.clientSecret,
            scope: p.scope,
          },
        ],
      })
    ),
    customSession(async ({ user, session }) => {
      // Attach user roles and permissions to the session
      const userRoles = await db.query.userRoles.findMany({
        where: (ur, { eq }) => eq(ur.userId, user.id),
        with: {
          role: {
            with: {
              rolePermissions: {
                with: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const roles = userRoles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.name)
          )
        ),
      ];

      return {
        user: {
          ...user,
          roles,
          permissions,
        },
        session,
      };
    }),
  ],
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session;
