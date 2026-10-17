// Caspian Diagnostic Centre: Crelio-priced catalog for Caspian's own systems (Vercel Serverless Function)
// Repo path: /api/catalog.js   →   GET https://www.caspianlabs.in/api/catalog
//
// Used by the WhatsApp brain (Supabase edge function wa-brain) once a day to refresh its
// lab_prices table, so the prices it quotes on WhatsApp follow Crelio, the same live list
// /api/pay charges from. Not for the browser: it needs the header
//   x-catalog-key: <LAB_CATALOG_KEY>
//
// Env vars: LAB_CATALOG_KEY (shared secret, same value as wa_settings.lab_catalog_key in Supabase),
//           CRELIO_TOKEN, CRELIO_TESTS_BASE / CRELIO_BASE (same as /api/pay).
// Until LAB_CATALOG_KEY is set this returns 503 notConfigured, so it is safe to deploy any time.
//
// Response: { ok, at, count, items: [{ name, code, price }], mapped: [{ name, code, price }] }
//   items  = every priced entry in Crelio's getAllTestsAndProfiles
//   mapped = the website's booking names (CODE_MAP) priced exactly the way /api/pay prices them
//            ("A + B" codes are summed; an item Crelio cannot price is left out, never guessed).

import crypto from "node:crypto";

// MAINTENANCE RULE: keep in sync with CODE_MAP in /api/pay.js and /api/book.js.
const CODE_MAP = {
  "Full Body Check Up": "FULL BODY CHECK UP",
  "Caspian Essential Checkup": "Caspian Essential Checkup",
  "General Health Check": "PG1",
  "Clinova Mini Health Check": "PHP01",
  "Clinova Health Screen": "PHP06",
  "Clinova Master Health Screen": "PHP07",
  "Complete Metabolic Panel": "Complete Metabolic Panel",
  "Metabolic Wellness + InBody": "RAMZAN FITNESS CHECKUP",
  "Metabolic Wellness (without InBody)": "Metabolic Wellness Checkup",
  "Premium Health Check — Men 45+": "PREMIUM HEALTH CHECK FOR MEN ABOVE 45",
  "Women's Health Profile": "PHP03",
  "Haj / Umrah Fitness": "HAJI PROFILE",
  "Comprehensive Diabetes Screening": "COMPREHENSIVE DIABETES  SCREENING",
  "Diabetes Monitoring Mini Profile": "PD03",
  "Diabetes Monitoring Maxi Profile": "PD04",
  "HbA1c (Glycated Haemoglobin)": "H04CB",
  "Blood Sugar — Fasting (FBS)": "G20CB",
  "Blood Sugar — Post Prandial (PPBS)": "G21CB",
  "Blood Sugar — Random (RBS)": "G22CB",
  "Thyroid Profile (T3 T4 TSH)": "PT07",
  "Thyroid Panel I (T3 T4 TSH)": "PT07",
  "Thyroid Profile II": "PT08",
  "Thyroid Comprehensive Profile": "PT11",
  "TSH (single)": "T49CB",
  "Free T4 (FT4)": "T03CB",
  "Cardiac Profile (with 2D Echo)": "CARDIAC PROFILE",
  "Cardiac Basic Profile": "PC02",
  "Lipid Profile (Cholesterol)": "PL2",
  "Liver Function Test (LFT)": "Liver Function Test; LFT",
  "Kidney Function Mini Profile (KFT)": "PK1",
  "Kidney Function Maxi Profile": "PK2",
  "Electrolyte Profile (Na/K/Cl)": "PE1",
  "Ortho Profile": "PO02",
  "Serum Creatinine": "C164CB",
  "Blood Urea": "B46HM",
  "Uric Acid": "U04CB",
  "Liver Enzymes (SGPT / SGOT)": "A48CB + A166CB",
  "Complete Blood Count (CBC)": "CBC 300",
  "ESR": "E22HM",
  "Anaemia Mini Profile": "PA01",
  "Iron Deficiency Profile": "PI01",
  "Serum Ferritin": "F13CB",
  "Thalassemia Screen": "PT25",
  "Blood Group (ABO & Rh)": "B45HM",
  "Vitamin D (25-OH)": "V15CB",
  "Vitamin B12": "V12CB",
  "Vitamin B Complex Profile": "PV01",
  "Serum Calcium": "C13CB",
  "Antenatal Mini Profile": "PA04",
  "Antenatal Maxi Profile": "PA05",
  "Beta HCG (Pregnancy)": "B19CB",
  "Extended PCOD Panel": "PE30",
  "PCOS Mini Profile": "PP04",
  "Menopause Mini Profile": "PM02",
  "Testosterone Profile": "PT01",
  "PSA (Prostate)": "P41CB",
  "Bone Profile": "PB02",
  "Osteoporosis Screening": "PO03",
  "Arthritis Basic Screen": "PA09",
  "Fever Mini Profile": "PF1",
  "Fever Maxi Profile": "PF2",
  "Dengue Profile": "PD01",
  "Malaria Profile": "PM01",
  "Typhoid Profile": "PT19",
  "Widal (Typhoid)": "W09IS",
  "CRP (C-Reactive Protein)": "C160CB",
  "Urine Routine (CUE)": "C151CP",
  "Hepatitis B Marker Profile": "PH5",
  "Pre-Operative Mini Profile": "PP10",
  "Pre-Operative Maxi Profile": "PP11",
  "Major Surgical Profile": "major surgical profile",
  "Stone Screening Mini Profile": "PS06",
  "Hypertension Profile": "PH13",
  "Asthma Health Camp": "ASTHMA HEALTH CAMP",
};

