/**
 * Billing Webhooks Handler (Stub for Demo Mode)
 *
 * In production, replace with real webhook handling for Stripe/LemonSqueezy.
 */
export async function loader() {
  return Response.json({ message: "Webhooks not configured in demo mode" }, { status: 404 });
}

export async function action() {
  return Response.json({ message: "Webhooks not configured in demo mode" }, { status: 404 });
}
