# Everwyn — The Adventure Factory

*An autonomous plan → generate → evaluate loop that turns a story idea into playable
rooms, run by Linear and CyLocal (a self-hosted Cyrus agent).*

> Status: **v1 implemented (branch `factory`), awaiting its first live story.** The
> engine gained multi-room worlds (spatial exits, time strides, validation, reachability);
> the skills, `AGENTS.md`, harness, and setup script are in the repo; CyLocal's label
> prompts are configured. Open questions are collected in §13.

Companion documents:

- [design/DESIGN.md](./design/DESIGN.md), [design/UNIVERSE.md](./design/UNIVERSE.md),
  [design/WRITING-GUIDE.md](./design/WRITING-GUIDE.md) — the creative canon every
  generated room must obey.
- [DEVELOP.md](./DEVELOP.md) — how the code is laid out and run.

---

## 1. Goal

Jake writes a story. Agents turn it into rooms. Another agent proves the rooms are
playable. If they aren't, the failure goes back to the generator with enough detail to
fix it — without a human in the loop — until the story is done or a limit is hit.

The first version is deliberately the **simplest loop that closes**: one story at a
time, one room at a time, no fan-out, one evaluator with one question ("can a player
reach every room?"). Everything else is a later issue.

Vocabulary, taken from the design (DESIGN.md §4.4) and the code (`src/types.ts`):

- A **place** persists across eras — one node in the spatial lattice.
- An **era** gives a place a face. An era is labeled by its **landing** (e.g. `2099 BA`)
  and named by its **age** (e.g. `the High Masonry`).
- A **room** is a place *in one era* — "one face of it", the `Room` type. Rooms are
  reached by walking (spatial exits) or by time travel (`Room.time` exits,
  `PAST`/`FUTURE`).

A story is a connected set of rooms.

## 2. The loop at a glance

```
 Jake                   CyLocal orchestrator               child sessions (CyLocal)
 ────                   ────────────────────               ────────────────────────
 "Game Story" issue ──► session on story issue
 (label + delegate)     branch: the story branch
                        │
                        ├─ sub-issue "Outline" ──────────► GENERATE · outline
                        │                                   expanded story + room plan, ≤ max_rooms
                        │ ◄── child completes → parent auto-resumed with result
                        ├─ check: count ≤ limit, fits premise
                        │
                        ├─ sub-issue "Rooms" ────────────► GENERATE · detail
                        │                                   one room at a time, commit each,
                        │                                   design docs open the whole time
                        │ ◄── auto-resumed
                        │
                        ├─ sub-issue "Evaluate" ─────────► EVALUATE (read-only tools)
                        │                                   reachability harness + playthrough
                        │ ◄── auto-resumed with PASS / FAIL report
                        │
                        ├─ FAIL → "Rooms (round N)" with the report as input  (cap: 3)
                        └─ PASS → PR story branch → main, issue → In Review
```

Every box on the right is an ordinary CyLocal session with its own git worktree. Cyrus
resumes the parent session automatically when a child completes, so the orchestrator
never polls in the happy path.

## 3. Roles

| Role | Who | Tools | Responsibility |
|---|---|---|---|
| **Planner** | Jake | Linear | Write the story issue. That's the whole job. |
| **Orchestrator** | CyLocal session on the story issue | `coordinator` preset (everything except Edit/Write) | Decompose, spawn children, check limits, route failures back, open the final PR. Log every step and every decision with its reason (§5.8). Cannot author content by construction. |
| **Generator (outline)** | CyLocal child session | full | Expand the story into the outline and plan the rooms — each place in each era the story touches. |
| **Generator (detail)** | CyLocal child session | full | Write each room as game data, one at a time, committing as it goes. |
| **Evaluator** | CyLocal child session | `safe`/read-only preset | Prove every room is reachable. Report, never fix. |
| **Gardener** | a scheduled job outside Cyrus (§10) | Linear API/MCP | Notice stuck work and nudge, cancel, or escalate. |

## 4. The Linear model

**Project:** `adventure`. Routing to the `jakelevirne/adventure` repo is automatic via
Cyrus's project rule; no repository prompt.

**Labels** (each selects a Cyrus prompt + tool preset, see §11):

- `Game Story` — the parent issue. Orchestrator.
- `Generate` — generator sub-issues. Builder prompt, full tools.
- `Evaluate` — evaluator sub-issues. Read-only tools.

**The story issue** (created from a "Game Story" template):

```
<story premise — a few paragraphs, tone notes, anything Jake wants honored>

---
factory:
  max_rooms: 8        # hard cap on rooms (places × eras) for this story
  max_rounds: 3       # generate↔evaluate cycles before escalating to a human
  round: 0            # maintained by the orchestrator
```

The `factory:` block is structured on purpose: the orchestrator and the gardener parse it
rather than interpret prose. `round` lives in the issue, not in any session, so the cap
survives restarts.

**Sub-issues** are children of the story issue (so their branches stack on the story
branch, §6) and carry a label. The story issue is marked **blocked-by** whichever
sub-issue is active, which lets Cyrus park and wake the parent on state change as a
second path besides session completion (§10).

**Comments** on a session's thread are how anyone — Jake, the gardener — re-prompts a
session; Cyrus resumes it, durably, even after a restart.

## 5. The flow, step by step

### 5.1 Plan (Jake)

Create the story issue from the template, label `Game Story`, delegate to CyLocal. Done.

### 5.2 Orchestrate — start

CyLocal routes to `adventure`, creates a worktree on the story branch, and starts the
orchestrator session. It:

1. Reads the story and the `factory:` block.
2. Reads the three design docs once, for its own judgment later.
3. Pushes the story branch (children branch from it; Cyrus's orchestrator prompt already
   requires this before the first spawn).
4. Creates sub-issue **"Outline: <story>"** (label `Generate`), marks the story
   blocked-by it, spawns a child session on it, schedules a deadline wakeup (§10), and
   ends its turn.

### 5.3 Generate — outline

The outline child reads the story and the design docs, and writes
`design/stories/<slug>/OUTLINE.md`. The outline is the story's **working bible**: it
must contain and expand the original story so that every later generator can work from
the outline alone and never has to go back to the Linear issue.

```markdown
# <Story title>

max_rooms: 8

## Story
<The original issue text, carried over faithfully — then expanded: the arc (how it
opens, turns, and resolves), what the player is trying to do and why, the key beats
in order, which places and eras the story touches and what each is for, the items,
NPCs, and ideas that carry across rooms, and the tone notes from the issue. Written
so that nothing in the issue is needed to author a room.>

## Rooms
- [ ] turning-house · 2099 BA (the High Masonry) — where the letter is found
- [ ] turning-house · 2099 AA — the same place, a later face — the letter's reply
- [ ] mill-race · 2099 BA — the only way down to the water
...

## Threads
<Things that span rooms: an item that travels, a puzzle with pieces in several
places, a PAST/FUTURE pair that must line up. One line each, updated as rooms land.>

## Blockers
<Empty at first. Filled only as a last resort — see §5.5.>
```

The `## Story` section is the expansion; the room lines stay one line each — the place's
stable id, the landing (and age name where it helps), and a phrase of story purpose —
and do not justify themselves against the design docs. That grounding happens when each
room is written (§5.5), and compliance is a later evaluator's job (§13). Landings and age
names use the engine's own vocabulary (`Room.landing`, `Room.age`), never calendar years.

The outline child commits, opens a PR against the story branch, and completes. Cyrus
resumes the orchestrator with the result.

### 5.4 Orchestrate — check the outline

Cheap, mechanical: count ≤ `max_rooms`; every entry has an id, a landing, and a
purpose; the `## Story` section carries everything the issue said and reads as one
story — a generator could work from it without the issue. If it fails, re-spawn the outline child with the reason (this
counts as a round). If it passes, merge the PR into the story branch, create sub-issue
**"Rooms: <story>"** (label `Generate`), swap the blocked-by, spawn, set deadline, end
turn.

### 5.5 Generate — detail

The detail child works the outline **top to bottom, one room per cycle**:

1. Read the outline — `## Story`, `## Threads`, and the neighbors' as-built notes — and
   the relevant design docs for this room (writing guide is law for all text). The
   outline is the source; the Linear issue is not consulted.
2. Write the room as game data under `src/content/` following the existing shape
   (`Room`: title, landing, age, look, items, scenery, time exits; spatial exits as the
   engine expects).
3. Typecheck and run the tests.
4. **Commit.** Then **update the outline**, not just the checkbox: tick the room and add
   an *as-built* line under it — the exits and time exits it actually has, the items and
   scenery that matter, what it sets up or pays off, and any deviation from the plan and
   why. Update `## Threads` if this room added, moved, or resolved one. Commit that too.
   The outline gets clearer with every room, so each later generator — including the
   next fix round — inherits what was actually built, not just what was planned.

Non-negotiables, also stated in the repo's `AGENTS.md` so every session sees them:

- Never stop before the goal (all outline entries) or the limit. If a room seems blocked
  (unclear design, missing mechanic), go back to `design/UNIVERSE.md` — the single source
  of creative truth — and work from its core principles to write the room as well as it
  can be written. Only then, if a genuine gap remains, record the blocker in the outline
  line and continue to the next room. A blocker is a last resort, never a first response.
- Commit after every room. A session that hits its turn ceiling loses nothing; the
  orchestrator spawns **"Rooms (continued)"** pointing at the next unchecked entry.

When every entry is ticked and annotated it opens a PR against the story branch and
completes. Fix rounds (§5.7) follow the same procedure and leave the same kind of
as-built notes, so the outline also records how each failure was resolved.

### 5.6 Evaluate

The orchestrator merges, creates **"Evaluate: <story>"** (label `Evaluate`), spawns. The
evaluator has read-only tools: it cannot change content, by construction. Two layers:

1. **Reachability harness** — `npm run eval:reach` (a checked-in script, §7): loads the
   content, walks every spatial and time exit from the start room, and lists every
   room it cannot reach plus the last reachable room before each gap.
2. **Playthrough** — the engine is a pure string-in/text-out function, so the evaluator
   plays: for each room it issues the harness's route as commands and checks the text
   actually arrives there (catches "reachable on paper but a locked door with no key").

It ends with a structured report (§8) as its final response and completes. Cyrus hands
that report to the orchestrator on resume.

### 5.7 Close the loop

- **FAIL:** increment `round` in the story issue. If `round ≥ max_rounds`, stop: write a
  final log entry beginning `NEEDS HUMAN: rounds exhausted` with the last report, move the
  story to In Review (the team has no dedicated needs-human state; In Review without a PR
  to `main` plus that marker is the signal), done. Else
  hand the full report back to the Rooms generator — preferably by re-prompting its
  existing session (`linear_agent_give_feedback`, which keeps its worktree and context),
  or, if that session is gone, by creating **"Rooms (round N): <one-line summary>"** with
  the report in the description — and go to §5.5. Either way the generator now has exact
  repros.
- **PASS:** open the PR story branch → `main`, move the story issue to In Review, post a
  summary. Jake reviews a whole, evaluated story; `main` never sees a half-made one.

### 5.8 The orchestration log

The orchestrator is the only agent that makes decisions, so it keeps the only log that
matters. The rule: **every orchestrator turn ends with a log entry, and every decision is
written with its reason.** The same entry goes to two places:

1. **The session itself.** Each turn's final `response` *is* the log entry. Cyrus posts
   it natively; it shows top-level in the story issue's agent panel and Activity feed.
   Zero extra tooling.
2. **A Linear document, "Orchestration log — <story>", linked to the story issue.**
   Created on the first turn, appended on every turn via the Linear MCP. The whole
   history in one scroll, one click from the issue — no digging through session panels.
   (Cyrus's orchestrator prompt forbids commenting on its own issue; an append-only
   document is the right home for a record anyway.)

It is also mirrored to `design/stories/<slug>/LOG.md` on the story branch, so the log
ships inside the PR and the gardener — or any agent — can read it without Linear access.

Entry shape:

```markdown
## <UTC time> · step <n> · <event>
- event:    child "Rooms" completed (SPE-63) | outline check | deadline wakeup | …
- saw:      <1–3 lines: child result summary, evaluator verdict, harness totals>
- decision: <what it chose>
- reason:   <why — which rule, which limit, which evidence; "per §5.4" for mechanical steps>
- action:   <what it did — sub-issue SPE-64 created (Generate) · blocked-by moved ·
             PR #12 merged · round 1→2 · deadline set 20m>
- next:     <what it is waiting for, and by when>
```

What is always logged: start and the parsed `factory:` block; every spawn (sub-issue,
label, why); outline accept/reject with counts; every merge; every evaluator verdict with
failure count; every round increment; every continuation; every deadline that fires and
what was found; every escalation; the final PASS/PR or stop. Wherever a real choice
existed — accept vs reject, wait vs act, continue vs escalate — the `reason` line is
mandatory, not optional.

## 6. Branches and PRs

- Story issue → story branch, cut from `main` (Linear's branch name for the issue).
- Sub-issues branch **from the story branch** (Cyrus's base-branch rule for sub-issues),
  so all generation stacks onto one integration branch the orchestrator owns.
- Children open PRs **against the story branch**; the orchestrator merges them. The
  orchestrator's instructions must say this explicitly — Cyrus's git phase defaults
  toward the repo's base branch (§13).
- Only the orchestrator opens a PR to `main`, and only after PASS.

## 7. What lives in this repo

| Path | Purpose |
|---|---|
| `AGENTS.md` | The non-negotiables every session must obey (read design docs first; commit per room; never stop before goal/limit; PR against the story branch). Agent-agnostic by name; Claude-based sessions (which is what CyLocal runs) load `CLAUDE.md`, so keep `CLAUDE.md` as a symlink to `AGENTS.md`. |
| `.claude/skills/orchestrate-story/` | The orchestrator's operating procedure: sub-issue templates, the outline check, rounds, deadlines, the log. Layers on Cyrus's built-in orchestrator prompt. |
| `.claude/skills/generate-story/` | The generator playbook (outline format, per-room procedure, data shape, checks, fix rounds). |
| `.claude/skills/evaluate-story/` | The evaluator playbook (run harness, play routes, report format). |
| `scripts/eval-reach.ts` + `npm run eval:reach` | The reachability harness. Deterministic; exit 1 on any unreachable room; `--json` for machines. |
| `scripts/play.ts` | Scripted playthrough through the real engine (`--expect <room id>` exits 1 if the route doesn't land there). The evaluator's second layer; it has no Write tool, so this script exists. |
| `src/world.ts` | World helpers the engine and harness share: lookup, stride resolution, `validateWorld`, `reachability`. |
| `design/stories/<slug>/OUTLINE.md` | One per story: the story's working bible — the expanded story, the room plan with per-room as-built notes, cross-room threads, blockers. Every generator reads it and every generator improves it. |
| `design/stories/<slug>/LOG.md` | Mirror of the orchestration log (§5.8); the Linear document linked to the story issue is the primary copy. |
| `src/content/` | Generated rooms, in the engine's data shape. |
| `cyrus-setup.sh` | `npm install`, so each worktree can typecheck and run the engine immediately. |

Keeping the playbooks *in the repo* (not in Cyrus config) is deliberate: the workflow's
brain is versioned next to the game, reviewable in PRs, and loaded automatically by
every Cyrus session via project skills.

## 8. The evaluator's report

The report is the contract between evaluator and generator. Plain markdown, fixed shape:

```markdown
# Evaluation: <story> (round N)
verdict: FAIL            # or PASS
rooms: 8  reachable: 6   # harness totals

## Failures
### mill-race · 2099 BA
- from: turning-house · 2099 BA (reachable)
- tried: SOUTH
- got: "There's no way down from here."
- expected (outline): "the only way down to the water"
- suggestion: add an exit south from turning-house · 2099 BA, or a PAST exit from
  mill-race · 2099 AA

### <next room> ...

## Notes
<anything the playthrough saw that the harness can't: text that arrives in the wrong
room, a time exit that lands in an unlisted age>
```

Every failure names the room, where the player stood, what was typed, what came back,
and what the outline promised. That is enough for the generator to reproduce and fix
without re-deriving anything.

## 9. Limits and stop conditions

| Limit | Where it lives | Enforced by |
|---|---|---|
| `max_rooms` | story issue `factory:` block | outline check (§5.4); detail generator never writes beyond the outline |
| `max_rounds` | story issue | orchestrator on every FAIL; gardener as backstop |
| per-session turn ceiling | Cyrus (200 turns per phase) | not a stop — a *continuation*: commit-per-room + "Rooms (continued)" |
| deadline per child | orchestrator `ScheduleWakeup` | §10 |

The loop always ends in one of three states: **In Review** (PASS), **needs human**
(rounds exhausted or a blocker the gardener couldn't clear), or **canceled** by Jake.

## 10. When sessions don't complete cleanly

Sessions wedge — turn limits, API blips, a child that quietly dies. Three layers, from
fastest to most durable:

1. **In-session deadline (`ScheduleWakeup`).** After spawning a child the orchestrator
   schedules a wakeup (say 20 min). Cyrus keeps the session alive and marks the Linear
   panel as waiting. If the wakeup fires before the child reported, the orchestrator
   inspects the child's issue and worktree and decides: wait again, spawn a continuation,
   or escalate. *Lost on Cyrus restart.*
2. **Blocked-by parking.** The story issue is blocked-by the active child; Cyrus parks
   the parent and wakes it when the child issue reaches a terminal state — so a dead
   child whose issue gets moved (by the gardener) still unblocks the parent. *In-memory
   too.*
3. **The gardener (external, durable).** A scheduled job outside Cyrus — a Claude Code
   cloud routine or a local cron running headless Claude with the Linear MCP — every
   ~20 min:
   - find adventure issues with factory labels that are in progress with no activity for
     N minutes;
   - read the `factory:` block, the issue state, and the orchestration log's last entry
     (never session internals);
   - act in order: **nudge** (comment in the session thread — Cyrus resumes the session,
     durably) → **cancel** the dead child issue (wakes the parent via layer 2) →
     **re-delegate** the story issue → **flag for a human**; never exceed `max_rounds`.

Design principle: everything the gardener needs is in Linear — the `factory:` block, the
round, the outline checklist, child issue states. Watchdogs read durable state, not
process memory.

## 11. Cyrus configuration

Per-repo in `~/.cyrus/config.json` (hot-reloaded):

```json
"labelPrompts": {
  "orchestrator": { "labels": ["Game Story"], "allowedTools": "coordinator" },
  "builder":      { "labels": ["Generate"],   "allowedTools": "all" },
  "scoper":       { "labels": ["Evaluate"],   "allowedTools": [
    "Read(**)", "Glob", "Grep", "Skill", "Task", "TaskCreate", "TaskUpdate", "TaskGet", "TaskList",
    "Bash(npm install:*)", "Bash(npm run eval:reach:*)", "Bash(npm test:*)",
    "Bash(npm run typecheck:*)", "Bash(node scripts/play.ts:*)",
    "Bash(git status:*)", "Bash(git log:*)", "Bash(git diff:*)"
  ] }
}
```

The evaluator gets an explicit list rather than Cyrus's `safe` preset because `safe`
is "everything except Bash" — and the evaluator must run the harness and the
playthrough script. The list has no Edit/Write and no `git commit`, so it can report
but not fix, by construction.

Plus `cyrus-setup.sh` in the repo. Everything role-specific beyond that comes from the
repo's `AGENTS.md` and skills (§7), which the orchestrator invokes by name when it writes
each sub-issue ("use the `generate-story` skill").

## 12. Build order

1. **Repo, as one reviewable PR:** `scripts/eval-reach.ts` + `npm run eval:reach`;
   `.claude/skills/generate-story` and `evaluate-story`; `AGENTS.md` (+ `CLAUDE.md`
   symlink); `cyrus-setup.sh`;
   the `design/stories/` convention. Test the harness by hand against the Turning House.
2. **Cyrus:** the three `labelPrompts` entries. Hot-reloads.
3. **Linear:** the `Game Story` template with the `factory:` block; the three labels.
4. **First live story:** one hand-written issue, `max_rooms: 4`, `max_rounds: 2`. Watch
   the orchestrator spawn its first child and tune the playbooks from what actually
   happens — the same way the bridge was tuned.
5. **Gardener:** after the first clean run, so its rules are written against real stuck
   modes rather than imagined ones.

## 13. Decisions and open questions

**Decided**

- The outline is a living document: it contains and expands the original story so
  generators never need the issue, and every generator that touches a room leaves an
  as-built note that makes the outline clearer for the next one. Room lines themselves
  stay one line each, with no per-entry design-doc justification — grounding happens at
  detail time; compliance is a later evaluator.
- Outline and detail are separate children, so the limit is enforced before the
  expensive part and continuation after a cutoff is trivial.
- The evaluator is read-only by tool preset, not by instruction.
- Round count and limits live in the issue, not in sessions.
- The orchestrator logs every step and every decision-with-reason, as its turn responses
  and in a Linear document linked to the story issue (mirrored to the repo).
- Playbooks live in the repo, not in Cyrus config.
- Vocabulary follows the design and the code: *place* (persists), *era* (landing + age),
  *room* (a place in one era). Outline entries use engine landings (`2099 BA`), never
  calendar years.

**Open**

- Can the Linear "Game Story" template pre-set the delegate, or is delegation one extra
  click per story?
- Cyrus's git phase defaults toward the repo base branch for PRs; confirm on the first
  run that children PR against the story branch as instructed, or adjust.
- Evaluator v2 candidates, in order: writing-guide compliance, item/puzzle solvability,
  time-exit symmetry. Each is a new `Evaluate` child; the orchestrator doesn't change.
- Fan-out (parallel room generation) is explicitly out of scope for v1.
