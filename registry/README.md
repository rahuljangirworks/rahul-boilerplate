# Custom Shadcn Component Registry

This directory holds the development source files, schemas, compilations, legal attributions, and local validation workflows for your custom, premium **shadcn-compatible component registry**.

---

## 🏛️ Twin-Directory Architecture

To keep the application modular and scalable, this registry separates raw development sources from served JSON files:
1. **`registry/` (Development Sources)**: High-quality React components, custom hooks, and utilities written by developers, fully typechecked and isolated.
2. **`public/r/` (Compiled Registry)**: Static JSON payloads automatically generated from the development sources and served statically over HTTP for consumption by the standard `npx shadcn` CLI.

---

## 📁 Folder Structure

```text
registry/
├── registry.json                 # Main index mapping all components and metadata
├── README.md                     # This documentation file
├── tsconfig.json                 # Registry-specific typecheck configuration
├── types.d.ts                    # Mocks for downstream dynamic primitives (e.g. sidebar)
├── scripts/
│   ├── build-registry.ts         # TypeScript compiler script
│   └── smoke-test.ts             # E2E installation simulation script
├── blocks/                       # Layout components and page templates
│   ├── auth/                     # Auth sign-in / signup cards
│   └── landing/                  # SaaS marketing layouts
├── hooks/                        # Custom hooks utilized by registry components
│   └── use-mobile.ts             # Responsive viewport width pivots listener
└── attribution/
    └── THIRD-PARTY-UI.md         # Open-source compliance attribution journal
```

---

## 🚀 Workflows & Verification Commands

We have implemented a dual-layered local verification pipeline to guarantee that all components are 100% type-safe, compiling, and deliverable.

### 1. Build the Registry JSON
Compiles all development sources in `/registry` into standalone JSON payloads in `public/r/` and updates the combined index `public/r/index.json`:
```bash
# Execute local TypeScript compiler script
npx tsx registry/scripts/build-registry.ts
```

### 2. Run Local Typecheck (`typecheck:registry`)
Since registry files are development templates that utilize optional client modules (e.g. `react-hook-form` in `auth-login-card`), we exclude the `registry/` folder from the main application's `tsconfig.json`.

Instead, we run typechecks in isolation using a dedicated `registry/tsconfig.json` which resolves parent-app imports dynamically and uses `types.d.ts` declarations mockups:
```bash
# Run isolated type check on registry templates
npm run typecheck:registry
```

### 3. Run E2E Installation Smoke Test (`test:registry-install`)
This script simulates the end-user CLI installation sequence inside a sandboxed target application under `/tmp/shadcn-smoke-test/`:
1. Compiles the latest registry sources to `public/r/`.
2. Scaffolds a dummy React/Tailwind/tsconfig sandbox app in `/tmp`.
3. Runs `npm install` for core typings (`@types/react`) and utility helpers (`tailwind-merge`, `clsx`).
4. Runs `npx shadcn add` locally pointing to the compiled JSON files under `public/r/` (resolving nested dependencies and parent primitives).
5. Runs `npx tsc --noEmit` inside the sandboxed target project to verify path alias resolution and type sanity.
6. Automatically purges all temporary files.

To execute the full installation verification pass:
```bash
# Run E2E simulation and typecheck
npm run test:registry-install
```

---

## ⚖️ Open-Source Attribution Policy

To remain fully compliant with permissive open-source licenses (MIT/Apache), all copied, adapted, or inspired third-party layouts must be logged inside [registry/attribution/THIRD-PARTY-UI.md](file:///home/rahul/work/personal-projacts/rahul-boilerplate/registry/attribution/THIRD-PARTY-UI.md).

For each entry, ensure you document:
- Original source repository URL and specific studied file paths.
- Original license type (MIT, Apache-2.0, etc.) and full license copyright text.
- Original author and year.
- Detailed modification logs (e.g., upgrades to React 19 rules, styling shifts to Tailwind v4 CSS variables).
