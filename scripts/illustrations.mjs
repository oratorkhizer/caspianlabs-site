// Adds the illustration set (Sep 2026) to the site at build time. Chained LAST in the
// vercel.json buildCommand, after inject-optin.mjs and address-fix.mjs.
//
// The image files live in /illus at the repo root (uploaded through the GitHub web UI, because
// the connector cannot push binary files). inject-optin.mjs copies that folder into public/.
//
// RULE FROM THE OWNER: every illustration on the site is unique. One file per page, never reused.
// To add a page: add one new file to /illus and one new line to ILLUS below.
//
// SAFETY: each illustration is only wired in when its file really exists in /illus, so a missing
// upload can never produce a broken image. This script never fails the build.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// slug (or key) -> [file name without extension, alt text]
const ILLUS = {
  // packages
  "full-body-checkup-hyderabad": ["full-body-checkup", "Illustration: a full body check-up looks at the heart, liver, kidneys, thyroid, bones and blood"],
  "essential-health-checkup-hyderabad": ["essential-checkup", "Illustration: a nurse taking a blood sample from a young working adult"],
  "comprehensive-diabetes-screening-hyderabad": ["diabetes-screening", "Illustration: a man checking his blood sugar on a glucometer beside a balanced meal"],
  "thyroid-profile-test-hyderabad": ["thyroid-profile", "Illustration: the thyroid gland at the front of the neck, with blood sample tubes"],
  "metabolic-wellness": ["metabolic-wellness", "Illustration: a person standing on a body composition analyser"],
  "womens-health-checkup-hyderabad": ["womens-health", "Illustration: three women of different ages, for the women's health profile"],
  "senior-citizen-health-checkup-hyderabad": ["senior-citizen", "Illustration: an elderly couple walking in a park"],
  "premium-health-checkup-men-hyderabad": ["premium-men", "Illustration: a man in his fifties going through his results with a doctor"],
  "haj-umrah-fitness-package-hyderabad": ["haj-umrah", "Illustration: two pilgrims ready to travel, with a stethoscope and a fitness certificate"],
  // tests
  "hba1c-test-hyderabad": ["hba1c", "Illustration: sugar attached to red blood cells over three months, which is what HbA1c measures"],
  "blood-sugar-test-hyderabad": ["blood-sugar", "Illustration: a fingertip blood drop on a glucometer test strip"],
  "cbc-test-hyderabad": ["cbc", "Illustration: red cells, white cells and platelets seen under a microscope"],
  "tsh-test-hyderabad": ["tsh", "Illustration: the pituitary gland sending its TSH signal to the thyroid gland"],
  "lipid-profile-test-hyderabad": ["lipid-profile", "Illustration: cholesterol plaque narrowing an artery"],
  "liver-function-test-hyderabad": ["liver-function", "Illustration: the liver with a blood sample tube"],
  "kidney-function-test-hyderabad": ["kidney-function", "Illustration: the kidneys, ureters and bladder"],
  "vitamin-d-test-hyderabad": ["vitamin-d", "Illustration: a woman walking in morning sunlight, the main source of vitamin D"],
  "vitamin-b12-test-hyderabad": ["vitamin-b12", "Illustration: milk, eggs and fish beside a nerve cell"],
  "urine-routine-test-hyderabad": ["urine-routine", "Illustration: a urine sample container and a dipstick"],
  "crp-test-hyderabad": ["crp", "Illustration: an inflamed knee joint and a thermometer"],
  "esr-test-hyderabad": ["esr", "Illustration: ESR tubes with settled red cells beside a sand timer"],
  "serum-creatinine-test-hyderabad": ["creatinine", "Illustration: creatinine made in muscle and cleared by the kidney"],
  "uric-acid-test-hyderabad": ["uric-acid", "Illustration: uric acid crystals in a painful big toe joint"],
  "blood-urea-test-hyderabad": ["blood-urea", "Illustration: urea made in the liver from protein and cleared by the kidney"],
  "ferritin-test-hyderabad": ["ferritin", "Illustration: the body's iron stores, with iron-rich foods"],
  "blood-group-test-hyderabad": ["blood-group", "Illustration: blood bags and a blood grouping tile"],
  "beta-hcg-test-hyderabad": ["beta-hcg", "Illustration: a pregnant woman with a blood sample tube"],
  "psa-test-hyderabad": ["psa", "Illustration: a man in his sixties wearing a blue awareness ribbon"],
  "dengue-test-hyderabad": ["dengue", "Illustration: the striped Aedes mosquito, fever and platelets"],
  "malaria-test-hyderabad": ["malaria", "Illustration: a person with chills in bed and a mosquito at the window"],
  "typhoid-widal-test-hyderabad": ["typhoid", "Illustration: hand washing, and caution with outside food and water"],
  "electrolytes-test-hyderabad": ["electrolytes", "Illustration: water, salt and lemon, the three electrolytes and a heartbeat line"],
  "calcium-test-hyderabad": ["calcium", "Illustration: a bone, a tooth, milk and curd"],
  "body-composition": ["body-composition", "Illustration: body weight split into muscle, fat and water"],
  // single-use slots
  "404": ["not-found", "Illustration: a lab technician looking for a missing test tube"],
  "abg": ["abg", "Illustration: the lungs and an arterial blood sample syringe kept on ice"],
  "home-band": ["home-collection", "Illustration: our phlebotomist arriving at a patient's home for sample collection"],
  "home-why": ["why-caspian", "Illustration: a lab scientist checking a sample beside an analyser"],
};

