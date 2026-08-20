# Illuminations — a rethink

> Status: **Brainstorm, for @jake.** Not a design and not canon. This exists because the
> SPE-32 spike (`spike/illuminations/`, ten glyph-grid pages) did not work, and before we
> fix the format we should question whether the format is the thing to fix. Everything
> below is a candidate, including "cut the feature." See [DESIGN.md §6](./DESIGN.md) for
> what Illuminations were meant to be and [UNIVERSE.md §6](./UNIVERSE.md) for the themes
> any replacement must serve.

---

## 1. What we actually wanted

Strip the spike away and the goal underneath it was one feeling: **discovery**. A room in
twenty does something the others don't, and finding it feels like finding a gem (DESIGN.md
§6.1). "Wonder is rationed" is a whole design pillar (§2.4). The picture was never the
point. The picture was our first guess at *how to deliver a jolt of the extraordinary in a
medium made of ordinary text*.

So the real brief is: **how do we make a Traveler go "oh —" a few times a realm, in a way
that is high quality, scarce, and worth building?** Pictures are one answer. This doc
treats them as one answer among many.

## 2. Why the spike missed

Two failures, and they are different failures.

**Failure one: no purpose.** A hotspot composes a command into the prompt. Anything you can
tap, you can type. So the interactivity is a shortcut, not a discovery — the illumination
knows nothing the parser didn't already tell you. A gem you could have found by typing
`OPEN DOOR` is not a gem. This is the deeper failure, and it would sink even beautiful art.

**Failure two: low ceiling.** Glyph-grid pictures look poor even judged as glyph-grid
pictures, and they will look poorer in contributor hands than in ours. The format asks
every author to be a good ASCII artist, which is a rare and unrelated talent, and then
grades the result against a memory of Zork that was never actually illustrated. We set
ourselves to compete on visuals, the one axis where a terminal is weakest and our writing
is strongest.

Both failures share a root: the spike treated an Illumination as **decoration you look at**
rather than **a discovery that changes something**. Decoration in a text game fights the
first pillar ("the writing is the graphics"). A discovery serves it.

## 3. The test any replacement must pass

Before listing ideas, here is the bar. A discovery earns its place only if it clears all
three.

1. **The parser can't already do it.** If tapping or finding the thing just runs a command
   the player could type, it fails. A discovery must hand over something otherwise
   unavailable: a clue, a capability, a commemoration, or a connection (see §5).
2. **It reads like Everwyn.** Terse, dry, deep-time underneath. It sounds one of the four
   themes: persistence, consequence at a distance, the forgotten thing, the traveler's
   melancholy (UNIVERSE.md §6).
3. **It stays rare and stays good.** Scarce by construction, not by policy, and buildable
   at quality by us and by reviewed contributors — or authored by us alone and gated.

Anything that fails #1 is garnish. The spike was garnish.

---

## 4. The approaches

Four families, cheapest-and-safest first, wildest last. None are exclusive; the strongest
plan probably braids two or three. Each carries a rough build cost and the main risk.

### Family A — Discoveries made of text (no picture at all)

The null hypothesis with teeth: the game's superpower is prose and consequence, so spend
the wonder budget there and drop pictures entirely.

**A1. The aria.** The narrator is rationed to 2–4 sentences a room by law. So the rare
break in that rhythm *is* the spectacle. Once or twice a realm, at an earned moment, the
narration opens up: a longer passage, printed slower, with the typewriter cadence dropped
to a walk and blank lines used like held breath. No glyphs. The gem is that the voice you
know to be terse suddenly isn't, and you feel it in your chest before you know why.

> \> FUTURE
>
> The years pour past.
>
> The mill is gone. So is the miller, and the miller's language, and the war his
> grandsons will lose. The wheel you set turning an hour and a thousand years ago has
> turned the whole time.
>
> The millpond is exactly where it was.

- *Clears the test:* the parser can't produce this; only an authored, placed moment can.
- *Cost:* near zero to build — it's a writing-guide rule plus a cadence flag on a passage.
- *Risk:* discipline. If arias appear every third room they become wallpaper made of words.
  Same scarcity governance as before, but now the scarce thing is one we're good at.

