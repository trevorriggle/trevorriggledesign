# What's left, and it is all yours

Written 2026-09-14, after Phase 5. **The redesign is code-complete.** All five
phases on `redesign/editorial` are built, verified and committed. Nothing below
needs an engineer; every item is content, a decision, or a credential.

Where an item has a file path, that path is the only edit. Nothing here requires
touching more than one file, and nothing requires a component change.

---

## 1. Blocking: the site has a visible hole without these

### 1.1 The American Scientific website case study is a scaffold

**Where:** `content/design.ts` → `designFeatured["american-scientific"]`
**Renders at:** `/design/american-scientific`, the ultramarine band at the top

This is the strongest piece of evidence on the design side of the site, and
right now it is two blocks of prose drawn entirely from your own brief, with no
pictures at all. Everything missing is listed in the `todo` array in that file,
which renders on the page in `next dev` and never in production.

**Screenshots needed.** Drop them anywhere and tell me where; the wiring is a
one-line edit each.

| # | Shot | Why |
| - | ---- | --- |
| 1 | Landing page, desktop width | The establishing shot |
| 2 | One ERP-integrated page: product detail, quote flow, or account | This is the whole claim. Without it "wired into the ERP" is a sentence |
| 3 | The lead capture form, in context | Same, for the lead half |
| 4 | Landing page, phone width | Most of this site's readers are on one |
| 5 | The admin or data side, if any of it can be shown | Optional, strongest if it exists |
| 6 | The **old** site, for a before/after | Optional. The rebrand section works because it is a before/after, and this would too |

**Questions I cannot answer for you.** These are what turn the section from a
redesign story into a production-engineering one.

1. **Which ERP, and what does the integration actually move?** Catalog sync,
   pricing, inventory, order submission, something else?
2. **"Lead acquisition through our email domains", concretely.** Forms into a
   CRM? Transactional sends? Sequences? Which provider?
3. **The stack.**
4. **Any scale numbers at all.** SKUs, monthly traffic, leads per month,
   conversion or time-on-task against the old site. Numbers are the single
   highest-value thing on this list: they are what make a reader file this
   under engineering rather than under layout.
5. **Your role, versus anyone else's.**
6. **What is confidential.** ERP internals and customer data are the obvious
   risk, and the boundary needs to be known before anything gets written.
7. **The live URL, and whether it can be linked.** If it can, it also needs a
   line in `REQUIRED_LIVE` in `scripts/check-links.mjs`, so a dead link fails
   the build rather than sitting there.

### 1.2 `/agentic-ai` is a nav tab pointing at an empty page

**Where:** `content/agentic-ai.ts` → `body: []`, and `lib/site.ts` → `nav`

The page renders a heading and a link into DrawEvolve's "How I worked" passage.
That is it. For a reader who has just come out of a final-round interview, a
dead section is worse than no section: it reads as something abandoned.

**Two options, pick one:**

- **Write it.** Fill `body` in `content/agentic-ai.ts` and the page grows a
  lead. The material exists in your head; the DrawEvolve passage is the
  published proof.
- **Cut the tab.** Delete the `Agentic AI` line from `nav` in `lib/site.ts`.
  The agent-workflow material stays where it already lives, inside DrawEvolve,
  which is where a reader will actually encounter it.

My recommendation is still **cut**, unless you want to write it this week.
Half a section in front of a hiring manager costs more than no section does.

### 1.3 `site.social` is empty, so two blocks render nothing

**Where:** `lib/site.ts` → `social: []`

The footer's "Elsewhere" block and the contact page's rail both render nothing
at all while this is empty. Someone deciding whether to argue for you in a
debrief goes looking for LinkedIn and GitHub, and finds neither.

Add the lines and both reappear, with no other edit anywhere:

```ts
social: [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
  { label: "GitHub", href: "https://github.com/trevorriggle" },
],
```

Absolute `https://` URLs only. A guessed handle that 404s in front of a hiring
manager is the exact failure the link check exists to prevent, which is why
nothing was invented here.

---

## 2. The resume

**Where:** `public/resume/` — the folder does not exist yet

Drop **any PDF** into `public/resume/` and the download button appears on
`/about`, labelled with the file's real size in KB. Any filename works; the
browser saves it as "Trevor Riggle, resume.pdf" whatever it is called on disk.
No manifest, no import, no other edit.

**With no file there, no button renders.** That is deliberate and it is a
departure from the brief, which asked for a placeholder PDF. The reasoning is in
the header of `lib/resume.ts`: a missing resume is a gap a reader asks about, a
blank one is a thing they remember, and the readers of this page are deciding
something.

---

## 3. Deploy configuration

### 3.1 Resend, for the contact form

The form at `/contact` is built, validated on both sides, and verified end to
end. It is not connected. Until it is, it answers **503** and tells the visitor
to email you directly, naming the address. It never claims to have sent
something it did not send.

**Four steps:**

1. Create a Resend account.
2. Verify **`trevorriggle.design`** as a sending domain. This is DNS records on
   the domain, and it is the step with a wait in it, so start it first.
