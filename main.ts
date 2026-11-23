// Dad Joke Showdown — entry program (program/v1, Node 22, stdlib only).
// Writes one dad joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output/entry.txt), then reads it back and verifies the bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate allows at most 200 characters; keep the limit in one named
// place so every length check below reads from the same source of truth.
const MAX_CHARS = 200;

const JOKE =
  'I asked my dad for money to buy a calendar. He said, "Son, your days are numbered."';

// Gate: non-empty, at most MAX_CHARS characters, at least one sentence.
// Sentence-terminating periods are counted after removing the dot inside
// the proper noun "make.fun" (not used in this joke, but kept for safety).
if (JOKE.trim().length === 0) {
  throw new Error("Joke must not be empty or only white space");
}
if (JOKE.length < 1 || JOKE.length > MAX_CHARS) {
  throw new Error(`Joke must be 1-${MAX_CHARS} characters, got ${JOKE.length}`);
}
const withoutMakeFun = JOKE.replaceAll("make.fun", "makefun");
const sentenceEnds = (withoutMakeFun.match(/[.!?]/g) || []).length;
if (sentenceEnds < 1) {
  throw new Error("Joke must contain at least one sentence");
}
if (JOKE.trim() !== JOKE) {
  throw new Error("Joke must not have leading or trailing white space");
}
// Gate: exactly one line. A stray newline would split the entry into two
// lines on the page and break the "one dad joke, told out loud" delivery.
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  throw new Error("Joke must be a single line with no newline characters");
}
// Gate: a joke needs more than a word or two to land a pun. Require at
// least three words so a one-word placeholder can never slip through.
const wordCount = JOKE.trim().split(/\s+/).length;
if (wordCount < 3) {
  throw new Error(`Joke must contain at least 3 words, got ${wordCount}`);
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
