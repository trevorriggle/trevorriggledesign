import { notFound } from "next/navigation";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";
import { SELECTED, getSelected, getCaseStudy } from "@/content";


export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return SELECTED.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudy(slug);
  if (!entry) notFound();

  /* The deck only. Nothing on the card is generated prose. */
  const position = getSelected().findIndex((s) => s.slug === slug) + 1;

  return ogCard({
    ordinal: String(position).padStart(2, "0"),
    eyebrow: "Applications",
    title: entry.title,
    deck: entry.deck || undefined,
    footer: site.domain,
  });
}
