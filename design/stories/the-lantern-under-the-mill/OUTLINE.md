# The Lantern Under the Mill

max_rooms: 2

## Story

The author's story, carried over whole:

> A player arrives at the turning house at dusk and finds an unlit iron lantern hung
> beside the door, its glass still warm. Someone lit it moments ago and left. The only way
> to follow is down: a narrow stair leads to the mill-race, where the water runs black and
> fast under the wheel. In the earlier age the stair is open and the race is loud; in the
> later age the stair has been bricked over and the wheel is silent, but the lantern still
> hangs, and it still remembers who carried it.
>
> Tone: quiet, watchful, a little melancholy. No jump scares, no villains. The mystery is
> who lit the lantern, and the answer should be felt rather than stated. Keep the text
> spare and concrete, in the voice of the writing guide.
>
> Keep this story small: two rooms only, both at the same place across two eras, or the
> turning house plus the mill-race in one era. Reachability from the start room is the only
> thing that must hold.

### What the story is

One lantern outlasts a mill. That is the whole of it.

The Turning House is named for turning, and the thing that turns is under it: a wheel in a
race, black water in a stone channel below the common room. In the High Masonry the wheel
is working and the way down is open. A thousand years on, in the Long Noon, the wheel has
stopped, the stair has been bricked shut from above, and the iron lantern is down there on
its nail — unlit, and still warm. Nobody ever says who carried it down. Nobody ever will.

The theme is persistence (`design/UNIVERSE.md` §6.1): not the mill, but the lantern. And
the traveler's melancholy (§6.4): you are following someone who is, from where you stand,
minutes ahead of you and a thousand years gone.

### The arc

**Open — the Turning House, 2099 BA, at dusk.** The player starts where every player
starts. Beside the barred door, on a nail, hangs an iron lantern: unlit, its glass warm.
Someone lit it a few minutes ago and went out of the room. The house offers no explanation
and the landlady does not offer one either. A second stair, narrow, goes down.

**Turn — the mill-race, 2099 BA.** Down at the water: the wheel turning, the race loud
enough that a person could leave without being heard, the stone wet. On a beam there is a
nail with a ring of soot around it and nothing on it. Whoever came down is not here, and
there is no further door. What there is, is loose ground — the years run forward at the
water's edge.

**Resolve — the mill-race, 1099 BA.** The same channel. The wheel is stopped and dry to
the hub, the race silted, and above, where the stair came down, there is brick. On the beam
the nail is not empty: the iron lantern hangs there, unlit. The glass is warm. The only way
back is the way you came, and it is not a stair.

The player never finds the carrier, never learns a name, and is never told what the warmth
means. The one fact the story hands over — the lantern went down, and stayed down, and is
still warm — is the answer, delivered as a fact and left alone.

### The beats, in order

1. `LOOK` in the Turning House: an iron lantern hangs beside the door, unlit.
2. `EXAMINE LANTERN`: the glass is warm. One sentence. No theory offered.
3. `TAKE LANTERN`: refused, in voice, in one line. It stays on its nail.
4. `DOWN`: the narrow stair to the water.
5. The mill-race in the High Masonry: wheel, race, wet stone, an empty sooted nail.
6. `FUTURE`: a thousand years.
7. The mill-race in the Long Noon: brick overhead, a stopped wheel — and the lantern on
   the nail, warm.
8. `PAST` is the way home. The stair is gone; the years are not.

### Places and eras, and what each is for

- **the Turning House · 2099 BA** — the existing start room. It is the hook and the door
  down. Not a new room; see *Existing-room touches* below.
- **mill-race · 2099 BA (the High Masonry)** — the loud, working, wet version of the place.
  Establishes the nail, the beam, and an absence: the lantern is *not* here. Its job is to
  make the player ask where the lantern went, and to offer the stride that answers it.
- **mill-race · 1099 BA (the Long Noon)** — the quiet, stopped, bricked version. Pays the
  question off: same nail, same beam, lantern on it, still warm. Its job is one image and
  no explanation.

The Long Noon is a golden, complacent age with the worst maps in history (`UNIVERSE.md`
§4). It is exactly the age that would culvert a working race, brick a stair it had stopped
using, and forget the wheel was ever anything. Let that show in one clause at most; do not
narrate it.

### Things that carry

- **The iron lantern.** One lantern, one nail, two ages. Iron, plain, unlit in every era,
  glass warm in every era. Never takeable, anywhere: the story is about following it, not
  carrying it. It has no wick problem, no puzzle, no use — it is not a light source and
  must never behave like one. If the player tries to light it, the refusal is one dry line
  and no mechanism.
