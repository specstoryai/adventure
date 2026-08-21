#!/usr/bin/env node
// Reachability harness: can a player reach every room from the start?
//
//   npm run eval:reach          markdown report, exit 1 if any room is unreachable
//   npm run eval:reach -- --json  machine-readable report
//
// Deterministic and engine-free: it walks the content data (spatial exits and
// open time strides) exactly as src/world.ts defines moves. The evaluator agent
// runs this first, then plays the reported routes through the real engine.

import { exit, argv, stdout } from "node:process";
import { world } from "../src/content/index.ts";
import { reachability, validateWorld, roomMap } from "../src/world.ts";

const json = argv.includes("--json");
const problems = validateWorld(world);
const reach = reachability(world);
const rooms = roomMap(world);
const pass = problems.length === 0 && reach.unreachable.length === 0;

if (json) {
  stdout.write(
    JSON.stringify(
      {
        verdict: pass ? "PASS" : "FAIL",
        rooms: world.rooms.length,
        reachable: reach.reachable.length,
        problems,
        unreachable: reach.unreachable.map((r) => ({
          id: r.id,
          place: r.place,
          landing: r.landing,
          nearest: nearestFace(r.place, r.id),
        })),
        routes: Object.fromEntries(reach.routes),
      },
      null,
      2,
    ) + "\n",
  );
  exit(pass ? 0 : 1);
}

const lines: string[] = [];
lines.push(`# Reachability`);
lines.push(`verdict: ${pass ? "PASS" : "FAIL"}`);
lines.push(`rooms: ${world.rooms.length}  reachable: ${reach.reachable.length}`);
lines.push("");

if (problems.length > 0) {
  lines.push("## World problems");
  for (const p of problems) lines.push(`- ${p}`);
  lines.push("");
}

if (reach.unreachable.length > 0) {
  lines.push("## Unreachable");
  for (const r of reach.unreachable) {
    lines.push(`### ${r.place} · ${r.landing} (${r.id})`);
    const near = nearestFace(r.place, r.id);
    if (near) {
      lines.push(`- nearest reachable face of this place: ${near.id} (route: ${route(near.id)})`);
      lines.push(`- hint: a PAST/FUTURE stride between these faces, or a spatial exit into ${r.id} from a reachable room`);
    } else {
      lines.push(`- no face of this place is reachable; add a spatial exit into ${r.id} from a reachable room`);
    }
    lines.push("");
  }
}

lines.push("## Routes from start");
for (const id of reach.reachable) {
  const r = rooms.get(id)!;
  lines.push(`- ${r.place} · ${r.landing} (${id}): ${route(id)}`);
}
stdout.write(lines.join("\n") + "\n");
exit(pass ? 0 : 1);

function route(id: string): string {
  const steps = reach.routes.get(id) ?? [];
  return steps.length === 0 ? "(start)" : steps.join(", ");
}

function nearestFace(place: string, except: string): { id: string } | null {
  const face = reach.reachable.find((id) => id !== except && rooms.get(id)!.place === place);
  return face ? { id: face } : null;
}
