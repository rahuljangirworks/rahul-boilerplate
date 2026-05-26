import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),

  // Auth UI routes (guest-only — middleware redirects logged-in users to /dashboard)
  route("auth/sign-in", "routes/auth.sign-in.tsx"),
  route("auth/sign-up", "routes/auth.sign-up.tsx"),

  // Better Auth API handler — handles all /api/auth/* requests
  route("api/auth/*", "routes/api/auth.ts"),

  // tRPC API handler
  route("api/trpc", "routes/api/trpc.ts"),

  // Dashboard (protected by auth middleware)
  layout("components/layout/app-shell.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("dashboard/projects", "routes/dashboard/projects.tsx"),
    route("dashboard/projects/:id", "routes/dashboard/projects.$id.tsx"),
  ]),
] satisfies RouteConfig;
