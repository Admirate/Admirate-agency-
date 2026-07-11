import type { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";

export const metadata: Metadata = {
  title: "Design That Moves With You",
  description:
    "Our design work — logos and brand identity, websites, social creatives, and every other collateral your brand needs to show up looking like itself, everywhere.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "ADMIRATE — Design That Moves With You",
    description:
      "Logos, websites, social creatives and brand collaterals from ADMIRATE, a strategic design and marketing agency.",
    url: "https://admirate.in/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
