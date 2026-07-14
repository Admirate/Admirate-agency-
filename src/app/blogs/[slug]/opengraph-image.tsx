import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { POSTS, getPost } from "@/components/blogs/posts";

export const alt = "ADMIRATE Journal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Pre-render one card per post at build, matching the page's own params. */
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return ogImage({
    eyebrow: post?.tag ?? "Journal",
    title: post?.title ?? "Notes from the work.",
  });
}
