// Caspian Diagnostic Centre: product feed for Meta Commerce Manager (WhatsApp catalog)
// Repo path: /api/whatsapp-catalog.js   ->   GET https://www.caspianlabs.in/catalog.csv
// (vercel.json rewrites /catalog.csv here; /api/whatsapp-catalog also works.)
//
// Public, no secrets. Meta fetches it on a schedule (Commerce Manager > Data sources > Scheduled feed).
// Prices, names and fasting come from the SAME data the /tests and /packages pages render
// (PACKAGES and TESTS in /api/page.js, PRICE in /api/surgical.js), so the catalog cannot drift
// from the site. Change a price there and the feed follows on the next deploy.
//
// Images: catalog-img/<slug>.png, 1024x1024 branded cards made by scripts/catalog-images.py.
// Each card prints the price, so IMG_PRICES (api/_catalog-img.js, written by that script) records
// the price each card was drawn with. If a page price changes and the card was not redrawn, the
// feed sends the plain logo card (catalog-img/_generic.png) for that item instead of a wrong price.
// Redraw with:  python3 scripts/catalog-images.py   (then commit catalog-img/ and api/_catalog-img.js)
//
// Columns: id, title, description, availability, condition, price, link, image_link, brand.
// Descriptions are plain Indian English, under 200 characters: what it checks, sample, fasting.
// No em dashes anywhere (owner's rule).

import { PACKAGES, TESTS } from "./page.js";
import { SURGICAL } from "./surgical.js";
import { IMG_PRICES } from "./_catalog-img.js";

const BASE = "https://www.caspianlabs.in";
const BRAND = "Caspian Diagnostic Centre";

// Homepage "All tests" list order (index.html TESTS array), limited to items that have their own
// /tests page. Tests not listed here follow in /api/page.js order.
const HOME_ORDER = [
  "hba1c-test-hyderabad", "blood-sugar-test-hyderabad", "tsh-test-hyderabad", "lipid-profile-test-hyderabad",
  "liver-function-test-hyderabad", "kidney-function-test-hyderabad", "electrolytes-test-hyderabad",
  "serum-creatinine-test-hyderabad", "blood-urea-test-hyderabad", "uric-acid-test-hyderabad", "cbc-test-hyderabad",
  "esr-test-hyderabad", "ferritin-test-hyderabad", "blood-group-test-hyderabad", "vitamin-d-test-hyderabad",
  "vitamin-b12-test-hyderabad", "calcium-test-hyderabad", "beta-hcg-test-hyderabad", "psa-test-hyderabad",
  "dengue-test-hyderabad", "malaria-test-hyderabad", "typhoid-widal-test-hyderabad", "crp-test-hyderabad",
  "urine-routine-test-hyderabad", "chest-x-ray-hyderabad",
];

