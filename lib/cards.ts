import type { WorkEntry } from "@/components/ui/WorkIndex";
import type { CaseStudy, ImageRef } from "@/content";
import { designCategories } from "@/content/design";
import {
  getCategoryThumb,
  getDesignGroups,
  type DesignGroup,
  type DesignItem,
} from "@/lib/design-images";

/* ============================================================================
   INDEX DATA, one mapper per kind of thing that gets a row.
   ============================================================================
   <WorkIndex> knows nothing about case studies or design folders. It takes a
   href, a title, one line and a picture, and these three functions are the
   only places that shape is assembled.

   DIMENSIONS TRAVEL WITH THE PICTURE. The browse tier renders each preview at
   its OWN proportion rather than cropping everything to one box, so it needs
   the real width and height, not just a URL.

   COPY IS PASSED THROUGH, NEVER COMPOSED. `description` is an existing field
   verbatim, the deck for an application and the intro for a design category,
   and it is empty when that field is empty. Nothing here writes a sentence.

   THERE IS NO META FIELD ANY MORE, and its removal is the point rather than
   a simplification. Every row used to carry one derived string on the right:
   an entry's `state` ("Shipped to TestFlight; approved for external testing",
   "Shelved") or a count off the folder ("16 pieces", "3 pieces").

   The counts were the weaker of the two. "3 pieces" tells a reader that a
   body of work is small before they have looked at it, which is the opposite
   of what a browsing page is for, and it made the archive's own shape into
   the headline fact about it.

   The status badges were worse, because they were doing real work badly. The
   TestFlight facts are genuine evidence and they belong in a sentence in the
   case study, where "the third build passed Beta App Review" can be read as
   an outcome. Set as a chip beside a title, the same words read as a label
   somebody applied to themselves.

   Both survive where they are load-bearing: DrawEvolve's body already states
   the TestFlight outcome in its own prose under "Outcome", and Lynk's deck
   already says "and the decision to stop building it". Nothing was lost by
   deleting the chips, which is how you know they were chips.
   ========================================================================= */

function fromImageRef(image: ImageRef | null | undefined) {
  if (!image?.exists) return null;
  return {
    url: image.url,
    width: image.width,
    height: image.height,
    unoptimized: image.unoptimized,
  };
}

function fromDesignItem(item: DesignItem | null) {
  if (!item) return null;
  /* `still` not `src`: a video's still is its poster, which is the only thing
     that can go in an <Image>. */
  return {
    url: item.still,
    width: item.width,
    height: item.height,
    unoptimized: item.passthrough,
  };
}

/**
 * An application's row.
 *
 * `thumb` FIRST. This used to read the
 * entry's lead, a video's poster frame or the declared cover, on the reasoning
 * that the case study had already chosen its best picture. It had, but for a
 * different job: the lead is chosen to prove the deck at full size, and at
 * 380px in a 4:3 box a portrait iPad grab loses the panel that made it worth
 * leading with, and a 16:9 action still loses its subject to the crop.
 *
 * `thumb` is a picture composed for THIS size. The old chain stays behind it,
 * so an entry with no thumbnail cards up exactly as it did before.
 */
export function caseStudyRows(entries: CaseStudy[]): WorkEntry[] {
  return entries.map((entry) => ({
    href: entry.href,
    title: entry.title,
    /* BOTH LINES, JOINED. The deck names the thing and `deckB` says what it
       does; the browse tier is the one place a reader has neither the page
       nor the pictures yet, so it gets both. Still composed of existing
       fields verbatim and still empty when they are. */
    description: [entry.deck, entry.deckB].filter(Boolean).join(" ") || undefined,
    preview:
      fromImageRef(entry.thumb) ??
      fromImageRef(entry.video?.poster) ??
      fromImageRef(entry.cover) ??
      null,
  }));
}

/** A body of design work. */
export function designCategoryRows(): WorkEntry[] {
  return designCategories.map((category) => ({
    href: `/design/${category.slug}`,
    title: category.title,
    description: category.intro || undefined,
    preview: fromDesignItem(getCategoryThumb(category.slug, category.title)),
  }));
}

/**
 * The groups inside one category.
 *
 * No description: a group has no written copy anywhere in content, and one is
 * not invented for it. The row is its name and its picture.
 */
export function designGroupRows(
  category: string,
  categoryTitle: string,
): WorkEntry[] {
  return getDesignGroups(category, categoryTitle).map((group: DesignGroup) => ({
    href: group.href,
    title: group.title,
    preview: fromDesignItem(group.thumb),
  }));
}
