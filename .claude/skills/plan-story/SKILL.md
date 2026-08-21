---
name: plan-story
description: Plan an Everwyn story — turn the author's story into design/stories/<slug>/OUTLINE.md, the story's working bible (expanded story, room plan within max_rooms, through-lines). Use when working a "Plan" sub-issue of a Game Story. Writes no game content.
---

# Plan a story

You are the **planner**: you turn the author's story into the outline the generator will
build from. `AGENTS.md` is binding; the writing guide is law for every line of prose you
write; you do not write any `src/content`.

## Before you start

Read, in this order: `design/WRITING-GUIDE.md`, `design/UNIVERSE.md`, the relevant parts
of `design/DESIGN.md` (at least §3 and §4.4), `AGENTS.md`, and `src/content/turning-house.ts`
as the model of a finished room (so your plan asks for things the engine can express).
Run `npm install` if `node_modules` is missing.

## Input

The author's story text in your sub-issue description, and `max_rooms`.

## Output: `design/stories/<slug>/OUTLINE.md`

Use the format in `design/stories/README.md`:

- `## Story` — carry the author's text over faithfully, then **expand** it: the arc
  (open, turn, resolve), what the player is trying to do and why, the beats in order,
  which places and eras the story touches and what each is for, the items, NPCs, and
  ideas that carry across rooms, the tone notes. The generator must be able to write
  every room from this section alone, without ever seeing the Linear issue.
- `## Rooms` — one line per room, at most `max_rooms`:
  `- [ ] <place> · <landing> (<age>) — <one phrase of purpose>`. Landings are engine
  landings (`2099 BA`, `2099 AA`), never calendar years; ages are the age's name. A room
  is one place in one era; the same place in two eras is two lines. Keep the lines to one
  line each — no per-room design-doc justification; grounding happens when the generator
  writes each room.
- `## Through-lines` — what spans rooms: traveling items, puzzles in pieces, PAST/FUTURE
  pairs that must line up, with the rooms involved.
- `## Blockers` — leave empty.

Plan for the engine as it is: rooms connect by spatial exits and by time strides between
faces of the same place at **adjacent** landings (`World.landings`, oldest first). If the
story wants to reach a far era, plan the intermediate faces or a spatial route.

## Finish

Commit, push, open a PR against the story branch named in your issue. Your final response
lists the room count and ends with an **`## Acceptance criteria`** block that repeats
every criterion from your sub-issue and marks it `✓`/`✗` with one line of evidence, then
the verification commands (`npm run typecheck && npm test`, and "read OUTLINE.md").

## If the orchestrator sends the plan back

Fix exactly what it names (too many rooms, a missing field, a Story section that still
needs the issue), commit, push, and repeat the final-response format.

## Never

- Never write `src/content`. Never exceed `max_rooms`. Never open the PR against `main`.
