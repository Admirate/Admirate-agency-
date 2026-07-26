import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/landing/clientGrid.mjs"),
).href;
let renderClientGrid;

try {
  ({ renderClientGrid } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertion below.
}

test("client grid renderer emits every supplied logo once with its display metadata", () => {
  assert.equal(typeof renderClientGrid, "function", "renderClientGrid is missing");

  const html = renderClientGrid(
    [
      { name: "Wide Brand", file: "wide logo.webp" },
      { name: "White Brand", file: "white.webp", inv: true },
      { name: "Padded Brand", file: "padded.webp", scale: 1.45 },
    ],
    (file) => `/clients/${encodeURIComponent(file)}`,
  );

  assert.equal(
    html,
    '<li class="client-cell"><img src="/clients/wide%20logo.webp" alt="Wide Brand" loading="lazy" decoding="async"></li>' +
      '<li class="client-cell is-inverted"><img src="/clients/white.webp" alt="White Brand" class="inv" loading="lazy" decoding="async"></li>' +
      '<li class="client-cell"><img src="/clients/padded.webp" alt="Padded Brand" style="--s:1.45" loading="lazy" decoding="async"></li>',
  );
});
