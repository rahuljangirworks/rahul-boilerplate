import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/router";
import { createTRPCContext } from "~/server/trpc";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

function handleRequest(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: request.headers }),
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return handleRequest(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return handleRequest(request);
}
