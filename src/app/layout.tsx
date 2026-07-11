import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

const LOGO_URL =
  "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/admirate%20logo.webp";

export const metadata: Metadata = {
  metadataBase: new URL("https://admirate.in"),
  title: {
    default: "ADMIRATE — Strategic Design & Marketing Agency",
    template: "%s | ADMIRATE",
  },
  description:
    "ADMIRATE is a strategic design and marketing agency. Branding, web design, social media, video production, and digital advertising — done the right way.",
  icons: {
    icon: [{ url: LOGO_URL, type: "image/webp" }],
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  openGraph: {
    title: "ADMIRATE — Strategic Design & Marketing Agency",
    description:
      "Strategic design and marketing agency specializing in branding, web design, social media, video production, and digital advertising.",
    url: "https://admirate.in",
    siteName: "ADMIRATE",
    images: [LOGO_URL],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADMIRATE — Strategic Design & Marketing Agency",
    description:
      "Strategic design and marketing agency specializing in branding, web design, social media, video production, and digital advertising.",
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ADMIRATE",
  url: "https://admirate.in",
  logo: LOGO_URL,
  description: "Strategic Design & Marketing Agency",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8374494954",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [],
  serviceArea: {
    "@type": "Country",
    name: "India",
  },
  knowsAbout: [
    "Social Media Management",
    "Web Design",
    "Video Production",
    "Digital Advertising",
    "Brand Identity",
    "Packaging Design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Archivo must be the variable-width axis build — the pages rely on
            font-stretch for their display type. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Inter:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1001] focus:bg-red-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "u512498vm3");`}
        </Script>

        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
