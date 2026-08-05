import type { NextConfig } from "next";

/**
 * `next dev` needs two things the deployed policy must never grant.
 *
 * React Refresh compiles modules by evaluating strings, so without
 * `'unsafe-eval'` every client chunk throws and the page renders as bare
 * server HTML — which on this site means a black screen, because the landing
 * copy is revealed by a `.ready` class that only JS adds. Hot reload also
 * opens a websocket back to the dev server, which `'self'` does not cover.
 *
 * Both are gated on NODE_ENV rather than being added to the shared policy:
 * `'unsafe-eval'` in production would undo most of what a CSP is for.
 */
const isDev = process.env.NODE_ENV !== "production";

const devScriptSrc = isDev ? " 'unsafe-eval'" : "";
const devConnectSrc = isDev ? " ws://localhost:* http://localhost:*" : "";

/**
 * Security headers, declared here rather than only in netlify.toml.
 *
 * netlify.toml has carried an identical block since July, and production was
 * serving none of it: a live check returned only HSTS and X-Content-Type-Options,
 * and the HSTS max-age did not even match the value in the file. Netlify's
 * `[[headers]]` decorate files served from the publish directory, and every URL
 * on this site — pages, robots.txt, the sitemap — is produced by the Next
 * runtime instead, so nothing was ever matched. Next applies these to its own
 * responses, which is all of them.
 *
 * The toml block is left in place for anything Netlify does serve directly, and
 * the two are kept identical so a response cannot carry two different policies.
 */
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* The only one that was genuinely never configured. Denies the powerful
     features this site has no use for, so a future third-party script cannot
     quietly reach for them. */
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  },
  {
    key: "Content-Security-Policy",
    /**
     * Widened from the netlify.toml original, which had never been enforced.
     *
     * Applying it for the first time immediately blocked both analytics
     * scripts, because the policy was written from the tag names rather than
     * from what the tags actually fetch:
     *
     *   - GA4 was missing entirely. `googletagmanager.com` serves the loader,
     *     and gtag then beacons to google-analytics.com.
     *   - Clarity was allowed at `www.clarity.ms`, but that host only returns
     *     a bootstrap that pulls the real script from `scripts.clarity.ms`,
     *     and the session pixel comes from `c.clarity.ms`.
     *
     * Anything added here should be verified in a browser console, not
     * reasoned about — this is precisely the mistake that was shipped before.
     */
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${devScriptSrc} https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://*.supabase.co https://s0.wp.com https://*.clarity.ms https://www.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.in",
      "font-src 'self' https://fonts.gstatic.com",
      "media-src 'self' https://*.supabase.co",
      /* `analytics.google.com` is listed alongside the wildcard, not covered by
         it: a CSP `*.host` matches subdomains and never the bare host, and GA4
         beacons to both. It also posts to www.google.com, and fires a Google
         Ads audience pixel on the visitor's country TLD — google.co.in here.
         Other TLDs stay blocked, which costs nothing unless Google Ads
         remarketing is switched on. */
      `connect-src 'self'${devConnectSrc} https://*.supabase.co https://api.resend.com https://*.clarity.ms https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.in`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // The public pages port hand-written imperative animation code (rAF loops,
  // observers, direct DOM mutation) designed to initialise exactly once per
  // mount. Strict Mode double-invokes effects in dev, which would double-run
  // that code and leave orphaned loops behind.
  reactStrictMode: false,
  /* Next advertises itself with `X-Powered-By: Next.js` on every response.
     It tells a visitor nothing and tells an attacker which framework and
     which CVE list to start from, so it is switched off. */
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mshehtxywddtdxxkbnuu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
