// The shape of Everwyn's content. Places, items, and eras are declarative data
// so that (per the design) they can one day be authored and reviewed like pull
// requests. The engine reads these; it never hard-codes a room.

/** Something the parser can name and EXAMINE. Items and scenery share this. */
export interface Examinable {
  /** Stable id, used by the engine for state. */
  id: string;
  /** Words the parser will accept for this thing, most specific first. */
  nouns: string[];
  /** EXAMINE text. One sentence, per the writing guide. */
  description: string;
}

/** A takeable object. Lives in the room or the player's hands. */
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

/** A place, in one era. Place persists across eras; this is one face of it. */
export interface Room {
  id: string;
  /** Terse, locative title. Shown above the description. */
  title: string;
  /** The landing this face belongs to, e.g. "2099 BA". */
  landing: string;
  /** The age's name, e.g. "the High Masonry". */
  age: string;
  /** Full description body on first sight (title is printed separately). */
  look: string;
  /** Shorter body on return. Falls back to `look` if absent. */
  lookAgain?: string;
  items: Item[];
  scenery: Scenery[];
  time: TimeExits;
}
