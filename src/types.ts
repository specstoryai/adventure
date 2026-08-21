// The shape of Everwyn's content. Places, items, and eras are declarative data
// so that (per the design) they can one day be authored and reviewed like pull
// requests. The engine reads these; it never hard-codes a room.

/** Compass and vertical directions the parser understands. */
export type Direction =
  | "north"
  | "south"
  | "east"
  | "west"
  | "up"
  | "down"
  | "in"
  | "out";

/** Something the parser can name and EXAMINE. Items and scenery share this. */
export interface Examinable {
  /** Stable id, used by the engine for state. Item ids are unique across the world. */
  id: string;
  /** Words the parser will accept for this thing, most specific first. */
  nouns: string[];
  /** EXAMINE text. One sentence, per the writing guide. */
  description: string;
}

/** A takeable object. Lives in a room or the player's hands. */
export interface Item extends Examinable {
  /** Whether the player may pick it up. Defaults false. */
  takeable?: boolean;
  /** In-voice refusal shown when a non-takeable item is taken. */
  takeRefusal?: string;
  /** Optional line shown when the item is eaten (adds the thing to the world). */
  eat?: string;
  /** Optional line shown when the item is read. */
  read?: string;
  /** Where the item starts. */
  start: "room" | "inventory";
}

/** Fixed furniture: examinable, never takeable. */
export interface Scenery extends Examinable {
  /** Optional line shown when the player TALKs to this (an NPC). */
  talk?: string;
}

/** Which temporal exits a place offers. Time is an exit, per the design. */
export interface TimeExits {
  past: boolean;
  future: boolean;
}

/**
 * A place, in one era. Place persists across eras; this is one face of it
 * (DESIGN.md §4.4). PAST and FUTURE move between faces of the same place at
 * adjacent landings in `World.landings`; spatial exits move between places.
 */
export interface Room {
  /** Unique across the world. Convention: `<place>:<landing-slug>`, e.g. `turning-house:2099-ba`. */
  id: string;
  /** The persistent place this room is one face of. Same string in every era. */
  place: string;
  /** Terse, locative title. Shown above the description. */
  title: string;
  /** The landing this face belongs to, e.g. "2099 BA". Must appear in `World.landings`. */
  landing: string;
  /** The age's name, e.g. "the High Masonry". */
  age: string;
  /** Full description body on first sight (title is printed separately). */
  look: string;
  /** Shorter body on return. Falls back to `look` if absent. */
  lookAgain?: string;
  items: Item[];
  scenery: Scenery[];
  /** Whether the years run from here. The target is the same place at the adjacent landing. */
  time: TimeExits;
  /** Spatial exits: direction → room id. Absent directions are "You can't go that way." */
  exits?: Partial<Record<Direction, string>>;
}

/** The whole map: every room in every era, and where the player begins. */
export interface World {
  /** Room id the player starts in. */
  start: string;
  /** Every landing in the world, oldest first. PAST and FUTURE step along this list. */
  landings: string[];
  rooms: Room[];
}
