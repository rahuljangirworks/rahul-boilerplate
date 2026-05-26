import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Loader2, Calendar, AlertTriangle } from "lucide-react";
import type { Route } from "./+types/projects.$id";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Project Detail — Boilerplate` }];
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  done: "outline",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();

  const { data: project, isLoading, error } = useQuery({
    ...trpc.project.getById.queryOptions({ id: id ?? "" }),
    enabled: !!id,
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link to="/dashboard/projects">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
          <p className="text-muted-foreground text-sm">
            Detailed information of the selected generic boilerplate record.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error || !project ? (
        <Card className="border-destructive/50 bg-destructive/5 text-destructive-foreground">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Error Loading Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {error?.message || "The requested project could not be found or you do not have permission to view it."}
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/dashboard/projects">Return to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription>
                Project identifier: <code className="bg-muted px-1 py-0.5 rounded text-xs">{project.id}</code>
              </CardDescription>
            </div>
            <Badge variant={statusBadgeVariant[project.status] ?? "outline"} className="text-sm">
              {project.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Description</h4>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {project.description || "No description provided for this template project."}
              </p>
            </div>

            <div className="border-t pt-4 flex flex-col sm:flex-row gap-4 justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {new Date(project.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last Updated: {new Date(project.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
