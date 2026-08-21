import { test } from "node:test";
import assert from "node:assert/strict";
import type { Room, World } from "../src/types.ts";
import { Game } from "../src/engine.ts";
import { reachability, validateWorld, strideTarget } from "../src/world.ts";
import { world as shipped } from "../src/content/index.ts";

// A small world for movement tests: one place in two eras, and a cellar
// reached by going down — but only in the later era.
function room(overrides: Partial<Room> & Pick<Room, "id" | "place" | "landing">): Room {
  return {
    title: overrides.id,
    age: "an age",
    look: `You are in ${overrides.id}.`,
    items: [],
    scenery: [],
    time: { past: false, future: false },
    ...overrides,
  };
}

const tiny: World = {
  start: "house:2099-ba",
  landings: ["2099 BA", "2099 AA"],
  rooms: [
    room({
      id: "house:2099-ba",
      place: "house",
      landing: "2099 BA",
      time: { past: false, future: true },
      items: [{ id: "coin", nouns: ["coin"], description: "A coin.", takeable: true, start: "room" }],
    }),
    room({
      id: "house:2099-aa",
      place: "house",
      landing: "2099 AA",
      time: { past: true, future: false },
      exits: { down: "cellar:2099-aa" },
    }),
    room({
      id: "cellar:2099-aa",
      place: "cellar",
      landing: "2099 AA",
      exits: { up: "house:2099-aa" },
    }),
  ],
};

test("the shipped world is valid and fully reachable", () => {
  assert.deepEqual(validateWorld(shipped), []);
  assert.equal(reachability(shipped).unreachable.length, 0);
});

test("validateWorld reports broken exits, bad landings, duplicate ids, and a missing start", () => {
  const broken: World = {
    start: "nowhere",
    landings: ["2099 BA"],
    rooms: [
      room({ id: "a", place: "a", landing: "2099 BA", exits: { north: "ghost" } }),
      room({ id: "a", place: "a", landing: "1 AA" }),
    ],
  };
  const problems = validateWorld(broken);
  assert.ok(problems.some((p) => p.includes("missing room \"ghost\"")));
  assert.ok(problems.some((p) => p.includes("not listed in world.landings")));
  assert.ok(problems.some((p) => p.includes("duplicate room id")));
  assert.ok(problems.some((p) => p.includes("start room \"nowhere\"")));
});

test("strideTarget follows the landings list for the same place", () => {
  const [ba, aa] = tiny.rooms;
  assert.equal(strideTarget(tiny, ba!, "future")?.id, "house:2099-aa");
  assert.equal(strideTarget(tiny, ba!, "past"), null); // nothing older
  assert.equal(strideTarget(tiny, aa!, "past")?.id, "house:2099-ba");
});

test("reachability walks exits and strides and reports the route", () => {
  const r = reachability(tiny);
  assert.deepEqual(r.unreachable, []);
  assert.deepEqual(r.routes.get("cellar:2099-aa"), ["FUTURE", "DOWN"]);
});

test("reachability reports an unreachable room", () => {
  const cut: World = { ...tiny, rooms: tiny.rooms.map((x) => (x.id === "house:2099-aa" ? { ...x, exits: {} } : x)) };
  const r = reachability(cut);
  assert.deepEqual(r.unreachable.map((x) => x.id), ["cellar:2099-aa"]);
});

test("the engine moves between rooms by direction and by stride", () => {
  const g = new Game(tiny);
  assert.equal(g.where(), "house:2099-ba");
  assert.equal(g.handle("down").text, "You can't go that way.");
  assert.match(g.handle("future").text, /different world/);
  assert.equal(g.where(), "house:2099-aa");
  assert.match(g.handle("down").text, /cellar/);
  assert.equal(g.where(), "cellar:2099-aa");
  assert.match(g.handle("up").text, /house:2099-aa/);
  assert.match(g.handle("past").text, /different world/);
  assert.equal(g.where(), "house:2099-ba");
});

test("a stride that is open but has no face in that age leaves the player put", () => {
  const g = new Game({
    start: "lone",
    landings: ["1 BA", "1 AA"],
    rooms: [room({ id: "lone", place: "lone", landing: "1 BA", time: { past: false, future: true } })],
  });
  assert.match(g.handle("future").text, /nothing of this place stands/);
  assert.equal(g.where(), "lone");
});

test("items travel with the player and are listed where they are dropped", () => {
  const g = new Game(tiny);
  assert.equal(g.handle("take coin").text, "Taken.");
  g.handle("future");
  g.handle("down");
  assert.equal(g.handle("drop coin").text, "Dropped.");
  assert.match(g.handle("look").text, /There is a coin here/);
  assert.equal(g.handle("take coin").text, "Taken.");
  g.handle("up");
  assert.match(g.handle("inventory").text, /coin/);
});

test("an invalid world is rejected at construction", () => {
  assert.throws(
    () => new Game({ start: "x", landings: [], rooms: [] }),
    /invalid world/,
  );
});