3. Set two environment variables in Vercel:

   | Variable | Value |
   | -------- | ----- |
   | `RESEND_API_KEY` | The API key |
   | `CONTACT_FROM` | An address **on the verified domain**, e.g. `site@trevorriggle.design` |
   | `CONTACT_TO` | Optional. Where mail lands. Defaults to `site.email`, the gmail address |

4. Send yourself one test message through the live form.

**`CONTACT_FROM` must not be the gmail address.** Your own address rides in
`Reply-To`, so hitting reply still goes to the right place. Putting a gmail
address in `From` on mail sent by a different domain is how a sending domain's
reputation gets burned, and the mail starts landing in spam.

There is no rate limiter, by choice: a honeypot field and a two-second minimum
on the form catch the undirected crawlers, and a real limiter needs a shared
store, which on Vercel means provisioning KV for a personal contact form. **The
ceiling that matters meanwhile is the daily send limit on the Resend account**,
so set one.

### 3.2 The domain, which is still an assumption

**Where:** `lib/site.ts` → `domain` / `url`

`trevorriggle.design` is assumed, and it is the last unconfirmed value in the
repository. It builds `metadataBase`, every canonical URL, the sitemap and the
OG image URLs. One edit if it is wrong, and everything follows.

---

## 4. Copy you can improve at any time, nothing is broken without it

### 4.1 Placeholder section copy on the design pages

**Where:** `content/design.ts` → `designSections`

Eight sections carry copy that is **not yours**. It was written under a strict
contract, at the top of that file: no claim that is not visible in the folder's
own images or already written elsewhere in this repo, and no client names,
dates, volumes, outcomes or metrics. Every block carries `placeholder: true`,
and a marker renders in `next dev` only.

| Category | Sections |
| -------- | -------- |
| American Scientific | `rebrand`, `print`, `social-media`, `motion-graphics` |
| Personal Works | `misc-art`, `comics`, `drawings`, `motion-graphics` |

Rewrite any of them in your own voice and drop the `placeholder: true` line.
They are designed to be **edited, not replaced**: the structure is right, the
sentences are just cautious.

### 4.2 Three copy fields that render nothing

**Where:** `content/design.ts`

| Field | State |
| ----- | ----- |
| `designCategories` → American Scientific `intro` | Empty |
| `designCategories` → Taranto's `intro` | Empty |
| `designLanding.body` (the `/design` landing copy) | Empty |

All three render nothing rather than an empty element, so the pages are correct
as they stand. Fill any one and it appears.

Taranto's is the thinnest thing on the site: three images, no copy of any kind.
It renders as a flat gallery with no subnav, which was deliberate — a sticky bar
with one item in it is furniture. **If it stays this thin, consider cutting
it.** Three images with nothing said about them is the one place on the site
where a reader learns nothing.

---

## 5. Decisions already made, so you do not re-open them

Recorded so this list is not re-litigated later. Full reasoning in
`DECISIONS.md`.

| Question | Answer | Where |
| -------- | ------ | ----- |
| Taranto's: fold in, restructure, or cut? | Left as a flat gallery, deliberately. Still worth cutting if no copy arrives | Phase 3 |
| Lynk's "Shelved" badge | Badge gone. The deck names the shelving in the sentence that introduces it, and the body opens on it flatly | Phase 2 |
| Ochre on the Paper ground | **Never type.** It measures 2.00:1. It is a field with ink on top, a rule, or an underline. Ochre as type only on Ink, where it is 8.67:1 | Phase 1 |
| `Portfolio Images/` | **Kept**, untracked. It is the 240 MB local masters archive and holds the only copy of the thoosie video master | Phase 0 |
| Home page thumbnails | No longer a thing. `public/home/` is deleted; the grid reads the same rows `/applications` does | Phase 5 |
| A placeholder resume PDF | Not shipped. See section 2 | Phase 5 |

---

## 6. Two known gaps in the engineering, for the record

Neither blocks a deploy, and neither is something you need to act on.

1. **ESLint cannot lint the `.tsx` files.** `typescript-eslint` throws on
   TypeScript 7, which this repo pins. `pnpm typecheck` and `next build` both
   type-check the whole project, so nothing is unchecked, but the lint rules
   that need type information do not run.
2. **OG cards render in the fallback sans, not Instrument Serif.** `next/og`
   rasterises with satori, which needs a raw `ttf`/`otf` and cannot read the
   `woff2` that `next/font` produces. To fix: drop a `.ttf` into `lib/fonts/`
   and pass it to the `fonts` option in `lib/og.tsx`.

---

## The short version

If you only do four things, do these, in this order:

1. **Start the Resend domain verification.** It has a DNS wait in it.
2. **Decide `/agentic-ai`:** write it or cut the tab.
3. **Add the two social URLs.** Two lines, and it closes a gap that matters at
   exactly the moment someone is deciding about you.
4. **Send the American Scientific screenshots and the six answers.** It is the
   strongest thing on the design side and it is currently a paragraph.
