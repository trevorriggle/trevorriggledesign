import type { CardData } from "@/components/ui/Card";
import type { CaseStudy, ImageRef } from "@/content";
import { designCategories } from "@/content/design";
import {
  getCategoryThumb,
  getDesignGroups,
  getDesignImages,
  type DesignGroup,
  type DesignItem,
} from "@/lib/design-images";

/* ============================================================================
   CARD DATA, one mapper per kind of thing that gets a card.
   ============================================================================
   The card component knows nothing about case studies or design folders. It
   takes a href, a title, one line, a derived meta string and a thumbnail, and
   these three functions are the only places that shape is assembled.

   COPY IS PASSED THROUGH, NEVER COMPOSED. `description` is an existing field
   verbatim, the deck for an application and the intro for a design category,
   and it is empty when that field is empty. Nothing here writes a sentence.

   META IS DERIVED, NEVER WRITTEN. A count off the folder, or the entry's own
   `state`. Same rule lib/home-tiles.ts already runs on.
   ========================================================================= */

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function fromImageRef(image: ImageRef | null | undefined) {
  if (!image?.exists) return null;
  return { url: image.url, unoptimized: image.unoptimized };
}

function fromDesignItem(item: DesignItem | null) {
  if (!item) return null;
  /* `still` not `src`: a video's still is its poster, which is the only thing
     that can go in an <Image>. */
  return { url: item.still, unoptimized: item.passthrough };
}

/**
 * An application's card.
 *
 * `thumb` FIRST, and that is the whole change here. This used to read the
 * entry's lead, a video's poster frame or the declared cover, on the reasoning
 * that the case study had already chosen its best picture. It had, but for a
 * different job: the lead is chosen to prove the deck at full size, and at
 * 380px in a 4:3 box a portrait iPad grab loses the panel that made it worth
 * leading with, and a 16:9 action still loses its subject to the crop.
 *
 * `thumb` is a picture composed for THIS size. The old chain stays behind it,
 * so an entry with no thumbnail cards up exactly as it did before.
 */
export function caseStudyCards(entries: CaseStudy[]): CardData[] {
  return entries.map((entry) => ({
    href: entry.href,
    title: entry.title,
    description: entry.deck || undefined,
    meta: entry.state || undefined,
    thumb:
      fromImageRef(entry.thumb) ??
      fromImageRef(entry.video?.poster) ??
      fromImageRef(entry.cover) ??
      null,
  }));
}

/** A body of design work. Count comes off the folder, groups included. */
export function designCategoryCards(): CardData[] {
  return designCategories.map((category) => {
    const count = getDesignImages(category.slug, category.title).length;
    return {
      href: `/design/${category.slug}`,
      title: category.title,
      description: category.intro || undefined,
      meta: count > 0 ? plural(count, "piece", "pieces") : undefined,
      thumb: fromDesignItem(getCategoryThumb(category.slug, category.title)),
    };
  });
}

/**
 * The groups inside one category.
 *
 * No description: a group has no written copy anywhere in content, and one is
 * not invented for it. The card is its name, its count and its picture.
 */
export function designGroupCards(
  category: string,
  categoryTitle: string,
): CardData[] {
  return getDesignGroups(category, categoryTitle).map((group: DesignGroup) => ({
    href: group.href,
    title: group.title,
    meta: plural(group.items.length, "piece", "pieces"),
    thumb: fromDesignItem(group.thumb),
  }));
}
