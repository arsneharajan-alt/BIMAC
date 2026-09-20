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
