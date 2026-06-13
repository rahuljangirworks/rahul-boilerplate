import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchStreamLink, httpBatchLink, splitLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import superjson from "superjson";
import type { AppRouter } from "~/server/router";

export const { TRPCProvider, useTRPC } = createTRPCContext<any>();

export function TRPCProviderWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    createTRPCClient<any>({
      links: [
        splitLink({
          condition: (op) => op.path.includes("chat.stream"),
          true: httpBatchStreamLink({
            url: "/api/trpc",
            transformer: superjson,
          }),
          false: httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
          }),
        }),
      ],
    })
  );

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
