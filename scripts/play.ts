#!/usr/bin/env node
// Scripted playthrough: run a sequence of commands through the real engine and
// show where each one lands. The evaluator uses this to confirm the routes
// that `npm run eval:reach` reports actually work in play.
//
//   node scripts/play.ts FUTURE DOWN "TAKE LAMP"
//   node scripts/play.ts --quiet FUTURE DOWN     # only the final location
//
// Prints each command, the engine's reply, and `[where: <room id>]`. Exit code
// is 0; use the printed locations (or --expect <room id>) to judge.
//
//   node scripts/play.ts --expect cellar:2099-aa FUTURE DOWN   # exit 1 if not there

import { argv, exit, stdout } from "node:process";
import { Game } from "../src/engine.ts";
import { world } from "../src/content/index.ts";

const args = argv.slice(2);
const quiet = args.includes("--quiet");
const expectIdx = args.indexOf("--expect");
const expected = expectIdx >= 0 ? args[expectIdx + 1] : undefined;
const commands = args.filter((a, i) => a !== "--quiet" && a !== "--expect" && i !== expectIdx + 1);

const game = new Game(world);
if (!quiet) stdout.write(game.intro() + "\n[where: " + game.where() + "]\n");
for (const cmd of commands) {
  const turn = game.handle(cmd);
  if (!quiet) stdout.write(`\n> ${cmd}\n${turn.text}\n[where: ${game.where()}]\n`);
}
if (quiet) stdout.write(game.where() + "\n");
if (expected !== undefined && game.where() !== expected) {
  stdout.write(`\nEXPECTED ${expected} but ended in ${game.where()}\n`);
  exit(1);
}