// What it checks + sample. Fasting is added from the page data (fasting field) so it stays in sync.
const CHECKS = {
  // Packages
  "full-body-checkup-hyderabad": "60+ parameters: CBC, ESR, HbA1c, lipids, liver, kidney, iron, thyroid, vitamin D, B12, calcium and urine. Blood and urine sample.",
  "essential-health-checkup-hyderabad": "Basic yearly check: CBC, random sugar, lipid profile, liver function, TSH and urine test. Blood and urine sample.",
  "comprehensive-diabetes-screening-hyderabad": "Sugar control and early damage: HbA1c, lipid profile, creatinine and urine ACR for the kidneys. Blood and urine sample.",
  "thyroid-profile-test-hyderabad": "Full thyroid check: T3, T4 and TSH. Blood sample.",
  "metabolic-wellness": "Everything in the Full Body Check Up plus a body composition scan for fat, muscle and metabolic age. Blood and urine sample.",
  "womens-health-checkup-hyderabad": "For women: lipids, kidney, iron, folic acid, vitamin D, B12, calcium, fasting sugar, CA-125 and urine. Blood and urine sample.",
  "senior-citizen-health-checkup-hyderabad": "For elders: HbA1c, fasting sugar, lipids, kidney, iron, folic acid, vitamin D, B12, calcium, PSA (men) and urine tests.",
  "heart-health-checkup-hyderabad": "ECG, 2D echo, blood sugar check and a doctor consultation, all at our centre in one visit.",
  "premium-health-checkup-men-hyderabad": "For men 45+: CBC, HbA1c, advanced lipids, HsCRP, liver, kidney, PSA, vitamin D, B12, cortisol and urine. Blood and urine.",
  "haj-umrah-fitness-package-hyderabad": "Pilgrim fitness tests: CBC, random sugar, kidney function, ECG, chest X-ray and blood group. Blood sample.",
  "surgical-profile-hyderabad": "16 pre-operative tests: CBC, LFT, kidney, electrolytes, clotting, HIV, HBsAg, HCV, blood group, TSH, ECG, chest X-ray.",
  // Tests
  "hba1c-test-hyderabad": "Your average blood sugar over the last 3 months. Blood sample.",
  "blood-sugar-test-hyderabad": "Blood glucose: fasting (FBS), after food (PPBS) or random (RBS). Blood sample.",
  "cbc-test-hyderabad": "Haemoglobin, red cells, white cells and platelets, for anaemia and infection. Blood sample.",
  "tsh-test-hyderabad": "The main screening test for thyroid function. Blood sample.",
  "lipid-profile-test-hyderabad": "Total cholesterol, HDL, LDL and triglycerides, for heart risk. Blood sample.",
  "liver-function-test-hyderabad": "Bilirubin, SGPT, SGOT, ALP, total protein and albumin. Blood sample.",
  "kidney-function-test-hyderabad": "Urea, creatinine, sodium, potassium and chloride. Blood sample.",
  "vitamin-d-test-hyderabad": "Vitamin D (25-OH) level, for bone pain, tiredness and weak bones. Blood sample.",
  "vitamin-b12-test-hyderabad": "Vitamin B12 level, for tiredness, tingling and anaemia. Blood sample.",
  "urine-routine-test-hyderabad": "Complete urine test for infection, kidney problems and sugar in urine. Urine sample.",
  "crp-test-hyderabad": "C-reactive protein, a marker of infection and inflammation. Blood sample.",
  "esr-test-hyderabad": "A simple marker of inflammation, used in fever, joint pain and TB. Blood sample.",
  "serum-creatinine-test-hyderabad": "The key blood marker of kidney function. Blood sample.",
  "uric-acid-test-hyderabad": "Uric acid level, for gout and kidney stones. Blood sample.",
  "blood-urea-test-hyderabad": "Urea level, a kidney marker usually read with creatinine. Blood sample.",
  "ferritin-test-hyderabad": "Your body's iron stores, the key test for iron deficiency. Blood sample.",
  "blood-group-test-hyderabad": "ABO and Rh blood group. Blood sample.",
  "beta-hcg-test-hyderabad": "Pregnancy hormone level, the most sensitive pregnancy test. Blood sample.",
  "psa-test-hyderabad": "Prostate-specific antigen, a prostate screening test for men. Blood sample.",
  "dengue-test-hyderabad": "NS1 antigen with IgG and IgM antibodies, for dengue fever. Blood sample.",
  "malaria-test-hyderabad": "Smear and antigen test for vivax and falciparum malaria. Blood sample.",
  "typhoid-widal-test-hyderabad": "Widal test, a quick screen for typhoid fever. Blood sample.",
  "electrolytes-test-hyderabad": "Sodium, potassium and chloride, for BP patients, elders and dehydration. Blood sample.",
  "calcium-test-hyderabad": "Calcium level for bone health, often done with vitamin D. Blood sample.",
  "ecg-test-hyderabad": "12-lead ECG of the heart rhythm, done at our centre in about 5 minutes. No sample.",
  "2d-echo-test-hyderabad": "Ultrasound scan of the heart's pumping and valves, done at our centre. No sample.",
  "chest-x-ray-hyderabad": "Digital chest X-ray for cough, fever, TB screening and pre-op checks, with report. Done at our centre.",
  "body-composition": "Body fat %, muscle mass, visceral fat, BMR and metabolic age, explained to you. 5-minute scan at our centre.",
  "insulin-fasting-test-hyderabad": "Fasting insulin level, an early sign of insulin resistance. Blood sample.",
  "homa-ir-test-hyderabad": "Insulin resistance score from fasting insulin and fasting sugar. Blood sample.",
  "c-peptide-test-hyderabad": "How much insulin your own pancreas still makes. Blood sample.",
  "urine-acr-test-hyderabad": "Urine albumin/creatinine ratio, the earliest test for kidney damage. Spot urine sample.",
  "anti-tpo-test-hyderabad": "Thyroid antibodies, for autoimmune thyroid disease such as Hashimoto's. Blood sample.",
  "prolactin-test-hyderabad": "Prolactin hormone, for irregular periods, milk discharge and infertility. Blood sample.",
  "testosterone-test-hyderabad": "Total testosterone, the main male hormone. Blood sample.",
  "fsh-test-hyderabad": "FSH hormone, used in fertility, PCOS and menopause. Blood sample.",
  "lh-test-hyderabad": "LH hormone, used in PCOS and fertility checks. Blood sample.",
  "amh-test-hyderabad": "AMH level, an estimate of a woman's egg reserve. Blood sample.",
  "hbsag-test-hyderabad": "Screening test for hepatitis B infection. Blood sample.",
  "hiv-test-hyderabad": "HIV 1 and 2 antibody test, confidential and with your consent. Blood sample.",
  "ra-factor-test-hyderabad": "Rheumatoid factor, a first test for rheumatoid arthritis. Blood sample.",
  "anti-ccp-test-hyderabad": "Anti-CCP antibody, the most specific test for rheumatoid arthritis. Blood sample.",
  "ana-test-hyderabad": "Antinuclear antibody, a screen for autoimmune disease such as lupus. Blood sample.",
  "stool-routine-test-hyderabad": "Stool test for infection, worms, blood and digestion problems. Stool sample.",
  "pt-inr-test-hyderabad": "How fast your blood clots, for warfarin users and before surgery. Blood sample.",
  "d-dimer-test-hyderabad": "Helps rule out a blood clot in the leg or lung. Blood sample.",
  "troponin-test-hyderabad": "Troponin I, the blood test for heart muscle damage. Blood sample.",
  "g6pd-test-hyderabad": "G6PD enzyme level, for G6PD deficiency. Blood sample.",
  "thalassemia-hba2-test-hyderabad": "HbA2 level to find thalassaemia carriers before marriage or pregnancy. Blood sample.",
};

