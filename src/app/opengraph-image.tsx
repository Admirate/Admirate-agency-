import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ADMIRATE — Strategic Design & Marketing Agency";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    // Not the tagline — the footer already carries that. This says what we make.
    eyebrow: "Branding · Websites · Social · Video",
    title: "A seriously, seriously creative advertising agency.",
  });
}
