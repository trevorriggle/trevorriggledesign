import type { MetadataRoute } from "next";
import { getSelected } from "@/content";
import { designCategories } from "@/content/design";
import { getDesignGroups } from "@/lib/design-images";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/applications", "/design", "/agentic-ai", "/about", "/contact"].map((path) => ({
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

  /* The group detail pages, one per public/design/<category>/NN-<group>/.
     Derived from the folders, like the routes themselves, so adding a group
     directory puts it in the sitemap with no edit here. Ranked below their
     category: a group page carries pieces, the category page carries the
     writing. */
  const groups = designCategories.flatMap((category) =>
    getDesignGroups(category.slug, category.title).map((group) => ({
      url: `${site.url}/design/${category.slug}/${group.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...routes, ...studies, ...design, ...groups];
}
