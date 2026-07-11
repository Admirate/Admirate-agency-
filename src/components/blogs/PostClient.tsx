"use client";

import RawPage from "@/components/RawPage";
import { BLOGS_CSS, postHtml } from "@/components/blogs/content";
import { initPost } from "@/components/blogs/init";
import type { Post } from "@/components/blogs/posts";
import { NAV_CSS, navHtml, initNav } from "@/components/shared/nav";

export default function PostClient({ post }: { post: Post }) {
  return (
    <RawPage
      css={BLOGS_CSS + NAV_CSS}
      html={navHtml("blogs") + postHtml(post)}
      init={() => {
        const stopNav = initNav();
        const stopPage = initPost();
        return () => {
          stopNav();
          stopPage();
        };
      }}
    />
  );
}
