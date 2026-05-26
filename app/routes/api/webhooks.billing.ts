import type { Route } from "./+types/webhooks.billing";
import { db } from "~/server/db";
import { users } from "~/../drizzle/schema";
import { eq } from "drizzle-orm";

function getTierFromStatus(status: string): "Starter" | "Pro" {
  const activeStatuses = ["active", "trialing", "complete", "active_trial"];
  return activeStatuses.includes(status.toLowerCase()) ? "Pro" : "Starter";
}

async function updateUserSubscription({
  email,
  customerId,
  subscriptionId,
  tier,
}: {
  email?: string;
  customerId?: string;
  subscriptionId?: string;
  tier: "Starter" | "Pro";
}) {
  let user = null;

  if (email) {
    user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  if (!user && customerId) {
    user = await db.query.users.findFirst({
      where: eq(users.customerId, customerId),
    });
  }

  if (!user && subscriptionId) {
    user = await db.query.users.findFirst({
      where: eq(users.subscriptionId, subscriptionId),
    });
  }

  if (!user) {
    console.warn(
      `[Webhook] User not found: email=${email}, customerId=${customerId}, subscriptionId=${subscriptionId}`
    );
    return false;
  }

  const updateData: Record<string, any> = {
    subscriptionTier: tier,
    updatedAt: new Date().toISOString(),
  };

  if (customerId) {
    updateData.customerId = customerId;
  }
  if (subscriptionId) {
    updateData.subscriptionId = subscriptionId;
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, user.id));

  console.log(`[Webhook] User ${user.email} updated to ${tier} tier`);
  return true;
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const headers = request.headers;
    const body = await request.json() as any;

    // 1. STRIPE WEBHOOK
    if (headers.has("stripe-signature")) {
      const eventType = body.type;
      console.log(`[Webhook] Received Stripe event: ${eventType}`);

      if (eventType === "checkout.session.completed") {
        const session = body.data?.object;
        const email = session?.customer_details?.email;
        const customerId = session?.customer;
        const subscriptionId = session?.subscription || session?.id;

        if (email) {
          const updated = await updateUserSubscription({
            email,
            customerId,
            subscriptionId,
            tier: "Pro",
          });
          return Response.json({
            success: updated,
            message: updated ? "Stripe upgrade processed" : "User not found",
          });
        }
      } else if (
        eventType === "customer.subscription.updated" ||
        eventType === "customer.subscription.deleted"
      ) {
        const sub = body.data?.object;
        const customerId = sub?.customer;
        const subscriptionId = sub?.id;
        const status = sub?.status;

        const tier = eventType === "customer.subscription.deleted" ? "Starter" : getTierFromStatus(status);
        const updated = await updateUserSubscription({
          customerId,
          subscriptionId,
          tier,
        });
        return Response.json({
          success: updated,
          message: `Stripe subscription update processed to ${tier}`,
        });
      }

      return Response.json({ success: true, message: "Stripe event ignored" });
    }

    // 2. POLAR WEBHOOK
    if (headers.has("x-polar-signature")) {
      const eventType = body.event;
      console.log(`[Webhook] Received Polar event: ${eventType}`);

      const data = body.data;
      const email = data?.email || data?.user?.email;
      const customerId = data?.user_id;
      const subscriptionId = data?.id;
      const status = data?.status;

      if (eventType === "subscription.created") {
        const tier = getTierFromStatus(status || "active");
        const updated = await updateUserSubscription({
          email,
          customerId,
          subscriptionId,
          tier,
        });
        return Response.json({
          success: updated,
          message: `Polar creation processed to ${tier}`,
        });
      } else if (eventType === "subscription.updated" || eventType === "subscription.revoked") {
        const tier = eventType === "subscription.revoked" ? "Starter" : getTierFromStatus(status || "");
        const updated = await updateUserSubscription({
          email,
          customerId,
          subscriptionId,
          tier,
        });
        return Response.json({
          success: updated,
          message: `Polar status update processed to ${tier}`,
        });
      }

      return Response.json({ success: true, message: "Polar event ignored" });
    }

    // 3. LEMONSQUEEZY WEBHOOK
    if (headers.has("x-lemon-squeezy-signature")) {
      const eventType = body.meta?.event_name;
      console.log(`[Webhook] Received LemonSqueezy event: ${eventType}`);

      const data = body.data;
      const attributes = data?.attributes;
      const email = attributes?.user_email;
      const customerId = attributes?.customer_id ? String(attributes.customer_id) : undefined;
      const subscriptionId = data?.id;
      const status = attributes?.status;

      if (eventType === "subscription_created") {
        const tier = getTierFromStatus(status || "active");
        const updated = await updateUserSubscription({
          email,
          customerId,
          subscriptionId,
          tier,
        });
        return Response.json({
          success: updated,
          message: `LemonSqueezy creation processed to ${tier}`,
        });
      } else if (eventType === "subscription_updated" || eventType === "subscription_cancelled") {
        const tier = eventType === "subscription_cancelled" ? "Starter" : getTierFromStatus(status || "");
        const updated = await updateUserSubscription({
          email,
          customerId,
          subscriptionId,
          tier,
        });
        return Response.json({
          success: updated,
          message: `LemonSqueezy update processed to ${tier}`,
        });
      }

      return Response.json({ success: true, message: "LemonSqueezy event ignored" });
    }

    // Unrecognized webhook payload
    return new Response(JSON.stringify({ error: "Unrecognized webhook provider" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[Webhook] Handler error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
