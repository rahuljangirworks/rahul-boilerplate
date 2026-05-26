import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
import { useFilters } from "~/stores/use-filters";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { DataTable } from "~/components/projects/data-table";
import { ProjectDialog } from "~/components/projects/project-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus, Search, Edit2, Trash2, FolderKanban, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { statusFilter, searchQuery, setStatusFilter, setSearchQuery } = useFilters();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch paginated projects
  const { data, isLoading } = useQuery(
    trpc.project.list.queryOptions({
      status: statusFilter,
      search: searchQuery || undefined,
      page,
      pageSize,
    })
  );

  const deleteMutation = useMutation({
    ...trpc.project.delete.mutationOptions(),
    onSuccess: () => {
      toast.success("Project deleted successfully.");
      queryClient.invalidateQueries({ queryKey: trpc.project.pathKey() });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete project");
    },
  });

  const handleEditClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this project? This action is irreversible.")) {
        deleteMutation.mutate({ id });
      }
    },
    [deleteMutation]
  );

  // TanStack columns
  const columns = useMemo<ColumnDef<Project>[]>(() => {
    return [
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
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const isDeleting = deleteMutation.isPending && deleteMutation.variables?.id === row.original.id;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => handleEditClick(row.original)}
              >
                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(row.original.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          );
        },
      },
    ];
  }, [handleEditClick, handleDeleteClick, deleteMutation]);

  const pageCount = data ? Math.ceil(data.total / data.pageSize) : 1;

  const handleCreateNewClick = useCallback(() => {
    setSelectedProject(null);
    setDialogOpen(true);
  }, []);

  const emptyState = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="rounded-full bg-muted p-3">
        <FolderKanban className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold">No projects found</p>
        <p className="text-sm text-muted-foreground">
          {searchQuery ? "Try checking spelling or adjusting search filters." : "Create your first boilerplate project container to get started."}
        </p>
      </div>
      {!searchQuery && (
        <Button size="sm" onClick={handleCreateNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            Clean CRUD boilerplate template utilizing drizzle migrations.
          </p>
        </div>
        <Button onClick={handleCreateNewClick}>
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
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val as typeof statusFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={(data?.data as Project[]) ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyState={emptyState}
      />

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
      />
    </div>
  );
}
