// A classic two-word-and-up parser with the Infocom conveniences the design asks
// for: abbreviations (N, X, I, Z, G), forgiving noun matching, and multi-word
// verb phrases (LOOK AT, PICK UP, TALK TO). It turns a line of text into a
// Command; the engine decides what a Command means.

export type Verb =
  | "look"
  | "examine"
  | "take"
  | "drop"
  | "inventory"
  | "go"
  | "past"
  | "future"
  | "when"
  | "wait"
  | "again"
  | "say"
  | "talk"
  | "mark"
  | "read"
  | "eat"
  | "help"
  | "quit";

import type { Direction } from "./types.ts";
export type { Direction };

export interface Command {
  verb: Verb;
  /** The cleaned noun phrase, e.g. "brass lamp". Empty string if none. */
  noun: string;
  /** The raw text after the verb, uncleaned (used by SAY and MARK). */
  rest: string;
}

export interface ParseError {
  /** The word we didn't understand, for the "I don't know the word" reply. */
  unknownWord: string;
}

export type ParseResult =
  | { ok: true; command: Command }
  | { ok: false; error: ParseError };

const DIRECTIONS: Record<string, Direction> = {
  north: "north",
  n: "north",
  south: "south",
  s: "south",
  east: "east",
  e: "east",
  west: "west",
  w: "west",
  up: "up",
  u: "up",
  down: "down",
  d: "down",
  in: "in",
  inside: "in",
  out: "out",
  outside: "out",
};

// Single-word verb synonyms and abbreviations -> canonical verb.
const VERBS: Record<string, Verb> = {
  look: "look",
  l: "look",
  examine: "examine",
  x: "examine",
  inspect: "examine",
  describe: "examine",
  take: "take",
  get: "take",
  grab: "take",
  carry: "take",
  drop: "drop",
  discard: "drop",
  inventory: "inventory",
  i: "inventory",
  inv: "inventory",
  past: "past",
  future: "future",
  when: "when",
  wait: "wait",
  z: "wait",
  again: "again",
  g: "again",
  say: "say",
  speak: "say",
  shout: "say",
  talk: "talk",
  greet: "talk",
  mark: "mark",
  read: "read",
  eat: "eat",
  help: "help",
  "?": "help",
  commands: "help",
  verbs: "help",
  go: "go",
  walk: "go",
  move: "go",
  run: "go",
  quit: "quit",
  q: "quit",
  exit: "quit",
  bye: "quit",
};

// Multi-word verb phrases, longest first, mapped to a canonical verb. The rest
// of the line becomes the noun phrase.
const PHRASES: Array<[string, Verb]> = [
  ["look at", "examine"],
  ["look in", "examine"],
  ["look inside", "examine"],
  ["pick up", "take"],
  ["put down", "drop"],
  ["talk to", "talk"],
  ["talk with", "talk"],
  ["speak to", "talk"],
];

const ARTICLES = new Set(["the", "a", "an", "some", "my", "your", "at", "to"]);

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9?'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip leading articles and filler so "the brass lamp" matches "brass lamp". */
function cleanNoun(phrase: string): string {
  const words = phrase.split(" ").filter(Boolean);
  while (words.length > 0 && ARTICLES.has(words[0]!)) {
    words.shift();
  }
  return words.join(" ");
}

export function parse(input: string): ParseResult | null {
  const line = normalize(input);
  if (line === "") return null;

  // The original words, case and punctuation intact, so SAY and MARK keep the
  // player's own text. `rest` is drawn from these; `noun` from the normalized
  // line, which is what the engine matches against.
  const rawWords = input.trim().split(/\s+/);

  // Bare direction, e.g. "n" or "north".
  const asDirection = DIRECTIONS[line];
  if (asDirection) {
    return { ok: true, command: { verb: "go", noun: asDirection, rest: line } };
  }

  // Multi-word verb phrases first, so "look at" beats "look". Every phrase is
  // two words, so the raw remainder starts at the third word.
  for (const [phrase, verb] of PHRASES) {
    if (line === phrase || line.startsWith(phrase + " ")) {
      const noun = cleanNoun(line.slice(phrase.length).trim());
      const rest = rawWords.slice(2).join(" ");
      return { ok: true, command: { verb, noun, rest } };
    }
  }

  const spaceAt = line.indexOf(" ");
  const head = spaceAt === -1 ? line : line.slice(0, spaceAt);
  const normRest = spaceAt === -1 ? "" : line.slice(spaceAt + 1).trim();
  const rest = rawWords.slice(1).join(" ");

  const verb = VERBS[head];
  if (!verb) {
    return { ok: false, error: { unknownWord: head } };
  }

  // GO takes a direction as its noun; normalize it.
  if (verb === "go") {
    const cleaned = cleanNoun(normRest);
    const dir = DIRECTIONS[cleaned] ?? cleaned;
    return { ok: true, command: { verb: "go", noun: dir, rest } };
  }

  // LOOK with a noun means EXAMINE that noun ("look lamp").
  if (verb === "look" && normRest !== "") {
    return { ok: true, command: { verb: "examine", noun: cleanNoun(normRest), rest } };
  }

  return { ok: true, command: { verb, noun: cleanNoun(normRest), rest } };
}
