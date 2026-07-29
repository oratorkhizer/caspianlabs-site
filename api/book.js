// Caspian Diagnostic Centre — website booking backend (Vercel Serverless Function)
// Repo path: /api/book.js   →   POST https://www.caspianlabs.in/api/book
//
// Real CrelioHealth contract (REST API Integration guide, confirmed w/ Balaji, Jul 2026):
//   POST  {CRELIO_BASE}/LHRegisterBillAPI/{CRELIO_TOKEN}/     <-- token is in the URL PATH, never a header
//   Body: { fullName (required), gender, age ("35 Years"), mobile, email, countryCode,
//           billDetails: { organizationIdLH, referralName, paymentType, advance,
//                          testList:[ {testID, testCode} ], paymentList:[...] } }
//   200 -> { patientId, billId, Message:"Success", reportDetails:[...] }
//   Errors: 404 wrong token · 406 test not mapped · 401 wrong request type · 403 wrong org/referral
//
// The token NEVER touches the browser — it lives only here in a Vercel Environment Variable.
// ──────────────────────────────────────────────────────────────────────────────
// Vercel Environment Variables (Project → Settings → Environment Variables):
//   CRELIO_TOKEN   404a428e-...            (SECRET — Dr Khizer pastes the value; goes in the URL path)
//   CRELIO_ORG_ID  539536                  (Org ID "for booking" from Balaji; not secret)
//   CRELIO_BASE    https://livehealth.solutions   (default; use https://uat.crelio.solutions to test)
//   ALLOW_ORIGIN   https://www.caspianlabs.in     (optional; defaults to same-origin/*)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  // Not configured yet → tell the site to fall back to WhatsApp (never a hard error for patients).
  if (!process.env.CRELIO_TOKEN) {
    return res.status(503).json({ ok: false, notConfigured: true, error: "Booking API not configured yet" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // ---- Honeypot: bots fill hidden fields humans never see. Pretend success, create no bill. ----
  if (body.website || body.company_url) {
    return res.status(200).json({ ok: true, billId: null, patientId: null, skipped: true });
  }

  // ---- Validate ----
  const errors = [];
  const fullName = String(body.fullName || body.name || "").trim();
  const mobile   = String(body.mobile || "").replace(/\D/g, "");
  const email    = String(body.email || "").trim();
  const gender   = normGender(String(body.gender || "").trim());
  const age      = formatAge(body.age);
  const mode     = String(body.mode || "now").trim();          // now | scheduled | home
  const items    = Array.isArray(body.items) ? body.items : []; // [{id,code,name}]

  if (!fullName) errors.push("Full name is required");
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.push("A valid 10-digit Indian mobile number is required");
  if (!items.length) errors.push("Select at least one test or package");
  if (errors.length) return res.status(400).json({ ok: false, error: errors.join("; ") });

  // ---- testList: numeric testID preferred, else testCode. If the client sent only a
  //      test NAME, resolve its Crelio code server-side from CODE_MAP (single source of truth). ----
  const unmapped = [];
  const testList = items.map((it) => {
    const entry = {};
    const id = it.id ?? it.testID ?? it.testId;
    if (id !== undefined && id !== null && String(id).trim() !== "") { const nid = Number(id); entry.testID = Number.isFinite(nid) ? nid : String(id); }
    let code = it.code ?? it.testCode;
    if (!code && it.name) { const m = CODE_MAP[String(it.name).trim()]; if (m) code = m.code; }
    if (code) entry.testCode = String(code);
    if (entry.testID === undefined && entry.testCode === undefined) unmapped.push(it.name || it.code || "item");
    return entry;
  }).filter((e) => e.testID !== undefined || e.testCode !== undefined);

  // If ANY selected item can't be mapped, don't half-book — tell the site to use WhatsApp so the
  // team completes the full order. (notMapped is handled client-side like notConfigured.)
  if (unmapped.length) {
    return res.status(422).json({ ok: false, notMapped: true, items: unmapped,
      error: "Some selected items are not mapped in Crelio yet" });
  }
  if (!testList.length) return res.status(400).json({ ok: false, error: "Selected items have no Crelio id/code mapping" });

  // ---- Payload ----
  const payload = {
    fullName, age, gender,
    countryCode: "91",
    mobile, email,
    patientType: "OP",
    billDetails: {
      emergencyFlag: "0",
      organizationIdLH: String(process.env.CRELIO_ORG_ID || "539536"),
      referralName: "Self",
      // Per Crelio (Balaji Awale, Jul 2026): use "Cash" for walk-in online bookings so unpaid
      // reports aren't accessible before payment. Advance stays 0 (patient pays at centre/doorstep).
      paymentType: "Cash",
      advance: "0",
      billConcession: "0",
      comments: "Online booking via caspianlabs.in",
      testList,
      paymentList: [],
    },
  };

  // ---- Mode-specific keys ----
  if (mode === "home") {
    payload.isHomecollection = 1;
    if (body.dateTime) payload.homeCollectionDateTime = toIso(body.dateTime);
    if (body.address) payload.address = String(body.address).trim();
  } else if (mode === "scheduled") {
    payload.isAppointmentRequest = 1;
    if (body.dateTime) { payload.startDate = toIso(body.dateTime); payload.endDate = toIso(body.dateTime); }
  }

  // ---- Call Crelio (token in URL path) ----
  const base  = (process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");
  const token = encodeURIComponent(process.env.CRELIO_TOKEN);
  const url   = `${base}/LHRegisterBillAPI/${token}/`;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok || (data && data.code && Number(data.code) >= 400)) {
      const hint = {
        404: "Booking token not recognised by Crelio",
        406: "One of the selected tests is not mapped in Crelio",
        401: "Request type not accepted by Crelio",
        403: "Organisation/referral not authorised (try paymentType Cash)",
      }[r.status] || "Crelio API error";
      console.error("Crelio booking error", r.status, JSON.stringify(data).slice(0, 500));  // server log only
      return res.status(502).json({ ok: false, error: hint, status: r.status });
    }

    const billId    = data.billId || data.orderId || null;
    const patientId = data.patientId || null;
    return res.status(200).json({ ok: true, mode, billId, patientId, crelio: data });
  } catch (e) {
    console.error("Booking server error", String(e));  // server log only
    return res.status(500).json({ ok: false, error: "Server error contacting Crelio" });
  }
}

function normGender(g){const s=String(g).toLowerCase();if(s.startsWith("m"))return"Male";if(s.startsWith("f"))return"Female";return g?"Other":"";}
function formatAge(a){const s=String(a==null?"":a).trim();if(!s)return"";if(/^\d+$/.test(s))return s+" Years";return s;}
function toIso(v){const s=String(v).trim();if(!s)return s;if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s))return s+":00+05:30";return s;}

