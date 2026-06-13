import { eq, and, count } from "drizzle-orm";
import { db } from "~/server/db";
import {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
} from "~/../drizzle/schema";
import type { User, Role, Permission } from "~/../drizzle/schema";

// ─── ID Generation ───────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Core Auth Helpers ────────────────────────────────────────────────────────

/**
 * Get the current user by ID with roles and permissions.
 */
export async function getCurrentUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return null;

  const userRolesList = await getUserRoles(userId);
  const permissionsList = await getUserPermissions(userId);

  return {
    ...user,
    roles: userRolesList.map((ur) => ur.role.name),
    permissions: permissionsList.map((p) => p.name),
  };
}

/**
 * Require authentication — throws if not authenticated.
 */
export async function requireAuth(userId: string | null) {
  if (!userId) {
    throw new Error("Authentication required");
  }
  const user = await getCurrentUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

/**
 * Require a specific role — throws if user doesn't have the role.
 */
export async function requireRole(userId: string, roleName: string) {
  const user = await requireAuth(userId);
  if (!user.roles.includes(roleName)) {
    throw new Error(`Role '${roleName}' required`);
  }
  return user;
}

/**
 * Require a specific permission — throws if user doesn't have the permission.
 */
export async function requirePermission(userId: string, permissionName: string) {
  const user = await requireAuth(userId);
  if (!user.permissions.includes(permissionName)) {
    throw new Error(`Permission '${permissionName}' required`);
  }
  return user;
}

/**
 * Check if a user has a specific role.
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const userRolesList = await getUserRoles(userId);
  return userRolesList.some((ur) => ur.role.name === roleName);
}

/**
 * Check if a user has a specific permission.
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const permissionsList = await getUserPermissions(userId);
  return permissionsList.some((p) => p.name === permissionName);
}

// ─── Role Helpers ─────────────────────────────────────────────────────────────

/**
 * Get all roles assigned to a user.
 */
export async function getUserRoles(userId: string) {
  return db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
    with: {
      role: true,
    },
  });
}

/**
 * Get all permissions for a user (derived from their roles).
 */
export async function getUserPermissions(userId: string) {
  const userRolesList = await db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
    with: {
      role: {
        with: {
          rolePermissions: {
            with: {
              permission: true,
            },
          },
        },
      },
    },
  });

  const permissionMap = new Map<string, Permission>();
  for (const ur of userRolesList) {
    for (const rp of ur.role.rolePermissions) {
      permissionMap.set(rp.permission.id, rp.permission);
    }
  }

  return Array.from(permissionMap.values());
}

/**
 * Assign a role to a user.
 */
export async function assignRoleToUser(userId: string, roleId: string) {
  // Check if already assigned
  const existing = await db.query.userRoles.findFirst({
    where: and(
      eq(userRoles.userId, userId),
      eq(userRoles.roleId, roleId)
    ),
  });

  if (existing) {
    return existing;
  }

  const id = generateId("ur");
  const now = new Date().toISOString();

  const [result] = await db
    .insert(userRoles)
    .values({ id, userId, roleId, createdAt: now })
    .returning();

  return result;
}

/**
 * Remove a role from a user.
 */
export async function removeRoleFromUser(userId: string, roleId: string) {
  const existing = await db.query.userRoles.findFirst({
    where: and(
      eq(userRoles.userId, userId),
      eq(userRoles.roleId, roleId)
    ),
  });

  if (!existing) {
    return false;
  }

  await db.delete(userRoles).where(
    and(
      eq(userRoles.userId, userId),
      eq(userRoles.roleId, roleId)
    )
  );

  return true;
}

// ─── Permission Helpers ───────────────────────────────────────────────────────

/**
 * Assign a permission to a role.
 */
export async function assignPermissionToRole(roleId: string, permissionId: string) {
  const existing = await db.query.rolePermissions.findFirst({
    where: and(
      eq(rolePermissions.roleId, roleId),
      eq(rolePermissions.permissionId, permissionId)
    ),
  });

  if (existing) {
    return existing;
  }

  const id = generateId("rp");
  const now = new Date().toISOString();

  const [result] = await db
    .insert(rolePermissions)
    .values({ id, roleId, permissionId, createdAt: now })
    .returning();

  return result;
}

