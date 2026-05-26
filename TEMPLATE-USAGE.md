# Template Setup & Usage Guide — rahul-boilerplate

This document is a step-by-step checklist to help you clone, rename, configure, and customize this boilerplate for a new product, app, or service.

---

## 🚀 Quick-Start Checklist

Follow these steps to instantiate a brand-new project from this boilerplate:

### 1. Clone the Repository
Clone this repository to your local machine into your preferred project directory:
```bash
git clone <this-repo-url> my-new-app
cd my-new-app
```

### 2. Reset Git History
If you are starting a fresh project, delete the boilerplate's git history and initialize a new repository:
```bash
rm -rf .git
git init
```

### 3. Rebrand the Project
Run the built-in renaming utility to update the project name in `package.json`, `package-lock.json`, and `wrangler.jsonc`:
```bash
npm run rename my-new-app
```

### 4. Create and Configure Environment Variables
Copy the template environment file to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` in your editor and configure the following variables:
- **`TURSO_DATABASE_URL`**: Use `file:./local.db` for quick local SQLite development, or point to a live Turso DB (`libsql://...`).
- **`TURSO_AUTH_TOKEN`**: A random string for local development, or your real Turso API token.
- **`BETTER_AUTH_SECRET`**: Generate a secure 32-character random string.
  - *Tip:* You can generate one via terminal: `openssl rand -hex 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **`BETTER_AUTH_URL`**: Set this to `http://localhost:5173` for local development.

### 5. Install Dependencies
Install all package dependencies via npm:
```bash
npm install
```

### 6. Synchronize Database Schema
Push the Drizzle ORM schema to your database (creates the SQLite database file locally if using `file:./local.db`):
```bash
npm run db:push
```

### 7. Run Verification and Startup
Make sure the setup is fully clean:
```bash
npm run typecheck   # Runs type generation and tsc compiler checks
npm run test:unit   # Runs unit/integration test suite (40 tests should pass)
npm run dev         # Launches development server at http://localhost:5173
```

---

## 📦 Core Architecture & customization

Once initialized, here is how you perform common development tasks in the codebase:

### 1. Modifying & Creating DB Tables
All database schemas are stored in [`app/server/db.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/db.ts) and [`drizzle/schema.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/drizzle/schema.ts).
- To add a new table, declare it in `drizzle/schema.ts` using Drizzle ORM's SQLite exports.
- Sync your DB structure locally: `npm run db:push`.
- Create structural migration files (required for production pipelines): `npm run db:generate`.
- Inspect your database visually using Drizzle Studio: `npm run db:studio`.

### 2. Adding tRPC Endpoints
API endpoints live in [`app/server/routers/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/routers/).
- Declare procedures in existing routers or create a new file (e.g. `myRouter.ts`).
- Register your new router in [`app/server/router.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/server/router.ts).
- Consume the queries/mutations in any UI route using the `useTRPC()` hook:
  ```typescript
  import { useTRPC } from "~/providers/trpc-provider";
  
  const trpc = useTRPC();
  const { data, isLoading } = trpc.myRouter.getMyData.useQuery({ id: "123" });
  ```

### 3. Adding Pages and Routing
This boilerplate uses React Router v7 in framework/SSR mode:
- Routes are declared by creating files in [`app/routes/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/routes/).
- The main app dashboard layout is located at [`app/routes/dashboard.tsx`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/routes/dashboard.tsx), which embeds sub-routes like `/dashboard/settings` and `/dashboard/chat` using `<Outlet />`.
- Use the `authMiddleware` to protect new pages. See example files in `app/routes/` for layout configurations.

---

## ⚡ Optional Extension Modules

By default, optional modules run in "graceful fallback mode" if their environment variables are missing, avoiding application crashes. Activate them as needed:

### AI Chat Assistant (Cloudflare Workers AI)
- **Local Dev**: Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` to your local `.env`.
- **Production**: Map the Workers AI binding in `wrangler.jsonc` (`[ai] binding = "AI"`).

### File Uploads (Cloudflare R2 / S3)
- **Local & Production**: Set `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, and `R2_BUCKET_NAME` in your environment.

### Transactional Emails (Resend)
- **Local & Production**: Add `RESEND_API_KEY` to your environment.
- Email templates are crafted using React Email inside the [`app/emails/`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/app/emails/) directory.

### Subscriptions & Billing Webhooks
- **Stripe/Polar/LemonSqueezy**: Wire your provider's webhook URL to your app's endpoint `/api/webhooks/billing`.
- Check [`scripts/test-billing-webhook.ts`](file:///home/rahul/work/personal-projacts/rahul-boilerplate/scripts/test-billing-webhook.ts) for testing webhooks locally with simulated payloads.

---

## 🛡️ Testing & CI/CD Gates

Keep your boilerplate pristine by utilizing the comprehensive test suit:
- **Unit & Integration tests**: Run `npm run test:unit` (powered by Vitest).
- **End-to-End browser tests**: Run `npm run test:e2e` (powered by Playwright).
- **GitHub Actions**: Configured out-of-the-box in `.github/workflows/` to automatically typecheck, compile, run all tests, apply Turso migrations, and deploy to Cloudflare Workers or Vercel on commits to the `main` branch.