// ── Crelio test/profile code map (name → {code,type}) ────────────────────────
// Single source of truth so the website only sends test NAMES. Generated from the
// Caspian × Crelio code map (Jul 2026). Names must match the site's TESTS list.
// Ambiguous/unconfirmed items are intentionally omitted → they fall back to WhatsApp.
const CODE_MAP = {
  "Full Body Check Up": { code: "FULL BODY CHECK UP", type: "profile" },
  "Caspian Essential Checkup": { code: "Caspian Essential Checkup", type: "profile" },
  "General Health Check": { code: "PG1", type: "profile" },
  "Clinova Mini Health Check": { code: "PHP01", type: "profile" },
  "Clinova Health Screen": { code: "PHP06", type: "profile" },
  "Clinova Master Health Screen": { code: "PHP07", type: "profile" },
  "Complete Metabolic Panel": { code: "Complete Metabolic Panel", type: "profile" },
  "Metabolic Wellness + InBody": { code: "RAMZAN FITNESS CHECKUP", type: "profile" },
  "Metabolic Wellness (without InBody)": { code: "Metabolic Wellness Checkup", type: "profile" },
  "Premium Health Check \\u2014 Men 45+": { code: "PREMIUM HEALTH CHECK FOR MEN ABOVE 45", type: "profile" },
  "Women's Health Profile": { code: "PHP03", type: "profile" },
  "Haj / Umrah Fitness": { code: "HAJI PROFILE", type: "profile" },
  "Comprehensive Diabetes Screening": { code: "COMPREHENSIVE DIABETES  SCREENING", type: "profile" },
  "Diabetes Monitoring Mini Profile": { code: "PD03", type: "profile" },
  "Diabetes Monitoring Maxi Profile": { code: "PD04", type: "profile" },
  "HbA1c (Glycated Haemoglobin)": { code: "H04CB", type: "test" },
  "Blood Sugar \\u2014 Fasting (FBS)": { code: "G20CB", type: "test" },
  "Blood Sugar \\u2014 Post Prandial (PPBS)": { code: "G21CB", type: "test" },
  "Blood Sugar \\u2014 Random (RBS)": { code: "G22CB", type: "test" },
  "Thyroid Profile (T3 T4 TSH)": { code: "PT07", type: "profile" },
  "Thyroid Panel I (T3 T4 TSH)": { code: "PT07", type: "profile" },
  "Thyroid Profile II": { code: "PT08", type: "profile" },
  "Thyroid Comprehensive Profile": { code: "PT11", type: "profile" },
  "TSH (single)": { code: "T49CB", type: "test" },
  "Free T4 (FT4)": { code: "T03CB", type: "test" },
  "Cardiac Profile (with 2D Echo)": { code: "CARDIAC PROFILE", type: "profile" },
  "Cardiac Basic Profile": { code: "PC02", type: "profile" },
  "Lipid Profile (Cholesterol)": { code: "PL2", type: "profile" },
  "Liver Function Test (LFT)": { code: "Liver Function Test; LFT", type: "test" },
  "Kidney Function Mini Profile (KFT)": { code: "PK1", type: "profile" },
  "Kidney Function Maxi Profile": { code: "PK2", type: "profile" },
  "Electrolyte Profile (Na/K/Cl)": { code: "PE1", type: "profile" },
  "Ortho Profile": { code: "PO02", type: "profile" },
  "Serum Creatinine": { code: "C164CB", type: "test" },
  "Blood Urea": { code: "B46HM", type: "test" },
  "Uric Acid": { code: "U04CB", type: "test" },
  "Liver Enzymes (SGPT / SGOT)": { code: "A48CB + A166CB", type: "multi" },
  "Complete Blood Count (CBC)": { code: "CBC 300", type: "test" },
  "ESR": { code: "E22HM", type: "test" },
  "Anaemia Mini Profile": { code: "PA01", type: "profile" },
  "Iron Deficiency Profile": { code: "PI01", type: "profile" },
  "Serum Ferritin": { code: "F13CB", type: "test" },
  "Thalassemia Screen": { code: "PT25", type: "profile" },
  "Blood Group (ABO & Rh)": { code: "B45HM", type: "test" },
  "Vitamin D (25-OH)": { code: "V15CB", type: "test" },
  "Vitamin B12": { code: "V12CB", type: "test" },
  "Vitamin B Complex Profile": { code: "PV01", type: "profile" },
  "Serum Calcium": { code: "C13CB", type: "test" },
  "Antenatal Mini Profile": { code: "PA04", type: "profile" },
  "Antenatal Maxi Profile": { code: "PA05", type: "profile" },
  "Beta HCG (Pregnancy)": { code: "B19CB", type: "test" },
  "Extended PCOD Panel": { code: "PE30", type: "profile" },
  "PCOS Mini Profile": { code: "PP04", type: "profile" },
  "Menopause Mini Profile": { code: "PM02", type: "profile" },
  "Testosterone Profile": { code: "PT01", type: "profile" },
  "PSA (Prostate)": { code: "P41CB", type: "test" },
  "Bone Profile": { code: "PB02", type: "profile" },
  "Osteoporosis Screening": { code: "PO03", type: "profile" },
  "Arthritis Basic Screen": { code: "PA09", type: "profile" },
  "Fever Mini Profile": { code: "PF1", type: "profile" },
  "Fever Maxi Profile": { code: "PF2", type: "profile" },
  "Dengue Profile": { code: "PD01", type: "profile" },
  "Malaria Profile": { code: "PM01", type: "profile" },
  "Typhoid Profile": { code: "PT19", type: "profile" },
  "Widal (Typhoid)": { code: "W09IS", type: "test" },
  "CRP (C-Reactive Protein)": { code: "C160CB", type: "test" },
  "Urine Infection Screen": { code: "PU01", type: "profile" },
  "Urine Routine (CUE)": { code: "C151CP", type: "test" },
  "Hepatitis B Marker Profile": { code: "PH5", type: "profile" },
  "Pre-Operative Mini Profile": { code: "PP10", type: "profile" },
  "Pre-Operative Maxi Profile": { code: "PP11", type: "profile" },
  "Stone Screening Mini Profile": { code: "PS06", type: "profile" },
  "Hypertension Profile": { code: "PH13", type: "profile" },
  "Asthma Health Camp": { code: "ASTHMA HEALTH CAMP", type: "profile" },};
