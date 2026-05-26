import { unstable_useRoute as useRoute } from "react-router";
import type { BetterAuthUser, BetterAuthSession } from "~/middlewares/auth";

export interface RootLoaderData {
  colorScheme: string;
  user: BetterAuthUser | null;
  session: BetterAuthSession["session"] | null;
}

export function useAuthUser() {
  const data = useRoute("root");
  const loaderData = data?.loaderData as RootLoaderData | undefined;

  if (!loaderData?.user) {
    throw new Error(
      "Authentication user not available. Ensure this hook is used within authenticated context.",
    );
  }

  return loaderData.user;
}

export function useOptionalAuthUser() {
  const data = useRoute("root");
  const loaderData = data?.loaderData as RootLoaderData | undefined;
  return loaderData?.user ?? null;
}

export function useAuthSession() {
  const data = useRoute("root");
  const loaderData = data?.loaderData as RootLoaderData | undefined;
  return loaderData?.session ?? null;
}
