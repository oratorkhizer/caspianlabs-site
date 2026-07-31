// Caspian Diagnostic Centre — online payment backend (Vercel Serverless Function)
// Repo path: /api/pay.js   →   POST https://www.caspianlabs.in/api/pay
//
// Architecture (2.4, decided 31 Jul 2026 after Balaji/Crelio confirmed LHRegisterBillAPI
// returns no payment link): REQUIRED PREPAYMENT via direct Razorpay Checkout on the site,
// then the bill is registered in Crelio ONLY AFTER payment succeeds, and the payment is
// recorded against the bill via Crelio's Bill Payment API (billPayment, paymentMode
// "Online" — per Balaji's 31 Jul links) so it reconciles as a proper online payment in
// Crelio's payment reports. If payment never completes, no bill is ever created — a true
// hard gate. The bill is deliberately NOT marked complete (billComplete): at this point
// only the payment is received, the sample is not yet collected, so the order must stay
// open for the lab workflow (Dr Khizer, 31 Jul).
//
//   action:"create"  → validates the booking, prices it from Crelio's live catalog
//                      (getAllTestsAndProfiles MRP), creates a Razorpay Order with the
//                      booking payload stored in the order's notes (server-side, tamper-proof),
//                      returns { orderId, amount, keyId } for Checkout.
//   action:"confirm" → verifies the Razorpay signature (HMAC-SHA256), double-checks the
//                      payment with Razorpay's API, registers the Crelio bill from the
//                      order notes, then syncs the payment via billPayment. Idempotent: the
//                      billId is written back into the order notes, so a repeated confirm
//                      returns the same bill instead of double-booking — and re-attempts the
//                      billPayment sync if it failed the first time.
//
// Payment-failure never strands a patient: if Crelio registration fails AFTER a captured
// payment, we return { ok:true, pending:true } — the site tells the patient the payment is
// received and the team will confirm (payment + full booking details remain visible in the
// Razorpay dashboard notes; Dr Khizer also gets Razorpay's payment-success email). If the
// bill registers but the billPayment sync fails, the bill comment still says PAID ONLINE
// with the Razorpay id, so staff can reconcile manually.
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   RAZORPAY_KEY_ID       rzp_live_...   (from Razorpay Dashboard → Account & Settings → API Keys)
//   RAZORPAY_KEY_SECRET   ...            (SECRET — never exposed to the browser)
//   HOME_VISIT_CHARGE     100 (default)  — ₹ per home visit
//   HOME_FREE_ABOVE       500 (default)  — first visit free when tests total ≥ this
//   CRELIO_CITY           Hyderabad (default) — city sent on home-collection registrations
//   CRELIO_AREA           defaults to CRELIO_CITY
//   CRELIO_TOKEN, CRELIO_ORG_ID, CRELIO_BASE, ALLOW_ORIGIN — same as /api/book.js
//
// Until RAZORPAY_KEY_ID/SECRET are set, this returns notConfigured and the site silently
// falls back to the existing pay-at-centre flow — safe to deploy any time.

import crypto from "node:crypto";

const RZP = "https://api.razorpay.com/v1";

