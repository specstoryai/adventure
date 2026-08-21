---
name: generate-story
description: Generate an Everwyn story's rooms — write every room in design/stories/<slug>/OUTLINE.md as game data under src/content/, one room at a time, committing and annotating the outline as you go; also handles evaluator fix rounds and human-review revisions. Use when working a "Generate" sub-issue of a Game Story.
---

# Generate a story's rooms

You are the **generator**: the outline is your source and the design docs are your law.
`AGENTS.md` is binding. You never stop before the goal (every room in the outline) or the
limit.

## Before you start

Read, in this order: `design/WRITING-GUIDE.md`, `design/UNIVERSE.md`, the relevant parts
of `design/DESIGN.md` (at least §3 and §4.4), `AGENTS.md`, and `src/content/turning-house.ts`
as the model of a finished room. Run `npm install` if `node_modules` is missing.

## Input

`design/stories/<slug>/OUTLINE.md` on the story branch. It is the source; do not consult
the Linear story issue.

## One room per cycle, top to bottom

1. Re-read `## Story`, `## Through-lines`, and the as-built notes of the rooms around this
   one. Re-read the design-doc passages relevant to this room.
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
   up or pays off, any deviation from the plan and why. Update `## Through-lines` if this
   room added, moved, or resolved one. Commit.
7. Next room.

If a room seems blocked — unclear design, a mechanic the engine lacks — go back to
`design/UNIVERSE.md` and write the room as well as it can be written from its
principles. Only if a genuine gap remains, add one line under `## Blockers` naming the
room and the gap, and continue. A blocker is a last resort, never a first response.

When every room is ticked: run `npm run eval:reach` yourself and fix any unreachable room
you can (the evaluator's verdict is the official one, but there is no reason to hand it an
obvious gap). Then push and open a PR against the story branch.

## Your final response, every time (first pass, continuations, fix rounds, revisions)

List the rooms written and the harness result, then an **`## Acceptance criteria`** block
that repeats every criterion from your sub-issue and marks it `✓`/`✗` with one line of
evidence (the command you ran and its result, or the file/commit) — the orchestrator
re-verifies and ticks the boxes from this block; it cannot tick what you did not report —
then the verification commands: `npm run typecheck && npm test && npm run eval:reach`,
plus one `node scripts/play.ts …` route per room.

## Fix rounds and revisions

- **Evaluator report (verdict FAIL) as feedback:** for every failure, make the room
  reachable as the report suggests (or a better way that honors the outline), re-run
  `npm run eval:reach` until it passes, add an as-built note describing the fix, commit,
  push.
- **Human review comments (a revision):** make exactly the requested changes in the
  writing-guide voice; keep exits, ids, and time flags untouched unless the comment asks;
  add an as-built note; commit; push.

Either way, repeat the final-response format.

## Never

- Never stop with rooms unwritten while turns remain. Running out of turns is fine —
  every committed room survives and a continuation session picks up at the first
  unchecked room.
- Never write outside `src/content/`, `src/content/index.ts`, and
  `design/stories/<slug>/`. Engine changes are not yours to make; if the engine truly
  cannot express a room, that is a blocker.
- Never open the PR against `main`.
