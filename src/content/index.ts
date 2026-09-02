import type { World } from "../types.ts";
import { turningHouse } from "./turning-house.ts";
import { millRace2099Ba } from "./mill-race-2099-ba.ts";

// The assembled world. Every room in every era is registered here, and
// `landings` lists every era oldest-first — PAST and FUTURE step along it.
//
// Authoring a new room (see .claude/skills/generate-story): write it in its
// own file under src/content/, import it here, add it to `rooms`, and add its
// landing to `landings` if the era is new. Keep `landings` in chronological
// order. The engine validates the world on startup and `npm run eval:reach`
// proves every room can be reached from the start.

export const world: World = {
  start: "turning-house",
  landings: ["2099 BA"],
  rooms: [turningHouse, millRace2099Ba],
};
