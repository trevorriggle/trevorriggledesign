import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — design engineer portfolio`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Portfolio",
    title: site.name,
    /* The site meta description from the copy. Nothing on an OG card is
       generated prose. */
    deck: site.description,
    footer: site.domain,
  });
}
