import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import cronHandler from "../app/server/cron";

// 1. Load environment variables from local env files if they exist
const envFiles = [".env.local", ".env"];
for (const file of envFiles) {
  const filePath = resolve(process.cwd(), file);
  if (existsSync(filePath)) {
    if (typeof (process as any).loadEnvFile === "function") {
      try {
        (process as any).loadEnvFile(filePath);
        console.log(`[Test Harness] Loaded environment variables from ${file}`);
      } catch (e) {
        loadEnvFileManually(filePath);
      }
    } else {
      loadEnvFileManually(filePath);
    }
  }
}

function loadEnvFileManually(filePath: string) {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index > 0) {
        const key = trimmed.slice(0, index).trim();
        const val = trimmed.slice(index + 1).trim();
        const cleanVal = val.replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = cleanVal;
        }
      }
    }
    console.log(`[Test Harness] Loaded environment variables from ${filePath} (manually)`);
  } catch (e) {
    console.error(`[Test Harness] Error loading ${filePath}:`, e);
  }
}

// 2. Parse arguments for custom cron schedule simulation
const args = process.argv.slice(2);
const cronPattern = args[0] || "0 0 * * *"; // Default to midnight daily if not specified

console.log("\n========================================================");
console.log(`[Test Harness] Simulating Cron trigger for: "${cronPattern}"`);
console.log("========================================================\n");

// 3. Mock the event payload
const event = {
  cron: cronPattern,
  scheduledTime: Date.now(),
  noURI: false,
};

// 4. Mock the Cloudflare env object
const env = {
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ...process.env,
};

// 5. Mock the Cloudflare execution context
const pendingPromises: Promise<any>[] = [];
const ctx = {
  waitUntil(promise: Promise<any>) {
    pendingPromises.push(promise);
  },
};

// 6. Run the handler
async function run() {
  const startTime = performance.now();
  try {
    await cronHandler.scheduled(event, env, ctx);
    
    // Wait for all waitUntil promises to resolve
    if (pendingPromises.length > 0) {
      console.log(`[Test Harness] Waiting for ${pendingPromises.length} background task(s) (waitUntil)...`);
      await Promise.all(pendingPromises);
    }
    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`\n[Test Harness] Simulation finished successfully in ${duration}ms!`);
  } catch (error) {
    console.error("\n[Test Harness] Simulation failed with error:", error);
    process.exit(1);
  }
}

run();
