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
  `project` (the parent's — sub-issues do **not** inherit the project, and Cyrus routes
  the child session to the repository by project; an issue outside the project triggers
  a "which repository?" prompt that stalls the loop), `state: "Todo"` (the team's
  unstarted state), and `labels`.
- Cyrus MCP: `mcp__cyrus-tools__linear_agent_session_create` to spawn a child session on
  a sub-issue; `mcp__cyrus-tools__linear_agent_give_feedback` to re-prompt an existing
  child session (fix rounds).
- `ScheduleWakeup` for per-child deadlines. `Bash` for git and for appending the log
  mirror.

## 0. Start

1. Read the story issue. Parse the `factory:` block at the bottom of its description:
   `max_rooms` (default 8), `max_rounds` (default 3), `round` (default 0),
   `max_revisions` (default 5), `revisions` (default 0). If the block or a key is missing,
   use the defaults and write the full block into the issue description.
2. Derive the story slug (kebab-case of the title, ≤ 40 chars). Paths:
   `design/stories/<slug>/OUTLINE.md` and `design/stories/<slug>/LOG.md`.
3. Read `design/UNIVERSE.md`, `design/DESIGN.md`, `design/WRITING-GUIDE.md` once, for
   your own judgment later.
4. `git push -u origin <story-branch>` (children branch from it).
5. Create the log: a Linear document titled `Orchestration log — <story title>`, attached
   to the story issue if the tool allows (else to the `adventure` project). Write entry
   1 (see §11). Mirror it to `design/stories/<slug>/LOG.md` via Bash and commit on the
   story branch.
6. Go to §1.

## 1. Outline

Create sub-issue **`Outline: <story title>`** — label `Generate`, parent = the story
issue, **project = the story issue's project**, state "Todo", assignee inherited.
Description (exactly this structure):

```
Objective: Write design/stories/<slug>/OUTLINE.md for this story (generate-story skill, phase: outline).
Context: The full story as written by the planner follows. max_rooms: <n>.

--- STORY ---
<paste the entire story issue description, minus the factory block>
--- END STORY ---

Acceptance Criteria:
- [ ] OUTLINE.md exists with sections Story, Rooms, Through-lines, Blockers (format: design/stories/README.md)
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

1. Verify (§9): merge the child's branch into the story branch locally, run
   `npm run typecheck && npm test` there, read `OUTLINE.md`.
2. Check: room count ≤ `max_rooms`; every room line has place, landing, purpose; the
   `## Story` section carries everything the issue said and reads as one story.
   Landings use engine vocabulary (`2099 BA`), never calendar years.
3. Reject → `git reset --hard` the story branch to before the merge; this is a fix round:
   if `round >= max_rounds`, stop as in §6 (NEEDS HUMAN); else `round` += 1,
   `linear_agent_give_feedback` to the outline child with the exact problems, re-arm the
   deadline, log, end turn. Accept → push the story branch, **close out the child (§10)**,
   log, go to §3.

## 3. Rooms

Create sub-issue **`Rooms: <story title>`** — label `Generate`, parent, "Todo", assignee
inherited. Description:

```
Objective: Write every room in design/stories/<slug>/OUTLINE.md as game data (generate-story skill, phase: detail).
Context: The outline is the source — read it first; do not consult the story issue. Story branch: <story-branch>.

Acceptance Criteria:
- [ ] Every unchecked room in OUTLINE.md is written under src/content/, registered in src/content/index.ts, and ticked with an as-built note
- [ ] After every room: npm run typecheck && npm test pass, and the room is committed
- [ ] Through-lines section kept current; blockers only as a last resort (design/UNIVERSE.md first)
- [ ] PR opened against branch <story-branch>

Dependencies: the outline (merged on the story branch)
Technical Notes: Use the `generate-story` skill, phase "detail". Room id convention <place>:<landing-slug>. Register new landings oldest-first.

**MANDATORY VERIFICATION REQUIREMENTS:** <standard template>
```

Blocked-by swap → spawn → deadline (20 min) → log → end turn.

## 4. On rooms completion

1. Verify (§9): merge the child's branch into the story branch locally, run
   `npm run typecheck && npm test && npm run eval:reach` there; every room line in
   `OUTLINE.md` is ticked and has an as-built note (or a recorded blocker).
2. If rooms remain unchecked (the child ran out of turns): keep the merge, push, then spawn
   **`Rooms (continued): <story title>`** with the same description plus "start at the
   first unchecked room". A continuation that made progress (ticked at least one new room)
   is not a round; a continuation that ticked **no** new room counts as a fix round (apply
   the §6 check — something is wrong, and continuations must not loop forever). Log. End
   turn. (Do not close out the Rooms sub-issue yet — the continuation finishes it.)
3. Otherwise push the story branch, **close out the child (§10)**, log, go to §5.

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
1. If `round >= max_rounds` (the fix rounds are used up): write a final log entry that
   begins `NEEDS HUMAN: rounds exhausted` and includes the last report, move the story
   issue to "In Review" (the team has no dedicated needs-human state; In Review plus that
   marker is the signal — no PR to main is opened), and stop.
2. Else `round` += 1 in the story issue's `factory:` block (update the description).
   `max_rounds` is the number of fix rounds allowed after the first evaluation:
   `max_rounds: 2` means up to two fix rounds and three evaluations.
