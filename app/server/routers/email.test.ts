import { describe, it, expect, vi, beforeEach } from "vitest";

// Must mock env BEFORE any module imports — vitest hoists vi.mock() calls
vi.mock("~/lib/env", () => ({
  env: {
    TURSO_DATABASE_URL: "libsql://test-db.turso.io",
    TURSO_AUTH_TOKEN: "test-token",
    BETTER_AUTH_SECRET: "a-very-long-secret-key-that-is-at-least-32-chars-long",
    BETTER_AUTH_URL: "http://localhost:5173",
    RESEND_API_KEY: "re_test_api_key",
  },
}));

vi.mock("~/lib/auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Resend must be mocked as a class constructor
const mockSend = vi.fn().mockResolvedValue({ id: "email-mock-id", error: null });
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function (this: any) {
    this.emails = { send: mockSend };
  }),
}));

vi.mock("@react-email/components", () => ({
  render: vi.fn().mockResolvedValue("<html><body>Mock Email HTML</body></html>"),
}));

vi.mock("~/emails/welcome", () => ({
  WelcomeEmail: vi.fn(() => null),
}));

vi.mock("~/emails/notification", () => ({
  NotificationEmail: vi.fn(() => null),
}));

import { emailRouter } from "./email";
import { createCallerFactory } from "~/server/trpc";

describe("emailRouter", () => {
  const createCaller = createCallerFactory(emailRouter);

  const authenticatedCaller = createCaller({
    db: {} as any,
    userId: "user-test-123",
    headers: new Headers(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-apply send mock after clearAllMocks
    mockSend.mockResolvedValue({ id: "email-mock-id", error: null });
  });

  describe("sendWelcome", () => {
    it("should call Resend and return success when RESEND_API_KEY is set", async () => {
      const result = await authenticatedCaller.sendWelcome({
        email: "user@example.com",
        name: "Test User",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("sendNotification", () => {
    it("should send a transactional notification email and return success", async () => {
      const result = await authenticatedCaller.sendNotification({
        email: "admin@example.com",
        title: "Security Alert",
        message: "New login detected on your account.",
        actionLabel: "Review Activity",
        actionUrl: "https://app.example.com/security",
      });

      expect(result).toEqual({ success: true });
    });

    it("should send notification without optional actionLabel/actionUrl", async () => {
      const result = await authenticatedCaller.sendNotification({
        email: "admin@example.com",
        title: "System Update",
        message: "Your system has been updated successfully.",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("getPreviews", () => {
    it("should return welcome and notification HTML previews with hasApiKey flag", async () => {
      const result = await authenticatedCaller.getPreviews();

      expect(result).toHaveProperty("welcome");
      expect(result).toHaveProperty("notification");
      expect(result).toHaveProperty("hasApiKey");
      expect(typeof result.welcome).toBe("string");
      expect(typeof result.notification).toBe("string");
      expect(typeof result.hasApiKey).toBe("boolean");
      expect(result.hasApiKey).toBe(true);
    });
  });
});
