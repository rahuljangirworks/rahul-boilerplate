#!/usr/bin/env tsx
/**
 * scripts/migrate.ts
 *
 * Programmatic Turso/libSQL migration runner.
 * Runs all pending Drizzle migrations from ./drizzle/migrations/
 *
 * Usage:
 *   npx tsx scripts/migrate.ts
 *
 * Requires env vars:
 *   TURSO_DATABASE_URL — e.g. libsql://your-db.turso.io
 *   TURSO_AUTH_TOKEN   — your Turso auth token
 *
 * For local SQLite dev:
 *   TURSO_DATABASE_URL=file:./local.db
 *   TURSO_AUTH_TOKEN=any-non-empty-string
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌  TURSO_DATABASE_URL is not set.");
  process.exit(1);
}

if (!authToken) {
  console.error("❌  TURSO_AUTH_TOKEN is not set.");
  process.exit(1);
}

console.log(`🔗  Connecting to: ${url}`);

const client = createClient({ url, authToken });
const db = drizzle(client);

const migrationsFolder = path.resolve(__dirname, "../drizzle/migrations");

console.log(`📂  Running migrations from: ${migrationsFolder}`);

try {
  await migrate(db, { migrationsFolder });
  console.log("✅  All migrations applied successfully.");
  process.exit(0);
} catch (err) {
  console.error("❌  Migration failed:", err);
  process.exit(1);
}
