import test from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const moduleUrl = pathToFileURL(
  resolve(here, "../src/components/llms/catalog.mjs"),
).href;

let buildLlmsSections;
let renderLlmsTxt;

try {
  ({ buildLlmsSections, renderLlmsTxt } = await import(moduleUrl));
} catch {
  // The RED run reaches the explicit function assertions below.
}

const input = {
  origin: "https://admirate.in/",
  homeDescription: "Strategic design and marketing agency in Hyderabad.",
  services: [
    { slug: "identity", label: "Identity" },
    { slug: "digital", label: "Digital" },
  ],
  serviceDescriptions: {
    identity: "Brand identity and logo systems.",
    digital: "Fast websites and digital experiences.",
  },
  posts: [
    {
      slug: "first-post",
      title: "First [useful] post",
      excerpt: "A concise\narticle description.",
    },
  ],
  legalDocs: [
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      description: "How ADMIRATE handles personal data.",
    },
  ],
  contacts: [
    {
      label: "Email ADMIRATE",
      href: "mailto:essentials@admirate.in",
      description: "Send a direct project enquiry.",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/admirate.in",
      description: "ADMIRATE on Instagram.",
    },
  ],
};

test("catalog covers public content in a stable order", () => {
  assert.equal(typeof buildLlmsSections, "function");

  const sections = buildLlmsSections(input);

  assert.deepEqual(
    sections.map((section) => section.title),
    [
      "Primary pages",
      "Services",
      "Journal",
      "Contact and profiles",
      "Legal and site",
    ],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.links.map((link) => link.href)),
    [
      "https://admirate.in",
      "https://admirate.in/services",
      "https://admirate.in/pricing",
      "https://admirate.in/blogs",
      "https://admirate.in/start-project",
      "https://admirate.in/services/identity",
      "https://admirate.in/services/digital",
      "https://admirate.in/blogs/first-post",
      "mailto:essentials@admirate.in",
      "https://www.instagram.com/admirate.in",
      "https://admirate.in/privacy-policy",
      "https://admirate.in/sitemap",
    ],
  );
});

test("renderer emits specification-shaped Markdown and normalizes authored text", () => {
  assert.equal(typeof renderLlmsTxt, "function");

  const output = renderLlmsTxt({
    name: "ADMIRATE",
    summary: "Strategic design and marketing agency in Hyderabad.",
    overview: "ADMIRATE works with clients across India.",
    sections: buildLlmsSections(input),
  });

  assert.match(output, /^# ADMIRATE\n\n> Strategic design/);
  assert.match(output, /\n## Services\n/);
  assert.ok(
    output.includes(
      "- [First \\[useful\\] post](https://admirate.in/blogs/first-post): A concise article description.",
    ),
  );
  assert.equal(output.endsWith("\n"), true);
  assert.doesNotMatch(output, /\/dashboard|\/api\//);
});
