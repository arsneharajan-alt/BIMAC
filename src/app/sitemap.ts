import type { MetadataRoute } from "next";
import { disciplines } from "@/data/disciplines";
import { softwarePlatforms } from "@/data/software";
import { stages } from "@/data/stages";
import { toolHref, tools } from "@/data/tools";
import { site } from "@/lib/site";

/**
 * Generated from the same data the pages are, so a new tool or discipline is
 * indexed without anyone remembering to add it here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, frequency: "weekly" as const },
    { path: "/tools", priority: 0.95, frequency: "weekly" as const },
    { path: "/tools/mepf", priority: 0.9, frequency: "weekly" as const },
    { path: "/software", priority: 0.9, frequency: "weekly" as const },
    { path: "/stages", priority: 0.85, frequency: "monthly" as const },
    { path: "/custom-development", priority: 0.8, frequency: "monthly" as const },
    { path: "/about", priority: 0.6, frequency: "yearly" as const },
    { path: "/contact", priority: 0.7, frequency: "yearly" as const },
    { path: "/privacy-policy", priority: 0.3, frequency: "yearly" as const },
    { path: "/terms", priority: 0.3, frequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.frequency,
      priority: route.priority,
    })),
    ...disciplines.map((discipline) => ({
      url: `${site.url}/tools/${discipline.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...softwarePlatforms.map((platform) => ({
      url: `${site.url}/software/${platform.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...stages.map((stage) => ({
      url: `${site.url}/stages/${stage.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...tools.map((tool) => ({
      url: `${site.url}${toolHref(tool)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
