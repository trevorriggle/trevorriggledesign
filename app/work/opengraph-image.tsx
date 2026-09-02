import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";
import { sections } from "@/content/sections";

export const alt = `Work — ${site.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: "Index",
    title: "Work",
    deck: sections.map((s) => s.title).join(" · "),
    footer: site.domain,
  });
}
