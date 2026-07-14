import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostClient from "@/components/blogs/PostClient";
import { POSTS, getPost } from "@/components/blogs/posts";
import { pageMeta } from "@/lib/seo";
import { blogPostingSchema, breadcrumbSchema, ld } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = [
    blogPostingSchema(post),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Journal", path: "/blogs" },
      { name: post.title, path: `/blogs/${post.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
      />
      <PostClient post={post} />
    </>
  );
}
