import type { MetadataRoute } from "next";
import { getSelected } from "@/content";
import { designCategories } from "@/content/design";
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

  /* NO GROUP ENTRIES. There used to be one per
     public/design/<category>/NN-<group>/, derived from the folders exactly as
     the routes were. Those routes are gone: a category is one page now and
     each group is a section on it.

     They are not listed as anchors either. A sitemap enumerates DOCUMENTS,
     and /design/personal#comics is the same document as /design/personal. A
     crawler offered both reads it as one page advertised four times, which is
     the shape of keyword-stuffed boilerplate rather than a site index.

     The old URLs still resolve, via the 308 in next.config.ts, which is what
     a redirect is for. A sitemap should list where things ARE. */

  return [...routes, ...studies, ...design];
}
