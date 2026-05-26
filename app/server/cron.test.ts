import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import cronHandler from "./cron";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Mock `@libsql/client`
vi.mock("@libsql/client", () => {
  const mockClient = {
    execute: vi.fn(),
    batch: vi.fn(),
  };
  return {
    createClient: vi.fn(() => mockClient),
  };
});

// Mock `drizzle-orm/libsql`
vi.mock("drizzle-orm/libsql", () => {
  const mockDb = {
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  };
  return {
    drizzle: vi.fn(() => mockDb),
  };
});

describe("Cloudflare Workers Cron Trigger Handler", () => {
  let consoleLogSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Spy on console methods to assert and to prevent output pollution
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  const createMockCtx = () => {
    const promises: Promise<any>[] = [];
    return {
      ctx: {
        waitUntil(promise: Promise<any>) {
          promises.push(promise);
        },
      },
      promises,
    };
  };

  it("should trigger a daily cron job successfully and call correct handlers", async () => {
    const { ctx, promises } = createMockCtx();
    const event = {
      cron: "0 0 * * *",
      scheduledTime: new Date("2026-05-26T00:00:00Z").getTime(),
      noURI: false,
    };
    const env = {
      RESEND_API_KEY: "re_mock_key",
    };

    await cronHandler.scheduled(event, env, ctx);
    
    // Wait for the waitUntil promises to settle
    await Promise.all(promises);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Cron] Triggered job "0 0 * * *"'));
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("TURSO_DATABASE_URL is not set"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Running daily tasks"));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Daily digest emails sent successfully."));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Successfully completed job: 0 0 * * *"));
  });

  it("should trigger hourly tasks when hourly cron runs", async () => {
    const { ctx, promises } = createMockCtx();
    const event = {
      cron: "0 * * * *",
      scheduledTime: Date.now(),
      noURI: false,
    };
    const env = {};

    await cronHandler.scheduled(event, env, ctx);
    await Promise.all(promises);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Running hourly tasks"));
  });

  it("should trigger default tasks for an arbitrary pattern", async () => {
    const { ctx, promises } = createMockCtx();
    const event = {
      cron: "*/5 * * * *",
      scheduledTime: Date.now(),
      noURI: false,
    };
    const env = {};

    await cronHandler.scheduled(event, env, ctx);
    await Promise.all(promises);

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Running default tasks for cron schedule: */5 * * * *"));
  });

  it("should initialize database client and run DB cleanup when database credentials are provided", async () => {
    const { ctx, promises } = createMockCtx();
    const event = {
      cron: "0 * * * *",
      scheduledTime: Date.now(),
      noURI: false,
    };
    const env = {
      TURSO_DATABASE_URL: "libsql://test-db.turso.io",
      TURSO_AUTH_TOKEN: "mock-token",
    };

    await cronHandler.scheduled(event, env, ctx);
    await Promise.all(promises);

    expect(createClient).toHaveBeenCalledWith({
      url: "libsql://test-db.turso.io",
      authToken: "mock-token",
    });
    expect(drizzle).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Running database maintenance tasks..."));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Expired session cleanup simulated successfully."));
  });

  it("should handle error in background tasks gracefully and log the error", async () => {
    const { ctx, promises } = createMockCtx();
    const event = {
      cron: "0 0 * * *",
      scheduledTime: Date.now(),
      noURI: false,
    };
    
    // Provoke an error in daily digest by spying and mocking an issue
    // E.g., make custom logic throw. Let's pass a bad value or throw in one of the tasks
    // To do this simply, we can stub/mock one of the functions or just mock the environment variables to trigger a throw.
    // For a clean test, let's mock one of the operations to throw.
    // We can temporarily throw inside performDbCleanup or createClient.
    (createClient as any).mockImplementationOnce(() => {
      throw new Error("Database Connection Failed");
    });

    const env = {
      TURSO_DATABASE_URL: "libsql://error-db.turso.io",
      TURSO_AUTH_TOKEN: "mock-token",
    };

    await cronHandler.scheduled(event, env, ctx);
    
    // Catch errors inside waitUntil
    await Promise.all(promises.map(p => p.catch(() => {})));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed job: 0 0 * * *"),
      expect.any(Error)
    );
  });
});
