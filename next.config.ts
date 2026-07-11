import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The public pages port hand-written imperative animation code (rAF loops,
  // observers, direct DOM mutation) designed to initialise exactly once per
  // mount. Strict Mode double-invokes effects in dev, which would double-run
  // that code and leave orphaned loops behind.
  reactStrictMode: false,
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
