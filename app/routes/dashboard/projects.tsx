import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { DataTable } from "~/components/projects/data-table";
import { Plus, Search, FolderKanban } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Route } from "./+types/projects";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projects — Boilerplate" }];
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "paused" | "done";
  createdAt: string;
  updatedAt: string;
}

const mockProjects: Project[] = [
  {
    id: "proj_1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    status: "active",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
  {
    id: "proj_2",
    name: "Mobile App v2",
    description: "React Native mobile application for iOS and Android",
    status: "active",
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2025-06-08T00:00:00Z",
  },
  {
    id: "proj_3",
    name: "API Migration",
    description: "Migrate REST API to tRPC for better type safety",
    status: "paused",
    createdAt: "2025-04-20T00:00:00Z",
    updatedAt: "2025-05-30T00:00:00Z",
  },
  {
    id: "proj_4",
    name: "Design System",
    description: "Build a shared component library with Tailwind and Radix",
    status: "done",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-04-15T00:00:00Z",
  },
  {
    id: "proj_5",
    name: "Analytics Dashboard",
    description: "Real-time analytics dashboard with charts and metrics",
    status: "active",
    createdAt: "2025-06-05T00:00:00Z",
    updatedAt: "2025-06-12T00:00:00Z",
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "done", label: "Completed" },
] as const;

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  done: "outline",
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredProjects = useMemo(() => {
    let result = mockProjects;
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [statusFilter, searchQuery]);

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-semibold text-foreground">
            {row.original.name}
            {row.original.description && (
              <p className="text-xs text-muted-foreground font-normal max-w-sm truncate mt-0.5">
                {row.original.description}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant[row.original.status] ?? "outline"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
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

  const pageCount = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manage your projects and track their progress.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8 w-full sm:max-w-xs"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          {statusOptions.map(({ value, label }) => (
            <Button
              key={value}
              variant={statusFilter === value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedProjects}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyState={
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="rounded-full bg-muted p-3">
              <FolderKanban className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">No projects found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try checking spelling or adjusting search filters."
                  : "Create your first project to get started."}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
