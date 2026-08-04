/**
 * Teaches `node --test` the "@/…" path alias that tsconfig.json declares and
 * Next understands, so a module under test can import another src module.
 *
 * Without it, anything the tests cover may only import from packages and
 * relative paths — a constraint on production code imposed by the test runner,
 * which is exactly backwards.
 *
 * Used as: node --import ./tests/resolve-alias.mjs --test tests/
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = resolve(root, "src", specifier.slice(2));
      // The alias is written without an extension, as bundler resolution
      // allows; Node requires one, so the candidates are tried in the order
      // TypeScript would.
      for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
        if (existsSync(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
});