// ── Crelio test/profile code map — MAINTENANCE RULE: keep in sync with CODE_MAP in /api/book.js.
// (Deliberately duplicated rather than imported so this new file cannot break the live /api/book.)
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
  "Premium Health Check — Men 45+": { code: "PREMIUM HEALTH CHECK FOR MEN ABOVE 45", type: "profile" },
  "Women's Health Profile": { code: "PHP03", type: "profile" },
  "Haj / Umrah Fitness": { code: "HAJI PROFILE", type: "profile" },
  "Comprehensive Diabetes Screening": { code: "COMPREHENSIVE DIABETES  SCREENING", type: "profile" },
  "Diabetes Monitoring Mini Profile": { code: "PD03", type: "profile" },
  "Diabetes Monitoring Maxi Profile": { code: "PD04", type: "profile" },
  "HbA1c (Glycated Haemoglobin)": { code: "H04CB", type: "test" },
  "Blood Sugar — Fasting (FBS)": { code: "G20CB", type: "test" },
  "Blood Sugar — Post Prandial (PPBS)": { code: "G21CB", type: "test" },
  "Blood Sugar — Random (RBS)": { code: "G22CB", type: "test" },
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
  "Asthma Health Camp": { code: "ASTHMA HEALTH CAMP", type: "profile" },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.CRELIO_TOKEN) {
    return res.status(503).json({ ok: false, notConfigured: true, error: "Online payment not configured yet" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  try {
    if (body.action === "confirm") return await confirmPayment(body, res);
    if (body.action === "recover" || (body.event && body.payload)) return await recoverPayment(body, res);
    return await createOrder(body, res);
  } catch (e) {
    console.error("pay.js server error", String(e));
    return res.status(500).json({ ok: false, error: "Payment server error" });
  }
}

/* ───────────────────────── action: create ───────────────────────── */

async function createOrder(body, res) {
  // Honeypot — quietly skip: the client falls back and no order is created.
  if (body.website || body.company_url) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const errors = [];
  const fullName = String(body.fullName || body.name || "").trim();
  const mobile   = String(body.mobile || "").replace(/\D/g, "");
  const email    = String(body.email || "").trim();
  const items    = Array.isArray(body.items) ? body.items : [];
  if (!fullName) errors.push("Full name is required");
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.push("A valid 10-digit Indian mobile number is required");
  if (!items.length) errors.push("Select at least one test or package");
  if (errors.length) return res.status(400).json({ ok: false, error: errors.join("; ") });

  // Resolve Crelio codes exactly like /api/book — if anything is unmapped, fall back (WhatsApp).
  const unmapped = [];
  const resolved = items.map((it) => {
    const name = String(it.name || "").trim();
    let code = it.code ?? it.testCode;
    if (!code && name && CODE_MAP[name]) code = CODE_MAP[name].code;
    if (!code) unmapped.push(name || "item");
    return { name, code: code ? String(code) : null };
  });
  if (unmapped.length) {
    return res.status(422).json({ ok: false, notMapped: true, items: unmapped, error: "Some selected items are not mapped in Crelio yet" });
  }

  // Price every item from Crelio's live catalog (MRP). Any item without a price → fallback,
  // never guess an amount to charge.
  const catalog = await getCatalog();
  if (!catalog) return res.status(502).json({ ok: false, notConfigured: true, error: "Could not load price list" });
  const unpriced = [];
  let totalRupees = 0;
  for (const r of resolved) {
    const p = priceFor(catalog, r);
    if (p == null || !(p > 0)) { unpriced.push(r.name); continue; }
    r.price = p; totalRupees += p;
  }
  if (unpriced.length) {
    return res.status(422).json({ ok: false, noPrice: true, items: unpriced, error: "Live price unavailable for some items" });
  }
  totalRupees = Math.round(totalRupees * 100) / 100;

  // Home-collection visit charge (₹100/visit, first visit free on orders ≥ ₹500 — env-tunable).
  // FBS + PPBS together need TWO visits (fasting draw, then post-meal draw) → second visit charged.
  const VISIT_FEE = Number(process.env.HOME_VISIT_CHARGE || 100);
  const FREE_ABOVE = Number(process.env.HOME_FREE_ABOVE || 500);
  let visitCharge = 0;
  if (String(body.mode || "now").trim() === "home") {
    const lower = resolved.map((r) => r.name.toLowerCase());
    const twoVisits = lower.some((n) => n.includes("fasting") || n.includes("(fbs)")) &&
                      lower.some((n) => n.includes("post prandial") || n.includes("(ppbs)"));
    const visits = twoVisits ? 2 : 1;
    const freeVisits = totalRupees >= FREE_ABOVE ? 1 : 0;
    visitCharge = VISIT_FEE * Math.max(0, visits - freeVisits);
  }
  const payableRupees = Math.round((totalRupees + visitCharge) * 100) / 100;

  // Booking payload for AFTER payment — stored server-side in the Razorpay order notes so the
  // confirm step can rebuild it without trusting the browser. Chunked (notes values max ~256 chars).
  const booking = {
    n: fullName, m: mobile, e: email,
    a: String(body.age || "").trim(), g: String(body.gender || "").trim(),
    md: String(body.mode || "now").trim(),
    ad: String(body.address || "").trim().slice(0, 400),
    dt: String(body.dateTime || "").trim(),
    it: resolved.map((r) => ({ n: r.name, c: r.code, p: r.price })),
    vc: visitCharge,
  };
  const notes = chunkNotes(JSON.stringify(booking));
  if (!notes) return res.status(422).json({ ok: false, error: "Order too large — please book on WhatsApp" });
  notes.patient = fullName.slice(0, 250);
  notes.mobile = mobile;

  const order = await rzp("POST", "/orders", {
    amount: Math.round(payableRupees * 100),   // paise
    currency: "INR",
    receipt: "web-" + mobile.slice(-4) + "-" + crypto.randomBytes(4).toString("hex"),
    payment_capture: 1,
    notes,
  });
  if (!order || !order.id) {
    console.error("Razorpay order create failed", JSON.stringify(order).slice(0, 400));
    return res.status(502).json({ ok: false, error: "Could not start payment" });
  }

  return res.status(200).json({
    ok: true, orderId: order.id, amount: order.amount, currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID, total: payableRupees, testsTotal: totalRupees, visitCharge,
  });
}

/* ───────────────────────── action: confirm ───────────────────────── */

async function confirmPayment(body, res) {
  const orderId = String(body.razorpay_order_id || "");
  const paymentId = String(body.razorpay_payment_id || "");
  const signature = String(body.razorpay_signature || "");
  if (!orderId || !paymentId || !signature) return res.status(400).json({ ok: false, error: "Missing payment details" });

  const base = (process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");

  // 1. Signature proves this payment belongs to this order and succeeded.
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId).digest("hex");
  const sigOk = signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!sigOk) return res.status(400).json({ ok: false, error: "Payment could not be verified" });

  // 2. Fetch the order (booking payload + idempotency) and the payment (status/amount).
  const order = await rzp("GET", "/orders/" + orderId);
  if (!order || !order.id) return res.status(502).json({ ok: false, error: "Could not read payment order" });

  const payment = await rzp("GET", "/payments/" + paymentId);
  const pStatus = payment && payment.status;
  if (pStatus !== "captured" && pStatus !== "authorized") {
    return res.status(400).json({ ok: false, error: "Payment not completed", status: pStatus || "unknown" });
  }

  return settleOrder(base, order, payment, res);
}

/* ─────────────── action: recover  (webhook / manual safety net) ───────────────
   Covers the gap where Razorpay captures the payment but the browser never calls
   confirm (patient approved UPI on their phone and closed the page — happened live
   31 Jul 2026, pay_TK4HJ5OcXRqFmU). Accepts either:
     • Razorpay webhook payload (event payment.captured) — configure the webhook to
       POST https://www.caspianlabs.in/api/pay
     • { action:"recover", paymentId:"pay_..." } (manual)
   The payload is treated ONLY as a pointer: everything is re-fetched from Razorpay's
   authenticated API before anything is registered, and settleOrder() is idempotent —
   so a forged/replayed call can never double-book or fake a payment. */

async function recoverPayment(body, res) {
  const base = (process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");

  let paymentId = String(body.paymentId || body.razorpay_payment_id || "");
  const isWebhook = !!(body.event && body.payload);
  if (isWebhook) {
    if (body.event !== "payment.captured") return res.status(200).json({ ok: true, ignored: body.event });
    try { paymentId = String(body.payload.payment.entity.id || ""); } catch (e) { paymentId = ""; }
  }
  if (!paymentId) return res.status(400).json({ ok: false, error: "paymentId required" });

  const payment = await rzp("GET", "/payments/" + paymentId);
  if (!payment || !payment.id) return res.status(502).json({ ok: false, error: "Could not read payment" });
  if (payment.status !== "captured") return res.status(200).json({ ok: false, error: "Payment not captured", status: payment.status || "unknown" });
  if (!payment.order_id) return res.status(200).json({ ok: false, error: "Payment has no order" });

  const order = await rzp("GET", "/orders/" + payment.order_id);
  if (!order || !order.id) return res.status(502).json({ ok: false, error: "Could not read order" });

  return settleOrder(base, order, payment, res);
}

/* ─────────── shared settlement: register bill + sync payment (idempotent) ─────────── */

async function settleOrder(base, order, payment, res) {
  const orderId = order.id;
  const paymentId = payment.id;

  // Idempotency: already registered? Return the same bill — never double-book. But if the
  // billPayment sync failed last time, re-attempt it now (payAmt was stored in the notes).
  if (order.notes && order.notes.billId) {
    if (order.notes.paid !== "1" && order.notes.billId !== "registered") {
      let payAmt = Number(order.notes.payAmt || 0);
      const bt = Number(order.notes.bt || 0);
      if (bt > 0 && payAmt > bt) payAmt = bt;   // cap at the bill total learned at registration
      if (payAmt > 0 && (await crelioBillPayment(base, order.notes.billId, payAmt))) {
        try { await rzp("PATCH", "/orders/" + orderId, { notes: Object.assign({}, order.notes, { paid: "1" }) }); } catch (e) { /* non-fatal */ }
      }
    }
    return res.status(200).json({ ok: true, billId: order.notes.billId, patientId: order.notes.patientId || null, amountPaid: order.amount / 100, already: true });
  }

  const amountPaid = (payment.amount || order.amount) / 100;

  const booking = unchunkNotes(order.notes);
  if (!booking) {
    console.error("pay.js: order notes unreadable", orderId);
    return res.status(200).json({ ok: true, pending: true, paymentId, amountPaid });
  }

  // 3. Register the PAID bill in Crelio (same contract as /api/book). The payment itself is
  //    recorded in step 3b via Crelio's Bill Payment API (per Balaji, 31 Jul 2026) — so
  //    advance stays 0 here and the money is never double-counted. Razorpay reference goes
  //    in comments either way, so staff can always reconcile.
  const payload = {
    fullName: booking.n, age: formatAge(booking.a), gender: normGender(booking.g),
    countryCode: "91", mobile: booking.m, email: booking.e,
    patientType: "OP",
    billDetails: {
      emergencyFlag: "0",
      organizationIdLH: String(process.env.CRELIO_ORG_ID || "539536"),
      referralName: "Self",
      paymentType: "Cash",
      advance: "0",
      billConcession: "0",
      comments: "Online booking via caspianlabs.in — PAID ONLINE ₹" + amountPaid
        + (Number(booking.vc) > 0 ? " (incl ₹" + booking.vc + " home-visit charge)" : "")
        + " (Razorpay " + paymentId + ")",
      testList: (booking.it || []).map((r) => (r.c ? { testCode: String(r.c) } : null)).filter(Boolean),
      paymentList: [],
    },
  };
  if (booking.md === "home") {
    payload.isHomecollection = 1;
    // Crelio's home-collection branch REQUIRES several patient fields that walk-ins don't
    // (verified 31 Jul 2026 via Vercel logs — LHRegisterBillAPI 400s with KeyError-style
    // bodies: first {"raw":"'city'"}, then {"raw":"'designation'"} once city was sent).
    // Send the full patient block from the docs so registration can't trip on a missing key.
    payload.city = process.env.CRELIO_CITY || "Hyderabad";
    payload.area = process.env.CRELIO_AREA || payload.city;
    payload.pincode = "";
    payload.designation = payload.gender === "Female" ? "Ms." : "Mr.";
    const nameParts = String(booking.n || "").trim().split(/\s+/);
    payload.firstName = nameParts[0] || "";
    payload.lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    // Map-pin coordinates travel inside the address ("| Map: https://maps.google.com/?q=lat,lng")
    const geo = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/.exec(String(booking.ad || ""));
    if (geo) { payload.latitude = geo[1]; payload.longitude = geo[2]; }
    if (booking.dt) payload.homeCollectionDateTime = toIso(booking.dt);
    if (booking.ad) payload.address = booking.ad;
  } else if (booking.md === "scheduled") {
    payload.isAppointmentRequest = 1;
    if (booking.dt) { payload.startDate = toIso(booking.dt); payload.endDate = toIso(booking.dt); }
  }

  const url = `${base}/LHRegisterBillAPI/${encodeURIComponent(process.env.CRELIO_TOKEN)}/`;

  let data = null, registered = false;
  for (let attempt = 0; attempt < 2 && !registered; attempt++) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const text = await r.text();
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (r.ok && !(data && data.code && Number(data.code) >= 400)) registered = true;
      else console.error("Crelio register (paid) error", r.status, JSON.stringify(data).slice(0, 400));
    } catch (e) { console.error("Crelio register (paid) network error", String(e)); }
  }

  if (!registered) {
    // Money is captured but the bill isn't in Crelio — tell the patient it's received and
    // being processed. All booking details live in the Razorpay order notes for the team.
    return res.status(200).json({ ok: true, pending: true, paymentId, amountPaid });
  }

  const billId = data.billId || data.orderId || null;
  const patientId = data.patientId || null;
  console.log("Crelio register ok", JSON.stringify(data).slice(0, 400));
  // Crelio's bill total can differ from the catalog MRP the patient was charged (seen live
  // 31 Jul: FBS catalog ₹80 vs bill ₹50 — a Crelio data-hygiene issue). billPayment rejects
  // amounts above the bill total ("Bill Advance cannot be greater than Bill Total Amount"),
  // so cap the sync at the bill total when the response reveals it, and flag the mismatch.
  let billTotal = Number(data.billTotalAmount ?? data.totalAmount ?? data.billAmount ?? data.total ?? NaN);
  if (!Number.isFinite(billTotal) && Array.isArray(data.reportDetails)) {
    // No top-level total in the response — sum the line items (reportDetails[].testAmount).
    const sum = data.reportDetails.reduce((s, rd) => s + (Number(String((rd && rd.testAmount) || 0).replace(/[^\d.]/g, "")) || 0), 0);
    billTotal = sum > 0 ? sum : NaN;
  }

  // 3b. Record the payment against the bill — Crelio Bill Payment API (billPayment),
  //     paymentMode "Online". Amount = tests total only: that is the bill's own total in
  //     Crelio; the home-visit charge is not a Crelio line item and is already explained
  //     in the bill comment. NOT calling billComplete — sample not yet collected, the
  //     order must stay open (Dr Khizer, 31 Jul).
  let payAmt = Math.round(Math.max(0, amountPaid - (Number(booking.vc) || 0)) * 100) / 100;
  if (Number.isFinite(billTotal) && billTotal > 0 && payAmt > billTotal) {
    console.error("pay.js: PRICE MISMATCH bill", billId, "- catalog charged", payAmt, "but Crelio bill total is", billTotal, "- fix the test's MRP/rate in Crelio");
    payAmt = billTotal;
  }
  let paySynced = false;
  if (billId && payAmt > 0) paySynced = await crelioBillPayment(base, billId, payAmt);
  if (!paySynced) console.error("pay.js: billPayment sync failed for bill", billId, "— payment noted in bill comments");

  // 4. Write billId back into the order notes (idempotency + staff visibility + payment-sync
  //    retry state). Best-effort.
  try {
    const newNotes = Object.assign({}, order.notes, {
      billId: String(billId || "registered"), patientId: String(patientId || ""),
      paid: paySynced ? "1" : "0", payAmt: String(payAmt),
      bt: Number.isFinite(billTotal) ? String(billTotal) : "",
    });
    await rzp("PATCH", "/orders/" + orderId, { notes: newNotes });
  } catch (e) { /* non-fatal */ }

  return res.status(200).json({ ok: true, billId, patientId, amountPaid, paymentId });
}

