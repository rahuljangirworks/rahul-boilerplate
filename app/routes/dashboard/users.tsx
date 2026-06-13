import { useState, useMemo } from "react";
import { mockUsers, type MockUserRecord } from "~/lib/mock-data";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { DataTable } from "~/components/projects/data-table";
import { Plus, Search, Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Route } from "./+types/users";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users — Boilerplate" }];
}

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  user: "secondary",
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "outline",
  invited: "secondary",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return mockUsers;
    const q = searchQuery.toLowerCase();
    return mockUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<MockUserRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatar}
              alt={row.original.name}
              className="size-8 rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant={roleBadgeVariant[row.original.role] ?? "outline"}>
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={statusBadgeVariant[row.original.status] ?? "outline"}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {new Date(row.original.lastActive).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {new Date(row.original.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
    ],
    []
  );

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage team members and their access roles.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8 w-full sm:max-w-xs"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyState={
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="rounded-full bg-muted p-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">No users found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try checking spelling or adjusting search filters."
                  : "Invite your first team member to get started."}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
