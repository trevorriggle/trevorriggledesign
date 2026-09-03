# Portfolio Copy — Trevor Riggle

Everything below is written from what you've told me. Anywhere a specific
fact would have to be invented, there's a `[[NEEDS: ...]]` marker. Those are
the only spots to fill — everything else is ready to paste.

Do not ship a `[[NEEDS]]` marker. If you can't fill one, cut the sentence.
An empty field beats a number you can't defend in an interview.

---

## SITE-WIDE

### Home — opening statement

> Graphic designer who ships software.
>
> I spent four years making catalogs and marketing for hundreds of clients,
> then learned to build the products instead of decorating them. Now I design
> and ship AI tools end to end — interface, backend, model pipeline, and the
> parts nobody wants to own.

### Nav labels
`Work` · `About` · `Contact`

Keep it to three. Anything else is a fourth thing to maintain.

### Meta description (site)
> Trevor Riggle — graphic designer and self-taught developer building AI
> products. iOS, full-stack, and design work.

### 404
> **Nothing here.**
>
> Which is at least honest. [Back to the work →]

### Contact page
> **Get in touch**
>
> I'm looking for design engineering and AI product roles. Happy to talk
> about anything on this site in as much detail as you want.
>
> trevorriggle@gmail.com

---

## ABOUT

> I'm a graphic designer with a BFA from West Virginia University. For the
> last four years I've run catalogs and marketing at American Scientific,
> managing design for hundreds of clients — the kind of production work that
> teaches you systems whether you want to learn them or not.
>
> Somewhere in there I got tired of designing interfaces I couldn't build. I
> taught myself Swift, then SwiftUI, then the rest of it — TypeScript,
> Cloudflare Workers, Supabase, enough Metal to write a renderer. I now build
> and ship products under RIG Tech LLC.
>
> The through-line is that I don't hand off. I design the thing, build the
> thing, and own the parts of it that break. That means I've had to make real
> engineering decisions with real costs — architecture I had to migrate,
> features I had to cut, a product I shelved because the economics didn't
> work. Those are on this site too.
>
> What I'm looking for is the job where the design and the building are the
> same job.

---

## SECTION: AI SYSTEMS & DEVELOPMENT

### Section intro
> Products I designed and built end to end. Interface through infrastructure.

---

# CASE STUDY 1 — DrawEvolve

**Subtitle:** An iOS drawing app where the AI coaches instead of critiques.
**Role:** Everything — design, iOS, backend, infrastructure
**Timeline:** October 2025 – present
**Status:** Shipped to TestFlight; approved for external testing
**Live:** drawevolve.com

### The premise

Most AI feedback on creative work is stateless. You show it a drawing, it
tells you what's wrong, and next time you show it a drawing it has no idea
it's ever met you. That's not coaching. That's a very confident stranger with
opinions.

DrawEvolve is built on the opposite principle: the critique remembers. A
second critique on the same piece references the first one and evaluates
whether you actually acted on it. Progress is the thing being measured, not
the individual drawing.

The product position is *AI as mentor, not replacement* — the app has an
Artist Bill of Rights, and nothing in it generates art on your behalf.

### The constraint

I was the entire team. Design, iOS, backend, infrastructure, and every
decision in between. That shapes everything downstream: I couldn't afford
architecture that required a team to maintain, and I couldn't afford a cost
structure that could bankrupt me while I slept.

I also started this not knowing Swift. I learned it in about two weeks and
started building.

### What I built

**A drawing engine, from scratch.** Metal tile-based rendering, a wet-ink
stroke system, brush suite, layers, selection tools, symmetry, full Apple
Pencil support, and portrait/landscape handling.

The renderer went through a multi-phase architectural migration to tiles.
[[NEEDS: what forced the migration — what specifically was breaking or too slow
under the old approach? One or two sentences.]]

[[NEEDS: what the migration cost you — how long was the app in a broken state,
what did you have to rip out or rewrite along the way?]]

**An iterative critique system.** Four distinct AI voice presets, and "Eve," a
conversational coaching layer that maintains rolling summaries of your
conversation history so context survives across sessions without unbounded
token growth. Critiques reference prior critiques. A My Evolution dashboard
turns critique history into a visible progress record.

**Infrastructure that assumes the worst.** Every model call routes through a
Cloudflare Worker proxy that verifies JWTs, enforces App Attest, applies
tiered rate limits, and hard-caps daily spend. Supabase with row-level
security behind it. Sign in with Apple and Google via authorization code flow
with PKCE.

That work isn't glamorous and it's the reason the product exists. A solo
developer shipping an LLM-backed app without a spend ceiling is one abusive
script away from a five-figure bill. The ceiling went in before the app went
out.

### The tradeoff I made

I shipped the tile-based renderer before retrofitting wet-ink onto it, which
means the stroke system is running on architecture it wasn't originally
written for until I go back and finish that work. I took the visible progress
over the clean sequence, deliberately, because a renderer nobody can use
isn't verified.

That's a debt I named rather than hid, and it's scheduled.

### How I worked

I ran parallel Claude Code agents across git worktrees for most of the build.
Not as a novelty — as the only way one person covers that much surface area
in six months. Each agent held a bounded scope on its own branch, and I did
integration and review.

Learning to decompose work so that agents don't collide is a real skill, and
it's most of why the timeline was possible at all.

### Outcome

Shipped to TestFlight in May 2026. Three builds; the third passed Beta App
Review and was approved for external testing. Running with a beta group of
working artists, including a tattoo artist who's been the heaviest user of
the critique system.

