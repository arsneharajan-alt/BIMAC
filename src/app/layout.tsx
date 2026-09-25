import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/common/ScrollReveal";
import { site } from "@/lib/site";

/**
 * Manrope carries the whole site — body copy and headings both. One family,
 * two roles: the display variable is the same font, so a heading and a
 * paragraph share letterforms and only weight and size separate them.
 */
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "BIM automation",
    "Revit plugins",
    "architecture BIM tools",
    "structural BIM automation",
    "MEPF BIM tools",
    "sprinkler layout automation",
    "CAD to Revit",
    "Scan to BIM",
    "Revit annotation automation",
    "quantity takeoff automation",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  /**
   * Google Search Console ownership, as the HTML-tag method: Search Console
   * hands out a <meta name="google-site-verification" content="…"> and this
   * writes it into every page's head. The code lives in
   * GOOGLE_SITE_VERIFICATION (set it in Vercel → Settings → Environment
   * Variables, or in .env.local) — nothing is emitted until it is set.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  /**
   * The tab mark.
   *
   * Declared rather than left to the app/icon.png convention alone, so the
   * <link rel="icon"> is explicit in the head and the Apple touch icon has
   * somewhere to point. The artwork is the BIMAC mark cropped to itself: it
   * used to ship inside a 512 square it only filled a third of, which reads
   * at 512 and disappears at 16.
   */
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#061422",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        {/*
          Start fetching the opening while the HTML is still being parsed.

          The <video> that plays it only exists after hydration, so without
          this the 650KB is not even requested until the page is interactive —
          a second of the opening's four spent waiting on a file the server
          already knows it needs.
        */}
        <link rel="preload" as="video" type="video/mp4" href="/intro.mp4" />

        {/* Without JS nothing can add `.is-revealed`, so nothing may start hidden. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}` +
            `[data-hero-intro] .hero-staged{animation-play-state:running!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
