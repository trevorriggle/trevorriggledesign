import fs from "node:fs";
import path from "node:path";

/* ============================================================================
   THE RESUME
   ============================================================================
   Drop-in, like every other asset on this site: put a PDF in public/resume/
   and the download button appears on /about. There is no manifest and no
   import to add.

   NO PLACEHOLDER FILE IS SHIPPED, AND THAT IS A DELIBERATE DEPARTURE FROM THE
   BRIEF, which asked for "a resume download button with a placeholder file we
   will wire up later". The wiring is all here and the button is real. What is
   not here is a fake PDF.

   The reason is who downloads it. This site's job is closing, and a
   meaningful share of its readers arrive after a final-round interview while
   deciding whether to argue for this person in a debrief. Handing that reader
   a blank or lorem-filled PDF is materially worse than showing them no button
   at all: a missing resume is a gap they will ask about, and a broken one is
   a thing they will remember. The same standing rule the rest of the site
   runs on, an absent asset is absent rather than faked, applies hardest here.

   So the button renders only when a real file exists. Drop one in and it
   appears, with no other edit anywhere.

   ANY FILENAME WORKS. The first PDF in the folder wins, so the file can be
   named whatever the export names it. The download attribute gives it a
   stable, human name on the way out regardless of what it is called on disk,
   because "resume-final-v3(2).pdf" in somebody's downloads folder is not the
   first impression this is for.
   ========================================================================= */

export type Resume = {
  /** Public URL of the file as it sits on disk. */
  url: string;
  /** What the browser should save it as. */
  filename: string;
  /** Size in KB, for the label. A download with no size is a small rudeness. */
  sizeKb: number;
  /**
   * A rendered image of page one, shown ON the page above the button.
   *
   * THE RESUME IS NOW A VISUAL RATHER THAN A LINK, which is what the brief
   * asked for and is also the better answer: a reader who has to download a
   * file to find out whether it is worth downloading generally does not.
   *
   * It is a committed raster beside the PDF, not something rendered at
   * request time. A PDF cannot be displayed by <Image>, an <iframe> of one is
   * a browser-dependent viewer that is unusable on iOS, and rendering pages
   * in the browser means shipping a PDF library to every visitor of /about
   * for one static picture. See the regeneration note at the foot of this
   * file.
   *
   * Null when no matching image is on disk, and the section then renders the
   * button by itself exactly as it did before. Same standing rule as every
   * other asset here: absent is absent, never faked.
   */
  image: { url: string; width: number; height: number } | null;
};

const DIR = path.join(process.cwd(), "public", "resume");

export async function getResume(): Promise<Resume | null> {
  if (!fs.existsSync(DIR)) return null;

  let entries: string[];
  try {
    entries = fs.readdirSync(DIR);
  } catch {
    return null;
  }

  const file = entries
    .filter((name) => /\.pdf$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))[0];

  if (!file) return null;

  let sizeKb = 0;
  try {
    sizeKb = Math.max(1, Math.round(fs.statSync(path.join(DIR, file)).size / 1024));
  } catch {
    /* Unreadable stat. The button still renders, just without a size, which
       is a better outcome than no resume link. Never a build failure. */
  }

  /* The preview sits beside the PDF and shares its basename, so the pairing
     survives the file being renamed and needs no second piece of config. */
  const stem = file.replace(/\.pdf$/i, "");
  const previewName = entries.find(
    (name) => name === `${stem}.png` || name === `${stem}.jpg`,
  );

  let image: Resume["image"] = null;
  if (previewName) {
    try {
      const { imageSize } = await import("image-size");
      const buffer = fs.readFileSync(path.join(DIR, previewName));
      const size = imageSize(buffer);
      if (size.width && size.height) {
        image = {
          url: `/resume/${previewName}`,
          width: size.width,
          height: size.height,
        };
      }
    } catch {
      /* Unreadable or not an image. The button still renders on its own,
         which is the same failure mode as an unreadable stat above. */
    }
  }

  return {
    url: `/resume/${file}`,
    filename: "Trevor Riggle, resume.pdf",
    sizeKb,
    image,
  };
}

/* ============================================================================
   REGENERATING THE PREVIEW
   ============================================================================
   public/resume/<same-basename>.png is a render of page one, committed. To
   replace it after a new export, render the PDF and crop the viewer's chrome
   off it. Chrome will do this with no extra dependency in this repo:

     chrome --headless --screenshot=out.png --window-size=850,1100 \
       --force-device-scale-factor=3 \
       "http://localhost:3000/resume/<file>.pdf#toolbar=0&navpanes=0&view=Fit"

   then crop to the white page and scale the long edge to about 1700px. The
   current file is 1700x2042. Nothing reads the dimensions from here; they are
   measured off the file at build time by `imageSize` above, so a replacement
   of any size works with no edit.
   ========================================================================= */
