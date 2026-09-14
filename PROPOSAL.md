# Redesign proposal

Written against the brief of 2026-09-14. Investigation only, no code written yet.

The constraint behind every decision below: the audience is hiring managers, most
on a phone, a meaningful number reading this AFTER a final-round interview while
deciding whether to argue for the candidate in a debrief. The site's job is
closing, not screening.

---

## 0. Something is broken right now

`content/work/drawevolve/index.mdx` points at `02.jpg` (cover) and `03-06.jpg`
(plates). Those files were deleted and replaced by `1-5.jpg`. Every one of those
references now resolves `exists: false`, and the templates are built to render
nothing rather than break.

**The DrawEvolve case study currently shows a logo, a deck, and zero
screenshots.** The strongest entry on the site is empty.

Verified:

- `1-5.jpg` are byte-identical to `IMG_0472-0476.jpg` in `Portfolio Images/`, in
  that order (`cmp` on all five).
- `1.jpg` is the AI Feedback critique shot that was the old cover.
- So the existing alt text maps across cleanly with a rename. No rewriting.

That also answers brief item 5's "two locations": `Portfolio Images/` is the raw
drop, `public/media/` is what ships.

**Correction, found during Phase 0.** An earlier draft of this document proposed
deleting `Portfolio Images/`. That was wrong and it has been kept. The folder is
gitignored deliberately, with a comment at `.gitignore:23` saying so: it is the
local masters archive, 240 MB, and it holds originals that are not duplicated
anywhere. `thoosiecoaster.mp4` there is 106 MB against the 14 MB web encode that
ships, so the drop is the only copy of the master. It stays, untracked, exactly
as intended.

`drawevolve logo.jpg` and `lynk-logo.png` at the repo root were a different case:
tracked, unused by the build, and lower-resolution exports of marks that exist in
better form in `public/media/`. Those were removed, and are recoverable from git.

---

## 1. Scope

Too large for one pass. The brief is a palette change, a type change, a spacing
change, two page-structure rewrites, a new content type, a new API route, and
four page overhauls. A sequence is proposed in section 4.

---

## 2. Things that are wrong, in order of how much they matter

### 2.1 Ochre cannot do the jobs it was assigned

Measured contrast ratios for the proposed palette:

| Colour                   | on Paper `#F7F4ED` | on Ink `#0A0E27` |
| ------------------------ | ------------------ | ---------------- |
| Ultramarine `#1B2ECC`    | 8.28               | 2.09             |
| Ochre `#E0A526`          | **2.00**           | 8.67             |
| Signal `#FF4D2E`         | **3.01**           | 5.75             |
| Ink `#0A0E27`            | 17.30              | n/a              |

Ochre at 2.00 fails every contrast threshold at every size. The brief assigns it
to pull quotes and active nav states, which are both text on Paper. Signal at
3.01 barely clears AA for large text only.

Neither can be an ink colour on Paper.

**What works instead**, with the colour still as dominant as the brief wants:

- Ochre as a **field**, with Ink text on top of it.
- Ochre as rules, bars and underlines.
- A pull quote becomes Instrument Serif in Ink on an Ochre block, not Ochre type.
- Active nav becomes Ink text with an Ochre underline.
- Ochre as type only on Ink grounds, where it measures 8.67.

### 2.2 A pinned scroll sequence on a phone is the riskiest thing in the brief

Most of the audience is on a phone, and scroll-jacking is where that goes wrong:
it breaks momentum scroll, fights the address bar collapse, and strands people
mid-sequence.

Proposal: gate the pin to >= 62rem. Phones get a snap-scrolling vertical stack of
the five shots at full width. That is genuinely better thumb-first, not a
consolation prize. Same stack under `prefers-reduced-motion`, and same stack in
Firefox, which still has no `animation-timeline` support.

### 2.3 Removing every status badge takes out the one word that makes Lynk legible

"Shelved" is the frame for that entire entry. Without it a reader takes Lynk for a
third shipped product and has to re-orient when they hit "Why I killed it".

The deck already reads "and the decision to stop building it", so: drop the badge,
lean on the deck, and open the body with the shelving stated flatly. Same
treatment the brief asks for on the TestFlight facts. Evidence in a sentence, not
a chip.

### 2.4 Agentic AI is a nav tab and a home door pointing at an empty page

`content/agentic-ai.ts` has `body: []`. The page renders a heading and a link back
into DrawEvolve. For a reader in a debrief, a dead section is worse than no
section.

Either write it, or cut the tab and let the agent-workflow material live in
DrawEvolve where it already is. Recommendation: cut it.

### 2.5 `site.social` is empty

The footer "Elsewhere" block and the contact rail both render nothing. Someone
deciding whether to argue for a candidate in a debrief goes looking for LinkedIn
and GitHub. That is a closing-stage gap.

### 2.6 Hover is desktop-only today

The brief's read is correct but worth a correction: `IndexList` already lays the
pictures out inline on touch devices, inside
`@media not all and (hover: hover) and (pointer: fine)`. The gate is real on
desktop and absent on phones. Killing it is still correct.

### 2.7 `DECISIONS.md` becomes a false document

1143 lines arguing for the cool neutral ground, the one accent, no
scroll-triggered motion, the hover index, and derived counts. This work reverses
most of it. Rewrite the affected sections in the same commits rather than let it
rot into a document that contradicts the code.

---

