import type { Room } from "../types.ts";

// The Mill-Race, 1099 BA — the Long Noon.
// The stopped face of the place. Same ledge, same beam, same nail; the nail is
// not empty. Nothing here explains that, and nothing here should.
// All text here answers to design/WRITING-GUIDE.md.

export const millRace1099Ba: Room = {
  id: "mill-race:1099-ba",
  place: "mill-race",
  title: "The Mill-Race",
  landing: "1099 BA",
  age: "the Long Noon",
  look:
    "You are on the ledge, and the water is not running. The race is silted to the " +
    "ankle and the wheel stands dry to the hub, one paddle sprung. Overhead, where the " +
    "stair came down, there is brick, laid by someone with mortar to spare.\n" +
    "On the nail in the beam hangs an iron lantern, unlit.",
  lookAgain:
    "Silt, and a stopped wheel, and brick where the stair was. The lantern hangs on " +
    "its nail.",
  time: {
    // Back the way you came. The stair is brick; the years are not.
    past: true,
    future: false,
  },
  items: [
    {
      id: "mill-lantern",
      nouns: ["lantern", "iron lantern", "glass"],
      description: "Iron and plain, unlit, and the glass is warm.",
      takeable: false,
      takeRefusal: "You leave it on its nail. It has hung there a while.",
      start: "room",
    },
  ],
  scenery: [
    {
      id: "nail-1099",
      nouns: ["nail", "iron nail", "soot", "ring of soot"],
      description: "An iron nail in a ring of soot, and the lantern hanging on it.",
    },
    {
      id: "mill-beam-1099",
      nouns: ["beam", "beams", "timber"],
      description: "Oak, dry now, and holding. The nail has not moved.",
    },
    {
      id: "wheel-1099",
      nouns: ["wheel", "waterwheel", "water wheel", "paddles", "paddle", "hub"],
      description: "Grey oak, dry to the hub, and leaves where the water was.",
    },
    {
      id: "race-1099",
      nouns: ["race", "mill-race", "mill race", "water", "channel", "silt"],
      description:
        "Silt to the ankle, and a green line along the stone where the water used to reach.",
    },
    {
      id: "brick-1099",
      nouns: ["brick", "bricks", "brickwork", "ceiling", "stair", "stairs", "steps", "house"],
      description: "Brick laid flush and well mortared, and worked from the other side.",
    },
    {
      id: "ledge-1099",
      nouns: ["ledge", "stone", "stones", "floor"],
      description: "The one worn track is still here, and both ends of it are shut.",
    },
  ],
};
