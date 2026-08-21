#!/usr/bin/env node
import * as readline from "node:readline";
import { stdin, stdout, env, exit } from "node:process";
import { Game } from "./engine.ts";
import { world } from "./content/index.ts";

// The transcript arrives with a slight typewriter cadence (fast, skippable),
// per the design. It turns itself off when output isn't a terminal (pipes,
// tests) so captured output stays clean.
const TYPE_MS = Number.parseInt(env.EVERWYN_TYPE_MS ?? "5", 10);
const TYPEWRITER =
  !!stdout.isTTY && env.EVERWYN_NO_TYPEWRITER !== "1" && TYPE_MS > 0;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const rl = readline.createInterface({ input: stdin, output: stdout });

/** Print text with a typewriter reveal. Any keypress skips to the end. */
async function typeOut(text: string): Promise<void> {
  if (!TYPEWRITER) {
    stdout.write(text + "\n");
    return;
  }
  rl.pause();
  const wasRaw = stdin.isRaw ?? false;
  stdin.setRawMode?.(true);

  let skip = false;
  const onData = (buf: Buffer) => {
    if (buf.includes(0x03)) {
      // Ctrl-C during the animation: leave cleanly.
      stdout.write("\n");
      exit(0);
    }
    skip = true;
  };
  stdin.on("data", onData);

  try {
    for (const ch of text) {
      stdout.write(ch);
      if (!skip && ch !== "\n") await sleep(TYPE_MS);
    }
    stdout.write("\n");
  } finally {
    stdin.removeListener("data", onData);
    stdin.setRawMode?.(wasRaw);
    rl.resume();
  }
}

// Ctrl-C at the prompt closes the session, not just the current line.
rl.on("SIGINT", () => rl.close());

async function main(): Promise<void> {
  const game = new Game(world);
  await typeOut(game.intro());

  rl.setPrompt("\n> ");
  rl.prompt();

  // The async iterator delivers lines with backpressure, so it behaves the same
  // whether input is typed at a terminal or piped in from a file.
  for await (const line of rl) {
    if (line.trim() === "") {
      rl.prompt();
      continue;
    }
    const turn = game.handle(line);
    await typeOut("\n" + turn.text);
    if (turn.quit) break;
    rl.prompt();
  }

  rl.close();
  stdout.write("\n");
}

await main();
