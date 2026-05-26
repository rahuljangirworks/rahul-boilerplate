import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const TEMP_DIR = path.join("/tmp", "shadcn-smoke-test")
const ROOT_DIR = process.cwd()

console.log("🚀 Starting Custom Registry E2E Installation Smoke Test...")

try {
  // 1. Ensure Registry is compiled
  console.log("📦 Step 1: Compiling local registry JSON files...")
  execSync("npx tsx registry/scripts/build-registry.ts", { stdio: "inherit", cwd: ROOT_DIR })

  // 2. Setup Sandboxed Target Project
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true })
  fs.mkdirSync(path.join(TEMP_DIR, "src", "lib"), { recursive: true })
  fs.mkdirSync(path.join(TEMP_DIR, "src", "components"), { recursive: true })
  fs.mkdirSync(path.join(TEMP_DIR, "src", "hooks"), { recursive: true })

  console.log(`📂 Step 2: Created temporary sandbox environment at ${TEMP_DIR}`)

  // Write package.json with standard TS definitions and helpers to compile successfully
  const packageJson = {
    name: "shadcn-smoke-test",
    private: true,
    type: "module",
    dependencies: {
      "react": "^19.2.6",
      "react-dom": "^19.2.6",
      "lucide-react": "^0.475.0",
      "zod": "^3.24.1",
      "clsx": "^2.1.1",
      "tailwind-merge": "^3.0.0"
    },
    devDependencies: {
      "typescript": "^5.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0"
    }
  }
  fs.writeFileSync(
    path.join(TEMP_DIR, "package.json"),
    JSON.stringify(packageJson, null, 2),
    "utf8"
  )

  // Write components.json
  const componentsJson = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/index.css",
      "baseColor": "neutral",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    }
  }
  fs.writeFileSync(
    path.join(TEMP_DIR, "components.json"),
    JSON.stringify(componentsJson, null, 2),
    "utf8"
  )

  // Write tsconfig.json mapping both @/* and ~/* to src/* so dynamic installation imports resolve flawlessly
  const tsconfigJson = {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "~/*": ["src/*"]
      },
      "target": "ES2022",
      "module": "ES2022",
      "moduleResolution": "bundler",
      "jsx": "react-jsx",
      "strict": true,
      "noEmit": true,
      "skipLibCheck": true
    }
  }
  fs.writeFileSync(
    path.join(TEMP_DIR, "tsconfig.json"),
    JSON.stringify(tsconfigJson, null, 2),
    "utf8"
  )

  // Write mock index.css & tailwind.config.js & utils.ts
  fs.writeFileSync(path.join(TEMP_DIR, "src", "index.css"), '@import "tailwindcss";\n', "utf8")
  fs.writeFileSync(path.join(TEMP_DIR, "tailwind.config.js"), "module.exports = { theme: { extend: {} } }\n", "utf8")
  
  const utilsContent = `
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  fs.writeFileSync(path.join(TEMP_DIR, "src", "lib", "utils.ts"), utilsContent, "utf8")

  // 3. Install packages in target
  console.log("⚙️ Step 3: Resolving target npm package dependencies...")
  execSync("npm install", { stdio: "inherit", cwd: TEMP_DIR })

  // 4. Run installation simulation via shadcn CLI
  console.log("📥 Step 4: Simulating component installations via shadcn CLI...")
  
  const componentsToTest = [
    "use-mobile",
    "auth-login-card",
    "landing-saas-home",
    "dashboard-sidebar-layout"
  ]

  for (const component of componentsToTest) {
    const jsonPath = path.join(ROOT_DIR, "public", "r", `${component}.json`)
    console.log(`  └─ Adding component: ${component} from ${jsonPath}...`)
    execSync(`npx shadcn@latest add ${jsonPath} --yes`, { stdio: "inherit", cwd: TEMP_DIR })
  }

  // 5. Run compilation check on target project
  console.log("🔬 Step 5: Validating TS type safety inside sandboxed application...")
  execSync("npx tsc --noEmit", { stdio: "inherit", cwd: TEMP_DIR })

  console.log("\n✅ E2E Custom Registry Smoke Test: SUCCESS! All components installed and typechecked perfectly.\n")
} catch (error) {
  console.error("\n❌ E2E Smoke Test FAILED with error:\n", error)
  process.exit(1)
} finally {
  // Clean up
  console.log(`🧹 Step 6: Cleaning up sandboxed workspace at ${TEMP_DIR}`)
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true })
  }
  console.log("✨ Test complete.")
}
