import type { MetadataRoute } from "next";
import { getSelected } from "@/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/archive", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  /* Tier 1 only: the three case studies are the only entries with pages of
     their own. Archive sections are anchors on /archive, which is already
     listed above. Priority descends with the running order — the same
     editorial ranking the site presents, expressed to crawlers. */
  const entries = getSelected().map((entry, i) => ({
    url: `${site.url}${entry.href}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: Math.max(0.5, 0.9 - i * 0.1),
  }));

  return [...routes, ...entries];
}
