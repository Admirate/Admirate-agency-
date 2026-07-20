import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ADMIRATE — Video Production";

export default function Image() {
  return ogImage({ eyebrow: "Video Production", title: "Films that do a job" });
}
