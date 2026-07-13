import type { Metadata } from "next";
import StartClient from "@/components/start/StartClient";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project — branding, websites, social, video or packaging. We reply within one working day.",
  alternates: { canonical: "/start-project" },
  openGraph: {
    title: "Start a Project | ADMIRATE",
    description:
      "Send us the brief. We call within one working day, with a plan and a quote to follow.",
    url: "https://admirate.in/start-project",
    type: "website",
  },
};

export default function StartProjectPage() {
  return <StartClient />;
}