[[NEEDS (optional but strong): anything measurable from the renderer work —
canvas size or layer count you can handle now that you couldn't before, or a
rough before/after on frame times. Even approximate is fine. Skip if you
don't have it.]]

### What I'd do differently

[[NEEDS: one honest answer. Something you'd architect differently, a feature
you built that didn't earn its keep, or a decision you'd reverse. This is the
field hiring managers read hardest — a real answer here is worth more than
the rest of the page.]]

---

# CASE STUDY 2 — thoosie

**Subtitle:** Draw a line, ride it as a roller coaster.
**Role:** Everything — design, engineering, physics, launch
**Status:** Live
**Live:** thoosie.net

### The premise

You draw a track freehand. thoosie turns it into a rideable coaster and runs
real physics on it — speed, vertical G, airtime, inversions — then lets you
ride it from the train.

The whole design problem is the gap between those two things. Drawing is
loose and expressive. Physics is unforgiving. A line that looks great is
often a ride that either stalls out halfway up the hill or pulls G-forces
that would put a person in the hospital. The app has to let people draw
freely and still produce something that works.

### What I built

A full track editor: freehand, straight, and arc tools, plus a library of
prefab elements — first drops, vertical loops, camelbacks, bunny hops,
valleys, barrel rolls, half loops, Immelmanns, dive loops. Track types that
behave differently under the physics sim: chain lift, launch, brake run, and
trigger track.

A trigger and reaction system, so pieces can respond to the train passing —
a brake run that holds the train, counts down, then launches it onward, or
track that physically moves between two positions when a trigger fires. That
turned the editor from a drawing tool into something closer to a small
state machine, and it's the feature that made people build things I didn't
anticipate.

Live physics telemetry surfaced during the ride: current speed, vertical G,
airtime accumulating in real time, then a summary — height, top speed, max
and min G, inversions, length, ride time.

Plus the unglamorous half: autosave, cross-platform level sharing, a
gallery, a tutorial, a content filter on shared coasters, and a full mobile
pass.

### The decision that mattered

The physics readouts started as debug output. I kept them and made them a
first-class part of the interface, because watching airtime tick up while
you're cresting a hill you drew is the thing that makes the feedback loop
work. Players learn what makes a good coaster by watching the numbers
respond, not by reading a rule.

It's the same instinct as DrawEvolve, honestly — the system's job is to
teach you to get better, not to do it for you.

### What I cut

I built the game to run inside Reddit as a Devvit app and then didn't ship
it there. Two platforms meant two sets of layout bugs, two embed
environments, and a mobile letterboxing problem I'd have owned indefinitely.
I shipped the standalone web build only.

Cutting a finished platform is unpleasant. It was the right call — the
standalone build launched a day early and I spent that time on the game
instead of on embed CSS.

### Outcome

Launched August 2026. Promoted through the coaster and indie dev
communities with a single gameplay clip.

The response I actually cared about: two testers played for twenty-five
minutes unprompted, without being asked to and without stopping to give
feedback. For a physics toy with no goals, no score, and no progression,
that's the only signal that means anything.

[[NEEDS (optional): any post-launch numbers you're happy to publish — plays,
coasters shared, itch.io stats. Skip entirely if the numbers are small; the
25-minute anecdote is stronger than a modest number.]]

---

# CASE STUDY 3 — Lynk

**Subtitle:** A multi-model LLM workspace, and the decision to stop building it.
**Role:** Everything
**Status:** Shelved

### What it was

A multi-provider LLM orchestration platform — routing across model
providers, with hierarchical context compression so long sessions stayed
usable without blowing up token costs.

The compression work is the part I'd still defend. Long-running LLM sessions
degrade in predictable ways, and hierarchically summarizing older context
while keeping recent context intact was a genuinely reasonable answer to it.
The same idea, scaled down, is what runs Eve's rolling summaries in
DrawEvolve today.

### Why I killed it

The unit economics didn't work for one person. Every user session cost real
money against provider APIs, the value proposition was thin against
first-party tools that had the same models and more engineers, and I would
have been maintaining provider integrations indefinitely while doing it
alone.

I shelved it, kept the repo, and moved the parts worth keeping into
DrawEvolve.

### Why it's on this site

Because knowing when to stop is a skill, and I'd rather show you a project I
ended deliberately than pretend everything I've started is still alive. The
compression architecture found a better home. That's the outcome I wanted,
just not the one I planned.

---

## GALLERY SECTIONS

### 3D Graphics (2025)
> Product visualization and 3D work. Modeling, lighting, and render passes for
> commercial use.

### Marketing (2022)
> Campaign work at American Scientific — animated product flyers, web banners,
> and social assets, produced at volume across hundreds of client accounts.

### Motion Graphics (2021)
> Animation and motion work. Titles, product motion, and short-form pieces.

### Print (2021)
> Catalog spreads and print layout. Long documents, tight grids, and the kind
> of typographic discipline that only shows up when it's missing.

### Personal Works (2021)
> Illustration and comics, mostly made for myself. One of them ended up on the
> front page of Reddit, which was not the plan.

---

## NOTES

**On the two `[[NEEDS]]` markers in DrawEvolve:** the migration cause and the
"what I'd do differently" are the two highest-value sentences on the entire
site. They're what turn a feature list into evidence of judgment, and they're
the material a hiring manager will actually dig into. Worth writing properly
even if you cut something else.

**On Lynk:** framing a shelved project as a decision rather than a failure
only works if you own it plainly, which the copy above does. Don't soften it
back toward "on hold" — that reads as evasion and invites the exact question
you don't want.

**Length:** every case study above is short on purpose. Nobody reads a long
portfolio page. The goal is to leave them with questions, not answers.
