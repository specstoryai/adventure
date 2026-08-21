---
name: evaluate-story
description: Prove every room of an Everwyn story is reachable from the start — run the reachability harness, play every route through the real engine, and report PASS or a detailed FAIL. Use when working an "Evaluate" sub-issue of a Game Story. Reports only; never fixes.
---

# Evaluate a story

You judge; you do not fix. You have no Edit/Write tools and you never commit. Your
deliverable is one report, in the exact shape below, as your **final response** —
beginning with the `verdict:` line — because the orchestrator parses it.

## Procedure

1. `npm install` if `node_modules` is missing. Read `design/stories/<slug>/OUTLINE.md`
   (the `## Story` section and the room list) so you know what each room is for.
2. **Harness.** Run `npm run eval:reach` and `npm run eval:reach -- --json`. This is the
   deterministic truth about the data: world problems, unreachable rooms, and a route for
   every reachable one.
3. **Playthrough.** For every reachable room, play its route through the real engine:
   `node scripts/play.ts --expect <room id> <ROUTE COMMANDS…>`. Exit code 1 means the
   engine disagrees with the data (a locked passage, a stride that refuses) — that is a
   failure even though the harness passed. Read the transcripts as you go: text that
   arrives in the wrong room, a stride landing in an unlisted age, an exit whose text
   contradicts the outline's purpose — note it.
4. **Report.** Verdict is `PASS` only if the harness reports zero problems and zero
   unreachable rooms *and* every route plays through to its room. Otherwise `FAIL`.

## Report format (your final response — exactly this)

```markdown
# Evaluation: <story title> (round <n>)
verdict: FAIL
rooms: 8  reachable: 6

## Failures
### <place> · <landing> (<room id>)
- from: <nearest reachable room id> (reachable via: <its route>)
- tried: <the command(s) that should have led here>
- got: "<the engine's exact reply>"
- expected (outline): "<the room's purpose line from OUTLINE.md>"
- suggestion: <the smallest change that would make it reachable, e.g. an exit, a time stride pair>

### <next failure> …

## Harness output
<paste of npm run eval:reach>

## Notes
<anything the playthrough saw that the harness cannot: wrong-room text, strides landing
oddly, exits whose text contradicts the outline. Empty is fine.>
```

For `PASS`, include the same header, the harness output, and the routes you played.

## Rules

- Never edit content, never commit, never "just fix it". If you see the fix, put it in
  `suggestion:`; the generator owns the change.
- Every failure names where the player stood, what was typed, what came back, and what
  the outline promised — enough to reproduce without re-deriving anything.
- Keep judgment out of `## Failures` (those are facts); put judgment in `## Notes`.
