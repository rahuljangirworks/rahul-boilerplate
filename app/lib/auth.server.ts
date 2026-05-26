import { betterAuth } from "better-auth";
import { env } from "~/lib/env";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: env.TURSO_DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});
