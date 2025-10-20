// tests/coverage.import-all.test.js
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: tests/ -> src/ is one level up
const SRC_DIR = path.resolve(__dirname, "../src");

// Ignore list: add files that start servers or do heavy side effects on import.
const IGNORE_BASENAMES = new Set([
  "server.js", // common entry that calls app.listen()
  "index.js",  // if it bootstraps things
]);

// Ignore directories that cause model re-registration or heavy side effects
const IGNORE_DIRS = new Set([
  "models",  // prevent OverwriteModelError from Mongoose
  "config",  // optional: skip DB connection configs
  "seed",    // optional: skip data seeding scripts
]);

async function importTree(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);

    // Skip unwanted directories entirely
    if (stat.isDirectory()) {
      if (IGNORE_DIRS.has(name)) continue;
      await importTree(full);
      continue;
    }

    // Skip ignored files
    if (
      stat.isFile() &&
      full.endsWith(".js") &&
      !IGNORE_BASENAMES.has(path.basename(full))
    ) {
      // Convert to file:// URL for ESM dynamic import
      await import(pathToFileURL(full).href);
    }
  }
}

test("import all source files for coverage visibility", async () => {
  await importTree(SRC_DIR);
});
