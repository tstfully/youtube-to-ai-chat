#!/usr/bin/env node
// Build a self-contained "chat with this video" page from a transcript JSON file.
//
// Usage:
//   node scripts/build-chat-page.mjs <transcript.json> <output.html>
//
// The JSON is what scripts/fetch-transcript.mjs prints, optionally with extra fields:
//   { "video_id", "title", "channel", "segments": [{ "start", "text" }], "suggested_questions": [] }
//
// Requires Node 18+. No dependencies.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("Usage: node scripts/build-chat-page.mjs <transcript.json> <output.html>");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(here, "..", "assets", "chat-template.html"), "utf8");
const src = JSON.parse(readFileSync(inPath, "utf8"));

const segments = (Array.isArray(src.segments) ? src.segments : [])
  .map((s) => ({ start: Math.max(0, Math.floor(Number(s.start) || 0)), text: String(s.text ?? "").trim() }))
  .filter((s) => s.text);

if (!segments.length) {
  console.error("No timestamped segments found in " + inPath + ". The chat page needs a timestamped transcript.");
  process.exit(1);
}

const videoId = typeof src.video_id === "string" && /^[A-Za-z0-9_-]{11}$/.test(src.video_id) ? src.video_id : null;
if (!videoId) console.error("Warning: no valid video_id, so the page will have no embedded player.");

const data = {
  video_id: videoId,
  title: String(src.title ?? ""),
  channel: String(src.channel ?? ""),
  segments,
  suggested_questions: (Array.isArray(src.suggested_questions) ? src.suggested_questions : [])
    .map(String)
    .filter(Boolean)
    .slice(0, 4),
};

// Escape "<" so transcript text can never close the <script> tag it lives in.
const json = JSON.stringify(data).replace(/</g, "\\u003c");

const marker = /(<script id="video-data" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!marker.test(template)) {
  console.error("Template is missing the video-data script tag.");
  process.exit(1);
}
const html = template.replace(marker, (_, open, close) => open + json + close);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${segments.length} transcript lines).`);
