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
