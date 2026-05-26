import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock env variables before importing anything to satisfy @t3-oss/env-core validation
process.env.TURSO_DATABASE_URL = "libsql://test-db.turso.io";
process.env.TURSO_AUTH_TOKEN = "test-token";
process.env.BETTER_AUTH_SECRET = "a-very-long-secret-key-that-is-at-least-32-chars-long";
process.env.BETTER_AUTH_URL = "http://localhost:5173";

// Mock providers and AI SDK
vi.mock("workers-ai-provider", () => ({
  createWorkersAI: vi.fn(() => vi.fn()),
}));

vi.mock("ai", () => ({
  streamText: vi.fn(() => ({
    textStream: (async function* () {
      yield "Hello";
      yield " world";
    })(),
  })),
  tool: vi.fn(),
}));

vi.mock("~/lib/auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe("chatRouter", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = {
      ...process.env,
      ...originalEnv,
      TURSO_DATABASE_URL: "libsql://test-db.turso.io",
      TURSO_AUTH_TOKEN: "test-token",
      BETTER_AUTH_SECRET: "a-very-long-secret-key-that-is-at-least-32-chars-long",
      BETTER_AUTH_URL: "http://localhost:5173",
    };
    vi.restoreAllMocks();
  });

  describe("isConfigured", () => {
    it("should return true when env variables are set", async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = "test-account-id";
      process.env.CLOUDFLARE_API_TOKEN = "test-api-token";

      const { appRouter } = await import("~/server/router");
      const { createCallerFactory } = await import("~/server/trpc");

      const createCaller = createCallerFactory(appRouter);
      const caller = createCaller({
        db: {} as any,
        userId: "user-123",
        headers: new Headers(),
      });

      const result = await caller.chat.isConfigured();
      expect(result).toBe(true);
    });

    it("should return false when env variables are missing", async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID;
      delete process.env.CLOUDFLARE_API_TOKEN;

      const { appRouter } = await import("~/server/router");
      const { createCallerFactory } = await import("~/server/trpc");

      const createCaller = createCallerFactory(appRouter);
      const caller = createCaller({
        db: {} as any,
        userId: "user-123",
        headers: new Headers(),
      });

      const result = await caller.chat.isConfigured();
      expect(result).toBe(false);
    });
  });

  describe("stream", () => {
    it("should stream message deltas from the assistant", async () => {
      const { appRouter } = await import("~/server/router");
      const { createCallerFactory } = await import("~/server/trpc");

      const createCaller = createCallerFactory(appRouter);
      const caller = createCaller({
        db: {} as any,
        userId: "user-123",
        headers: new Headers(),
      });

      const iterable = await caller.chat.stream({
        messages: [{ role: "user", content: "hello" }],
      });

      const chunks = [];
      for await (const chunk of iterable) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([
        { type: "delta", text: "Hello" },
        { type: "delta", text: " world" },
        { type: "done" },
      ]);
    });
  });
});
