import type { Route } from "./+types/webhooks.billing";

export async function action({ request }: Route.ActionArgs) {
  return new Response("Billing webhook stub", { status: 200 });
}
