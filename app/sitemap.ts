import type { MetadataRoute } from "next";
import { getAllEntries } from "@/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  /* Entries are listed in running order, and priority descends with it — the
     same editorial order the site presents, expressed to crawlers. */
  const entries = getAllEntries().map((entry, i) => ({
    url: `${site.url}${entry.href}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: Math.max(0.3, 0.75 - i * 0.02),
  }));

  return [...routes, ...entries];
}
