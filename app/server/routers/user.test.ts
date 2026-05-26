import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

// vi.mock calls are hoisted — must mock env before any module loads
vi.mock("~/lib/env", () => ({
  env: {
    TURSO_DATABASE_URL: "libsql://test-db.turso.io",
    TURSO_AUTH_TOKEN: "test-token",
    BETTER_AUTH_SECRET: "a-very-long-secret-key-that-is-at-least-32-chars-long",
    BETTER_AUTH_URL: "http://localhost:5173",
  },
}));

vi.mock("~/lib/auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const mockUser = {
  id: "user-abc-123",
  name: "Alice",
  email: "alice@example.com",
  image: null,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  customerId: null,
  subscriptionId: null,
  subscriptionTier: "Starter" as const,
};

const mockDb = {
  query: {
    users: {
      findFirst: vi.fn().mockResolvedValue(mockUser),
      findMany: vi.fn().mockResolvedValue([mockUser]),
    },
  },
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue({ success: true }),
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockResolvedValue([{ count: 1 }]),
};

import { userRouter } from "./user";
import { createCallerFactory } from "~/server/trpc";

describe("userRouter", () => {
  const createCaller = createCallerFactory(userRouter);

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-apply default return values after clearAllMocks
    mockDb.query.users.findFirst.mockResolvedValue(mockUser);
    mockDb.query.users.findMany.mockResolvedValue([mockUser]);
    mockDb.from.mockResolvedValue([{ count: 1 }]);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.where.mockResolvedValue({ success: true });
    mockDb.select.mockReturnThis();
  });

  describe("getMe", () => {
    it("should return the current authenticated user", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      const result = await caller.getMe();

      expect(result).toEqual(mockUser);
      expect(mockDb.query.users.findFirst).toHaveBeenCalledOnce();
    });

    it("should throw NOT_FOUND when user does not exist in DB", async () => {
      mockDb.query.users.findFirst.mockResolvedValue(null);

      const caller = createCaller({
        db: mockDb as any,
        userId: "nonexistent-user",
        headers: new Headers(),
      });

      await expect(caller.getMe()).rejects.toMatchObject({ code: "NOT_FOUND" });
    });
  });

  describe("updateProfile", () => {
    it("should update the user's name and return success", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      const result = await caller.updateProfile({ name: "Alice Renamed" });

      expect(result).toEqual({ success: true });
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Alice Renamed" })
      );
    });

    it("should update both name and image URL", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      const result = await caller.updateProfile({
        name: "Alice Pro",
        image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alice",
      });

      expect(result).toEqual({ success: true });
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Alice Pro",
          image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alice",
          updatedAt: expect.any(String),
        })
      );
    });

    it("should reject invalid image URL", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      await expect(
        caller.updateProfile({ image: "not-a-valid-url" })
      ).rejects.toThrow();
    });
  });

  describe("getAll", () => {
    it("should return paginated users list with total count", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      const result = await caller.getAll({ page: 1, pageSize: 20 });

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("pageSize");
      expect(result.data).toEqual([mockUser]);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it("should use default pagination values", async () => {
      const caller = createCaller({
        db: mockDb as any,
        userId: "user-abc-123",
        headers: new Headers(),
      });

      const result = await caller.getAll({});

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });
  });
});
