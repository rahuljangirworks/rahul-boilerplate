import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import { projects } from "~/../drizzle/schema";
import { eq, and, like, desc, count } from "drizzle-orm";

const projectStatusEnum = z.enum(["all", "active", "paused", "done"]);

export const projectRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      status: projectStatusEnum.default("all"),
      search: z.string().optional(),
      page: z.number().default(1),
      pageSize: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(projects.userId, ctx.userId)];
      if (input.status !== "all") conditions.push(eq(projects.status, input.status));
      if (input.search) conditions.push(like(projects.name, `%${input.search}%`));

      const where = and(...conditions);
      const data = await ctx.db.query.projects.findMany({
        where,
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
        orderBy: desc(projects.createdAt),
      });
      const [{ count: total }] = await ctx.db.select({ count: count() })
        .from(projects)
        .where(where);

      return { data, total, page: input.page, pageSize: input.pageSize };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: and(eq(projects.id, input.id), eq(projects.userId, ctx.userId)),
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(["active", "paused", "done"]).default("active"),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date().toISOString();
      await ctx.db.insert(projects).values({
        id,
        name: input.name,
        description: input.description ?? null,
        status: input.status,
        userId: ctx.userId,
        createdAt: now,
        updatedAt: now,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.enum(["active", "paused", "done"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const existing = await ctx.db.query.projects.findFirst({
        where: and(eq(projects.id, id), eq(projects.userId, ctx.userId)),
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.update(projects)
        .set({ ...updates, updatedAt: new Date().toISOString() })
        .where(eq(projects.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.projects.findFirst({
        where: and(eq(projects.id, input.id), eq(projects.userId, ctx.userId)),
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});
