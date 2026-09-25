import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt, built from the same site URL as the sitemap and the canonical
 * links, so the three can never point at different domains again. The static
 * public/robots.txt it replaces was still sending crawlers to a placeholder
 * address.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
