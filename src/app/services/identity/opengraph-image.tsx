import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ADMIRATE — Identity";

export default function Image() {
  return ogImage({ eyebrow: "Identity", title: "Built to be known" });
}