const W = 1400, H = 781;
const has = (key) => ILLUS[key] && existsSync("illus/" + ILLUS[key][0] + ".jpg");
const log = (m) => console.log("illustrations: " + m);

// The owner's rule, checked on every build.
const names = Object.values(ILLUS).map((v) => v[0]);
const dup = names.filter((n, i) => names.indexOf(n) !== i);
if (dup.length) console.warn("illustrations: CHECK duplicate file used twice: " + dup.join(", "));

function patch(file, edits) {
  if (!existsSync(file)) { log("skip, no " + file); return; }
  let src = readFileSync(file, "utf8"), done = 0;
  for (const [find, repl, label] of edits) {
    const n = src.split(find).length - 1;
    if (n !== 1) { console.warn("illustrations: CHECK " + file + " anchor '" + label + "' matched " + n + " times, skipped"); continue; }
    src = src.replace(find, () => repl); done++;
  }
  writeFileSync(file, src);
  log(file + ": " + done + "/" + edits.length + " edits");
}

try {
  const present = Object.keys(ILLUS).filter(has);
  log(present.length + " of " + Object.keys(ILLUS).length + " files found in /illus");

  // 1. Landing pages (api/page.js): pages with no real photo get their own illustration.
  const mapJs = JSON.stringify(Object.fromEntries(present.map((k) => [k, ILLUS[k]])));
  const helper = `
/* Illustrations: injected at build by scripts/illustrations.mjs. One unique file per page. */
const ILLUS = ${mapJs};
function illusUrl(key) { return ILLUS[key] ? BASE + "/illus/" + ILLUS[key][0] + ".jpg" : ""; }
function illusFig(key) {
  if (!ILLUS[key]) return "";
  return \`<figure class="ph"><img src="/illus/\${ILLUS[key][0]}.jpg" alt="\${esc(ILLUS[key][1])}" width="${W}" height="${H}" loading="lazy" decoding="async"></figure>\`;
}
`;
  patch("api/page.js", [
    ["\nconst HOME_PAGE = {", helper + "\nconst HOME_PAGE = {", "helper"],
    ["${photoFig(p.photo)}<h2>About this package</h2>", "${photoFig(p.photo) || illusFig(p.slug)}<h2>About this package</h2>", "package figure"],
    ["${photoFig(t.photo)}<h2>What does this test check?</h2>", "${photoFig(t.photo) || illusFig(t.slug)}<h2>What does this test check?</h2>", "test figure"],
    ["bodyHtml: body, ogImage: photoUrl(p.photo),", "bodyHtml: body, ogImage: photoUrl(p.photo) || illusUrl(p.slug),", "package og"],
    ["bodyHtml: body, ogImage: photoUrl(t.photo),", "bodyHtml: body, ogImage: photoUrl(t.photo) || illusUrl(t.slug),", "test og"],
    ["bodyHtml: `<div class=\"card\"><p>Sorry,", "bodyHtml: `<div class=\"card\">${illusFig(\"404\")}<p>Sorry,", "404 figure"],
  ]);

  // 2. ABG page keeps its lab photo on top; the illustration sits lower down.
  if (has("abg")) {
    patch("api/abg.js", [[
      "<h2>What the report shows</h2>",
      `<figure class="ph"><img src="/illus/abg.jpg" alt="${ILLUS.abg[1]}" width="${W}" height="${H}" loading="lazy" decoding="async"></figure>\n<h2>What the report shows</h2>`,
      "abg figure",
    ]]);
  }

  // 3. Homepage: home-collection band and the Why Caspian section.
  const css = `<style>
.band.has-il{grid-template-columns:1.25fr 1fr}
.band.has-il .act{grid-column:1}
.band .band-il{grid-column:2;grid-row:1 / span 2;width:100%;height:auto;border-radius:16px;display:block;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.why-il{max-width:620px;margin:26px auto 6px}
.why-il img{width:100%;height:auto;display:block;border-radius:18px}
@media(max-width:900px){.band.has-il{grid-template-columns:1fr}.band .band-il{grid-column:1;grid-row:auto;order:-1}}
</style>
</head>`;
  const homeEdits = [];
  if (has("home-band")) homeEdits.push(['<div class="band">', `<div class="band has-il"><img class="band-il" src="/illus/home-collection.jpg" alt="${ILLUS["home-band"][1]}" width="${W}" height="${H}" loading="lazy" decoding="async">`, "band"]);
  if (has("home-why")) homeEdits.push(['<div class="feat-grid">', `<figure class="why-il"><img src="/illus/why-caspian.jpg" alt="${ILLUS["home-why"][1]}" width="${W}" height="${H}" loading="lazy" decoding="async"></figure>\n    <div class="feat-grid">`, "why"]);
  if (homeEdits.length) { homeEdits.push(["</head>", css, "css"]); patch("public/index.html", homeEdits); }
} catch (e) {
  console.warn("illustrations: CHECK script error, site built without illustrations: " + (e && e.message));
}
