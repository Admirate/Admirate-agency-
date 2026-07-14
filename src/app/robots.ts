import { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin dashboard and the API are not content. They were crawlable
      // before — the dashboard only redirects to a login page, so it offered
      // Google nothing but a duplicate login URL to index.
      disallow: ["/dashboard", "/dashboard/", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
