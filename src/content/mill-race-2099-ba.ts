import type { Room } from "../types.ts";

// The Mill-Race, 2099 BA — the High Masonry.
// The working face of the place: water, wheel, noise, and a nail with nothing
// on it. The absence is the point; 1099 BA answers it.
// All text here answers to design/WRITING-GUIDE.md.

export const millRace2099Ba: Room = {
  id: "mill-race:2099-ba",
  place: "mill-race",
  title: "The Mill-Race",
  landing: "2099 BA",
  age: "the High Masonry",
  look:
    "You are on a ledge of wet stone under the House, beside a channel cut for the " +
    "water. The race runs black and fast and turns the wheel, and the noise of it " +
    "would cover a shout, or a door. A beam crosses low above the ledge, and in the " +
    "beam there is an iron nail in a ring of soot, and nothing hanging on it.\n" +
    "The stair goes back up.",
  lookAgain:
    "Wet stone and black water, and the wheel taking it. The nail in the beam is " +
    "still empty.",
  time: {
    // The years are loose at the water's edge. Nothing older than this is built,
    // so only the forward stride opens.
    past: false,
    future: true,
  },
  items: [],
  scenery: [
    {
      id: "nail-2099",
      nouns: ["nail", "iron nail", "soot", "ring of soot"],
      description: "An iron nail in a ring of soot, and nothing hanging on it.",
    },
    {
      id: "mill-beam",
      nouns: ["beam", "beams", "timber"],
      description: "Oak, wet on the underside. The nail is not as old as the beam.",
    },
    {
      id: "wheel-2099",
      nouns: ["wheel", "waterwheel", "water wheel", "paddles", "paddle"],
      description: "Oak paddles, a hand's breadth of each under water at every turn.",
    },
    {
      id: "race-2099",
      nouns: ["race", "mill-race", "mill race", "water", "channel"],
      description:
        "The water comes in under the wall, does its work, and does not linger to be looked at.",
    },
    {
      id: "ledge-2099",
      nouns: ["ledge", "stone", "stones", "floor"],
      description: "Wet stone, worn in one track, from the foot of the stair to the water.",
    },
    {
      id: "mill-stair",
      nouns: ["stair", "stairs", "steps", "staircase"],
      description: "Narrow, wet at the foot, and the only door this place has.",
    },
  ],
  exits: { up: "turning-house" },
};
