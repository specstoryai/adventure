# Everwyn — Game Design Document

*Working title: **Everwyn** (developed under the codename *99*). A multiplayer,
ever-expanding, online text adventure.*

> Status: **Draft for review.** This is a design, not an implementation plan. Nothing here
> is canon until agreed by @jake. Decisions so far and remaining questions are collected
> at the end.

Companion documents:

- [UNIVERSE.md](./UNIVERSE.md) — the universe bible. The single source of creative truth.
- [WRITING-GUIDE.md](./WRITING-GUIDE.md) — the Zork-derived writing style guide that all
  game text must follow.

---

## 1. The pitch

**Everwyn** is a command-line text adventure that lives in the browser. It reads like
Zork — terse, dry, second person — but it is multiplayer, it never stops growing, and its
most distinctive feature is that **time travel is as easy as walking north**.

Every player is a member of the Travelers, a rare kind of person for whom the millennia
are just another compass direction. Type `EAST` and you cross a meadow. Type `FUTURE` and
you cross a thousand years. The room stays put; the world around it does not.

The game shares its name with its world: Everwyn, an other-worldly land with a
western-European flavor — not Earth, not Europe, but something a reader of Tolkien or
Narnia would recognize in their bones.

## 2. Design pillars

Every decision in this document should be defensible against these five pillars. If a
proposed feature fights one of them, the feature loses.

1. **It reads like Infocom.** The writing is the graphics. Terse, concrete, dryly funny.
   The writing guide is law.
2. **Time is a direction.** An exit like any other — present where an author put one,
   absent where they didn't, and never fiddly. The depth comes from what the mechanic
   does to the world, not from the mechanic itself.
3. **One universe, many hands.** Anyone can build rooms, quests, even whole realms — but
   only we define the universe. Consistency is our product.
4. **Wonder is rationed.** The extraordinary is rare on purpose — a longer passage than
   the game has trained you to expect, a reply you didn't think to look for, the world
   naming something you once did. A jolt you meet in one room in twenty is a gem; the same
   jolt in every room is wallpaper.
5. **A terminal, kindly.** It must feel like a classic command line and still be a
   pleasure on a phone.

## 3. The player experience

### 3.1 The terminal

The game presents as a single scrolling transcript in a monospace face — output above,
a prompt below. No panes, no minimaps, no health bars. State that matters is discovered
by asking (`LOOK`, `INVENTORY`, `WHEN`), exactly as in Zork.

Text arrives with a slight typewriter cadence (fast, skippable) so that the transcript
feels performed rather than dumped.

Each landing has its own **text styling**: a typographic treatment — weight, spacing,
ink — particular to the age, so that 2099 BA reads heavy and unmortared and 2099 AA reads
lettered and fine. This is presentation, not content. The narrator's voice and words are
constant (the accent is in the nouns, not the type; see the writing guide's era
inflection); only the page's texture shifts. Striding across the Gap should *look* like
the world woke up. The styling is ambient — felt more than noticed — and it is not a
reward, a discovery, or a puzzle; it is simply what an age looks like.

**Desktop:** keyboard-first. Command history on up-arrow. Tab completion for verbs and
visible nouns.

**Mobile:** the same transcript, plus a thin assist row above the keyboard offering
tappable context words — visible exits, visible nouns, recent verbs. Tapping composes
text into the prompt rather than executing directly, so the player always sees and sends
a command. The command line is the interface on every device; the assist row is
scaffolding, never a second UI.

### 3.2 The parser

A classic two-word-and-up parser (`TAKE LAMP`, `GIVE COIN TO FERRIER`, `PUT SEED IN
FURROW`) with the standard Infocom conveniences: abbreviations (`N`, `X` for examine,
`Z` for wait), `AGAIN`, `IT`, and forgiving noun matching. Parser error messages are
personality moments and are specified in the writing guide.

Two verbs are new to the genre and central to ours:

- `PAST` — step one stride toward Before.
- `FUTURE` — step one stride toward After.

