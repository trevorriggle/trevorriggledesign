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
};

const DIR = path.join(process.cwd(), "public", "resume");

export function getResume(): Resume | null {
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

  return {
    url: `/resume/${file}`,
    filename: "Trevor Riggle, resume.pdf",
    sizeKb,
  };
}
