# public/media

One folder per entry, named for its slug. Every image the site expects lives at
`public/media/<slug>/<filename>`.

Nothing needs to exist here. A declared image with no file renders as a spec
placeholder carrying its filename, aspect ratio, minimum size and a note on what
it must show. Saving the real file at the exact path is the entire operation —
no code edit, no frontmatter edit, no import.

`../../MANIFEST.md` lists every expected file and is regenerated on each build.