They are exits, and like any exit a room either has them or hasn't (see §4.3). Where
they exist, they are listed with the others:

> There are doors to the north and west. Here, the years run both ways.

### 3.3 Multiplayer

Other Travelers are present in the world, visible in rooms, and able to talk, trade, and
cooperate. The design conviction: **the world is a shared stage; the story is a personal
script.**

- **Shared:** presence ("A Traveler called Petra is here, wringing out her hat."),
  `SAY`/emotes, item gifting, and co-operative mechanisms that genuinely need two pairs
  of hands (a two-lever gate; a rope held from above) — including hands in *different
  millennia* (see §5.4).
- **Personal:** quest state, puzzle state, and story-critical world changes are tracked
  per player. If Petra has already opened the reliquary in her story, it is still sealed
  in yours. This is what lets thousands of players share one world without strip-mining
  each other's puzzles.
- **Griefing posture:** you cannot take another player's held items, block an exit, or
  spoil a puzzle state. The worst a stranger can do is talk at you. (Mute exists.)
- **Sparseness:** Everwyn must never feel crowded. Travelers are few and the years are
  wide, so two players in the same room and the same year do not automatically meet:
  the world surfaces at most a handful of fellow Travelers at a time, chosen quietly
  (a companion you have traveled with before, a stranger whose Story brushes yours).
  Meeting someone should feel like meeting a walker on a mountain road, not entering
  a lobby.

Multiplayer is deliberately thin at launch — presence, talk, trade, co-op mechanisms.
It is a text adventure you happen to share, not a MUD with combat and levels.

### 3.4 Marks

A Traveler may leave a **mark** near loose ground — a scratch on a lintel, a stacked
cairn, a coin turned face-down (the custom is canon; see the universe bible §3). A mark
is a short line of the player's own text, left at a place-and-year.

**At launch, marks are private.** You leave them for yourself, and you find them again on
a later stride back through the same place — a note from a past self, the traveler's
melancholy made into a game verb (`MARK`, `READ MARK`). Nobody else sees them yet.
Sharing marks between Travelers is a natural later step, but it opens moderation and
griefing questions (§3.3), so it stays out of launch; private marks carry none of that
weight and need no review.

## 4. Time: the turning years

### 4.1 The rule

History pivots on the **Awakening**, the event at year 0 that no one can reach and no
one remembers (see the universe bible). Years count down toward it (*Before Awakening*,
BA) and up from it (*After Awakening*, AA).

Travelers cannot land just anywhere. They land only in the **turning years** — years
ending in 99 — and at launch the world spans **six landings**:

```
2099 BA — 1099 BA — 99 BA
                      |
                 [ the Gap ]
                      |
2099 AA — 1099 AA — 99 AA
```

`PAST` and `FUTURE` move you one stride along this chain — from 99 BA, `FUTURE` lands
you in 99 AA, and from 99 AA, `PAST` returns you to 99 BA, straight over the Gap. No
arguments, no date entry, no "jump ahead 3 days."

**Every stride is exactly one thousand years — including the one that crosses the Gap.**
The calendars claim otherwise: on paper, 99 BA to 99 AA is 198 years. The calendars are
wrong. The After-reckoning was rebuilt from ruined records by post-Awakening scholars,
and they anchored their year 1 badly — by how much, nobody can prove, because the proof
lies inside the Gap, where no Traveler can land and every document is damaged. In-world
this discrepancy is the **Lapse**, the politest scandal in scholarship, argued about
in every lettered age. Travelers themselves can testify only that every stride feels
exactly like every other.

The Awakening itself is **permanently unreachable and permanently unexplained**. That is
settled canon, not a puzzle awaiting a finale: mystery is the universe's renewable
resource, and it is ours alone (see §6).

### 4.2 Why this shape

- **Meaningful but not finicky.** A millennium is long enough that every stride lands in
  a genuinely different world — forests become kingdoms become ruins — and coarse enough
  that there is nothing to fuss over. Six landings is a number a player holds in their
  head without a chart.
