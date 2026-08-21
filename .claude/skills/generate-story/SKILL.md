---
name: generate-story
description: Write an Everwyn story as game content — phase "outline" turns a story into design/stories/<slug>/OUTLINE.md, phase "detail" writes every room in the outline as data under src/content/, one room at a time, committing as it goes. Use when working a "Generate" sub-issue of a Game Story.
---

# Generate a story

Your sub-issue description says which phase you are in: **outline** or **detail**. In
both phases: `AGENTS.md` is binding, the writing guide is law, and you never stop before
the goal or the limit.

## Before either phase

Read, in this order: `design/WRITING-GUIDE.md`, `design/UNIVERSE.md`, the relevant parts
of `design/DESIGN.md` (at least §3 and §4.4), `AGENTS.md`, and `src/content/turning-house.ts`
as the model of a finished room. Run `npm install` if `node_modules` is missing.

## Phase: outline

Input: the story text in your sub-issue description and `max_rooms`.

1. Write `design/stories/<slug>/OUTLINE.md` in the format from
   `design/stories/README.md`:
   - `## Story` — carry the planner's text over faithfully, then **expand** it: the arc
     (open, turn, resolve), what the player is trying to do and why, the beats in order,
     which places and eras the story touches and what each is for, the items, NPCs, and
     ideas that carry across rooms, the tone notes. A later generator must be able to
     write every room from this section alone.
   - `## Rooms` — one line per room, at most `max_rooms`: `- [ ] <place> · <landing>
     (<age>) — <one phrase of purpose>`. Landings are engine landings (`2099 BA`,
     `2099 AA`), never calendar years; ages are the age's name. A room is one place in
     one era; the same place in two eras is two lines.
   - `## Through-lines` — what spans rooms: traveling items, puzzles in pieces, PAST/FUTURE
     pairs that must line up, with the rooms involved.
   - `## Blockers` — leave empty.
2. Do **not** write any `src/content` in this phase.
3. Commit, push, open a PR against the story branch named in your issue. Your final
   response lists the room count and the verification commands
   (`npm run typecheck && npm test`, and "read OUTLINE.md").

## Phase: detail

Input: `design/stories/<slug>/OUTLINE.md` on the story branch. It is the source; do not
consult the Linear story issue. Work the `## Rooms` list **top to bottom, one room per
cycle**:

1. Re-read `## Story`, `## Through-lines`, and the as-built notes of the rooms around this one.
   Re-read the design-doc passages relevant to this room.
2. Write the room as data in its own file `src/content/<place>-<landing-slug>.ts`
   exporting a `Room` (`src/types.ts`):
   - `id: "<place>:<landing-slug>"`, `place`, `title`, `landing`, `age`, `look`,
     optional `lookAgain`, `items`, `scenery`, `time: { past, future }`, `exits`.
   - `exits` reference other rooms' ids. An exit to a room not yet written is fine if
     that room is in the outline — it will exist before evaluation. Make exits two-way
     unless the story wants a one-way passage.
   - Time: set `time.past`/`time.future` open only where the outline has the same place
     in the adjacent era (see `World.landings` ordering in `src/content/index.ts`).
   - Item ids are unique across the whole world.
3. Register it in `src/content/index.ts`: add to `rooms`; if the landing is new, add it to
   `landings` in chronological order (oldest first).
4. `npm run typecheck && npm test`. Fix until green.
5. **Commit** (one room per commit).
6. **Update the outline**: tick the room and add an indented `as built:` line under it —
   the exits and time exits it actually has, the items/scenery that matter, what it sets
   up or pays off, any deviation from the plan and why. Update `## Through-lines` if this room
   added, moved, or resolved one. Commit.
7. Next room.

If a room seems blocked — unclear design, a mechanic the engine lacks — go back to
`design/UNIVERSE.md` and write the room as well as it can be written from its
principles. Only if a genuine gap remains, add one line under `## Blockers` naming the
room and the gap, and continue. A blocker is a last resort, never a first response.

When every room is ticked: run `npm run eval:reach` yourself and fix any unreachable room
you can (you are allowed to — the evaluator's verdict is the official one, but there is no
reason to hand it an obvious gap). Then push and open a PR against the story branch. Your
final response lists the rooms written, the harness result, and the verification
commands: `npm run typecheck && npm test && npm run eval:reach`, plus one
`node scripts/play.ts …` route per room.

## Your final response, every time (both phases, fix rounds, revisions)

End with an **`## Acceptance criteria`** block that repeats every criterion from your
sub-issue description and marks it `✓` or `✗` with one line of evidence each (the command
you ran and its result, or the file/commit). The orchestrator re-verifies and ticks the
boxes on the sub-issue from this block — it cannot tick what you did not report. Then the
verification commands.

## Fix rounds and revisions

If you receive an evaluator report (verdict FAIL) as feedback: for every failure, make the
room reachable as the report suggests (or a better way that honors the outline), re-run
`npm run eval:reach` until it passes, add an as-built note describing the fix, commit,
push. If you receive **human review comments** (a revision): make exactly the requested
changes in the writing-guide voice, keep exits/ids/time flags untouched unless the comment
asks, add an as-built note, commit, push. Either way your final response repeats the
verification commands and the `## Acceptance criteria` block.

## Never

- Never stop with rooms unwritten while turns remain. Running out of turns is fine —
  every committed room survives and a continuation session picks up at the first
  unchecked room.
- Never write outside `src/content/`, `src/content/index.ts`, and
  `design/stories/<slug>/`. Engine changes are not yours to make; if the engine truly
  cannot express a room, that is a blocker.
- Never open the PR against `main`.
