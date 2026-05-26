import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { projects, users } from "~/../drizzle/schema";
import { eq, like, and, or, desc, count, sql } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.userId),
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return user;
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      image: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(users)
        .set({ ...input, updatedAt: new Date().toISOString() })
        .where(eq(users.id, ctx.userId));
      return { success: true };
    }),

  getAll: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.users.findMany({
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
      });
      const [{ count: total }] = await ctx.db.select({ count: count() }).from(users);
      return { data, total, page: input.page, pageSize: input.pageSize };
    }),
});
