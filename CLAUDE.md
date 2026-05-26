# 🤖 CLAUDE.md — Agent Handoff & Developer Guidelines

This document contains standard instructions, commands, and rules for developers and AI agents working on `rahul-boilerplate`.

---

## ⚡ CLI commands

### Development & Build
*   Start dev server: `npm run dev`
*   Create build bundle: `npm run build`
*   Locally serve build: `npm run start`
*   Compiler typecheck: `npm run typecheck`
*   Rename project: `npm run rename <new-name>`

### Database Operations (Drizzle ORM)
*   Push schema (dev): `npm run db:push`
*   Generate migration file (prod): `npm run db:generate`
*   Apply migrations programmatically (CI/CLI): `npm run db:migrate:run`
*   Drizzle Kit migrations controller: `npm run db:migrate`
*   Open database visualizer: `npm run db:studio`

### Quality Assurance & Testing
*   Run unit/integration tests: `npm run test:unit`
*   Run Playwright E2E browser tests: `npm run test:e2e`

---

## 🛠️ Codebase Guidelines & Architecture

### 1. File & Directory Layout
*   [`app/routes/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/routes/) — Declares route views. Main dashboard layout lives in `dashboard.tsx` with children routes in `dashboard/`.
*   [`app/server/routers/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/routers/) — Individual tRPC router modules.
*   [`app/server/db.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/db.ts) & [`drizzle/schema.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/drizzle/schema.ts) — Database schema definitions.
*   [`app/components/ui/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/components/ui/) — shadcn/ui visual primitive elements.

### 2. Code Patterns & Styles
*   **Routing**: Use React Router v7 framework configuration (with loaders, actions, and typed route params). Keep components clean by deferring data fetching logic to loaders or tRPC where applicable.
*   **API Layer**: Use **tRPC v11** with defined input schemas (Zod). For protected actions, ensure the procedure runs on `protectedProcedure`.
*   **Styling**: Use **Tailwind CSS v4** design variables. Always use the built-in color-scheme patterns for light/dark theme compatibility.
*   **Database Access**: Execute database actions using **Drizzle ORM**. Always use transaction blocks when updating sensitive multi-table states (e.g. billing webhooks).
*   **Optional Modules**: Keep extension modules (AI, Storage, Emails, Billing) completely optional. If their corresponding environment variables are missing, ensure they fail gracefully by returning status flags/errors instead of crashing the process.

---

## 🤖 Future Agent Handoff

When a new AI agent initializes in this workspace:
1. Read this file ([`CLAUDE.md`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/CLAUDE.md)) and [`PROJECT-STATE.md`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/PROJECT-STATE.md) to understand current state.
2. Read [`TEMPLATE-USAGE.md`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/TEMPLATE-USAGE.md) to understand how to clone/rename/run the app.
3. Read [`deployment-runbook.md`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/.agent/workflows/deployment-runbook.md) to understand deployment pipelines.
4. Ensure all newly written code matches existing typescript standards and check with `npm run typecheck` and `npm run test:unit` before proposing changes.
