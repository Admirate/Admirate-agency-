import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ADMIRATE — Sitemap";

export default function Image() {
  return ogImage({ eyebrow: "Sitemap", title: "Everything, in one place" });
}
