import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/sitemap/catalog.mjs"),
).href;

let buildSitemapGroups;
let flattenSitemapPaths;
let renderSitemapContent;

try {
  ({ buildSitemapGroups, flattenSitemapPaths, renderSitemapContent } =
    await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

const input = {
  services: [
    { slug: "identity", label: "Identity" },
    { slug: "digital", label: "Digital" },
  ],
  posts: [
    { slug: "first-post", title: "First post" },
    { slug: "second-post", title: "Second & final" },
  ],
  legalDocs: [
    { slug: "privacy-policy", title: "Privacy Policy" },
    { slug: "terms", title: "Terms & Conditions" },
  ],
};

test("catalog contains every public page and no private route", () => {
  assert.equal(
    typeof buildSitemapGroups,
    "function",
    "buildSitemapGroups is missing",
  );
  assert.equal(
    typeof flattenSitemapPaths,
    "function",
    "flattenSitemapPaths is missing",
  );

  const groups = buildSitemapGroups(input);
  const paths = flattenSitemapPaths(groups);

  assert.deepEqual(
    groups.map((group) => group.title),
    ["Main Pages", "Services", "Journal", "Legal & Site"],
  );
  assert.deepEqual(paths, [
    "/",
    "/services",
    "/pricing",
    "/blogs",
    "/start-project",
    "/services/identity",
    "/services/digital",
    "/blogs/first-post",
    "/blogs/second-post",
    "/privacy-policy",
    "/terms",
    "/sitemap",
  ]);
  assert.equal(paths.some((path) => path.startsWith("/dashboard")), false);
  assert.equal(paths.some((path) => path.startsWith("/api")), false);
});

test("renderer emits one crawlable escaped anchor per catalog path", () => {
  assert.equal(
    typeof renderSitemapContent,
    "function",
    "renderSitemapContent is missing",
  );

  const groups = buildSitemapGroups(input);
  const html = renderSitemapContent(groups);
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(hrefs, flattenSitemapPaths(groups));
  assert.match(html, /Second &amp; final/);
  assert.doesNotMatch(html, /<script/i);
});
