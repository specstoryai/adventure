import type { Room } from "../types.ts";

// The Turning House, 2099 BA — the High Masonry.
// One place, one era: the game's front door, and for this slice the whole world.
// All text here answers to design/WRITING-GUIDE.md.

export const turningHouse: Room = {
  id: "turning-house",
  title: "The Turning House",
  landing: "2099 BA",
  age: "the High Masonry",
  look:
    "You are in the common room of an inn at a crossroads, low under black beams, " +
    "a fire going against a cold the season has not earned. The walls are drystone, " +
    "laid without mortar, and have outlasted the road they watch. A barred door holds " +
    "off the night; a stair climbs into the dark.\n" +
    "The landlady works the fire and does not ask your business.\n" +
    "On the long table a brass lamp stands unlit, and beside it a coin lies face down.",
  lookAgain:
    "The common room, low and warm. A brass lamp on the table, a coin face down " +
    "beside it, and the landlady at her fire.",
  time: {
    // The House turns in every age — but only one landing is built in this slice,
    // so the years have nowhere to carry you yet. The parser declines in voice.
    past: false,
    future: false,
  },
  items: [
    {
      id: "lamp",
      nouns: ["lamp", "brass lamp", "brass"],
      description: "A brass lamp, unlit, dented with long use. No wick you can find.",
      takeable: true,
      read: "There is nothing written on the lamp.",
      start: "room",
    },
    {
      id: "bread",
      nouns: ["bread", "heel of bread", "heel", "crust"],
      description: "A heel of dark bread, left for whoever the fire is for.",
      takeable: true,
      eat: "You eat the bread. The House does not charge you for it, this once.",
      start: "room",
    },
    {
      id: "coin",
      nouns: ["coin", "face-down coin", "penny"],
      description:
        "A coin turned face down: a Traveler's sign for I was here. It is not your coin.",
      takeable: false,
      takeRefusal: "Some other Traveler left it face down. You let it lie.",
      read: "The coin's face is down, and that is the whole of what it says.",
      start: "room",
    },
  ],
  scenery: [
    {
      id: "landlady",
      nouns: ["landlady", "woman", "keeper", "innkeeper", "her"],
      description:
        "She has kept this fire longer than the walls have stood, and will not say how long.",
      talk: "\"Late to be traveling,\" she says, and does not mean the hour.",
    },
    {
      id: "fire",
      nouns: ["fire", "hearth", "flame", "flames", "fireplace"],
      description: "The fire is well kept and a little too eager for the season.",
    },
    {
      id: "beams",
      nouns: ["beams", "beam", "rafters", "ceiling"],
      description: "Black beams, smoke-cured, older than the trade they were cut for.",
    },
    {
      id: "walls",
      nouns: ["walls", "wall", "stones", "stone", "drystone", "masonry"],
      description: "Drystone, laid without mortar. Nothing holds it up but the fit of it.",
    },
    {
      id: "door",
      nouns: ["door"],
      description: "A stout door, barred against the road and the weather. Not tonight.",
    },
    {
      id: "stair",
      nouns: ["stair", "stairs", "steps", "staircase"],
      description: "The stair climbs to rooms with a pair of boots outside each one.",
    },
    {
      id: "table",
      nouns: ["table", "long table"],
      description: "A long table, scrubbed pale, that seems to have been used recently.",
    },
    {
      id: "road",
      nouns: ["road", "roads", "crossroads", "high road", "high roads"],
      description: "The high roads were laid to outlast their makers. They are winning.",
    },
  ],
};
