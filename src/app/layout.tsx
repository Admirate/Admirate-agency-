import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import { SITE } from "@/lib/seo";
import { organizationSchema, websiteSchema, ld } from "@/lib/schema";

const LOGO_URL = SITE.logo;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: LOGO_URL, type: "image/webp" }],
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  // Pages override these through pageMeta() in lib/seo.ts. The og:image is not
  // set here — each route ships its own opengraph-image, which Next resolves
  // per page, so a share of /services no longer falls back to the homepage's.
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* One connected graph rather than a lone Organization: the WebSite points at
   the Organization as its publisher, and every article's author/publisher
   resolves to the same @id. */
const jsonLd = [organizationSchema, websiteSchema];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The inline script below sets `class="no-loader"` on <html> before React
    // hydrates, so the server markup and the client DOM differ on this one
    // attribute by design. Without this, React logs a hydration mismatch.
    <html lang="en" suppressHydrationWarning>
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

        {/* Decides, before the first paint, whether the landing loader runs.
            It is server-rendered markup, so removing it from an effect would
            flash the black terminal first. The nav links are real <a> hrefs,
            so returning Home is a full document load — without this, the whole
            boot sequence replays every single time.

            Plays on the first home-page load in a tab and on any reload (a hard
            refresh should show it again); skipped otherwise. The flag is set by
            the landing page itself, not here, so the intro is not consumed by a
            visitor who happened to land on /services first. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=performance.getEntriesByType('navigation')[0];if(sessionStorage.getItem('adm:booted')==='1'&&(!n||n.type!=='reload')){document.documentElement.classList.add('no-loader');}}catch(e){}})();`,
          }}
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
          dangerouslySetInnerHTML={{ __html: ld(jsonLd) }}
        />

        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "u512498vm3");`}
        </Script>

        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
