# Working in this repo as an agent

Everwyn is a text adventure in deep time. The design is law; the code is data plus a
small engine. Read this whole file before doing anything.

## Read first

1. `design/WRITING-GUIDE.md` — the voice. Every line of game text answers to it.
2. `design/UNIVERSE.md` — the single source of creative truth. When something seems
   unclear or blocked, go here first and work from its core principles.
3. `design/DESIGN.md` — how the game works, including §4.4 *Place persists, time varies*.
4. `DEVELOP.md` — code layout and commands.
5. `ADVENTURE_FACTORY.md` — if you were spawned by the story factory (your issue has a
   `Game Story`, `Plan`, `Generate`, or `Evaluate` label), this is your process. The matching
   skill in `.claude/skills/` is your playbook: `orchestrate-story`, `generate-story`,
   `evaluate-story`.

## Vocabulary

- A **place** persists across eras. An **era** is labeled by its **landing** (`2099 BA`)
  and named by its **age** (`the High Masonry`). A **room** is one place in one era —
  the `Room` type in `src/types.ts`. Never say "room+time".
- Room ids are `<place>:<landing-slug>` (e.g. `turning-house:2099-aa`). The one
  pre-existing room keeps its legacy id `turning-house`.

## The code, briefly

- Content is declarative data: one `Room` per file under `src/content/`, registered in
  `src/content/index.ts` (`rooms`, and `landings` oldest-first). The engine validates the
  world at startup; an invalid world throws.
- Movement: spatial `exits` (direction → room id) and time strides (`PAST`/`FUTURE`
  move to the same place at the adjacent landing when `time.past`/`time.future` is open).
- Commands: `npm run typecheck`, `npm test`, `npm run eval:reach` (every room reachable?),
  `node scripts/play.ts <COMMANDS…>` (scripted playthrough), `npm run play`.

## Non-negotiables

- **Design docs first.** Re-read the relevant sections before writing any room.
- **The writing guide is law** for all game text. Terse, dry, second person.
- **Commit after every room.** Small commits, one room each; a cut-off session must lose
  nothing.
- **Never stop before the goal or the limit.** If a room seems blocked, go back to
  `design/UNIVERSE.md` and write it as well as it can be written from first principles.
  Only if a genuine gap remains, record the blocker in the story's `OUTLINE.md` and
  continue. A blocker is a last resort, never a first response.
- **The outline is the source.** When working a story, `design/stories/<slug>/OUTLINE.md`
  carries the whole story; read it, and improve it as you go (as-built notes, through-lines).
  Do not go back to the Linear issue for story content.
- **PR against the story branch,** not `main`, when you are a child of a story issue. The
  orchestrator owns the story branch and is the only one who opens a PR to `main`.
- **Evaluators never fix.** An `Evaluate` session reports; it does not edit content or
  commit. The report format is in `ADVENTURE_FACTORY.md` §8.
- **Verification instructions in your final response.** When you finish a sub-issue,
  state the exact commands to verify your work (`npm run typecheck`, `npm test`,
  `npm run eval:reach`, `node scripts/play.ts …`) and what their output should be.
