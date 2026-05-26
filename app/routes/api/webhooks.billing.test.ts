import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module before any route imports
const mockUpdateChain = {
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue(undefined),
};

const mockFindFirst = vi.fn();
const mockDb = {
  query: {
    users: {
      findFirst: mockFindFirst,
    },
  },
  update: vi.fn(() => mockUpdateChain),
};

vi.mock("~/server/db", () => ({ db: mockDb }));
vi.mock("~/lib/auth.server", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

// Helper to create a minimal Request for the action function
function makeRequest(body: object, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/webhooks/billing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("webhooks.billing handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateChain.set.mockReturnThis();
    mockUpdateChain.where.mockResolvedValue(undefined);
    mockDb.update.mockReturnValue(mockUpdateChain);
  });

  it("should return 405 for non-POST requests", async () => {
    const { action } = await import("~/routes/api/webhooks.billing");

    const request = new Request("http://localhost/api/webhooks/billing", {
      method: "GET",
    });

    const response = await action({ request, params: {}, context: {} } as any);
    expect(response.status).toBe(405);
  });

  it("should return 400 for unrecognized webhook provider", async () => {
    const { action } = await import("~/routes/api/webhooks.billing");

    const request = makeRequest({ type: "unknown_event" });
    const response = await action({ request, params: {}, context: {} } as any);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty("error");
  });

  describe("Stripe webhook", () => {
    it("should handle checkout.session.completed and upgrade user to Pro", async () => {
      const mockUserRecord = {
        id: "db-user-1",
        email: "buyer@example.com",
        customerId: null,
        subscriptionId: null,
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          type: "checkout.session.completed",
          data: {
            object: {
              customer_details: { email: "buyer@example.com" },
              customer: "cus_abc123",
              subscription: "sub_xyz789",
            },
          },
        },
        { "stripe-signature": "t=1234,v1=abcdef" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.success).toBe(true);
      expect(json.message).toContain("Stripe upgrade processed");
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should handle customer.subscription.deleted and downgrade to Starter", async () => {
      const mockUserRecord = {
        id: "db-user-2",
        email: "subscriber@example.com",
        customerId: "cus_stripe_del",
        subscriptionId: "sub_del_999",
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          type: "customer.subscription.deleted",
          data: {
            object: {
              customer: "cus_stripe_del",
              id: "sub_del_999",
              status: "canceled",
            },
          },
        },
        { "stripe-signature": "t=1234,v1=abcdef" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.message).toContain("Starter");
    });

    it("should return success with ignored message for unknown Stripe events", async () => {
      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        { type: "payment_intent.succeeded" },
        { "stripe-signature": "t=1234,v1=abcdef" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.success).toBe(true);
      expect(json.message).toContain("ignored");
    });
  });

  describe("Polar webhook", () => {
    it("should handle subscription.created and update user to Pro", async () => {
      const mockUserRecord = {
        id: "db-polar-user",
        email: "polar@example.com",
        customerId: "polar-user-id-1",
        subscriptionId: "polar-sub-1",
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          event: "subscription.created",
          data: {
            email: "polar@example.com",
            user_id: "polar-user-id-1",
            id: "polar-sub-1",
            status: "active",
          },
        },
        { "x-polar-signature": "sig-abc123" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.success).toBe(true);
      expect(json.message).toContain("Pro");
    });

    it("should handle subscription.revoked and downgrade to Starter", async () => {
      const mockUserRecord = {
        id: "db-polar-user-rev",
        email: "polar-rev@example.com",
        customerId: "polar-rev-user",
        subscriptionId: "polar-rev-sub",
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          event: "subscription.revoked",
          data: {
            email: "polar-rev@example.com",
            user_id: "polar-rev-user",
            id: "polar-rev-sub",
            status: "canceled",
          },
        },
        { "x-polar-signature": "sig-xyz789" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.message).toContain("Starter");
    });
  });

  describe("LemonSqueezy webhook", () => {
    it("should handle subscription_created and upgrade user to Pro", async () => {
      const mockUserRecord = {
        id: "db-ls-user",
        email: "ls@example.com",
        customerId: "ls-cust-999",
        subscriptionId: "ls-sub-1",
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          meta: { event_name: "subscription_created" },
          data: {
            id: "ls-sub-1",
            attributes: {
              user_email: "ls@example.com",
              customer_id: 999,
              status: "active",
            },
          },
        },
        { "x-lemon-squeezy-signature": "hash-ls-abc" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.success).toBe(true);
      expect(json.message).toContain("Pro");
    });

    it("should handle subscription_cancelled and downgrade to Starter", async () => {
      const mockUserRecord = {
        id: "db-ls-user-cancel",
        email: "ls-cancel@example.com",
        customerId: "ls-cust-cancel",
        subscriptionId: "ls-sub-cancel",
      };
      mockFindFirst.mockResolvedValueOnce(mockUserRecord);

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          meta: { event_name: "subscription_cancelled" },
          data: {
            id: "ls-sub-cancel",
            attributes: {
              user_email: "ls-cancel@example.com",
              customer_id: 888,
              status: "cancelled",
            },
          },
        },
        { "x-lemon-squeezy-signature": "hash-ls-cancel" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.message).toContain("Starter");
    });
  });

  describe("User not found handling", () => {
    it("should return success:false when Stripe event user cannot be matched", async () => {
      mockFindFirst.mockResolvedValue(null); // user not found

      const { action } = await import("~/routes/api/webhooks.billing");

      const request = makeRequest(
        {
          type: "checkout.session.completed",
          data: {
            object: {
              customer_details: { email: "ghost@example.com" },
              customer: "cus_ghost",
              subscription: "sub_ghost",
            },
          },
        },
        { "stripe-signature": "t=1234,v1=ghost" }
      );

      const response = await action({ request, params: {}, context: {} } as any);
      const json = await response.json();

      expect(json.success).toBe(false);
      expect(json.message).toContain("User not found");
    });
  });
});