function keyOk(given) {
  const want = process.env.LAB_CATALOG_KEY || "";
  const a = Buffer.from(String(given || "")), b = Buffer.from(want);
  return want.length >= 16 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!process.env.LAB_CATALOG_KEY || !process.env.CRELIO_TOKEN) return res.status(503).json({ ok: false, notConfigured: true, error: "Catalog not configured" });
  if (!keyOk(req.headers["x-catalog-key"])) return res.status(401).json({ ok: false, error: "unauthorized" });

  const cat = await getCatalog();
  if (!cat) return res.status(502).json({ ok: false, error: "Could not load the Crelio price list" });

  const mapped = [];
  for (const [name, code] of Object.entries(CODE_MAP)) {
    const p = priceFor(cat, { name, code });
    if (p != null && p > 0) mapped.push({ name, code, price: p });
  }
  return res.status(200).json({ ok: true, at: new Date().toISOString(), count: cat.items.length, items: cat.items, mapped });
}

// Same loader as /api/pay (getAllTestsAndProfiles, MRP), also keeping the list of entries.
async function getCatalog() {
  const base = (process.env.CRELIO_TESTS_BASE || process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");
  try {
    const r = await fetch(`${base}/getAllTestsAndProfiles/?token=${encodeURIComponent(process.env.CRELIO_TOKEN)}`);
    if (!r.ok) return null;
    const data = await r.json();
    let arr = Array.isArray(data) ? data : null;
    if (!arr && data && typeof data === "object") {
      for (const k of ["data", "tests", "testList", "result", "results", "records", "profiles"]) {
        if (Array.isArray(data[k])) { arr = data[k]; break; }
      }
      if (!arr) { const m = []; for (const v of Object.values(data)) if (Array.isArray(v)) m.push(...v); if (m.length) arr = m; }
    }
    if (!arr) return null;
    const pick = (o, keys) => { for (const k of keys) { if (o[k] !== undefined && o[k] !== null && String(o[k]).trim() !== "") return o[k]; } return undefined; };
    const byName = new Map(), byCode = new Map(), items = [];
    for (const o of arr) {
      if (!o || typeof o !== "object") continue;
      const name = pick(o, ["testName", "TestName", "test_name", "name", "Name", "profileName", "ProfileName"]);
      const code = pick(o, ["testCode", "TestCode", "test_code", "code", "Code", "profileCode", "shortCode"]);
      const priceRaw = pick(o, ["testAmount", "cost", "price", "rate", "mrp", "MRP", "amount", "testCost", "testRate", "testMRP"]);
      const price = priceRaw !== undefined ? Number(String(priceRaw).replace(/[^\d.]/g, "")) : null;
      if (!Number.isFinite(price) || !(price > 0)) continue;
      if (name) { const k = String(name).trim().toLowerCase(); if (!byName.has(k)) byName.set(k, price); }
      if (code) { const k = String(code).trim().toLowerCase(); if (!byCode.has(k)) byCode.set(k, price); }
      items.push({ name: name ? String(name).trim() : null, code: code ? String(code).trim() : null, price });
    }
    return { byName, byCode, items };
  } catch { return null; }
}
// As in /api/pay, plus "A + B" codes summed (every part must be priced).
function priceFor(catalog, r) {
  if (r.code && /\+/.test(r.code)) {
    let sum = 0;
    for (const c of String(r.code).split("+")) { const p = catalog.byCode.get(c.trim().toLowerCase()); if (p == null) return null; sum += p; }
    return sum;
  }
  if (r.code) { const p = catalog.byCode.get(String(r.code).trim().toLowerCase()); if (p != null) return p; }
  if (r.name) { const p = catalog.byName.get(String(r.name).trim().toLowerCase()); if (p != null) return p; }
  return null;
}
