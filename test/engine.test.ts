import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/engine.ts";
import { turningHouse } from "../src/content/turning-house.ts";

function newGame() {
  return new Game(turningHouse);
}

test("intro shows the room title and first look", () => {
  const g = newGame();
  const intro = g.intro();
  assert.match(intro, /EVERWYN/);
  assert.match(intro, /The Turning House/);
  assert.match(intro, /common room of an inn/);
});

test("look is long on arrival, short on return", () => {
  const g = newGame();
  g.intro(); // marks visited
  const again = g.handle("look").text;
  assert.match(again, /The common room, low and warm/);
  assert.doesNotMatch(again, /outlasted the road/);
});

test("examine a visible object returns its description", () => {
  const g = newGame();
  assert.match(g.handle("x lamp").text, /brass lamp/i);
  assert.match(g.handle("examine landlady").text, /kept this fire/);
});

test("examine something absent is refused in voice", () => {
  const g = newGame();
  assert.equal(g.handle("examine dragon").text, "You can't see any such thing.");
});

test("take, inventory, and drop move an item", () => {
  const g = newGame();
  assert.equal(g.handle("take lamp").text, "Taken.");
  assert.match(g.handle("inventory").text, /lamp/);
  assert.equal(g.handle("drop lamp").text, "Dropped.");
  assert.equal(g.handle("inventory").text, "You are carrying nothing.");
});

test("a protected mark cannot be taken", () => {
  const g = newGame();
  const r = g.handle("take coin").text;
  assert.match(r, /You let it lie/);
  assert.equal(g.handle("inventory").text, "You are carrying nothing.");
});

test("take all reports each item", () => {
  const g = newGame();
  const r = g.handle("take all").text;
  assert.match(r, /Taken\./);
  assert.match(r, /let it lie/i); // the coin refuses
});

test("temporal exits decline in voice when the room has none", () => {
  const g = newGame();
  assert.match(g.handle("past").text, /House holds still/);
  assert.match(g.handle("future").text, /House holds still/);
});

test("when reports the landing", () => {
  const g = newGame();
  assert.match(g.handle("when").text, /2099 BA/);
});

test("marks are private and readable back", () => {
  const g = newGame();
  assert.equal(g.handle("read mark").text, "You have left no mark here.");
  assert.match(g.handle("mark a note to myself").text, /You leave your mark/);
  assert.match(g.handle("read mark").text, /a note to myself/);
});

test("talking to the landlady returns her line", () => {
  const g = newGame();
  assert.match(g.handle("talk to landlady").text, /Late to be traveling/);
});

test("eating the bread consumes it", () => {
  const g = newGame();
  assert.match(g.handle("eat bread").text, /You eat the bread/);
  assert.equal(g.handle("examine bread").text, "You can't see any such thing.");
});

test("unknown verbs get the Zork-style reply", () => {
  const g = newGame();
  assert.equal(g.handle("frotz").text, 'I don\'t know the word "frotz".');
});

test("again repeats the last command", () => {
  const g = newGame();
  g.handle("take lamp");
  g.handle("drop lamp");
  assert.equal(g.handle("take lamp").text, "Taken.");
  assert.equal(g.handle("g").text, "You already have it.");
});

test("quit sets the quit flag", () => {
  const g = newGame();
  const turn = g.handle("quit");
  assert.equal(turn.quit, true);
});

test("going nowhere is declined", () => {
  const g = newGame();
  assert.equal(g.handle("north").text, "You can't go that way.");
});

test("say echoes the player's words without doubling punctuation", () => {
  const g = newGame();
  assert.match(g.handle("say Hello, House!").text, /You say, "Hello, House!" /);
  assert.match(g.handle("say plainly").text, /You say, "plainly\." /);
});

test("reading a readable item works; reading empty air does not", () => {
  const g = newGame();
  assert.match(g.handle("read coin").text, /whole of what it says/);
  assert.equal(g.handle("read fire").text, "There's nothing to read there.");
});