/* ───────────────────────── helpers ───────────────────────── */

// Crelio Bill Payment API — POST {base}/billPayment/{token}/ with
// { billId, paymentList: [{ paymentMode: "Online", amount }] }. Response: { code: 200 }.
// (Doc: api.creliohealth.com "Bill Payment API", shared by Balaji 31 Jul 2026.)
async function crelioBillPayment(base, billId, amount) {
  const url = `${base}/billPayment/${encodeURIComponent(process.env.CRELIO_TOKEN)}/`;
  const body = JSON.stringify({ billId: Number(billId), paymentList: [{ paymentMode: "Online", amount: Number(amount) }] });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const text = await r.text();
      let d; try { d = JSON.parse(text); } catch { d = { raw: text }; }
      if (r.ok && !(d && d.code && Number(d.code) >= 300 && Number(d.code) !== 200)) return true;
      console.error("Crelio billPayment error", r.status, JSON.stringify(d).slice(0, 300));
    } catch (e) { console.error("Crelio billPayment network error", String(e)); }
  }
  return false;
}

function rzpAuth() {
  return "Basic " + Buffer.from(process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET).toString("base64");
}
async function rzp(method, path, jsonBody) {
  const r = await fetch(RZP + path, {
    method,
    headers: { Authorization: rzpAuth(), "Content-Type": "application/json" },
    body: jsonBody ? JSON.stringify(jsonBody) : undefined,
  });
  const text = await r.text();
  try { return JSON.parse(text); } catch { return { raw: text, http: r.status }; }
}

