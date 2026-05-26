import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "~/../drizzle/schema";

export interface Env {
  // Bindings for environment variables and resources
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
  RESEND_API_KEY?: string;
  // Fallbacks or other bindings can go here
  [key: string]: any;
}

export interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
  noURI: boolean;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
}

/**
 * Cloudflare Workers Cron Trigger Handler
 * This handler is invoked when a configured cron schedule triggers.
 */
export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const triggerTime = new Date(event.scheduledTime).toISOString();
    console.log(`[Cron] Triggered job "${event.cron}" at ${triggerTime}`);

    // Use ctx.waitUntil to keep the worker running until the asynchronous task finishes.
    ctx.waitUntil(
      runCronTasks(event, env)
        .then(() => {
          console.log(`[Cron] Successfully completed job: ${event.cron}`);
        })
        .catch((error) => {
          console.error(`[Cron] Failed job: ${event.cron}`, error);
        })
    );
  },
};

/**
 * Orchestrator for background tasks triggered by cron.
 */
async function runCronTasks(event: ScheduledEvent, env: Env): Promise<void> {
  // 1. Initialize the database client using worker bindings if available, otherwise fallback to process.env
  const dbUrl = env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
  const dbToken = env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.warn("[Cron] TURSO_DATABASE_URL is not set. Skipping database-related cron tasks.");
  } else {
    const client = createClient({
      url: dbUrl,
      authToken: dbToken,
    });
    const db = drizzle(client, { schema });
    
    // Example Task: Cleanup expired sessions or user invites
    console.log("[Cron] Running database maintenance tasks...");
    await performDbCleanup(db);
  }

  // 2. Perform other routine checks / jobs based on the cron trigger pattern
  switch (event.cron) {
    case "0 0 * * *": // Daily at midnight
      console.log("[Cron] Running daily tasks (e.g. daily summaries, notifications)...");
      await sendDailyDigest(env);
      break;

    case "0 * * * *": // Hourly
      console.log("[Cron] Running hourly tasks (e.g. cache syncing, system health checks)...");
      break;

    default:
      console.log(`[Cron] Running default tasks for cron schedule: ${event.cron}`);
  }
}

/**
 * Example Task: database cleanup
 */
async function performDbCleanup(db: any): Promise<void> {
  // Implement actual query here. For example:
  // await db.delete(schema.session).where(lt(schema.session.expiresAt, new Date()));
  console.log("[Cron] Expired session cleanup simulated successfully.");
}

/**
 * Example Task: send daily digest email
 */
async function sendDailyDigest(env: Env): Promise<void> {
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Cron] RESEND_API_KEY is not set. Skipping daily digest email.");
    return;
  }
  // Implement email sending logic here
  console.log("[Cron] Daily digest emails sent successfully.");
}
