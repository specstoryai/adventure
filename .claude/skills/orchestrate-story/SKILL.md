---
name: orchestrate-story
description: Run the story factory loop for a Linear issue labeled "Game Story" — expand the story into an outline, generate rooms one at a time, evaluate reachability, and route failures back until the story passes or a limit is hit. Use when you are the Cyrus session on a Game Story issue.
---

# Orchestrate a story

You are the orchestrator for one story. You decide and delegate; you never write game
content yourself (you have no Edit/Write tools). The full design is
`ADVENTURE_FACTORY.md` at the repo root — read it once now. This skill is the operating
procedure. The Cyrus orchestrator rules you were given still apply (sub-issues need
`parentId`, the inherited assignee, state "Todo", a label, and the mandatory
verification template; verify every child in its worktree before merging; never comment
on your own issue).

## Tools you will use

- Linear MCP (`mcp__linear__*`): `save_issue` to create/update issues (if your server
  exposes `create_issue`/`update_issue` instead, use those), `get_issue`,
  `save_document` for the log. Always pass `parentId`, `assignee` (the parent's),
  `state: "Todo"` (the team's unstarted state), and `labels`.
- Cyrus MCP: `mcp__cyrus-tools__linear_agent_session_create` to spawn a child session on
  a sub-issue; `mcp__cyrus-tools__linear_agent_give_feedback` to re-prompt an existing
  child session (fix rounds).
- `ScheduleWakeup` for per-child deadlines. `Bash` for git and for appending the log
  mirror.

## 0. Start

1. Read the story issue. Parse the `factory:` block at the bottom of its description:
   `max_rooms` (default 8), `max_rounds` (default 3), `round` (default 0). If the block is
   missing, use the defaults and add the block to the issue description.
2. Derive the story slug (kebab-case of the title, ≤ 40 chars). Paths:
   `design/stories/<slug>/OUTLINE.md` and `design/stories/<slug>/LOG.md`.
3. Read `design/UNIVERSE.md`, `design/DESIGN.md`, `design/WRITING-GUIDE.md` once, for
   your own judgment later.
4. `git push -u origin <story-branch>` (children branch from it).
5. Create the log: a Linear document titled `Orchestration log — <story title>`, attached
   to the story issue if the tool allows (else to the `adventure` project). Write entry
   1 (see §6). Mirror it to `design/stories/<slug>/LOG.md` via Bash and commit on the
   story branch.
6. Go to §1.

## 1. Outline

Create sub-issue **`Outline: <story title>`** — label `Generate`, parent = the story
issue, state "Todo", assignee inherited. Description (exactly this structure):

```
Objective: Write design/stories/<slug>/OUTLINE.md for this story (generate-story skill, phase: outline).
Context: The full story as written by the planner follows. max_rooms: <n>.

--- STORY ---
<paste the entire story issue description, minus the factory block>
--- END STORY ---

Acceptance Criteria:
- [ ] OUTLINE.md exists with sections Story, Rooms, Threads, Blockers (format: design/stories/README.md)
- [ ] "Story" contains and expands the story above so a generator needs nothing else
- [ ] Rooms: one line each, ≤ <max_rooms> entries, each with place · landing (age) — purpose
- [ ] PR opened against branch <story-branch>

Dependencies: none
Technical Notes: Use the `generate-story` skill, phase "outline". Read AGENTS.md and the three design docs first. Do not write any src/content yet.

**MANDATORY VERIFICATION REQUIREMENTS:** <the standard template from your orchestrator instructions>
```

Then: set the story issue **blocked by** this sub-issue; spawn with
`linear_agent_session_create(issueId)`; `ScheduleWakeup` in 20 minutes with prompt
"deadline check: outline child"; write a log entry; end your turn.

## 2. On outline completion

1. Verify in the child's worktree: `npm run typecheck && npm test`; read `OUTLINE.md`.
2. Check: room count ≤ `max_rooms`; every room line has place, landing, purpose; the
   `## Story` section carries everything the issue said and reads as one story.
   Landings use engine vocabulary (`2099 BA`), never calendar years.
3. Reject → `linear_agent_give_feedback` to the outline child with the exact problems;
   this counts as a round (increment `round` in the issue); re-arm the deadline; log; end
   turn. Accept → merge the child branch into the story branch, push, log, go to §3.

## 3. Rooms

Create sub-issue **`Rooms: <story title>`** — label `Generate`, parent, "Todo", assignee
inherited. Description:

```
Objective: Write every room in design/stories/<slug>/OUTLINE.md as game data (generate-story skill, phase: detail).
Context: The outline is the source — read it first; do not consult the story issue. Story branch: <story-branch>.

Acceptance Criteria:
- [ ] Every unchecked room in OUTLINE.md is written under src/content/, registered in src/content/index.ts, and ticked with an as-built note
- [ ] After every room: npm run typecheck && npm test pass, and the room is committed
- [ ] Threads section kept current; blockers only as a last resort (design/UNIVERSE.md first)
- [ ] PR opened against branch <story-branch>

Dependencies: the outline (merged on the story branch)
Technical Notes: Use the `generate-story` skill, phase "detail". Room id convention <place>:<landing-slug>. Register new landings oldest-first.

**MANDATORY VERIFICATION REQUIREMENTS:** <standard template>
```

Blocked-by swap → spawn → deadline (20 min) → log → end turn.

## 4. On rooms completion

1. Verify in the child's worktree: `npm run typecheck && npm test`; every room line in
   `OUTLINE.md` is ticked and has an as-built note (or a recorded blocker).
2. If rooms remain unchecked (the child ran out of turns): merge what exists, then spawn
   **`Rooms (continued): <story title>`** with the same description plus "start at the
   first unchecked room". Not a round. Log. End turn.
3. Otherwise merge into the story branch, push, log, go to §5.

## 5. Evaluate

Create sub-issue **`Evaluate: <story title>`** — label `Evaluate`, parent, "Todo",
assignee inherited. Description:

```
Objective: Prove every room of this story is reachable from the start (evaluate-story skill). Report; do not fix.
Context: Story branch <story-branch> (merged rooms). Outline: design/stories/<slug>/OUTLINE.md. Round: <round>.

Acceptance Criteria:
- [ ] npm run eval:reach run and its output included
- [ ] Every reported route played through with node scripts/play.ts --expect
- [ ] Final response is the report in the exact format of ADVENTURE_FACTORY.md §8, beginning with "verdict: PASS" or "verdict: FAIL"

Dependencies: rooms merged
Technical Notes: Use the `evaluate-story` skill. You have no Edit/Write tools; never commit.

**MANDATORY VERIFICATION REQUIREMENTS:** <standard template — for an evaluator the verification is re-running eval:reach and one play route>
```

Blocked-by swap → spawn → deadline (15 min) → log → end turn.

## 6. On evaluation completion — close the loop

Read the report's `verdict`.

**FAIL:**
1. `round` += 1 in the story issue's `factory:` block (update the description).
2. If `round >= max_rounds`: write a final log entry that begins `NEEDS HUMAN: rounds
   exhausted` and includes the last report, move the story issue to "In Review" (the
   team has no dedicated needs-human state; In Review plus that marker is the signal —
   no PR to main is opened), and stop.
3. Else: send the full report to the **Rooms** child session with
   `linear_agent_give_feedback` and the instruction "fix every failure in this report,
   re-run npm run eval:reach until it passes, update OUTLINE.md as-built notes, commit, and
   push to your PR". If that session no longer exists, create sub-issue
   **`Rooms (round <round>): <one-line summary>`** (label `Generate`) with the report
   in the description and spawn it. Deadline, log, end turn. When it completes, verify and
   merge as in §4, then go to §5 again.

**PASS:**
1. `gh pr create --base main --head <story-branch>` with a summary and a link to the log.
2. Move the story issue to "In Review".
3. Final log entry; final response summarizing rooms, rounds, PR.

## 7. Deadline wakeups

When a `ScheduleWakeup` fires before the child reported: read the child issue's state and
latest activity; look at its worktree (`git -C <path> log --oneline -5`). Decide — wait
again (re-arm), spawn a continuation (rooms), or escalate — and log the decision with its
reason. Never act on guesswork: if the child is visibly progressing, wait.

## 8. Every log entry

Append to the Linear document **and** `design/stories/<slug>/LOG.md` (Bash heredoc,
then commit). Your turn's final response is the same entry. Shape:

```
## <UTC time> · step <n> · <event>
- event:    <what happened — child completed, deadline fired, outline check, …>
- saw:      <1–3 lines of what you received>
- decision: <what you chose>
- reason:   <why — rule, limit, evidence; "per ADVENTURE_FACTORY.md §5.4" for mechanical steps>
- action:   <sub-issue ids created, blocked-by moved, PRs merged, round changes, deadlines set>
- next:     <what you are waiting for, and by when>
```

Wherever a real choice existed, `reason` is mandatory.

## Rules

- Sequential: one child at a time. Never spawn the next before merging the last.
- Never write content. Never edit OUTLINE.md yourself; children own it.
- Never exceed `max_rounds`. Never exceed `max_rooms` — reject outlines that do.
- Never comment on the story issue; log via the document and your responses.
