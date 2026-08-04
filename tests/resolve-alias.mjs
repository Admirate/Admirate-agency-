/**
 * Teaches `node --test` the module resolution that tsconfig.json declares and
 * Next understands: the "@/…" path alias, and extensionless relative imports.
 *
 * Without it, anything the tests cover may only import from packages and
 * fully-extensioned relative paths — a constraint on production code imposed by
 * the test runner, which is exactly backwards.
 *
 * Used as: node --import ./tests/resolve-alias.mjs --test "tests/*.test.mjs"
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The candidates TypeScript would try for an extensionless path, in its order.
 * Returns a resolution object, or null when none of them is on disk.
 */
const tryExtensions = (base) => {
  for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    if (existsSync(candidate)) {
      return { url: pathToFileURL(candidate).href, shortCircuit: true };
    }
  }
  return null;
};

/** Anything already carrying an extension is Node's to resolve, not ours. */
const hasExtension = (specifier) => /\.[a-z0-9]+$/i.test(specifier);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const hit = tryExtensions(resolve(root, "src", specifier.slice(2)));
      if (hit) return hit;
    }

    // "./shell" and "../lib/x" — bundler resolution allows the extension to be
    // left off, and the modules under test are written that way throughout.
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !hasExtension(specifier) &&
      context.parentURL?.startsWith("file:")
    ) {
      const from = dirname(fileURLToPath(context.parentURL));
      const hit = tryExtensions(resolve(from, specifier));
      if (hit) return hit;
    }

    return nextResolve(specifier, context);
  },
});
