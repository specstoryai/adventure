# Developing Everwyn

Start with the design so your work fits the world and its style: [`design/DESIGN.md`](design/DESIGN.md), [`design/UNIVERSE.md`](design/UNIVERSE.md), and [`design/WRITING-GUIDE.md`](design/WRITING-GUIDE.md).

1. **Read the design.** The writing guide is law for all game text.
2. **Pick up an issue.** Track work in Linear and branch off `main` for each change.
3. **Open a PR.** Keep changes focused and reference the issue; a maintainer reviews before merge.

## The code

A minimum playable slice lives under [`src/`](src/): one place (the Turning House) in one era, played at the command line. The eventual game is browser-based (see the design), but the shape here is deliberately portable — the engine takes a string and returns text, with no I/O of its own.

```
src/
  types.ts               shapes for places, items, eras (content is data)
  content/               the world, authored as declarative data
    turning-house.ts
  parser.ts              two-word-and-up parser with Infocom conveniences
  engine.ts              the game: turns typed lines into replies
  cli.ts                 the terminal front end (readline + typewriter)
test/                    parser and engine tests
```

**Stack:** TypeScript, run directly on Node (v22.6+; v24 recommended) with no build step — Node strips the types. The only dependencies are dev-only (`typescript`, `@types/node`) for typechecking.

### Run and test

```sh
npm install        # dev-only deps, for typecheck
npm run play       # play in your terminal
npm test           # run the test suite
npm run typecheck  # tsc --noEmit
```

Set `EVERWYN_NO_TYPEWRITER=1` to disable the typewriter cadence (also off automatically when output is piped). `EVERWYN_TYPE_MS` tunes its speed.
