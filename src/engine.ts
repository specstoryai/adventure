import type { Room, Item, Scenery, Examinable } from "./types.ts";
import { parse, type Command, type Verb } from "./parser.ts";

export interface Turn {
  text: string;
  /** True when the player has asked to leave. */
  quit?: boolean;
}

type ItemPlace = "room" | "inventory" | "gone";

/**
 * The game. Holds the world and turns typed lines into replies. Pure with
 * respect to I/O: `handle` takes a string and returns text, so it is trivially
 * testable and the same engine can back a terminal, a socket, or the web.
 */
export class Game {
  private readonly room: Room;
  private readonly itemPlace = new Map<string, ItemPlace>();
  private visited = false;
  private mark: string | null = null;
  private lastCommand: Command | null = null;

  constructor(room: Room) {
    this.room = room;
    for (const item of room.items) {
      this.itemPlace.set(item.id, item.start === "inventory" ? "inventory" : "room");
    }
  }

  /** The opening banner and first look, for the start of a session. */
  intro(): string {
    return [
      "EVERWYN",
      "An adventure in deep time.",
      "Type HELP for help, QUIT to leave.",
      "",
      this.describeRoom(),
    ].join("\n");
  }

  /** Handle one line of input. Never throws on bad input. */
  handle(input: string): Turn {
    const result = parse(input);
    if (result === null) {
      return { text: "I beg your pardon?" };
    }
    if (!result.ok) {
      return { text: `I don't know the word "${result.error.unknownWord}".` };
    }

    let command = result.command;
    if (command.verb === "again") {
      if (!this.lastCommand) return { text: "You have done nothing to repeat." };
      command = this.lastCommand;
    } else {
      this.lastCommand = command;
    }

    return this.run(command);
  }

  private run(command: Command): Turn {
    switch (command.verb) {
      case "look":
        return { text: this.describeRoom() };
      case "examine":
        return { text: this.examine(command.noun) };
      case "take":
        return { text: this.take(command.noun) };
      case "drop":
        return { text: this.drop(command.noun) };
      case "inventory":
        return { text: this.inventory() };
      case "go":
        return { text: this.go(command.noun) };
      case "past":
        return { text: this.stride("past") };
      case "future":
        return { text: this.stride("future") };
      case "when":
        return { text: this.when() };
      case "wait":
        return { text: "Time passes. Here, that is a great deal of it." };
      case "say":
        return { text: this.say(command.rest) };
      case "talk":
        return { text: this.talk(command.noun) };
      case "mark":
        return { text: this.leaveMark(command.rest) };
      case "read":
        return { text: this.read(command.noun) };
      case "eat":
        return { text: this.eat(command.noun) };
      case "help":
        return { text: HELP };
      case "quit":
        return { text: "The fire burns down. Come back; the lamps stay lit.", quit: true };
      // `again` is resolved before we get here.
      case "again":
        return { text: "You have done nothing to repeat." };
    }
  }

  // --- world description -----------------------------------------------------

  private describeRoom(): string {
    const first = !this.visited;
    this.visited = true;
    const body = first ? this.room.look : this.room.lookAgain ?? this.room.look;

    const lines = [this.room.title, body];

    // Items dropped into the room after the fact are listed, Zork-style.
    const extras = this.room.items.filter(
      (it) => this.itemPlace.get(it.id) === "room" && it.start !== "room",
    );
    for (const it of extras) {
      lines.push(`There is ${article(it.nouns[0]!)} here.`);
    }

    const timeLine = this.timeLine();
    if (timeLine) lines.push(timeLine);

    return lines.join("\n");
  }

  private timeLine(): string | null {
    const { past, future } = this.room.time;
    if (past && future) return "Here, the years run both ways.";
    if (future) return "Here, the years run forward.";
    if (past) return "Here, the years run back.";
    return null;
  }

  // --- verbs -----------------------------------------------------------------

  private examine(noun: string): string {
    if (noun === "") return "Examine what?";
    const target = this.resolve(noun);
    if (!target) return "You can't see any such thing.";
    if (isItem(target) && this.itemPlace.get(target.id) === "gone") {
      return "You can't see any such thing.";
    }
    return target.description;
  }

  private take(noun: string): string {
    if (noun === "") return "Take what?";
    if (noun === "all" || noun === "everything") return this.takeAll();

    const target = this.resolve(noun);
    if (!target) return "You can't see any such thing.";

    if (!isItem(target)) {
      return `The ${target.nouns[0]} stays where it is.`;
    }
    const place = this.itemPlace.get(target.id);
    if (place === "inventory") return "You already have it.";
    if (!target.takeable) {
      return target.takeRefusal ?? "That's hardly yours to take.";
    }
    this.itemPlace.set(target.id, "inventory");
    return "Taken.";
  }

  private takeAll(): string {
    const here = this.room.items.filter(
      (it) => this.itemPlace.get(it.id) === "room",
    );
    if (here.length === 0) return "There is nothing here to take.";
    const lines: string[] = [];
    for (const it of here) {
      if (it.takeable) {
        this.itemPlace.set(it.id, "inventory");
        lines.push(`${capitalize(it.nouns[0]!)}: Taken.`);
      } else {
        lines.push(`${capitalize(it.nouns[0]!)}: ${it.takeRefusal ?? "You leave it."}`);
      }
    }
    return lines.join("\n");
  }