// Split a JSON string across order-notes keys b0..b9 (Razorpay: ≤15 keys, values ≤256 chars).
function chunkNotes(s) {
  if (s.length > 250 * 10) return null;
  const notes = {};
  for (let i = 0; i * 250 < s.length; i++) notes["b" + i] = s.slice(i * 250, (i + 1) * 250);
  return notes;
}
function unchunkNotes(notes) {
  if (!notes) return null;
  let s = "";
  for (let i = 0; i < 12; i++) { if (typeof notes["b" + i] === "string") s += notes["b" + i]; else break; }
  try { const o = JSON.parse(s); return o && o.n ? o : null; } catch { return null; }
}

// Live catalog (name/code → price) with a short in-memory cache for warm lambdas.
let _cat = null, _catAt = 0;
async function getCatalog() {
  if (_cat && Date.now() - _catAt < 10 * 60 * 1000) return _cat;
  const base = (process.env.CRELIO_TESTS_BASE || process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");
  try {
    const r = await fetch(`${base}/getAllTestsAndProfiles/?token=${encodeURIComponent(process.env.CRELIO_TOKEN)}`);
    if (!r.ok) return _cat; // stale is better than nothing
    const data = await r.json();
    let arr = Array.isArray(data) ? data : null;
    if (!arr && data && typeof data === "object") {
      for (const k of ["data", "tests", "testList", "result", "results", "records", "profiles"]) {
        if (Array.isArray(data[k])) { arr = data[k]; break; }
      }
      if (!arr) { const m = []; for (const v of Object.values(data)) if (Array.isArray(v)) m.push(...v); if (m.length) arr = m; }
    }
    if (!arr) return _cat;
    const pick = (o, keys) => { for (const k of keys) { if (o[k] !== undefined && o[k] !== null && String(o[k]).trim() !== "") return o[k]; } return undefined; };
    const byName = new Map(), byCode = new Map();
    for (const o of arr) {
      if (!o || typeof o !== "object") continue;
      const name = pick(o, ["testName", "TestName", "test_name", "name", "Name", "profileName", "ProfileName"]);
      const code = pick(o, ["testCode", "TestCode", "test_code", "code", "Code", "profileCode", "shortCode"]);
      const priceRaw = pick(o, ["testAmount", "cost", "price", "rate", "mrp", "MRP", "amount", "testCost", "testRate", "testMRP"]);
      const price = priceRaw !== undefined ? Number(String(priceRaw).replace(/[^\d.]/g, "")) : null;
      if (!Number.isFinite(price) || !(price > 0)) continue;
      if (name) { const k = String(name).trim().toLowerCase(); if (!byName.has(k)) byName.set(k, price); }
      if (code) { const k = String(code).trim().toLowerCase(); if (!byCode.has(k)) byCode.set(k, price); }
    }
    _cat = { byName, byCode }; _catAt = Date.now();
    return _cat;
  } catch { return _cat; }
}
function priceFor(catalog, r) {
  if (r.code) { const p = catalog.byCode.get(String(r.code).trim().toLowerCase()); if (p != null) return p; }
  if (r.name) { const p = catalog.byName.get(String(r.name).trim().toLowerCase()); if (p != null) return p; }
  return null;
}

function normGender(g) { const s = String(g).toLowerCase(); if (s.startsWith("m")) return "Male"; if (s.startsWith("f")) return "Female"; return g ? "Other" : ""; }
function formatAge(a) { const s = String(a == null ? "" : a).trim(); if (!s) return ""; if (/^\d+$/.test(s)) return s + " Years"; return s; }
function toIso(v) { const s = String(v).trim(); if (!s) return s; if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return s + ":00+05:30"; return s; }
