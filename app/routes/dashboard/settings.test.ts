import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "~/server/router";
import { createCallerFactory } from "~/server/trpc";
import { getColorScheme, setColorScheme } from "~/lib/color-scheme-cookie.server";

// Mock env validation before any module is loaded
vi.mock("~/lib/env", () => ({
  env: {
    TURSO_DATABASE_URL: "libsql://test-db.turso.io",
    TURSO_AUTH_TOKEN: "test-token",
    BETTER_AUTH_SECRET: "a-very-long-secret-key-that-is-at-least-32-chars-long",
    BETTER_AUTH_URL: "http://localhost:5173",
  },
}));

// Mock auth.server to prevent actual database/API connections
vi.mock("~/lib/auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));


// Mock database updates
vi.mock("~/server/db", () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue({ success: true }),
  },
}));

import { db } from "~/server/db";

describe("Settings Onboarding & Theme Unit Tests", () => {
  describe("Color Scheme Cookie Parsing & Formatting", () => {
    it("should return system default when no cookie is set", () => {
      const request = new Request("http://localhost/dashboard/settings");
      expect(getColorScheme(request)).toBe("system");
    });

    it("should return light theme when cookie says light", () => {
      const request = new Request("http://localhost/dashboard/settings", {
        headers: { Cookie: "color-scheme=light" },
      });
      expect(getColorScheme(request)).toBe("light");
    });

    it("should return dark theme when cookie says dark", () => {
      const request = new Request("http://localhost/dashboard/settings", {
        headers: { Cookie: "color-scheme=dark" },
      });
      expect(getColorScheme(request)).toBe("dark");
    });

    it("should fall back to system when cookie is invalid", () => {
      const request = new Request("http://localhost/dashboard/settings", {
        headers: { Cookie: "color-scheme=invalid-val" },
      });
      expect(getColorScheme(request)).toBe("system");
    });

    it("should set the color-scheme cookie header with correct properties", () => {
      const header = setColorScheme("dark");
      expect(header).toContain("color-scheme=dark");
      expect(header).toContain("Max-Age=");
      expect(header).toContain("Path=/");
    });
  });

  describe("userRouter.updateProfile mutation integration", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should call the database update method with the user details", async () => {
      const createCaller = createCallerFactory(appRouter);
      const caller = createCaller({
        db: db as any,
        userId: "test-user-999",
        headers: new Headers(),
      });

      const payload = {
        name: "Onboarding Developer",
        image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
      };

      const result = await caller.user.updateProfile(payload);

      expect(result).toEqual({ success: true });
      expect((db as any).update).toHaveBeenCalled();
      expect((db as any).set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Onboarding Developer",
          image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
          updatedAt: expect.any(String),
        })
      );
    });
  });
});
