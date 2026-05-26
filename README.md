# Boilerplate

A production-ready, full-stack starter template for quickly launching personal, client, and internal product apps on a modern edge-ready React stack.

## Stack

| Layer | Choice |
|---|---|
| Framework | React Router v7 (framework mode, SSR) |
| Styling | Tailwind CSS v4 + shadcn/ui v4 |
| Auth | Better Auth (sessions, middleware, sign-in/sign-up) |
| RPC | tRPC v11 + TanStack Query v5 |
| Client State | Zustand v5 |
| Database | Drizzle ORM + Turso/libSQL |
| Tables | TanStack Table v8 |
| Validation | Zod v4 + `@t3-oss/env-core` |
| Deploy Primary | Cloudflare Workers (via Wrangler) |
| Deploy Secondary | Vercel |
| Deploy Fallback | Docker |

## Quick Start

### 1. Clone and install

```bash
git clone <this-repo-url> my-app
cd my-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Then fill in the required values (see [Environment Variables](#environment-variables) below).

### 3. Set up the database

```bash
# Push schema to your Turso database
npx drizzle-kit push
```

For local development you can use a local SQLite file — update `TURSO_DATABASE_URL` to `file:./local.db` and set `TURSO_AUTH_TOKEN` to any non-empty string.

### 4. Type-check and run

```bash
npm run typecheck   # Verify TypeScript — should pass with zero errors
npm run dev         # Start the dev server at http://localhost:5173
```

## Environment Variables

### Required

| Variable | Description |
|---|---|
| `TURSO_DATABASE_URL` | Your Turso database URL (`libsql://...`) or `file:./local.db` for local SQLite |
| `TURSO_AUTH_TOKEN` | Turso auth token (any non-empty string works for local SQLite) |
| `BETTER_AUTH_SECRET` | A random secret string — minimum 32 characters |
| `BETTER_AUTH_URL` | The base URL of your app — use `http://localhost:5173` locally |

### Optional

| Variable | Module | Description |
|---|---|---|
| `RESEND_API_KEY` | Email | Resend API key for transactional emails. App works fine without it. |
| `R2_ENDPOINT` | Storage | Cloudflare R2 endpoint for file uploads. App works fine without it. |
| `R2_ACCESS_KEY_ID` | Storage | R2 access key |
| `R2_SECRET_ACCESS_KEY` | Storage | R2 secret key |
| `R2_BUCKET_NAME` | Storage | R2 bucket name |
| `PUBLIC_APP_URL` | App | Public URL used for generated links. Defaults to `BETTER_AUTH_URL`. |

Optional modules fail gracefully when their env vars are absent — they will not break local development.

## Project Structure

```
app/
├── components/
│   ├── layout/        # App shell, sidebar, header, user nav
│   ├── projects/      # CRUD example: table, dialogs
│   └── ui/            # shadcn/ui base primitives
├── hooks/             # useAuthUser, useOptionalAuthUser
├── lib/               # auth-client, auth.server, env, utils
├── middlewares/       # Auth middleware (route protection)
├── providers/         # TRPCProviderWrapper
├── routes/
│   ├── _index.tsx     # Landing page
│   ├── api/           # auth handler, tRPC handler
│   ├── dashboard.tsx  # Dashboard home (protected)
│   └── dashboard/     # Projects CRUD, project detail
├── server/
│   ├── db.ts          # Drizzle + Turso client
│   ├── trpc.ts        # tRPC init, context, procedures
│   ├── router.ts      # Merged root router
│   └── routers/       # project, user, chat, email, upload
└── stores/            # Zustand: sidebar, filters
drizzle/               # Schema and migrations
```

## Auth Routes

Better Auth exposes routes under `/api/auth/*`. The middleware protects dashboard routes and redirects to `/auth/sign-in`. Auth UI routes (`/auth/sign-in`, `/auth/sign-up`, etc.) are guest-only — logged-in users are redirected to `/dashboard`.

If you need custom auth UI pages, add them as React Router routes under `app/routes/auth/`.

## Optional Extension Modules

These modules are cleanly stubbed and can be activated by filling in the relevant env vars:

- **AI chat** (`app/server/routers/chat.ts`) — Workers AI via `workers-ai-provider`. Requires a Workers AI binding in production.
- **R2 uploads** (`app/server/routers/upload.ts`) — Presigned S3-compatible uploads to Cloudflare R2. Server-only; never exposes secrets to the client.
- **Resend email** (`app/server/routers/email.ts`) — Transactional emails using the Resend SDK.

Extension routes exist in the tRPC router but are no-ops (return gracefully) when their env vars are not set.

## Deployment

### Cloudflare Workers (Primary)

```bash
npm run build
npx wrangler deploy
```

Set production secrets via `npx wrangler secret put <NAME>`.

### Vercel (Secondary)

Import the repo into Vercel. Set the same environment variables in the Vercel dashboard.

### Docker (Fallback)

```bash
docker build -t boilerplate .
docker run -p 3000:3000 --env-file .env boilerplate
```

## Using This as a Template

1. Clone the repo.
2. Rename the app: update `name` in `package.json`, the `name` in `wrangler.jsonc`, and any title strings in the routes.
3. Fill `.env` with your credentials.
4. Run `npx drizzle-kit push` to create the schema.
5. Run `npm run dev`.
6. Start adding your product-specific routes and routers.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build |
| `npm run typecheck` | Run `react-router typegen` + `tsc` |
| `npm run start` | Serve the production build locally |

## License

MIT