- **The nail and the beam.** The same nail in both faces of the mill-race, sooted in both.
  Empty in 2099 BA, holding the lantern in 1099 BA. This pair is the whole payoff; the two
  rooms must describe the nail in words close enough that a player recognizes it.
- **The warmth.** Stated as a plain fact, both at the Turning House and in 1099 BA. Never
  explained, never called impossible, never marveled at by the narrator. `UNIVERSE.md` §1:
  magic is weather. The warmth is the story's only wonder — ration it (`DESIGN.md` §2).
- **The wheel.** Turning in 2099 BA, stopped in 1099 BA. The contrast is the time-step
  line's job.

### Tone notes, binding

Quiet, watchful, a little melancholy. No jump scares, no villain, no NPC at the race — the
place is empty in both ages and stays empty. The narrator notices and reports and never
emotes for the player (`WRITING-GUIDE.md` §1.10). No exclamation points anywhere in this
story. At most one em-dash per passage. Rooms are 2–4 sentences; objects one. Nothing
about our world, no pastiche grammar, no summing up at the end — the last room ends on the
lantern, not on a moral.

Never write, in any form: who lit it, why, what the warmth is, that the lantern
"remembers," or that a thousand years have passed and yet, etc. The player does that work.

### What the generator must build (engine terms)

- Two new rooms, both `place: "mill-race"`, ids `mill-race:2099-ba` and `mill-race:1099-ba`.
- `src/content/index.ts`: register both rooms; `landings` becomes
  `["2099 BA", "1099 BA"]` (oldest first).
- `mill-race:2099-ba` — `landing: "2099 BA"`, `age: "the High Masonry"`,
  `exits: { up: "turning-house" }`, `time: { past: false, future: true }`.
- `mill-race:1099-ba` — `landing: "1099 BA"`, `age: "the Long Noon"`, no `exits` (the stair
  is brick), `time: { past: true, future: false }`.
- Both rooms share a `title`; the place keeps its name across eras
  (`WRITING-GUIDE.md` §1.8). *The Mill-Race* is the intended title.
- The engine appends its own time line ("Here, the years run forward." /
  "Here, the years run back."). Do not also announce the years in the room's `look`.
- Item ids are unique across the whole world (`validateWorld`), so the 1099 BA lantern
  needs an id distinct from the Turning House lantern's.
- The lantern is an `Item` with `takeable: false` and a `takeRefusal`, in both places it
  appears — the pattern the existing `coin` uses.

### Existing-room touches (not a third room)

`src/content/turning-house.ts` needs three small edits, and no more:

1. `exits: { down: "mill-race:2099-ba" }`.
2. An iron lantern beside the door: one clause in `look`, one `Item`
   (`takeable: false`, `takeRefusal`, `description` naming the warm glass).
3. The way down: revise the existing door/stair sentence rather than appending a new one —
   the room is already at its sentence budget — and give the down stair an examinable entry.
   The existing `stair` scenery describes the stair that *climbs*; the new one goes down, so
   it needs its own nouns.

Also refresh `lookAgain` so the revisited room lists the lantern with the other objects.
Leave the Turning House's `time` flags at `false`/`false`: no face of the House is built in
1099 BA, and the House holding still is the room's established behavior.

## Rooms