/**
 * Remove a permission from a role.
 */
export async function removePermissionFromRole(roleId: string, permissionId: string) {
  const existing = await db.query.rolePermissions.findFirst({
    where: and(
      eq(rolePermissions.roleId, roleId),
      eq(rolePermissions.permissionId, permissionId)
    ),
  });

  if (!existing) {
    return false;
  }

  await db.delete(rolePermissions).where(
    and(
      eq(rolePermissions.roleId, roleId),
      eq(rolePermissions.permissionId, permissionId)
    )
  );

  return true;
}

// ─── Role CRUD ────────────────────────────────────────────────────────────────

/**
 * Create a new role.
 */
export async function createRole(data: { name: string; description?: string }) {
  const id = generateId("role");
  const now = new Date().toISOString();

  const [result] = await db
    .insert(roles)
    .values({
      id,
      name: data.name,
      description: data.description ?? null,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return result;
}

/**
 * Update a role.
 */
export async function updateRole(
  roleId: string,
  data: { name?: string; description?: string }
) {
  const now = new Date().toISOString();

  const [result] = await db
    .update(roles)
    .set({ ...data, updatedAt: now })
    .where(eq(roles.id, roleId))
    .returning();

  return result;
}

/**
 * Delete a role (only if not a system role and no users assigned).
 */
export async function deleteRole(roleId: string) {
  const role = await db.query.roles.findFirst({
    where: eq(roles.id, roleId),
  });

  if (!role) {
    throw new Error("Role not found");
  }

  if (role.isSystem) {
    throw new Error("Cannot delete a system role");
  }

  const [{ count: userCount }] = await db
    .select({ count: count() })
    .from(userRoles)
    .where(eq(userRoles.roleId, roleId));

  if (userCount > 0) {
    throw new Error("Cannot delete a role with assigned users");
  }

  // Remove all permissions from the role first
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  // Delete the role
  await db.delete(roles).where(eq(roles.id, roleId));

  return true;
}

// ─── Permission CRUD ──────────────────────────────────────────────────────────

/**
 * Create a new permission.
 */
export async function createPermission(data: {
  name: string;
  description?: string;
  group: string;
}) {
  const id = generateId("perm");
  const now = new Date().toISOString();

  const [result] = await db
    .insert(permissions)
    .values({
      id,
      name: data.name,
      description: data.description ?? null,
      group: data.group,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return result;
}

/**
 * Get all roles.
 */
export async function getAllRoles() {
  return db.query.roles.findMany({
    with: {
      rolePermissions: {
        with: {
          permission: true,
        },
      },
    },
  });
}

/**
 * Get a role by ID.
 */
export async function getRoleById(roleId: string) {
  return db.query.roles.findFirst({
    where: eq(roles.id, roleId),
    with: {
      rolePermissions: {
        with: {
          permission: true,
        },
      },
      userRoles: {
        with: {
          user: true,
        },
      },
    },
  });
}

/**
 * Get all permissions.
 */
export async function getAllPermissions() {
  return db.query.permissions.findMany();
}

/**
 * Get permissions grouped by domain.
 */
export async function getPermissionsByGroup() {
  const allPermissions = await db.query.permissions.findMany();
  const grouped: Record<string, Permission[]> = {};

  for (const perm of allPermissions) {
    if (!grouped[perm.group]) {
      grouped[perm.group] = [];
    }
    grouped[perm.group].push(perm);
  }

  return grouped;
}

/**
 * Get all users with their roles.
 */
export async function getAllUsers(options?: { page?: number; pageSize?: number }) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const data = await db.query.users.findMany({
    limit: pageSize,
    offset,
    with: {
      userRoles: {
        with: {
          role: true,
        },
      },
    },
  });

  const [{ total }] = await db.select({ total: count() }).from(users);

  return {
    data,
    total,
    page,
    pageSize,
  };
}

/**
 * Get a user by ID with roles.
 */
export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      userRoles: {
        with: {
          role: true,
        },
      },
      sessions: true,
    },
  });
}

/**
 * Update a user profile.
 */
export async function updateUser(
  userId: string,
  data: { name?: string; image?: string; emailVerified?: boolean }
) {
  const now = new Date().toISOString();

  const [result] = await db
    .update(users)
    .set({ ...data, updatedAt: now })
    .where(eq(users.id, userId))
    .returning();

  return result;
}

