import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Route } from "./+types/projects.$id";

export function meta({}: Route.MetaArgs) {
  return [{ title: `Project Detail — Boilerplate` }];
}

const mockProjects: Record<string, {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "paused" | "done";
  createdAt: string;
  updatedAt: string;
}> = {
  proj_1: {
    id: "proj_1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    status: "active",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
  proj_2: {
    id: "proj_2",
    name: "Mobile App v2",
    description: "React Native mobile application for iOS and Android",
    status: "active",
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2025-06-08T00:00:00Z",
  },
  proj_3: {
    id: "proj_3",
    name: "API Migration",
    description: "Migrate REST API to tRPC for better type safety",
    status: "paused",
    createdAt: "2025-04-20T00:00:00Z",
    updatedAt: "2025-05-30T00:00:00Z",
  },
  proj_4: {
    id: "proj_4",
    name: "Design System",
    description: "Build a shared component library with Tailwind and Radix",
    status: "done",
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-04-15T00:00:00Z",
  },
  proj_5: {
    id: "proj_5",
    name: "Analytics Dashboard",
    description: "Real-time analytics dashboard with charts and metrics",
    status: "active",
    createdAt: "2025-06-05T00:00:00Z",
    updatedAt: "2025-06-12T00:00:00Z",
  },
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  done: "outline",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? mockProjects[id] : null;

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
            Detailed information of the selected project.
          </p>
        </div>
      </div>

      {project ? (
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
                {project.description || "No description provided."}
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
      ) : (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The requested project could not be found.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/dashboard/projects">Return to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
