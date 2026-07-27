import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
const port = 3113;
const baseUrl = `http://127.0.0.1:${port}`;
let server;
let output = "";

const expectedPublicPaths = [
  "/",
  "/services",
  "/blogs",
  "/start-project",
  "/services/identity",
  "/services/design",
  "/services/social-media",
  "/services/digital",
  "/services/video-production",
  "/services/brand-collaterals",
  "/blogs/why-your-website-is-slow",
  "/blogs/what-a-logo-actually-costs",
  "/blogs/packaging-gets-three-seconds",
  "/blogs/what-social-media-management-actually-is",
  "/blogs/when-to-rebrand",
  "/blogs/what-a-brand-film-costs",
  "/blogs/your-logo-has-half-a-second",
  "/blogs/the-homepage-scavenger-hunt",
  "/blogs/where-the-eye-actually-goes",
  "/blogs/reels-that-route",
  "/blogs/consistency-is-the-strategy",
  "/blogs/the-brief-is-the-work",
  "/privacy-policy",
  "/terms",
  "/sitemap",
];

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${output}`);
    }

    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // The server has not bound its port yet.
    }

    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }

  throw new Error(`Timed out waiting for Next.js.\n${output}`);
}

before(async () => {
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--webpack", "-p", String(port)],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"] },
  );
  server.stdout.on("data", (chunk) => {
    output += chunk;
  });
  server.stderr.on("data", (chunk) => {
    output += chunk;
  });
  await waitForServer();
});

after(async () => {
  if (!server || server.exitCode !== null) return;

  if (process.platform === "win32") {
    await new Promise((resolveStop) => {
      const killer = spawn(
        "taskkill",
        ["/pid", String(server.pid), "/T", "/F"],
        { stdio: "ignore" },
      );
      killer.once("error", resolveStop);
      killer.once("exit", resolveStop);
    });
    return;
  }

  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => server.once("exit", resolveExit)),
    new Promise((resolveWait) => setTimeout(resolveWait, 3000)),
  ]);
});

test("HTML sitemap renders every public destination with canonical metadata", async () => {
  const response = await fetch(`${baseUrl}/sitemap`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<title>Sitemap \| ADMIRATE<\/title>/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/admirate\.in\/sitemap"/,
  );
  assert.match(html, /ADMIRATE \/ SITE DIRECTORY/);

  for (const path of expectedPublicPaths) {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(html, new RegExp(`href="${escapedPath}"`), `missing ${path}`);
  }

  assert.doesNotMatch(html, /href="\/dashboard/);
  assert.doesNotMatch(html, /href="\/api/);
});

test("sitemap client bundles omit full article and policy bodies", async () => {
  const html = await (await fetch(`${baseUrl}/sitemap`)).text();
  const scriptUrls = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => new URL(match[1], baseUrl),
  );
  const scripts = await Promise.all(
    scriptUrls.map(async (url) => (await fetch(url)).text()),
  );
  const clientCode = scripts.join("\n");

  assert.doesNotMatch(
    clientCode,
    /Your website looks fine\. It looks fine because/,
  );
  assert.doesNotMatch(
    clientCode,
    /Under the DPDP Act we are the Data Fiduciary/,
  );
});

test("video production renders the supplied showreel in the existing player", async () => {
  const response = await fetch(`${baseUrl}/services/video-production`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    html,
    /<video id="rvid"[^>]*playsinline[^>]*muted[^>]*loop[^>]*preload="metadata"[^>]*disablepictureinpicture[^>]*>/,
  );
  assert.match(
    html,
    /<source src="https:\/\/mshehtxywddtdxxkbnuu\.supabase\.co\/storage\/v1\/object\/public\/videos\/admirate%20summary%203%20\(1\)\.mp4" type="video\/mp4">/,
  );
});

test("full and compact public footers link to the HTML sitemap", async () => {
  const sitemapHtml = await (await fetch(`${baseUrl}/sitemap`)).text();
  const fullFooter = sitemapHtml.match(
    /<nav class="aflegal" aria-label="Legal and site information">([\s\S]*?)<\/nav>/,
  );
  assert.ok(fullFooter, "full footer legal navigation is missing");
  assert.match(fullFooter[1], /href="\/sitemap"[^>]*>Sitemap<\/a>/);

  const startProjectHtml = await (
    await fetch(`${baseUrl}/start-project`)
  ).text();
  const compactFooter = startProjectHtml.match(/<footer>([\s\S]*?)<\/footer>/);
  assert.ok(compactFooter, "compact footer is missing");
  assert.match(compactFooter[1], /href="\/sitemap"[^>]*>Sitemap<\/a>/);
});

test("crawler files advertise the XML feed and include only public content", async () => {
  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemapXml = await sitemapResponse.text();

  assert.equal(sitemapResponse.status, 200);
  const xmlPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  const sitemapHtml = await (await fetch(`${baseUrl}/sitemap`)).text();
  const directoryMarkup = sitemapHtml.match(
    /<div class="map-wrap map-groups">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="afoot">/,
  );
  assert.ok(directoryMarkup, "sitemap directory markup is missing");
  const htmlPaths = [...directoryMarkup[1].matchAll(/href="([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(htmlPaths, expectedPublicPaths);
  assert.equal(new Set(xmlPaths).size, xmlPaths.length, "duplicate XML URLs");
  assert.deepEqual([...xmlPaths].sort(), [...htmlPaths].sort());
  assert.doesNotMatch(sitemapXml, /\/dashboard/);
  assert.doesNotMatch(sitemapXml, /\/api\//);

  const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
  assert.match(robots, /Sitemap: https:\/\/admirate\.in\/sitemap\.xml/);
});
