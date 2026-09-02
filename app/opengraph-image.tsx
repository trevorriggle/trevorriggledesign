import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — design engineer portfolio`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Portfolio",
    title: site.name,
    /* Uses the site description, which is a TODO in lib/site.ts — the card
       renders without it rather than inventing a tagline. */
    deck: site.description === "TODO" ? undefined : site.description,
    footer: site.domain,
  });
}
