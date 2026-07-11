import type { Metadata } from "next";
import BlogsClient from "@/components/blogs/BlogsClient";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the work — what we've learned building brands, sites and campaigns that have to earn their keep.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "ADMIRATE — Journal",
    description:
      "Notes from the work: branding, websites, creative and social, written for the people who have to sign them off.",
    url: "https://admirate.in/blogs",
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
