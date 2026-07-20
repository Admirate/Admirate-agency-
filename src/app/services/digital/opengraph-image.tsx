import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ADMIRATE — Digital";

export default function Image() {
  return ogImage({ eyebrow: "Digital", title: "Sites that earn their keep" });
}
