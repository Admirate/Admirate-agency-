import type { Metadata, Viewport } from "next";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import Script from "next/script";

export const metadata: Metadata = {
  // Set this to your deployed site URL to resolve Open Graph / Twitter images correctly
  metadataBase: new URL("https://admirate.in"),
  title: "ADMIRATE",
  description: "Strategic Design & Marketing Agency",
  icons: {
    icon: [{ url: "/redadmiratelogo.png", type: "image/png" }],
    shortcut: "/redadmiratelogo.png",
    apple: "/redadmiratelogo.png",
  },
  openGraph: {
    title: "ADMIRATE",
    description: "Strategic Design & Marketing Agency",
    images: ["/redadmiratelogo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-red-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ADMIRATE",
              url: "https://admirate.in",
              logo: "https://admirate.in/redadmiratelogo.png",
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
            }),
          }}
        />
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "u512498vm3");`}
        </Script>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
