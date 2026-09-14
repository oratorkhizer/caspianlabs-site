// Site-wide text replacements applied at build time, after scripts/inject-optin.mjs has
// copied the static site into public/. Run from vercel.json buildCommand, chained after it.
//
// Why this file and not the source files: index.html (164KB) and api/page.js (79KB) are too
// large to push through the GitHub connector, and the same string appears in a dozen files.
// One pair here keeps every page consistent.
//
// NOTE: static pages are listed under public/ because that is what gets deployed. API files
// are listed at their real path because Vercel builds functions from api/ in place.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PAIRS = [
  // Sep 2026: the owner's call. Caspian itself is the landmark, not the building name.
  ["Ahmed Plaza", "Opposite Post Office"],
];

const FILES = [
  "public/index.html",
  "public/about.html",
  "public/contact.html",
  "public/pricing.html",
  "public/terms.html",
  "public/privacy.html",
  "public/refund.html",
  "public/cancellation.html",
  "public/shipping.html",
  "api/page.js",
  "api/blog.js",
  "api/lang.js",
  "api/_shell.js",
];

let applied = 0;
for (const file of FILES) {
  if (!existsSync(file)) { console.warn("address-fix: missing " + file); continue; }
  let t = readFileSync(file, "utf8");
  let n = 0;
  for (const [find, rep] of PAIRS) {
    const c = t.split(find).length - 1;
    if (c) { t = t.split(find).join(rep); n += c; }
  }
  if (n) { writeFileSync(file, t); applied += n; console.log("address-fix: " + n + " in " + file); }
}
console.log("address-fix: applied " + applied);
