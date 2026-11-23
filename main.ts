// Dad Joke Showdown — entry program (program/v1, Node 22, stdlib only).
// Writes one dad joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  'I asked my dad for money to buy a calendar. He said, "Son, your days are numbered."';

// Gate: non-empty, at most 200 characters, at least one sentence.
// Sentence-terminating periods are counted after removing the dot inside
// the proper noun "make.fun" (not used in this joke, but kept for safety).
if (JOKE.trim().length === 0) {
  throw new Error("Joke must not be empty or only white space");
}
if (JOKE.length < 1 || JOKE.length > 200) {
  throw new Error(`Joke must be 1-200 characters, got ${JOKE.length}`);
}
const withoutMakeFun = JOKE.replaceAll("make.fun", "makefun");
const sentenceEnds = (withoutMakeFun.match(/[.!?]/g) || []).length;
if (sentenceEnds < 1) {
  throw new Error("Joke must contain at least one sentence");
}
if (JOKE.trim() !== JOKE) {
  throw new Error("Joke must not have leading or trailing white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, JOKE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== JOKE) {
  throw new Error("Verification failed: entry.txt does not match the joke");
}

console.log(`Wrote ${outPath}: ${JOKE}`);
console.log(`Characters: ${JOKE.length}, sentences: ${sentenceEnds}`);
