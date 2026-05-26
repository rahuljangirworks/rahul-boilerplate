import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadRouter } from "./upload";
import { createCallerFactory } from "~/server/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

vi.mock("~/lib/env", () => ({
  env: {
    TURSO_DATABASE_URL: "libsql://mock-db.turso.io",
    TURSO_AUTH_TOKEN: "mock-token",
    BETTER_AUTH_SECRET: "mock-secret-length-32-character-long-string",
    BETTER_AUTH_URL: "https://mock-auth-url.com",
    R2_ENDPOINT: "https://mock-endpoint.r2.cloudflarestorage.com",
    R2_ACCESS_KEY_ID: "mock-access-key",
    R2_SECRET_ACCESS_KEY: "mock-secret-key",
    R2_BUCKET_NAME: "mock-bucket",
  },
}));

vi.mock("~/server/db", () => ({
  db: {} as any,
}));

vi.mock("~/lib/auth.server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-s3", () => {
  // Define classes inside factory to avoid hoisting initialization errors
  class MockS3Client {
    send = mockSend;
  }
  class MockPutObjectCommand {
    constructor(public params: any) {}
  }
  class MockDeleteObjectCommand {
    constructor(public params: any) {}
  }
  return {
    S3Client: MockS3Client,
    PutObjectCommand: MockPutObjectCommand,
    DeleteObjectCommand: MockDeleteObjectCommand,
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => {
  return {
    getSignedUrl: vi.fn().mockResolvedValue("https://mock-presigned-url.com/uploads/user-123/mock-file.png"),
  };
});

describe("uploadRouter", () => {
  const createCaller = createCallerFactory(uploadRouter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a presigned URL on getPresignedUrl mutation", async () => {
    const caller = createCaller({
      db: {} as any,
      userId: "user-123",
      headers: new Headers(),
    });

    const result = await caller.getPresignedUrl({
      fileName: "test-file.png",
      contentType: "image/png",
      fileSize: 1024,
    });

    expect(result).toHaveProperty("uploadUrl");
    expect(result).toHaveProperty("key");
    expect(result.uploadUrl).toBe("https://mock-presigned-url.com/uploads/user-123/mock-file.png");
    expect(result.key).toContain("uploads/user-123/");
    expect(result.key.endsWith(".png")).toBe(true);
    expect(getSignedUrl).toHaveBeenCalled();
  });

  it("should call DeleteObjectCommand on deleteFile mutation", async () => {
    const caller = createCaller({
      db: {} as any,
      userId: "user-123",
      headers: new Headers(),
    });

    mockSend.mockResolvedValueOnce({ success: true });

    const result = await caller.deleteFile({
      key: "uploads/user-123/test-file.png",
    });

    expect(result).toEqual({ success: true });
    expect(mockSend).toHaveBeenCalled();
  });

  it("should throw UNAUTHORIZED if user is not logged in", async () => {
    const caller = createCaller({
      db: {} as any,
      userId: null as any,
      headers: new Headers(),
    });

    await expect(
      caller.getPresignedUrl({
        fileName: "test-file.png",
        contentType: "image/png",
      })
    ).rejects.toThrow("UNAUTHORIZED");
  });
});