**A2. Reactive verbs (the xyzzy tradition).** Discovery as a response the world had waiting
for a guess you weren't required to make. Type the odd word the room half-invites — `RING
BELL` in the Hush, `LISTEN` at the Gap, `WAIT` at the right stone — and get a reply nothing
prompted you to seek. Zork's whole reputation for depth is built on this.

- *Clears the test:* the payoff is knowledge you get no other way, and you had to reach for
  it. It rewards curiosity, which is the discovery emotion exactly.
- *Cost:* low; authored responses on nouns and verbs already in scope.
- *Risk:* undiscoverable if too hidden. Mitigate with the assist row surfacing the *safe*
  verbs and leaving the rare ones for the curious.

**A3. Cross-time commemoration (turn §5.3 into the discovery).** The signature Everwyn
pleasure is already textual: you do a small thing in an early era and the world, a thousand
years on, bears your mark and *names you*. The museum placard names the child who dropped
the coin (§4.4). Make **that** the gem, not a sprite of a coin. The discovery is finding
the consequence, and it can only exist because you traveled.

- *Clears the test:* impossible without the time mechanic; it is the game's thesis, felt.
- *Cost:* low-to-medium; it's authored cause-and-effect links, already the puzzle grammar.
- *Risk:* none to the format; the risk is simply writing enough of them well.

### Family B — Do the manuscript metaphor properly

If we keep visuals, stop drawing scenes. Real illuminated manuscripts are not comic panels.
Their beauty lives in letters, margins, and gold — elements that are far easier to make
gorgeous and far harder to make ugly than a 48×15 landscape.

**B1. Illuminated initials (the historiated capital).** The literal meaning of the word.
In a rare room, the **first letter** of the description is a large ornate drop-cap, drawn
as fine line art (SVG, our hand or a tight tileset of letterforms), with a tiny scene
living *inside* the letter — a vine, a creature, a face. It is a single glyph-sized jewel,
not a picture of the room. And it can carry a secret: the thing coiled in the letter is
examinable.

> **The Undercroft**
>
>  ╔═╗   Stone vaults, a swept floor. Someone keeps this place, and is not here.
>  ║S║   In the hollow of the S, a small fox is painted, looking back the way you came.
>  ╚═╝
>
> \> EXAMINE FOX
> It has been painted over once already. Under the new paint, an older fox faces the
> other way.

- *Clears the test:* the historiation hides a clue (here, the palimpsest hints a Thread);
  noticing it is the discovery. The letter is also just beautiful, on its own terms.
- *Cost:* medium. Real art, but a *bounded* kind — an alphabet of ornamented capitals is a
  finite, reusable asset, unlike infinite bespoke scenes.
- *Risk:* still asks for visual craft, but the surface area is one letter, and the manuscript
  frame flatters simple work rather than exposing it.

**B2. Marginalia and rubrication.** Two more manuscript devices, both cheap and full of
character. **Rubrics:** a very few words in a passage rendered in the theme's red, marking
what matters (the sacred, the dangerous, the true name) — live, so a rubricated word is
usually a noun worth examining. **Drolleries:** tiny creatures that live in the left margin
of the transcript and react to the room — a snail that races nothing, a monkey aping your
last verb. Rare, silent, never blocking. They make the page feel hand-kept.

- *Clears the test:* a rubric is a legible signal ("this word is load-bearing") the plain
  transcript can't give; the drollery is pure delight and stays off the critical path.
- *Cost:* low. A handful of margin glyphs and a red ink already in the palette.
- *Risk:* twee if overused. Budget them like exclamation points: about one per realm.

**B3. Hero plates, our hand only.** For the two or three genuine set-pieces of a realm — the
Turning House, the thing at the top of the mountain — commission real illustration in a
fixed frame (SVG woodcut / engraving style), authored by us and **never** by contributors.
This removes failure two at the root: contributors stop making ugly pictures because
contributors stop making pictures. The Foundry stays, but only for the small manuscript
ornaments above, not for scenes.

- *Clears the test:* only if the plate is a discovery too (reveals a hotspot the text
  withheld, or gilds on completion — see D3), not a splash screen.
- *Cost:* high per plate, but the count is tiny and fixed, like boss art in a small game.
- *Risk:* portability and the phone; a woodcut must still degrade to text for the blind and
  the purist (DESIGN.md §6.2's blind-playable rule is non-negotiable).

**B4. Ink that keeps the era.** Not a per-room discovery but a per-*age* one: let the
transcript's own texture shift by landing. 2099 BA renders heavy and unmortared; 2099 AA
renders lettered and fine; the Hush is a hair colder. Subtle enough to feel rather than
notice. This "illuminates" time itself, which is the one subject the terminal can render
better than any picture, and it costs nothing per room.

- *Clears the test:* it makes striding across the Gap *look* like the world woke up (§2 of
  the bible) — a payoff unavailable to a single-era game.
- *Cost:* low-medium; theming work, done once per era.
- *Risk:* gimmick if loud. The whole point is that it stays under the reading brain.

### Family C — Discoveries that are mechanisms (parser-exclusive by design)

These beat failure one head-on: each does something a command line genuinely cannot,
because the interaction is *spatial* or *cumulative*. This is where "clicking makes a
command I could type" becomes impossible, because there is no command that could do it.

**C1. Rubbings and impressions.** In one era you `TAKE RUBBING` of a seal, a gravestone, a
coin. It's an item. In another era you `PRESS RUBBING` against a matching surface and it
fits, or doesn't, or completes a half-worn inscription across a thousand years. The
discovery is an overlay of two times — impossible to type, native to carry-across-time.

- *Clears the test:* emphatically. Persistence and consequence-at-a-distance made physical.
- *Cost:* medium; a small item type plus authored match-points.
- *Risk:* inventory fiddliness. Keep the vocabulary tiny (`RUB`, `PRESS`) and forgiving.

**C2. The map that draws itself.** No pre-drawn art. As you walk a realm across eras, a
`MAP` view accretes in manuscript ink — coasts inked as you reach them, roads drawn as you
walk them, your route a red thread. The same place in two eras can overlay: the road older
than the kingdom that repaired it, seen. The picture is *earned*, never gifted, so it can't
be low quality — it's your own footprints.

- *Clears the test:* the discovery is the shape of the land resolving, and the persistence
  of places across time shown, not told. No command draws this.
- *Cost:* medium-high; a real subsystem, but a high-value one that serves navigation too.
- *Risk:* scope. It's closer to a feature than an ornament. Could ship thin (current realm,
  current era) and grow.

**C3. Live ciphers, rebuses, constellations.** A shown puzzle whose answer the parser will
not hand you: a rebus that spells a password, stars in scattered night-sky rooms you `LINK`
into a figure that names a door. The image is the *only* source of the solution, so looking
at it is mandatory and typing the answer is earned.

- *Clears the test:* by construction — the whole point is that no command reveals the answer.
- *Cost:* medium; each is bespoke, which caps how many exist (good for scarcity).
- *Risk:* accessibility. A purely visual cipher must have a described alternative, or it
  locks out screen-reader players. Design each with a text path from the start.

### Family D — Off the wall

**D1. Player-left marks.** Canon already grants Travelers a custom: waymarks scratched near
loose ground (UNIVERSE.md §3). Let players actually leave one short, moderated mark at a
site — a scratch, a stacked cairn — that a later Traveler, or future-you on a return
stride, discovers. Discoveries authored by the crowd, lightweight and textual, making the
years feel walked-in without a chat box.

- *Risk:* moderation, and the griefing posture (DESIGN.md §3.3). Ship read-only marks by us
  first; open authoring later, gated.

**D2. The palimpsest page.** A single inscription you can `SCRAPE` or hold to reveal the
older text beneath it — the same stone's words in a previous age, half-erased. Layered text
as the visual. History literally under history; the forgotten thing, almost surfacing.

- *Risk:* small and lovely; mostly just needs the right authored pairs.

**D3. Gilding earned, not found.** Invert the whole model. An Illumination is not something
you *find* in a room — it is something a room *becomes* when you finish a Thread there. Gold
leaf spreads across the closing page as your commemoration (§5.3, the compass of endings).
This fixes both failures at once: every illumination is load-bearing (it marks an ending),
and scarcity is automatic (there are only so many endings). The gem is a reward for
persistence, which is the universe's favorite theme. Of everything here, this is the one I'd
prototype first, because it turns the feature from decoration into consequence.

- *Risk:* couples illuminations to the Thread system, which doesn't exist yet. But it argues
  they *should* be coupled, and that may be the real lesson of the spike.

**D4. Cut it.** State the honest option plainly. Retire "Illuminations" as a named visual
system, keep the *word* for the earned-gilding idea (D3) or drop it, and reinvest the whole
wonder budget in Families A and C, which serve the first pillar instead of straining against
it. If nothing here reaches "gem," this is the responsible answer, and it costs us nothing
we've shipped.

---

## 5. A cross-cut: what a discovery is allowed to *give*

Independent of format, it clarified my thinking to name the only things a discovery may hand
over. Every idea above delivers at least one; if a proposal delivers none, it's garnish.

- **A clue** — knowledge available no other way (A2, B1, C3, D2).
- **A capability** — a new exit, verb, or item (C1, C3).
- **A commemoration** — the world marking what you did (A3, D1, D3).
- **A connection** — one Thread recognizing another across the years (A3, B1).

The spike's hotspots gave none of these. That, in one line, is why it felt empty.

## 6. Where I'd point next

If we prototype, prototype **D3 (earned gilding)** and **A1 (the aria)** together as the
smallest end-to-end slice: finish a tiny two-room Thread, watch the closing page gild while
the narrator, for once, breathes out. That single moment would tell us whether "discovery"
in Everwyn wants to be seen or read — and either answer is cheaper to test than another ten
glyph-grid pages. **C2 (the self-drawing map)** is the high-ceiling swing worth a separate
spike if the first slice lands.

## 7. Open questions for @jake

1. Is the discovery meant to be **looked at or read**? Everything forks on this. The spike
   assumed looked-at; Families A and C bet on read/done.
2. Do contributors make discoveries at all, or are these **our hand only** (like fixed
   points and the Foundry)? "Our hand only" kills failure two but shrinks the world's
   variety.
3. Should the feature keep the name **Illuminations**? It's still open (DESIGN.md §9). D3
   would honor the manuscript metaphor more truly than the spike did.
4. Is any real illustration (B3) in scope, or is Everwyn **text and typography only**, full
   stop? A clear "text only" would simplify everything downstream.