- **The turning years do quiet work.** Every year a player can ever stand in ends in 99.
  Signs, gravestones and ledgers in-world quietly agree. Players notice; noticing feels
  like finding a secret. (This motif is where the project's codename came from.)
- **The Gap is a story engine.** An unreachable event that reshaped the world gives every
  contributor a shared mystery to orbit without ever being allowed to solve it — and the
  Lapse means even the *size* of the mystery is mysterious.
- **The chain can grow.** Opening a farther millennium (3099 BA, 3099 AA, …) is held in
  reserve as a possible epochal, world-wide event in the game's later life. Deliberately
  not decided now.

### 4.3 Time is an exit

Not every room supports time travel. `PAST` and `FUTURE` are **optional, per-room
directions**, authored exactly like a door: a given place may offer both, one, or
neither. A crypt might be reachable in every era but let you stride only from its
antechamber; a mountaintop might be the one spot in the realm where the far Future can
be reached at all. Where the years run, the room says so; where they don't, the parser
declines in voice ("The years hold firm here.").

Rooms may also bar a normally-open temporal exit for story reasons — a warded vault, a
storm of years — exactly the way a door can be locked. What the design forbids is
*friction as a system*: no global cooldowns, costs, or resources. For a Traveler,
walking the years is free. That is the premise.

### 4.4 Place persists, time varies

The map is a single spatial lattice threaded through the eras. A room is a *place*; each
era gives it a different face, different objects, different people — sometimes no face
at all (the tower is not built yet; the tower is rubble). Where a place doesn't exist in
an era, arriving there resolves sensibly (you stand in the meadow where the tower will
be).

This makes the signature puzzle grammar of the game nearly free to author:

- Plant an acorn in 1099 BA; climb the oak in 99 AA.
- Read the founding charter in 2099 AA to learn the word that opens the crypt in 2099 BA.
- Drop a coin down the well as a child watches in 99 BA; in 1099 AA the coin is in a
  museum case, and the placard names the child.

**Consistency posture (important, and cheap):** changes a player makes ripple forward
along *their own* story (see §3.3 — story is a personal script), so paradoxes are
designed around rather than simulated. Authors write explicit era-states and explicit
cause–effect links. There is no general physics of time. Zork did not simulate fluid
dynamics to put water in a bottle.

## 5. Content structure

### 5.1 Realms

The world divides into **realms** — contiguous geographic regions of, roughly, 30–150
places, threaded through the six eras (an author may leave eras sparse: "in 2099 BA this
whole valley is under the ice" is one sentence and perfectly good content). We author
the founding realm; contributors propose new ones at the edges of the map (§6).

### 5.2 Stories (quests)

A **Story** is a strand: a braid of scenes, characters, and puzzles, usually spanning
several eras, with a beginning and at least one ending. There is no single "winning" of
Everwyn — the game accretes Stories the way a long-running universe accretes tales.
Stories can be small (one room, one ghost, one kindness) or realm-spanning epics.

Stories declare their dependencies (places, items, canon facts) and may *reference* other
Stories' outcomes, which is how seemingly distant stories come to connect — the
Marvel/Tolkien pleasure of recognizing a name from another tale a thousand years away.

### 5.3 The compass of endings

Multiple Stories means multiple endings, and endings need weight. Completing a Story is
commemorated in the world itself where possible — an epitaph gains a line, a song gains a
verse in a later era — visible to that player in their story, and recorded on their
Traveler's record (`STORIES` lists tales begun, abandoned, and finished).

### 5.4 Cross-time cooperation

The multiplayer flourish unique to Everwyn: two players in the *same place, different
eras* cooperating. One player holds the sluice open in 2099 BA; the streambed is dry for
her partner in 1099 AA, four strides of time downstream, for as long as she holds it. Used sparingly, in authored moments — never required
for a Story's only ending (a lone player must always have a path).

## 6. Extensibility and creative control

### 6.1 The line

**Anyone may build in the universe. Only we may build the universe.**

- **We own:** the universe bible; the Awakening and the Gap; the nature and rules of the
  Travelers; the timeline's fixed points; the writing guide; the name of the world.
- **Contributors own (subject to review):** realms, places, era-states, items, NPCs,
  Stories.

### 6.2 Canon tiers

1. **Core canon** — the universe bible and everything it fixes. Written only by us.
   Precedent: every long-lived universe (Tolkien's legendarium, D&D's cosmology, Marvel
   continuity) has a small custodial center that keeps a large collaborative edge
   coherent.
2. **Canon content** — contributed work that has passed review. It is *in* the world:
   on the shared map, reachable by every player, citable by later Stories.
3. **The Apocrypha** — a labeled proving ground (reached through a door in-fiction —
   a fair, a dream, a disreputable annex of the map) where new work can be played and
   critiqued before it is canon, without contaminating the world if it never gets there.

### 6.3 Review

Contributions are data (places, Stories, items, era-states) and are reviewed like pull
requests against three published gates:

1. **Universe gate** — consistent with the bible; no new metaphysics; nothing about the
   Awakening beyond licensed mystery.
2. **Writing gate** — passes the writing guide.
3. **Craft gate** — puzzles fair, Stories completable, era-states of each place coherent
   with their neighbors in time.

We hold final cut, always. As the community matures, trusted contributors can be
deputized to review the second and third gates; the universe gate stays with us.

## 7. Naming and technology notes

- **Everwyn** is the name of the world and of the game, and *the Lapse*, *the Turning
  House*, *Stories*, and *the Apocrypha* were approved in review. Other proper nouns used
  here — *the Awakening*, *the Gap*, *Travelers* — remain proposals; the universe bible
  brackets the ones still open to change.
- Technology is out of scope for this document by design. The only constraints the
  design imposes on any future implementation: browser-based; a real shared world with
  per-player story state; content (places, Stories) as reviewable declarative data;
  playable on a phone without ceasing to be a terminal.

## 8. Decision log and open questions

Settled in review (2026-08-17 – 2026-08-20, @jake):

1. **Name.** *Everwyn* — the name of the world and of the game. *99* is retired to
   codename; the turning-years motif stays in the world.
2. **Launch span.** Six landings, 2099 BA – 2099 AA. Widening the chain is deferred,
   held as a possible future epochal event.
3. **The Awakening.** Permanently unreachable, permanently unexplained. Settled canon.
4. **Temporal verbs.** `PAST` / `FUTURE`, no aliases.
5. **Time travel is per-room.** `PAST`/`FUTURE` are optional directions a room may or
   may not have, like any exit.
6. **Multiplayer launch scope.** Presence, talk, trade, co-op mechanisms; no PvP, no
   combat, no economy.
7. **The Gap arithmetic — the Lapse** (§4.1). Every stride is a millennium, the Gap
   included; the calendars that say otherwise are wrong, and the proof is out of reach.

8. **Illuminations are cut.** The visual "Illumination" system (glyph-grid pictures,
   hotspots, the Foundry tileset) is dropped. The spike showed it added no purpose a
   command couldn't and could not reach the quality bar. The wonder budget stays in text
   and consequence, where the game is strongest.
9. **Era text styling** (§3.1). Each landing gets a distinct typographic treatment.
   Presentation only, unrelated to discovery; the narrator's voice stays constant.
10. **Private marks** (§3.4). Travelers may leave short marks for their own later return.
    Self-only at launch; sharing between players is deferred.
11. **Naming.** *Threads* is renamed *Stories* throughout. *Stories* and *the Apocrypha*
    are approved proper nouns (§7).

Open:

1. **Provisional proper nouns.** *The Awakening*, *the Gap*, *Travelers* — standing
   unless vetoed. (*Turning House*, *Stories*, and *the Apocrypha* were approved in
   review.)
