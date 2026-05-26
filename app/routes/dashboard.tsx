import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  FolderKanban,
  Play,
  Pause,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";

import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> =
  {
    active: "default",
    paused: "secondary",
    done: "outline",
  };

export default function DashboardPage() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.getMe.queryOptions());

  // Real project data for stats and recent list
  const { data: allProjects } = useQuery(
    trpc.project.list.queryOptions({ status: "all", page: 1, pageSize: 100 })
  );
  const { data: activeProjects } = useQuery(
    trpc.project.list.queryOptions({ status: "active", page: 1, pageSize: 100 })
  );
  const { data: pausedProjects } = useQuery(
    trpc.project.list.queryOptions({ status: "paused", page: 1, pageSize: 100 })
  );
  const { data: doneProjects } = useQuery(
    trpc.project.list.queryOptions({ status: "done", page: 1, pageSize: 100 })
  );

  const stats = [
    {
      label: "Total Projects",
      value: allProjects?.total ?? "—",
      icon: FolderKanban,
      color: "text-blue-500",
    },
    {
      label: "Active",
      value: activeProjects?.total ?? "—",
      icon: Play,
      color: "text-green-500",
    },
    {
      label: "Paused",
      value: pausedProjects?.total ?? "—",
      icon: Pause,
      color: "text-yellow-500",
    },
    {
      label: "Completed",
      value: doneProjects?.total ?? "—",
      icon: CheckCircle2,
      color: "text-purple-500",
    },
  ];

  const recentProjects = allProjects?.data?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/dashboard/projects">
            <Plus className="mr-1.5 size-3.5" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`size-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/projects">
              View all
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="rounded-full bg-muted p-3">
                <FolderKanban className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No projects yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create your first project to get started.
                </p>
              </div>
              <Button size="sm" asChild>
                <Link to="/dashboard/projects">
                  <Plus className="mr-1.5 size-3.5" />
                  Add Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={statusBadgeVariant[project.status] ?? "outline"}
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
