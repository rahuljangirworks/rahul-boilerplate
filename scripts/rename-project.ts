#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';

const projectRoot = path.resolve(__dirname, '..');

// Helper to log with styling
function logSuccess(msg: string) {
  console.log(`\x1b[32m✔\x1b[0m ${msg}`);
}

function logInfo(msg: string) {
  console.log(`\x1b[34mℹ\x1b[0m ${msg}`);
}

function logError(msg: string) {
  console.error(`\x1b[31m✖ Error:\x1b[0m ${msg}`);
}

function validateName(name: string): boolean {
  // npm package name style: alphanumeric, hyphens, underscores
  const validRegex = /^[a-z0-9-_]+$/;
  return validRegex.test(name);
}

function main() {
  const args = process.argv.slice(2);
  const newName = args[0];

  if (!newName) {
    logError('Please provide a new project name.');
    console.log('\nUsage:');
    console.log('  npx tsx scripts/rename-project.ts <new-name>');
    console.log('\nExample:');
    console.log('  npx tsx scripts/rename-project.ts my-cool-app\n');
    process.exit(1);
  }

  if (!validateName(newName)) {
    logError(`Invalid project name: "${newName}"`);
    console.log('The name must contain only lowercase alphanumeric characters, hyphens (-), and underscores (_).');
    process.exit(1);
  }

  console.log(`Renaming project from "rahul-boilerplate" to "${newName}"...\n`);

  // 1. package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    try {
      const pkg = JSON.parse(packageJsonContent);
      const oldName = pkg.name;
      pkg.name = newName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      logSuccess(`Updated package.json name from "${oldName}" to "${newName}"`);
    } catch (e: any) {
      logError(`Failed to update package.json: ${e.message}`);
    }
  } else {
    logInfo('package.json not found, skipping.');
  }

  // 2. package-lock.json
  const packageLockJsonPath = path.join(projectRoot, 'package-lock.json');
  if (fs.existsSync(packageLockJsonPath)) {
    const packageLockContent = fs.readFileSync(packageLockJsonPath, 'utf-8');
    try {
      const lock = JSON.parse(packageLockContent);
      const oldName = lock.name;
      lock.name = newName;
      if (lock.packages && lock.packages['']) {
        lock.packages[''].name = newName;
      }
      fs.writeFileSync(packageLockJsonPath, JSON.stringify(lock, null, 2) + '\n', 'utf-8');
      logSuccess(`Updated package-lock.json name from "${oldName}" to "${newName}"`);
    } catch (e: any) {
      logError(`Failed to update package-lock.json: ${e.message}`);
    }
  } else {
    logInfo('package-lock.json not found, skipping.');
  }

  // 3. wrangler.jsonc
  const wranglerPath = path.join(projectRoot, 'wrangler.jsonc');
  if (fs.existsSync(wranglerPath)) {
    let wranglerContent = fs.readFileSync(wranglerPath, 'utf-8');
    // Using a regex to find "name": "rahul-boilerplate" or similar to avoid JSONC parse/stringify issues with comments
    const wranglerNameRegex = /"name"\s*:\s*"rahul-boilerplate"/g;
    if (wranglerNameRegex.test(wranglerContent)) {
      wranglerContent = wranglerContent.replace(wranglerNameRegex, `"name": "${newName}"`);
      fs.writeFileSync(wranglerPath, wranglerContent, 'utf-8');
      logSuccess(`Updated wrangler.jsonc name to "${newName}"`);
    } else {
      // General match
      const genericNameRegex = /("name"\s*:\s*")[a-z0-9-_]+(")/g;
      if (genericNameRegex.test(wranglerContent)) {
        wranglerContent = wranglerContent.replace(genericNameRegex, `$1${newName}$2`);
        fs.writeFileSync(wranglerPath, wranglerContent, 'utf-8');
        logSuccess(`Updated wrangler.jsonc name to "${newName}"`);
      } else {
        logInfo('Could not find name property in wrangler.jsonc.');
      }
    }
  } else {
    logInfo('wrangler.jsonc not found, skipping.');
  }

  console.log('\n\x1b[32m✔ Project renamed successfully!\x1b[0m');
  console.log('Next steps:');
  console.log('  1. Delete node_modules and run "npm install" if package-lock needs clean synchronization.');
  console.log('  2. Run "npm run typecheck" to verify typescript bindings.');
}

main();
