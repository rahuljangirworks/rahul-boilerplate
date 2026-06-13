/**
 * Cloudflare Workers Cron Trigger Handler (Stub for Demo Mode)
 *
 * In production, replace with real cron task implementations.
 */

export interface Env {
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
  RESEND_API_KEY?: string;
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

export default {
  async scheduled(
    event: ScheduledEvent,
    _env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const triggerTime = new Date(event.scheduledTime).toISOString();
    console.log(`[Cron] Triggered job "${event.cron}" at ${triggerTime}`);
    ctx.waitUntil(Promise.resolve());
  },
};
