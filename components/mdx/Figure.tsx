import { Frame } from "@/components/ui/Frame";
import type { ResolvedImage } from "@/content";

/**
 * <Figure src="02-detail.png" /> in an MDX body.
 *
 * Images are declared once in frontmatter `images[]` — where alt text, aspect
 * ratio and content label are all required and validated — and referenced here
 * by filename only. One source of truth for image metadata, no way to render
 * an image without alt text, and a typo'd filename is a build error naming the
 * declared alternatives rather than a silent 404.
 */
export function makeFigure(images: ResolvedImage[], entryPath: string) {
  return function Figure({ src, caption }: { src: string; caption?: string }) {
    const image = images.find((i) => i.src === src);

    if (!image) {
      throw new Error(
        `\n\n  ── Content error ──\n  ${entryPath}\n` +
          `  <Figure src="${src}" /> is not declared in the frontmatter images[] array.\n` +
          `  Declare it there (with alt, aspect and label) before referencing it in the body.\n` +
          `  Declared: ${images.map((i) => i.src).join(", ") || "(none)"}\n`,
      );
    }

    return (
      <Frame
        image={caption ? { ...image, caption } : image}
        role="figure"
        sizes={
          image.bleed
            ? "(max-width: 60rem) 100vw, 84rem"
            : "(max-width: 60rem) 100vw, 38rem"
        }
      />
    );
  };
}
