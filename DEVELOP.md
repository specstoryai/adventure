# Developing Everwyn

Start with the design so your work fits the world and its style: [`design/DESIGN.md`](design/DESIGN.md), [`design/UNIVERSE.md`](design/UNIVERSE.md), and [`design/WRITING-GUIDE.md`](design/WRITING-GUIDE.md).

1. **Read the design.** The writing guide is law for all game text.
2. **Pick up an issue.** Track work in Linear and branch off `main` for each change.
3. **Open a PR.** Keep changes focused and reference the issue; a maintainer reviews before merge.

## The code

A minimum playable slice lives under [`src/`](src/): a small world of rooms — each a place in one era — played at the command line. The eventual game is browser-based (see the design), but the shape here is deliberately portable — the engine takes a string and returns text, with no I/O of its own.

```
src/
  types.ts               shapes for rooms, items, eras, and the world (content is data)
  content/               the world, authored as declarative data
    index.ts             the assembled world: every room, every landing (oldest first)
    turning-house.ts     one room per file
  world.ts               world helpers: lookup, time strides, validation, reachability
  parser.ts              two-word-and-up parser with Infocom conveniences
  engine.ts              the game: turns typed lines into replies
  cli.ts                 the terminal front end (readline + typewriter)
scripts/
  eval-reach.ts          can every room be reached from the start? (npm run eval:reach)
  play.ts                scripted playthrough for evaluators and tests
test/                    parser, engine, and world tests
design/stories/          per-story outlines and logs written by the story factory
```

Rooms move by spatial `exits` and by time: `PAST`/`FUTURE` step to the same place at the adjacent landing when the room opens that way. The engine validates the world at startup. Agents working here start at [`AGENTS.md`](AGENTS.md); the autonomous story loop is described in [`ADVENTURE_FACTORY.md`](ADVENTURE_FACTORY.md).

**Stack:** TypeScript, run directly on Node (v22.6+; v24 recommended) with no build step — Node strips the types. The only dependencies are dev-only (`typescript`, `@types/node`) for typechecking.

### Run and test

```sh
npm install        # dev-only deps, for typecheck
npm run play       # play in your terminal
npm test           # run the test suite
npm run typecheck  # tsc --noEmit
npm run eval:reach # reachability report; exit 1 if any room can't be reached
node scripts/play.ts FUTURE DOWN   # play a command sequence, see where you land
```

Set `EVERWYN_NO_TYPEWRITER=1` to disable the typewriter cadence (also off automatically when output is piped). `EVERWYN_TYPE_MS` tunes its speed.