- [x] mill-race · 2099 BA (the High Masonry) — the loud working race, and the empty sooted nail
  - as built: `src/content/mill-race-2099-ba.ts`. `exits: { up: "turning-house" }`,
    `time: { past: false, future: true }`, no items. Scenery: `nail-2099` ("An iron nail in a
    ring of soot, and nothing hanging on it." — the line 1099 BA answers), `mill-beam` ("The
    nail is not as old as the beam."), `wheel-2099`, `race-2099`, `ledge-2099` (one worn track,
    stair to water), `mill-stair`. The noise "would cover a shout, or a door" carries the
    outline's someone-left-unheard beat without naming anyone. EXAMINE LANTERN here answers
    "You can't see any such thing." — the absence, delivered by the engine.
  - as built (Turning House touches, all three and no more): `exits: { down: "mill-race:2099-ba" }`;
    item `lantern` (`takeable: false`, refusal "You leave it on its nail. The House hangs things
    where it wants them.", description "Iron and plain, unlit, and the glass is warm."); the
    door/stair sentence revised in place to carry the lantern clause and the second stair, with
    new scenery `down-stair` (nouns `second stair` / `down stair` / `lower stair` /
    `narrow stair` / `floor`, kept off the existing `stair` entry's nouns so the climbing stair
    still answers to STAIR). `lookAgain` now lists the lantern. `time` left `false`/`false`.
  - as built (test fixture): `test/engine.test.ts` built its `Game` from the `turningHouse`
    room alone, and `validateWorld` rejects a room whose exit points outside its world, so the
    fixture is now the shipped `world`. Same start room, same assertions, no engine change.
- [x] mill-race · 1099 BA (the Long Noon) — bricked stair, stopped wheel, the lantern still on the nail
  - as built: `src/content/mill-race-1099-ba.ts`. `landing: "1099 BA"`, `age: "the Long Noon"`,
    no `exits` (the stair is brick), `time: { past: true, future: false }`. One item,
    `mill-lantern` (id distinct from the Turning House `lantern`, per `validateWorld`):
    `takeable: false`, description "Iron and plain, unlit, and the glass is warm." — the same
    sentence the Turning House lantern carries, word for word, because the recognition is the
    payoff. Refusal: "You leave it on its nail. It has hung there a while."
  - as built (the nail): `nail-1099` reads "An iron nail in a ring of soot, and the lantern
    hanging on it." against 2099 BA's "…and nothing hanging on it." Same clause, one word
    changed. `mill-beam-1099` answers 2099's "The nail is not as old as the beam" with "The
    nail has not moved."
  - as built (the Long Noon in one clause): "brick, laid by someone with mortar to spare" —
    the age that mortars what the High Masonry laid dry. `brick-1099` adds "worked from the
    other side", so the stair was bricked from the House, not from down here. Nothing narrated.
  - as built (registration): `landings` is now `["2099 BA", "1099 BA"]`, oldest first.
  - as built (deviation, minor): the wheel's 1099 description keeps the paddle vocabulary of
    2099 BA rather than introducing new nouns, so the two faces read as one wheel.

## Through-lines

- **Reachability from the start room.** `turning-house` (start) → `DOWN` →
  `mill-race:2099-ba` → `FUTURE` → `mill-race:1099-ba`. Both new rooms are reachable in two
  moves; `npm run eval:reach` should report routes `DOWN` and `DOWN, FUTURE`. The `DOWN`
  exit on `turning-house` and the `1099 BA` entry in `world.landings` are both required for
  this to hold. **Built and proved:** `npm run eval:reach` reports `verdict: PASS`,
  `rooms: 3  reachable: 3`, routes `DOWN` and `DOWN, FUTURE`.
- **The PAST/FUTURE pair.** `mill-race:2099-ba.time.future` and
  `mill-race:1099-ba.time.past` must both be `true`, and both rooms must carry the same
  `place: "mill-race"`, or `strideTarget` finds nothing and the stride fails in place.
  **Built.** Both flags set, both rooms `place: "mill-race"`; the stride round-trips
  (`DOWN FUTURE PAST UP` returns to the Turning House).
- **The nail, empty then filled.** The soot-ringed nail on the beam is described in
  `mill-race:2099-ba` and answered in `mill-race:1099-ba`. Same beam, same nail, recognizably
  the same words. This is the story's only payoff and it lives across both rooms. **Built:**
  "An iron nail in a ring of soot, and nothing hanging on it." → "An iron nail in a ring of
  soot, and the lantern hanging on it." The clause appears in each room's `look` and again in
  its `nail-*` scenery, so the player meets it whether they read or examine.
- **The lantern's three appearances.** Turning House (hangs, warm) → mill-race 2099 BA
  (absent; the nail is empty) → mill-race 1099 BA (hangs, warm). Non-takeable at every
  appearance, so it can never be in two places at once and no era-state has to be
  reconciled. **Built.** The absence in 2099 BA is delivered by the engine's own "You can't
  see any such thing.", which is the right amount of nothing.
- **The wheel, turning then stopped.** The one contrast the time-step earns; keep it to the
  two lines the writing guide allows. **Built:** "turns the wheel" against "the wheel stands
  dry to the hub, one paddle sprung"; the engine's own two lines carry the stride itself.
- **No verb for lighting the lantern, and that is the right answer.** The parser has no
  `LIGHT`, so LIGHT LANTERN returns `I don't know the word "light".` — one dry line and no
  mechanism, which is exactly what the outline asks for. Adding a verb would be an engine
  change and is out of scope. Not a blocker; the behavior wanted is the behavior shipped.
- **Every mentioned noun answers to EXAMINE** (`WRITING-GUIDE.md` rule 9). The Turning House
  lantern also answers to NAIL and GLASS; `mill-race:2099-ba` has `house-above-2099` for the
  common room overhead; `mill-race:1099-ba` folds HOUSE, CEILING, and STAIR into `brick-1099`,
  which is all that is left of the way up.
- **Known cosmetic edge, no action required.** The engine's closed-stride refusal is
  House-specific ("Tonight the House holds still"), so `PAST` at `mill-race:2099-ba` reads a
  little oddly. 2099 BA is the oldest landing and there is nothing back there either way.
  Changing engine text is out of scope for this story; noted so the evaluator is not
  surprised.

## Blockers

_None._
