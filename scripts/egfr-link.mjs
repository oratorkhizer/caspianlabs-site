// Build step, 2 Oct 2026. Links the creatinine and KFT test pages to the free eGFR calculator
// on caspianhealthcare.in, so a patient holding a creatinine result can turn it into an eGFR
// and a CKD stage, and the calculator gets links from the lab's own pages.
//
// Its own file (not an INSERTS entry in address-fix.mjs) because address-fix.mjs carries
// Telugu, Hindi and Urdu text that cannot be retyped safely through the GitHub connector.
// Chained last in vercel.json buildCommand. Edits api/page.js in place, which is how Vercel
// builds functions. Anchor must match once; skipped if the marker is already there.
// Never fails the build. ASCII only, no em dashes.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = "api/page.js";
const MARKER = "EGFR_TOOL_LINK";
const ANCHOR = "<h2>Test details</h2>";
const SLUGS = ["serum-creatinine-test-hyderabad", "kidney-function-test-hyderabad"];
const BOX =
  '<p style="background:#f2f8fe;border-left:4px solid var(--blue);border-radius:8px;padding:12px 14px">' +
  "<strong>Got your creatinine result?</strong> Turn it into your eGFR and CKD stage with our free " +
  '<a href="https://www.caspianhealthcare.in/tools/egfr" style="color:var(--blue);font-weight:600">eGFR calculator</a>, ' +
  "built by Dr. Khizer Hussain Junaidy, Diabetologist &amp; Bariatric Physician at Caspian Healthcare. " +
  "It takes mg/dL and also tells you how often to recheck.</p>";

if (!existsSync(FILE)) {
  console.warn("egfr-link: missing " + FILE);
} else {
  const t = readFileSync(FILE, "utf8");
  if (t.includes(MARKER)) {
    console.log("egfr-link: already present");
  } else {
    const c = t.split(ANCHOR).length - 1;
    if (c !== 1) {
      console.warn("egfr-link: CHECK anchor matched " + c + " times, skipped");
    } else {
      const rep = "${/* " + MARKER + " */ " + JSON.stringify(SLUGS) + ".includes(t.slug) ? " +
        JSON.stringify(BOX) + ' : ""}\n' + ANCHOR;
      writeFileSync(FILE, t.replace(ANCHOR, () => rep));
      console.log("egfr-link: added to " + FILE);
    }
  }
}
