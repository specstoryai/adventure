import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.ts";

function cmd(input: string) {
  const r = parse(input);
  assert.ok(r && r.ok, `expected a command for ${JSON.stringify(input)}`);
  return r.command;
}

test("empty input parses to null", () => {
  assert.equal(parse(""), null);
  assert.equal(parse("   "), null);
});

test("abbreviations expand to canonical verbs", () => {
  assert.equal(cmd("l").verb, "look");
  assert.equal(cmd("x lamp").verb, "examine");
  assert.equal(cmd("i").verb, "inventory");
  assert.equal(cmd("z").verb, "wait");
  assert.equal(cmd("g").verb, "again");
});

test("bare directions become a go command", () => {
  assert.deepEqual(cmd("n"), { verb: "go", noun: "north", rest: "n" });
  assert.equal(cmd("up").noun, "up");
});

test("articles and filler are stripped from nouns", () => {
  assert.equal(cmd("take the brass lamp").noun, "brass lamp");
  assert.equal(cmd("examine the coin").noun, "coin");
});

test("multi-word verb phrases resolve", () => {
  assert.equal(cmd("look at lamp").verb, "examine");
  assert.equal(cmd("look at lamp").noun, "lamp");
  assert.equal(cmd("pick up bread").verb, "take");
  assert.equal(cmd("talk to landlady").verb, "talk");
  assert.equal(cmd("talk to landlady").noun, "landlady");
});

test("LOOK with a noun means EXAMINE", () => {
  assert.equal(cmd("look lamp").verb, "examine");
  assert.equal(cmd("look").verb, "look");
});

test("SAY and MARK keep their raw text (case intact) in rest", () => {
  assert.equal(cmd("say hello there").rest, "hello there");
  assert.equal(cmd("mark I Was Here").rest, "I Was Here");
});

test("unknown words are reported", () => {
  const r = parse("frotz");
  assert.ok(r && !r.ok);
  assert.equal(r.error.unknownWord, "frotz");
});

test("temporal verbs have no aliases but parse themselves", () => {
  assert.equal(cmd("past").verb, "past");
  assert.equal(cmd("future").verb, "future");
});