const FASTING = {
  yes: "Fasting: 8 to 12 hours, water is fine.",
  no: "No fasting needed.",
  morning: "No fasting, give the sample in the morning.",
  cycle: "No fasting. Women test on day 2 to 5 of the period.",
  depends: "FBS needs 8 to 12 hours fasting, PPBS is 2 hours after a meal.",
  confirm: "Fasting: our team will confirm when you book.",
};

function shorten(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + ".";
}
const noEm = (s) => String(s).replace(/—/g, ",").replace(/\s+,/g, ",");

// [{ id, title, description, price, link, image, kind, fasting, sample }]. Also read by scripts/catalog-images.py.
export function buildItems() {
  const out = [];
  const add = (kind, slug, name, price, fasting, path, sample) => {
    const checks = CHECKS[slug] || name + ".";
    const f = FASTING[fasting] || FASTING.confirm;
    const description = noEm(shorten(checks + " " + f, 199));
    const imgOk = IMG_PRICES[slug] === price;
    out.push({
      id: slug, kind, title: noEm(name), description, price, fasting: fasting || "confirm", sample: sample || "",
      link: BASE + path,
      image: BASE + "/catalog-img/" + (imgOk ? slug : "_generic") + ".png",
    });
  };
  for (const p of PACKAGES) add("package", p.slug, p.name, p.price, p.fasting, "/packages/" + p.slug);
  add("package", SURGICAL.slug, SURGICAL.name, SURGICAL.price, "no", "/packages/" + SURGICAL.slug);
  const rank = (s) => { const i = HOME_ORDER.indexOf(s); return i < 0 ? HOME_ORDER.length + TESTS.findIndex((t) => t.slug === s) : i; };
  for (const t of [...TESTS].sort((a, b) => rank(a.slug) - rank(b.slug))) {
    add("test", t.slug, t.name, t.price, t.fasting, "/tests/" + t.slug, t.sample);
  }
  return out.filter((x) => Number.isFinite(x.price) && x.price > 0);
}

const COLS = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"];
const q = (v) => '"' + String(v).replace(/"/g, '""').replace(/[\r\n]+/g, " ") + '"';

export function toCsv(items) {
  const rows = [COLS.join(",")];
  for (const it of items) {
    rows.push([it.id, it.title, it.description, "in stock", "new", it.price.toFixed(2) + " INR", it.link, it.image, BRAND].map(q).join(","));
  }
  return rows.join("\r\n") + "\r\n";
}

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return res.status(405).send("Method not allowed");
  const csv = toCsv(buildItems());
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'inline; filename="caspianlabs-catalog.csv"');
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("X-Robots-Tag", "noindex");
  return res.status(200).send(req.method === "HEAD" ? "" : csv);
}