## 3. Two things that are easier than expected

**The display type costs nothing.** Archivo is already loaded as a variable font
across `wght 100-900` and `wdth 62-125`. Archivo Black is `wght: 900`, Expanded is
`wdth: 125`. Both are already in the payload. Instrument Serif is a third family
and the only real addition.

**The palette swap is one file.** `styles/tokens.css` was built for this
("Retheming this site is editing this file"). Every component references tokens.
There is no raw hex anywhere in the component CSS.

---

## 4. Proposed sequence

### Phase 0, now, small

Fix what is already broken, independent of the redesign.

- Re-point the DrawEvolve images to `1-5.jpg`
- Remove the two stray root logos. Keep `Portfolio Images/`, see the correction
  in section 0
- Kill the blue `@` artifact. It is `components/ui/ExternalLink.tsx:52`, a mono
  `@` in `--color-signal` rendered for `mailto:` links
- Footer copy (brief item 11)

### Phase 1, foundation

Nothing restructures, but every page changes appearance. Everything downstream
builds against this, so it goes first.

- `tokens.css` rewrite: five colours, re-tuned spacing, wider type-scale gap
- Instrument Serif added
- Archivo pushed to Black / Expanded for display
- New primitives: full-bleed colour band, hairline grid overlay, numbered section
  head, pull quote

### Phase 2, kill the gate

- Replace `IndexList` with a visible-on-load composition
- Remove `state` and all derived counts from `lib/cards.ts` and
  `lib/home-tiles.ts`
- Touches `/applications`, `/design`, `/design/[category]`

### Phase 3, design pages

- One page per category, sticky subnav, anchored sections
- Placeholder body copy, written as real sentences
- Delete the `[group]` routes, add redirects to the new anchors
- American Scientific website case-study scaffold with marked TODOs

### Phase 4, application pages

- Hero cleanup, one orientation line each
- "MANUAL RUNNING ORDER" removed
- TestFlight facts moved into DrawEvolve prose
- The DrawEvolve scroll sequence

### Phase 5, home / about / contact

Home goes last because it wants thumbnails from the finished pages.

- Home grid rework
- About overhaul plus resume download button
- Contact form, route handler, Resend

**Contact is independent of all of it** and can be pulled forward at any point. If
the site's job is closing, a working form sooner is a defensible reorder.

---

## 5. What I need

### 5.1 American Scientific website case study

Nothing exists yet, so this is the blocking list.

**Assets**

1. Desktop screenshots: landing page, one ERP-integrated page (product detail,
   quote flow, or account), the lead capture form in context
2. Mobile screenshot of at least the landing page
3. Anything showing the admin or data side, if it can be shown
4. A before shot of the old site, if one exists. The rebrand section works because
   it is a before/after, and this would too
5. The live URL, and confirmation it can be linked

**Answers**

6. What is the ERP, and what does the integration actually move? Catalog sync,
   pricing, inventory, order submission, something else
7. "Lead acquisition through our email domains" in concrete terms: forms into a
   CRM? transactional sends? sequences? which provider?
8. Stack
9. Scale numbers, whichever exist: SKUs, monthly traffic, leads per month,
   conversion or time-on-task change against the old site. Numbers are what make
   this read as production engineering rather than a redesign
10. Role, versus anyone else's
11. What is confidential. ERP internals and customer data are the obvious risk,
    and the boundary needs to be known before scaffolding

### 5.2 Decisions that are not mine to make

12. **Taranto's.** Brief item 6 names American Scientific and Personal Works only.
    Taranto's is three images, no copy, no mention. Same anchored treatment, fold
    in, or cut?
13. **Agentic AI**: write it or cut it, per 2.4
14. **Lynk's "Shelved"**, per 2.3
15. **LinkedIn and GitHub URLs** for `site.social`

### 5.3 Everything else

16. Resume PDF, or confirmation that a named placeholder should be wired up now
17. Home thumbnails. `public/home/` has only `applications.png` and `design.png`,
    so two of four tiles have no image. Once the home grid's contents are decided,
    the exact file list follows
18. **Resend** needs an account, a verified sending domain (DNS records on
    `trevorriggle.design`), and `RESEND_API_KEY` in Vercel. Send *to* the gmail
    address *from* the verified domain, never as gmail. Recommend a honeypot and a
    timing check rather than a KV-backed rate limiter to start

---

## 6. Brief coverage

Every numbered item in the brief, and where it lands.

| # | Item                                | Phase | Notes                                  |
| - | ----------------------------------- | ----- | -------------------------------------- |
| 1 | Kill hover-gated reveal             | 2     |                                        |
| 2 | Remove metadata chips               | 2     | Lynk exception, see 2.3                |
| 3 | Visual direction                    | 1     | Ochre re-scoped, see 2.1               |
| 4 | Application page hero cleanup       | 4     |                                        |
| 5 | DrawEvolve screenshot sequence      | 0, 4  | Files fixed in 0, sequence in 4         |
| 6 | Design pages, subnav and anchors    | 3     | Taranto's undecided, see 5.2            |
| 7 | American Scientific website feature | 3     | Blocked on assets, see 5.1              |
| 8 | Home page rework                    | 5     | Blocked on thumbnail decision           |
| 9 | Contact form                        | 0, 5  | `@` artifact in 0, form in 5            |
| 10| About overhaul                      | 5     |                                        |
| 11| Footer                              | 0     |                                        |
