import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ADMIRATE — Pricing";

/* The card is deliberately static while the page's figures are not. An OG image
   that rendered live rates would have to fetch Supabase on every crawl and
   would be cached by the platforms anyway, showing a stale number with the
   authority of a picture. The page itself is where the figures belong. */
export default function Image() {
  return ogImage({ eyebrow: "Pricing", title: "What it costs, in writing" });
}
