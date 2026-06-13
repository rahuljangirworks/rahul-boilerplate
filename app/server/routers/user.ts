import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";
import {
  users,
  userRoles,
} from "~/../drizzle/schema";
import { eq, like, and, count, desc } from "drizzle-orm";
import {
  getCurrentUser,
  getAllUsers as getAllUsersRBAC,
  getUserById as getUserByIdRBAC,
  updateUser,
  assignRoleToUser,
  removeRoleFromUser,
} from "~/lib/rbac";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser(ctx.userId);
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateUser(ctx.userId, input);
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return getAllUsersRBAC({
        page: input.page,
        pageSize: input.pageSize,
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await getUserByIdRBAC(input.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      return user;
    }),

  assignRole: protectedProcedure
    .input(z.object({ userId: z.string(), roleId: z.string() }))
    .mutation(async ({ input }) => {
      return assignRoleToUser(input.userId, input.roleId);
    }),

  removeRole: protectedProcedure
    .input(z.object({ userId: z.string(), roleId: z.string() }))
    .mutation(async ({ input }) => {
      return removeRoleFromUser(input.userId, input.roleId);
    }),
});
