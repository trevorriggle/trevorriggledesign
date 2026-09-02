import { notFound } from "next/navigation";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";
import { getAllEntries, getEntry } from "@/content";
import { sectionOrdinal } from "@/content/sections";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  /* The deck / caption only. Nothing on the card is generated prose. */
  const deck = entry.kind === "case" ? entry.deck : (entry.caption ?? undefined);

  return ogCard({
    ordinal: sectionOrdinal(entry.section),
    eyebrow: entry.sectionMeta.title,
    title: entry.title,
    deck,
    footer: site.domain,
  });
}
