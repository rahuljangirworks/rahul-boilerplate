import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "~/server/db";
import { auth } from "~/lib/auth.server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers });
  return {
    db,
    userId: session?.user?.id ?? null,
    headers: opts.headers,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
