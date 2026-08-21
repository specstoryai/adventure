import type { Direction, Room, World } from "./types.ts";

// Helpers over a World: lookup, time-stride resolution, integrity checks, and
// reachability. Pure functions; the engine and the evaluator both use them.

/** Room lookup by id. */
export function roomMap(world: World): Map<string, Room> {
  return new Map(world.rooms.map((r) => [r.id, r]));
}

/**
 * Where a PAST/FUTURE stride from `room` lands: the same place at the adjacent
 * landing, if the room opens that way and such a face exists. Null otherwise.
 */
export function strideTarget(world: World, room: Room, way: "past" | "future"): Room | null {
  if (!room.time[way]) return null;
  const idx = world.landings.indexOf(room.landing);
  if (idx < 0) return null;
  const landing = world.landings[way === "past" ? idx - 1 : idx + 1];
  if (landing === undefined) return null;
  return world.rooms.find((r) => r.place === room.place && r.landing === landing) ?? null;
}

/** Every integrity problem in the world, as human-readable lines. Empty means valid. */
export function validateWorld(world: World): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const itemIds = new Map<string, string>();

  if (world.rooms.length === 0) problems.push("world has no rooms");
  if (world.landings.length === 0) problems.push("world has no landings");

  for (const room of world.rooms) {
    if (ids.has(room.id)) problems.push(`duplicate room id "${room.id}"`);
    ids.add(room.id);
    if (!world.landings.includes(room.landing)) {
      problems.push(`room "${room.id}" has landing "${room.landing}" not listed in world.landings`);
    }
    for (const item of room.items) {
      const prior = itemIds.get(item.id);
      if (prior) problems.push(`item id "${item.id}" appears in both "${prior}" and "${room.id}"`);
      itemIds.set(item.id, room.id);
    }
  }
  if (!ids.has(world.start)) problems.push(`start room "${world.start}" does not exist`);

  for (const room of world.rooms) {
    for (const [dir, target] of Object.entries(room.exits ?? {})) {
      if (target !== undefined && !ids.has(target)) {
        problems.push(`room "${room.id}" exit ${dir} points at missing room "${target}"`);
      }
    }
  }
  return problems;
}

/** One step in a route: the command the player types and where it lands. */
export interface Step {
  command: string;
  to: string;
}

export interface Reachability {
  /** Room ids reachable from the start, in BFS order (start first). */
  reachable: string[];
  /** Rooms that cannot be reached by any sequence of moves. */
  unreachable: Room[];
  /** For each reachable room, the commands that get there from the start. */
  routes: Map<string, string[]>;
}

/** Every move available from a room: spatial exits and open time strides. */
export function movesFrom(world: World, room: Room): Step[] {
  const steps: Step[] = [];
  for (const [dir, target] of Object.entries(room.exits ?? {})) {
    if (target !== undefined) steps.push({ command: (dir as Direction).toUpperCase(), to: target });
  }
  for (const way of ["past", "future"] as const) {
    const target = strideTarget(world, room, way);
    if (target) steps.push({ command: way.toUpperCase(), to: target.id });
  }
  return steps;
}

/** Breadth-first search from the start room over every available move. */
export function reachability(world: World): Reachability {
  const rooms = roomMap(world);
  const routes = new Map<string, string[]>();
  const order: string[] = [];
  const queue: string[] = [];

  if (rooms.has(world.start)) {
    routes.set(world.start, []);
    queue.push(world.start);
  }
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    const room = rooms.get(id)!;
    const here = routes.get(id)!;
    for (const step of movesFrom(world, room)) {
      if (routes.has(step.to)) continue;
      routes.set(step.to, [...here, step.command]);
      queue.push(step.to);
    }
  }
  const unreachable = world.rooms.filter((r) => !routes.has(r.id));
  return { reachable: order, unreachable, routes };
}
