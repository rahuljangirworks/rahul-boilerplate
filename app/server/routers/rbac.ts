import { z } from "zod";
import { createTRPCRouter, protectedProcedure, requirePermissionProcedure } from "~/server/trpc";
import {
  createRole,
  updateRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  getAllPermissions,
  getPermissionsByGroup,
  assignPermissionToRole,
  removePermissionFromRole,
} from "~/lib/rbac";
import { TRPCError } from "@trpc/server";

export const rbacRouter = createTRPCRouter({
  // ─── Roles ──────────────────────────────────────────────────────────────
  getRoles: protectedProcedure.query(async () => {
    return getAllRoles();
  }),

  getRoleById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const role = await getRoleById(input.id);
      if (!role) throw new TRPCError({ code: "NOT_FOUND" });
      return role;
    }),

  createRole: requirePermissionProcedure("roles.create")
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createRole(input);
    }),

  updateRole: requirePermissionProcedure("roles.update")
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateRole(id, data);
    }),

  deleteRole: requirePermissionProcedure("roles.delete")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return deleteRole(input.id);
    }),

  // ─── Permissions ────────────────────────────────────────────────────────
  getPermissions: protectedProcedure.query(async () => {
    return getAllPermissions();
  }),

  getPermissionsByGroup: protectedProcedure.query(async () => {
    return getPermissionsByGroup();
  }),

  assignPermissionToRole: requirePermissionProcedure("permissions.assign")
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return assignPermissionToRole(input.roleId, input.permissionId);
    }),

  removePermissionFromRole: requirePermissionProcedure("permissions.assign")
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return removePermissionFromRole(input.roleId, input.permissionId);
    }),
});
