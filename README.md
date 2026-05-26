# ⚡ Production-Ready React Router v7 Boilerplate

A premium, highly optimized full-stack starter template for launching web applications on an edge-native stack. Built for developer velocity, robust quality, and scalability.

[![Stack Status](https://img.shields.io/badge/Stack-React_Router_7_+_TypeScript-blue)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://github.com/rahuljangirworks/rahul-boilerplate/actions/workflows/deploy-cloudflare.yml/badge.svg)](https://github.com/rahuljangirworks/rahul-boilerplate/actions)

---

## 🎨 Design & Aesthetic System
The boilerplate is built with modern design principles at its core:
*   **Aesthetics**: Sleek glassmorphism details, tailwind-curated dark and light themes, and smooth micro-animations.
*   **Typography**: Out-of-the-box system integration with clean, responsive type hierarchies (Inter font-family).
*   **Components**: Based on Tailwind CSS v4 and shadcn/ui primitives.

---

## 🛠️ The Tech Stack

| Layer | Choice | Description |
| :--- | :--- | :--- |
| **Framework** | **React Router v7** | Framework mode with Server-Side Rendering (SSR) & Vite bundler. |
| **Styling** | **Tailwind CSS v4** | Next-gen utility-first CSS processor featuring custom design tokens. |
| **UI Kit** | **shadcn/ui v4** | Fully accessible and unstyled component primitives. |
| **Auth** | **Better Auth** | Cookie-based session validation, signup/login forms, hooks, and routing middleware. |
| **API/RPC** | **tRPC v11** | End-to-end type safety between backend routers and React query components. |
| **Querying** | **TanStack Query v5** | State hydration, cache management, prefetching, and loading states. |
| **Database** | **Drizzle ORM** | Type-safe queries, migration control, and Drizzle Studio support. |
| **Engine** | **Turso (libSQL)** | Serverless, SQLite-compatible edge database. |
| **State** | **Zustand v5** | Minimal, lightweight client-side state store. |
| **Testing** | **Vitest + Playwright** | Fast unit/integration tests and complete E2E browser tests. |
| **CI/CD** | **GitHub Actions** | Automated typechecking, unit/E2E test verification, DB updates, and edge deployment. |

---

## ✨ Implemented Modules & Features

### 🔐 1. Core Auth & Middleware
*   Secure registration, password login, and profile administration.
*   Custom `authMiddleware` for protecting server-side loader functions and client-side view states.
*   React hooks (`useAuthUser()`) for clean global session context.

### 📊 2. Dynamic Projects CRUD
*   A complete reference implementation of owner-scoped CRUD operations.
*   Power-packed **TanStack Table** with pagination, multi-column search filters, and collapsible drawers.
*   Data validation using **Zod** schema constraints.

### 🤖 3. AI Chat Assistant
*   Auto-scrolling, streaming chat interface powered by **Cloudflare Workers AI** & **Vercel AI SDK**.
*   Interactive conversation blocks, customizable avatars, Markdown responses, and quick-start chip prompts.
*   Gracefully falls back to mock responses when API credentials are not set.

### 📂 4. Cloud Storage Uploads
*   Beautiful drag-and-drop file upload zone supporting drag states, drop animations, and a 5MB threshold.
*   Generates secure S3 presigned URLs from Cloudflare R2 on the fly (preventing key exposure).
*   Progress indicator tracking upload states, along with a grid view to inspect and delete files.

### 📧 5. Transactional Email Dashboard
*   Desktop & mobile preview mode compiling beautifully styled React Email templates.
*   Send sandbox test messages directly via **Resend** to verify design and delivery.

### 🗓️ 6. Background Cron Jobs
*   Serverless cron job entrypoint ([`app/server/cron.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/cron.ts)) utilizing wrangler schedules.
*   Local simulation command harness ([`scripts/test-cron.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/scripts/test-cron.ts)) to debug schedules locally without deployment.

### 💳 7. Subscription Webhook Skeleton
*   Flexible webhooks handler supporting Stripe, Polar, and LemonSqueezy.
*   Drizzle transaction mapping subscription changes directly to database state.
*   Simulated billing script ([`scripts/test-billing-webhook.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/scripts/test-billing-webhook.ts)) to fire test events locally.

---

## 🗂️ Project Map

```
├── .github/workflows/   # CI/CD deployment pipelines (Cloudflare / Vercel)
├── app/                 # Main Application Source
│   ├── components/      # UI components (shadcn primitives, project forms, shells)
│   ├── emails/          # React Email templates (welcome, notifications)
│   ├── hooks/           # Auth and utility hooks
│   ├── lib/             # Env configuration, auth setup, cookies
│   ├── middlewares/     # Route guard middleware
│   ├── providers/       # Theme providers and tRPC wrappers
│   ├── routes/          # Layout groups, pages, api routes, and views
│   ├── server/          # Backend code (Drizzle client, tRPC router, cron handlers)
│   └── stores/          # Zustand store definitions (sidebar, active states)
├── drizzle/             # SQL schema models and migrations
├── scripts/             # Local developer utilities (migrations, webhook/cron testing, rename)
├── wrangler.jsonc       # Cloudflare Wrangler Configuration
└── vercel.json          # Vercel SPA Routing Configuration
```

---

## 🚀 Getting Started & Operations

*   For details on cloning, rebranding, setting up database tables, and starting development, read [**TEMPLATE-USAGE.md**](file:///home/rahul/work/personal-projacts/rahul-boilerplate/TEMPLATE-USAGE.md).
*   For instructions on edge environment mappings, CI/CD integrations, Turso migrations, logs, and rollback strategies, check [**Deployment Runbook**](file:///home/rahul/work/personal-projacts/rahul-boilerplate/.agent/workflows/deployment-runbook.md).
*   For configuring and testing cron triggers, read [**Cron Jobs Guide**](file:///home/rahul/work/personal-projacts/rahul-boilerplate/.agent/workflows/cron-jobs.md).

---

## 🧪 Testing scripts

```bash
npm run test:unit      # Runs Vitest test suite (40 unit/integration tests)
npm run test:e2e       # Runs Playwright E2E browser tests
npm run typecheck      # Runs typechecks and compilation validations
```

## 📄 License

MIT