  private drop(noun: string): string {
    if (noun === "") return "Drop what?";
    const target = this.resolve(noun);
    if (!target || !isItem(target) || this.itemPlace.get(target.id) !== "inventory") {
      return "You aren't carrying that.";
    }
    this.itemPlace.set(target.id, "room");
    return "Dropped.";
  }

  private inventory(): string {
    const held = this.room.items.filter(
      (it) => this.itemPlace.get(it.id) === "inventory",
    );
    if (held.length === 0) return "You are carrying nothing.";
    return ["You are carrying:", ...held.map((it) => `  ${it.nouns[0]}`)].join("\n");
  }

  private go(direction: string): string {
    if (direction === "") return "Go where?";
    // No spatial exits are built in this one-room slice.
    return "You can't go that way.";
  }

  private stride(way: "past" | "future"): string {
    const open = way === "past" ? this.room.time.past : this.room.time.future;
    if (!open) {
      const reach = way === "past" ? "back" : "on";
      return `You reach ${reach}. The years do not give. Tonight the House holds still.`;
    }
    // With more landings built, this is where a stride would move the player.
    return "The years pour past. You arrive, and it is a different world.";
  }

  private when(): string {
    return `The year is ${this.room.landing}. They call it ${this.room.age}, and mean the walls.`;
  }

  private say(words: string): string {
    if (words.trim() === "") return "Say what?";
    return `You say, "${sentence(words)}" The landlady nods, as if she has heard it before.`;
  }

  private talk(noun: string): string {
    const target = noun === "" ? this.findTalker() : this.resolve(noun);
    if (!target) return "There is no one here by that name.";
    if (isScenery(target) && target.talk) return target.talk;
    return "That doesn't answer.";
  }

  private leaveMark(words: string): string {
    const text = words.trim();
    if (text === "") return "Mark it with what?";
    this.mark = text;
    return `You leave your mark: "${sentence(text)}" You will find it here again.`;
  }

  private read(noun: string): string {
    if (noun === "mark") {
      return this.mark === null
        ? "You have left no mark here."
        : `Your mark reads: "${sentence(this.mark)}"`;
    }
    if (noun === "") return "Read what?";
    const target = this.resolve(noun);
    if (!target) return "You can't see any such thing.";
    if (isItem(target) && target.read) return target.read;
    return "There's nothing to read there.";
  }

  private eat(noun: string): string {
    if (noun === "") return "Eat what?";
    const target = this.resolve(noun);
    if (!target || !isItem(target)) return "That's not for eating.";
    if (this.itemPlace.get(target.id) === "gone") return "You can't see any such thing.";
    if (!target.eat) return "That's not for eating.";
    this.itemPlace.set(target.id, "gone");
    return target.eat;
  }

  // --- lookup ----------------------------------------------------------------

  /** Find an item (in room or hand) or scenery matching a noun phrase. */
  private resolve(noun: string): Item | Scenery | null {
    const visibleItems = this.room.items.filter(
      (it) => this.itemPlace.get(it.id) !== "gone",
    );
    const candidates: Array<Item | Scenery> = [...visibleItems, ...this.room.scenery];

    // Exact phrase match wins.
    for (const c of candidates) {
      if (c.nouns.includes(noun)) return c;
    }
    // Otherwise, match any single word of the phrase against a noun.
    const words = noun.split(" ").filter(Boolean);
    for (const c of candidates) {
      if (words.some((w) => c.nouns.includes(w))) return c;
    }
    return null;
  }

  private findTalker(): Scenery | null {
    return this.room.scenery.find((s) => s.talk) ?? null;
  }
}

// --- helpers -----------------------------------------------------------------

function isItem(x: Examinable): x is Item {
  return "start" in x;
}

function isScenery(x: Examinable): x is Scenery {
  return !("start" in x);
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

/** End a quoted phrase with a period unless it already carries its own stop. */
function sentence(s: string): string {
  const trimmed = s.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : trimmed + ".";
}

/** "brass lamp" -> "a brass lamp"; "oak" -> "an oak". */
function article(noun: string): string {
  const a = /^[aeiou]/i.test(noun) ? "an" : "a";
  return `${a} ${noun}`;
}

const HELP = [
  "This is a text adventure. You type; the House answers.",
  "",
  "Useful words:",
  "  LOOK (L)         see where you are",
  "  EXAMINE (X) it   look closer at a thing",
  "  TAKE / DROP it   pick things up, set them down",
  "  INVENTORY (I)    what you are carrying",
  "  WHEN             what year it is",
  "  SAY something    speak aloud",
  "  MARK something   leave a private note; READ MARK to find it",
  "  WAIT (Z)         let time pass",
  "  AGAIN (G)        do that again",
  "  QUIT             leave (the lamps stay lit)",
  "",
  "Directions are NORTH, SOUTH, EAST, WEST, UP, DOWN.",
  "Two more you will not need tonight: PAST and FUTURE.",
].join("\n");
