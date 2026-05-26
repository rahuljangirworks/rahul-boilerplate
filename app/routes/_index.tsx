import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Zap,
  Shield,
  Database,
  ArrowRight,
  LayoutDashboard,
  Globe,
  Lock,
  Layers,
} from "lucide-react";

import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boilerplate — Full-Stack React Starter" },
    {
      name: "description",
      content:
        "A production-ready full-stack starter with React Router v7, Better Auth, tRPC, Drizzle, and Cloudflare-first deployment.",
    },
  ];
}

const stackBadges = [
  "React Router v7",
  "Better Auth",
  "tRPC v11",
  "TanStack Query",
  "Drizzle ORM",
  "Turso/libSQL",
  "Tailwind v4",
  "TypeScript",
  "Cloudflare",
];

const features = [
  {
    title: "Auth Out of the Box",
    description:
      "Better Auth handles sign-in, sign-up, sessions, and protected routes. No configuration guessing — middleware-first, correct from day one.",
    icon: Lock,
  },
  {
    title: "End-to-End Type Safety",
    description:
      "tRPC v11 with TanStack Query gives you fully typed API calls from database to UI. No API contracts to maintain separately.",
    icon: Shield,
  },
  {
    title: "Edge-First Database",
    description:
      "Drizzle ORM on Turso/libSQL. Schema-first, migration-tracked, and compatible with both local SQLite and Cloudflare Workers.",
    icon: Database,
  },
  {
    title: "Dashboard Ready",
    description:
      "A real app shell with collapsible sidebar, top header, theme toggle, user nav, and a Projects CRUD example using TanStack Table.",
    icon: LayoutDashboard,
  },
  {
    title: "Cloudflare-First Deploy",
    description:
      "Wrangler config, Workers AI bindings, R2 upload stubs, and Vercel as a secondary target — all pre-wired, ready to deploy.",
    icon: Globe,
  },
  {
    title: "Optional Modules",
    description:
      "AI chat, R2 uploads, Resend email, cron jobs, and billing hooks are cleanly stubbed. They fail gracefully when env vars are absent.",
    icon: Layers,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
          <Zap className="size-4 text-primary" />
          Boilerplate
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth/sign-in">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth/sign-up">
              Get Started
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-4 py-24 text-center md:py-36">
          <Badge variant="secondary" className="mb-6 text-xs font-medium px-3 py-1">
            Full-Stack · Edge-Ready · Open Source
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl leading-tight">
            Skip the setup.{" "}
            <span className="text-primary">Ship the product.</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg leading-relaxed">
            A production-grade boilerplate with auth, dashboard, typed API, and
            database — wired together and ready to clone, rename, and extend.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/auth/sign-up">
                Start Building
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          {/* Stack badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {stackBadges.map((badge) => (
              <Badge key={badge} variant="outline" className="text-xs font-mono">
                {badge}
              </Badge>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/30 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything wired, nothing assumed
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Each layer is chosen, configured, and connected. No glue code left as an exercise for the reader.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, icon: Icon }) => (
                <Card key={title} className="border bg-background">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed text-sm">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to clone and ship?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Clone the repo, fill your env vars, run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                npm run dev
              </code>
              , and start building your product.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/auth/sign-up">
                  Create Account
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-primary" />
            <span>Boilerplate</span>
          </div>
          <p>
            React Router v7 · tRPC · Better Auth · Drizzle · Cloudflare
          </p>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