/**
 * Seed default roles and permissions if they don't exist.
 */
export async function seedRBAC() {
  const now = new Date().toISOString();

  // Default roles
  const defaultRoles = [
    { name: "owner", description: "Full system access", isSystem: true },
    { name: "admin", description: "Administrative access", isSystem: true },
    { name: "manager", description: "Manager-level access", isSystem: false },
    { name: "member", description: "Standard member access", isSystem: false },
    { name: "viewer", description: "Read-only access", isSystem: false },
  ];

  for (const role of defaultRoles) {
    const existing = await db.query.roles.findFirst({
      where: eq(roles.name, role.name),
    });
    if (!existing) {
      await db.insert(roles).values({
        id: generateId("role"),
        ...role,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Default permissions
  const defaultPermissions = [
    { name: "users.read", description: "View users", group: "users" },
    { name: "users.create", description: "Create users", group: "users" },
    { name: "users.update", description: "Update users", group: "users" },
    { name: "users.delete", description: "Delete users", group: "users" },
    { name: "roles.read", description: "View roles", group: "roles" },
    { name: "roles.create", description: "Create roles", group: "roles" },
    { name: "roles.update", description: "Update roles", group: "roles" },
    { name: "roles.delete", description: "Delete roles", group: "roles" },
    { name: "permissions.read", description: "View permissions", group: "permissions" },
    { name: "permissions.assign", description: "Assign permissions", group: "permissions" },
    { name: "settings.read", description: "View settings", group: "settings" },
    { name: "settings.update", description: "Update settings", group: "settings" },
    { name: "billing.read", description: "View billing", group: "billing" },
    { name: "billing.manage", description: "Manage billing", group: "billing" },
    { name: "audit.read", description: "View audit logs", group: "audit" },
  ];

  for (const perm of defaultPermissions) {
    const existing = await db.query.permissions.findFirst({
      where: eq(permissions.name, perm.name),
    });
    if (!existing) {
      await db.insert(permissions).values({
        id: generateId("perm"),
        ...perm,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Assign all permissions to owner role
  const ownerRole = await db.query.roles.findFirst({
    where: eq(roles.name, "owner"),
  });
  if (ownerRole) {
    const allPerms = await db.query.permissions.findMany();
    for (const perm of allPerms) {
      const existing = await db.query.rolePermissions.findFirst({
        where: and(
          eq(rolePermissions.roleId, ownerRole.id),
          eq(rolePermissions.permissionId, perm.id)
        ),
      });
      if (!existing) {
        await db.insert(rolePermissions).values({
          id: generateId("rp"),
          roleId: ownerRole.id,
          permissionId: perm.id,
          createdAt: now,
        });
      }
    }
  }

  // Assign basic permissions to admin role
  const adminRole = await db.query.roles.findFirst({
    where: eq(roles.name, "admin"),
  });
  if (adminRole) {
    const adminPerms = await db.query.permissions.findMany();
    for (const perm of adminPerms) {
      const existing = await db.query.rolePermissions.findFirst({
        where: and(
          eq(rolePermissions.roleId, adminRole.id),
          eq(rolePermissions.permissionId, perm.id)
        ),
      });
      if (!existing) {
        await db.insert(rolePermissions).values({
          id: generateId("rp"),
          roleId: adminRole.id,
          permissionId: perm.id,
          createdAt: now,
        });
      }
    }
  }

  // Assign read-only permissions to viewer role
  const viewerRole = await db.query.roles.findFirst({
    where: eq(roles.name, "viewer"),
  });
  if (viewerRole) {
    const readPerms = await db.query.permissions.findMany({
      where: (p, { like }) => like(p.name, "%.read"),
    });
    for (const perm of readPerms) {
      const existing = await db.query.rolePermissions.findFirst({
        where: and(
          eq(rolePermissions.roleId, viewerRole.id),
          eq(rolePermissions.permissionId, perm.id)
        ),
      });
      if (!existing) {
        await db.insert(rolePermissions).values({
          id: generateId("rp"),
          roleId: viewerRole.id,
          permissionId: perm.id,
          createdAt: now,
        });
      }
    }
  }
}
