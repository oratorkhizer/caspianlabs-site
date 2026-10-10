// Build step, 11 Oct 2026. Major Surgical Profile (Rs 2,500, report in 3 hours, 24/7).
// Dr Khizer's decisions that day: retire the Pre-Operative Mini (Rs 1,200) and Maxi
// (Rs 2,000) profiles, list the new profile in the homepage test menu, link it to its
// page at /packages/surgical-profile-hyderabad (api/surgical.js), and promote it with a
// band above the test menu.
//
// Its own file so index.html (170 KB) does not have to be re-uploaded. Runs on
// public/index.html after inject-optin.mjs has copied the site. Each edit is anchored
// to text that must match exactly once; skipped if the marker is already there.
// Never fails the build. No em dashes.
//
// The CODE_MAP entries for the old profiles in api/pay.js and api/book.js are left in
// place on purpose: they are harmless, and touching those files risks live bookings.
// The new profile has no Crelio code yet, so its "Book" button falls back to WhatsApp.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = "public/index.html";
const NAME = "Major Surgical Profile";
const PAGE = "/packages/surgical-profile-hyderabad";
const CONTENTS = "Complete Blood Count (CBC), ESR, Liver Function Test (LFT), Blood Urea, Creatinine, Serum, Electrolytes (Sodium, Potassium, Chloride), Blood Sugar Random (RBS), Prothrombin Time (PT/INR), Bleeding Time & Clotting Time (BT/CT), HIV-1&2 Antibody, Hepatitis B Surface Antigen (HBsAg), Hepatitis C Virus Antibody, Blood Grouping ABO & Rh Typing, TSH, ECG, Chest X-ray. Report in 3 hours, 24/7.";

const BAND =
  '<!-- SURGICAL_PROFILE_BAND -->\n' +
  '<section class="sec" style="padding-top:8px;padding-bottom:8px">\n' +
  '  <div class="wrap">\n' +
  '    <a href="' + PAGE + '" style="display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;justify-content:space-between;' +
  'background:#eef5fb;border:1px solid #cfe1f0;border-left:6px solid #0A5C9E;border-radius:14px;padding:18px 22px;text-decoration:none;color:#152b3c">\n' +
  '      <span style="flex:1 1 320px">\n' +
  '        <span style="display:block;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#0A5C9E">Surgery or admission coming up?</span>\n' +
  '        <span style="display:block;font-size:20px;font-weight:700;margin:4px 0">Full pre-operative surgical profile, report in 3 hours</span>\n' +
  '        <span style="display:block;font-size:15px;color:#5b6b7a">16 tests including ECG and chest X-ray, done in one visit. Day or night, all 7 days.</span>\n' +
  '      </span>\n' +
  '      <span style="flex:0 0 auto;text-align:right">\n' +
  '        <span style="display:block;font-size:26px;font-weight:800;color:#0A5C9E">₹2,500</span>\n' +
  '        <span style="display:inline-block;margin-top:6px;background:#0A5C9E;color:#fff;font-weight:700;border-radius:10px;padding:9px 16px;font-size:15px">See what\'s included →</span>\n' +
  '      </span>\n' +
  '    </a>\n' +
  '  </div>\n' +
  '</section>\n\n';

// [label, marker, anchor, replacement]
const EDITS = [
  ["menu item", '{n:"' + NAME + '"',
    '    {n:"Pre-Operative Mini Profile", c:"Pre-op & Other", p:1200, k:"surgery preop pre operative"},\n' +
    '    {n:"Pre-Operative Maxi Profile", c:"Pre-op & Other", p:2000, k:"surgery preop pre operative"},\n',
    '    {n:"' + NAME + '", c:"Pre-op & Other", p:2500, pop:1, k:"surgery surgical preop pre-op pre operative pre anaesthetic anesthesia admission fitness 3 hours urgent ecg x-ray"},\n'],
  ["contents", '"' + NAME + '":"', null, null], // handled below (two lines, matched by prefix)
  ["page link", '"' + NAME + '": "' + PAGE + '"', 'var PAGE_OF={', 'var PAGE_OF={"' + NAME + '": "' + PAGE + '", '],
  ["band", "SURGICAL_PROFILE_BAND", "<!-- ALL TESTS DIRECTORY -->", BAND + "<!-- ALL TESTS DIRECTORY -->"],
];

if (!existsSync(FILE)) {
  console.warn("surgical: missing " + FILE);
} else {
  let t = readFileSync(FILE, "utf8");
  for (const [label, marker, anchor, rep] of EDITS) {
    if (t.includes(marker)) { console.log("surgical: " + label + " already present"); continue; }
    if (label === "contents") {
      // Replace the Mini and Maxi contents lines with one line for the new profile.
      const re = /\n[ \t]*"Pre-Operative Mini Profile":"[^"\n]*",?[ \t]*\n[ \t]*"Pre-Operative Maxi Profile":"[^"\n]*"(,?)/;
      const m = t.match(re);
      if (!m) { console.warn("surgical: CHECK contents lines not found, skipped"); continue; }
      t = t.replace(re, () => '\n    "' + NAME + '":"' + CONTENTS + '"' + m[1]);
      console.log("surgical: contents replaced");
      continue;
    }
    const c = t.split(anchor).length - 1;
    if (c !== 1) { console.warn("surgical: CHECK " + label + " anchor matched " + c + " times, skipped"); continue; }
    t = t.replace(anchor, () => rep);
    console.log("surgical: " + label + " done");
  }
  writeFileSync(FILE, t);
  if (t.includes("Pre-Operative Mini Profile") || t.includes("Pre-Operative Maxi Profile")) {
    console.warn("surgical: CHECK old pre-op profile names still present in " + FILE);
  }
}
