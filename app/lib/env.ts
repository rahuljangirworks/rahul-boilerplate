import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1).optional(),
    R2_ENDPOINT: z.string().url().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
  },
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
