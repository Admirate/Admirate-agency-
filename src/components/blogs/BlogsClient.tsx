"use client";

import RawPage from "@/components/RawPage";
import { BLOGS_CSS, blogsIndexHtml } from "@/components/blogs/content";
import { initBlogs } from "@/components/blogs/init";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function BlogsClient() {
  return (
    <RawPage
      css={BLOGS_CSS + NAV_CSS}
      html={navHtml("blogs") + blogsIndexHtml()}
      init={() => {
        const stopNav = initNav();
        const stopPage = initBlogs();
        return () => {
          stopNav();
          stopPage();
        };
      }}
    />
  );
}