3. Send the full report to the **Rooms** child session with
   `linear_agent_give_feedback` and the instruction "fix every failure in this report,
   re-run npm run eval:reach until it passes, update OUTLINE.md as-built notes, commit, and
   push to your PR". If that session no longer exists, create sub-issue
   **`Rooms (round <round>): <one-line summary>`** (label `Generate`) with the report
   in the description and spawn it. Deadline, log, end turn. When it completes, verify and
   merge as in §4, then go to §5 again.

**PASS:**
1. **Close out the evaluator child (§10)** — its criteria are verified by the report
   itself (harness output present, routes played, format correct).
2. `gh pr create --base main --head <story-branch>` with a summary and a link to the log.
3. Move the story issue to "In Review".
4. Final log entry; final response summarizing rooms, rounds, PR.

After a **FAIL** that leads to a fix round, the evaluator child is also closed out (§10)
once its report has been handed on — a later evaluation is a new `Evaluate` sub-issue
(`Evaluate (round <round>): <story title>`), not a re-run of the old one.

## 7. Revisions — human review after In Review

When a human asks for changes after the story is In Review (a comment in your session, or
"address the PR review comments"), that is a **revision**, not a fix round:

1. Read every comment (`gh pr view <n> --json reviews,comments` and
   `gh api repos/<owner>/<repo>/pulls/<n>/comments`). Quote them in the log.
2. Classify each change:
   - **text-only** — `look`/`lookAgain`/descriptions/dialogue/titles; no exits, time
     flags, items, scenery ids, room ids, or landings touched;
   - **structural** — anything else.
3. Delegate the fix to the Rooms generator with `linear_agent_give_feedback` (the same
   session keeps its worktree and context), with the comments verbatim plus exact
   guidance. Swap blocked-by, arm a deadline, log with the `REVISION:` marker, end turn.
4. On completion, verify per §9. **Text-only:** your own verification is sufficient
   (typecheck, tests, `eval:reach`, the play route) — merge, push (updates the PR), and
   reply to each PR comment explaining what changed. **Structural:** after merging, run a
   fresh `Evaluate (revision <k>)` child (§5) and only reply/finish on PASS; a FAIL here
   is a fix round and follows §6.
5. Revisions do **not** consume `round`. They are capped separately: `max_revisions`
   (default 5) in the `factory:` block; track `revisions: <k>` there. Past the cap, stop
   with `NEEDS HUMAN: revisions exhausted`.
6. Close out any child you used (§10). Log entry event: `REVISION <k> — <summary>`.

## 8. Deadline wakeups

When a `ScheduleWakeup` fires before the child reported: read the child issue's state and
latest activity; look at its worktree (`git -C <path> log --oneline -5`). Decide — wait
again (re-arm), spawn a continuation (rooms), or escalate — and log the decision with its
reason. Never act on guesswork: if the child is visibly progressing, wait.

## 9. How to verify a child

Verify on the **merged story branch**, not inside the child's worktree (running commands
in another worktree is often denied by the session's permissions, and the merged result
is what actually ships): `git fetch origin <child-branch> && git merge --no-ff
origin/<child-branch>` on the story branch, then run the checks there. If verification
fails, `git reset --hard` to the pre-merge commit before giving feedback. Never merge on
the child's claim alone; the child's final response lists the commands and an
`## Acceptance criteria` block — re-run the commands and confirm each criterion yourself.

## 10. Close out a child (after every accepted verification)

Every child sub-issue ends **Done with its acceptance criteria ticked** — the ticks are
your verification record, not the child's self-report.

1. For each criterion you verified, `save_issue` with a `patch` replacing that exact
   `- [ ] <text>` with `- [x] <text>` in the sub-issue description. Leave unticked
   anything you could not verify, and say why in the log.
2. Move the sub-issue to **Done** (or **Canceled** if it was superseded — e.g. a
   continuation replaced it). Done triggers Cyrus to tear down the child's worktree.
3. Remove the story issue's blocked-by on it (`removeBlockedBy`).
4. Log: event `CLOSE-OUT <sub-issue>`, with the criteria ticked (n/m) and the state set.

## 11. Every log entry

Append to the Linear document **and** `design/stories/<slug>/LOG.md` (Bash heredoc,
then commit). Your turn's final response is the same entry. Shape:

```
## <UTC time> · step <n> · <event>
- event:    <what happened — child completed, deadline fired, outline check, REVISION <k>, CLOSE-OUT <id>, …>
- saw:      <1–3 lines of what you received>
- decision: <what you chose>
- reason:   <why — rule, limit, evidence; "per ADVENTURE_FACTORY.md §5.4" for mechanical steps>
- action:   <sub-issue ids created/closed, criteria ticked, blocked-by moved, PRs merged, round/revision changes, deadlines set>
- next:     <what you are waiting for, and by when>
```

Wherever a real choice existed, `reason` is mandatory.

## Rules

- Sequential: one child at a time. Never spawn the next before merging the last.
- Never write content. Never edit OUTLINE.md yourself; children own it.
- Never exceed `max_rounds` or `max_revisions`. Never exceed `max_rooms` — reject
  outlines that do.
- Never comment on the story issue; log via the document and your responses.
- Never leave a child In Progress once its work is merged or superseded — close it out.
