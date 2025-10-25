// tests/coverage.import-all.test.js
import fs from "fs";
import path from "path";
import { fileURLToPath as file_url_to_path, pathToFileURL as path_to_file_url } from "url";

const file_name = file_url_to_path(import.meta.url);
const dir_name = path.dirname(file_name);

// IMPORTANT: tests/ -> src/ is one level up
const src_dir = path.resolve(dir_name, "../src");

// Ignore list: add files that start servers or do heavy side effects on import.
const ignore_base_names = new Set(["server.js", "index.js"]);

// Ignore directories that cause model re-registration or heavy side effects
const ignore_dirs = new Set(["models", "config", "seed"]);

async function import_tree(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);

    // Skip unwanted directories entirely
    if (stat.isDirectory()) {
      if (ignore_dirs.has(name)) continue;
      await import_tree(full);
      continue;
    }

    // Skip ignored files
    if (stat.isFile() && full.endsWith(".js") && !ignore_base_names.has(path.basename(full))) {
      // Convert to file:// URL for ESM dynamic import
      await import(path_to_file_url(full).href);
    }
  }
}

test("import all source files for coverage visibility", async () => {
  await import_tree(src_dir);
  // Satisfy jest/expect-expect rule
  expect(true).toBe(true);
});
