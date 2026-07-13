"use client";

import RawPage from "@/components/RawPage";
import { START_CSS, START_HTML } from "@/components/start/content";
import initStart from "@/components/start/init";

/**
 * No pill nav here — this page ships its own "← BACK TO SITE" bar. The pill
 * nav's Home / Services / Blogs links would invite the user straight back out
 * of the funnel they just entered.
 */
export default function StartClient() {
  return <RawPage css={START_CSS} html={START_HTML} init={() => initStart()} />;
}
