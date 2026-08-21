# Stories

One directory per story the factory has worked on (`ADVENTURE_FACTORY.md`), named by
the story's slug. Each holds:

- `OUTLINE.md` — the story's working bible: the expanded story, the room plan with
  per-room as-built notes, cross-room through-lines, and blockers. Every generator reads it
  and every generator improves it. The format is in `ADVENTURE_FACTORY.md` §5.3.
- `LOG.md` — a mirror of the orchestrator's log (§5.8). The Linear document linked to the
  story issue is the primary copy.

## OUTLINE.md template

```markdown
# <Story title>

max_rooms: 8

## Story
<The original issue text, carried over faithfully — then expanded: the arc, what the
player is trying to do and why, the key beats in order, which places and eras the story
touches and what each is for, the items, NPCs, and ideas that carry across rooms, and
the tone notes. Written so that nothing in the issue is needed to author a room.>

## Rooms
- [ ] <place> · <landing> (<age>) — <one phrase of story purpose>
      as built: <exits and time exits · items/scenery that matter · what it sets up or
      pays off · deviations from plan and why>            ← added by the generator

## Through-lines
- <something that spans rooms: a traveling item, a puzzle in pieces, a PAST/FUTURE pair
  that must line up> — <status>

## Blockers
<empty until a genuine gap remains after working from design/UNIVERSE.md>
```
