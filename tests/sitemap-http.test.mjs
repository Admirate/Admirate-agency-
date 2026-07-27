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

  const expectedPaths = [
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

  for (const path of expectedPaths) {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(html, new RegExp(`href="${escapedPath}"`), `missing ${path}`);
  }

  assert.doesNotMatch(html, /href="\/dashboard/);
  assert.doesNotMatch(html, /href="\/api/);
});
