"use client";

import RawPage from "@/components/RawPage";
import { VIDEO_CSS, VIDEO_HTML } from "./content";
import initVideo from "./init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function VideoClient() {
  return (
    <RawPage
      css={VIDEO_CSS + NAV_CSS}
      html={
        navHtml("services", "/start-project?service=Video%20Production") +
        VIDEO_HTML
      }
      init={() => {
        const stopNav = initNav();
        const stopPage = initVideo();
        return () => {
          stopNav();
          if (typeof stopPage === "function") stopPage();
        };
      }}
    />
  );
}
