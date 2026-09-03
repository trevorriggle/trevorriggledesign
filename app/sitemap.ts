import type { MetadataRoute } from "next";
import { getSelected } from "@/content";
import { designCategories } from "@/content/design";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/design", "/agentic-ai", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  /* Priority descends with the manual running order, the same editorial
     ranking the site presents, expressed to crawlers. */
  const studies = getSelected().map((entry, i) => ({
    url: `${site.url}${entry.href}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: Math.max(0.5, 0.9 - i * 0.1),
  }));

  const design = designCategories.map((category) => ({
    url: `${site.url}/design/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...studies, ...design];
}
