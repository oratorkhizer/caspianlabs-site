// Caspian Diagnostic Centre: one bill from Crelio, for Caspian's own systems (Vercel Serverless Function)
// Repo path: /api/bill.js   ->   GET https://www.caspianlabs.in/api/bill?bill=32125
//
// Used by the WhatsApp inbox and bot (Supabase edge functions wa-inbox, wa-flow) to:
//   1. check, live, whether a bill is fully paid before its report goes to a patient on WhatsApp
//   2. fetch the finished report PDF when Crelio's "Report PDF" webhook did not send it to us
// It calls Crelio's getOrderStatusAPI with the lab token, which never leaves this server.
// Not for the browser: it needs the header  x-catalog-key: <LAB_CATALOG_KEY>  (same key as /api/catalog).
//
// GET ?bill=<id>            -> { ok, bill, patient, phone10, pay, tests: [{ name, reported }], reported, total_tests, has_pdf, attachments }
// GET ?bill=<id>&pdf=1      -> same, plus pdf_base64 (Crelio's consolidated report) when Crelio has one
// GET ?bill=<id>&shape=1    -> the response's field names and value types only, no values (to map Crelio's fields)
//
// Payment: Crelio's documented response has no payment block, so every field whose name speaks of money
// (due, paid, advance, balance, payment, total, amount, concession) is read where present. pay.state is
// "paid" only when a due amount of 0 or a paid flag is actually found; anything else is "unknown".

import crypto from "node:crypto";

function keyOk(given) {
  const want = process.env.LAB_CATALOG_KEY || "";
  const a = Buffer.from(String(given || "")), b = Buffer.from(want);
  return want.length >= 16 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Field names and types, never values.
function shape(o, depth = 0) {
  if (depth > 5) return "…";
  if (Array.isArray(o)) return o.length ? [shape(o[0], depth + 1), "len " + o.length] : [];
  if (o && typeof o === "object") { const out = {}; for (const [k, v] of Object.entries(o)) out[k] = /reportsData|base64/i.test(k) ? "base64 (" + String(v || "").length + " chars)" : shape(v, depth + 1); return out; }
  return o === null ? "null" : typeof o;
}

// Every money-like field anywhere in the reply (the first 4 levels), as name -> value.
function moneyFields(o, path = "", out = {}, depth = 0) {
  if (!o || typeof o !== "object" || depth > 4) return out;
  for (const [k, v] of Object.entries(o)) {
    const p = path ? path + "." + k : k;
    if (v && typeof v === "object") { if (!Array.isArray(v) || depth < 2) moneyFields(Array.isArray(v) ? v[0] : v, p + (Array.isArray(v) ? "[0]" : ""), out, depth + 1); continue; }
    if (/(due|paid|advance|balance|payment|amount|concession|discount|refund|settle)/i.test(k) && !/test.?amount/i.test(k)) out[p] = v;
  }
  return out;
}

function payState(m) {
  const num = (x) => { const n = Number(String(x).replace(/[^\d.-]/g, "")); return Number.isFinite(n) ? n : null; };
  let due = null, flag = null;
  for (const [k, v] of Object.entries(m)) {
    const leaf = k.split(".").pop() || "";
    if (/^(bill)?due(amount)?$/i.test(leaf) || /^balance(amount)?$/i.test(leaf)) { const n = num(v); if (n != null) due = due == null ? n : Math.max(due, n); }
    if (/payment.?status|ispaid|paid.?flag|billpaymentstatus/i.test(leaf)) flag = String(v);
  }
  if (due != null) return due > 0 ? { state: "due", due, source: "crelio_live" } : { state: "paid", due: 0, source: "crelio_live" };
  if (flag != null) return /^(1|true|paid|full)/i.test(flag) ? { state: "paid", due: 0, source: "crelio_live" } : { state: "due", due: 0, source: "crelio_live" };
  return { state: "unknown", due: 0, source: "crelio_live" };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  if (!process.env.LAB_CATALOG_KEY || !process.env.CRELIO_TOKEN) return res.status(503).json({ ok: false, notConfigured: true, error: "Not configured" });
  if (!keyOk(req.headers["x-catalog-key"])) return res.status(401).json({ ok: false, error: "unauthorized" });
  const bill = String(req.query.bill || "").replace(/\D/g, "").slice(0, 10);
  if (bill.length < 3) return res.status(400).json({ ok: false, error: "bill required" });

  const base = (process.env.CRELIO_BASE || "https://livehealth.solutions").replace(/\/$/, "");
  let data;
  try {
    const r = await fetch(`${base}/getOrderStatusAPI/?token=${encodeURIComponent(process.env.CRELIO_TOKEN)}&billId=${bill}`);
    const txt = await r.text();
    try { data = JSON.parse(txt); } catch { return res.status(502).json({ ok: false, error: "Crelio did not answer with JSON", status: r.status }); }
    if (!r.ok) return res.status(502).json({ ok: false, error: "Crelio " + r.status, crelio: typeof data === "object" ? (data.Message || data.message || null) : null });
  } catch (e) { return res.status(502).json({ ok: false, error: "Crelio unreachable" }); }

  if (String(req.query.shape || "") === "1") return res.status(200).json({ ok: true, bill, shape: shape(data) });

  const reports = Array.isArray(data?.reportDetails) ? data.reportDetails : [];
  const first = reports[0] || {};
  const tests = reports.map((r) => ({
    name: String(r["Test Name"] || r.testName || "").trim(),
    reported: !!(r["Report Id"] || r.reportId) && (Array.isArray(r.reportFormatAndValues) ? r.reportFormatAndValues.length > 0 : true) || (Array.isArray(r.fileAttachments) && r.fileAttachments.length > 0),
  }));
  const attachments = [];
  for (const r of reports) for (const a of (Array.isArray(r.fileAttachments) ? r.fileAttachments : [])) { const u = typeof a === "string" ? a : (a && (a.url || a.link || a.fileUrl)); if (u) attachments.push({ test: String(r["Test Name"] || "").trim(), url: String(u) }); }
  const money = moneyFields(data);
  const pdf = typeof data?.reportsData === "string" && data.reportsData.length > 100 ? data.reportsData : "";
  const phone = String(first["Contact No"] || first.patientContact || first.mobile || "").replace(/\D/g, "").slice(-10);

  return res.status(200).json({
    ok: true, bill,
    patient: String(first["Patient Name"] || "").trim() || null,
    phone10: phone.length === 10 ? phone : null,
    pay: { ...payState(money), fields: money },
    tests, total_tests: tests.length, reported: tests.filter((t) => t.reported).length,
    has_pdf: !!pdf, attachments,
    ...(String(req.query.pdf || "") === "1" && pdf ? { pdf_base64: pdf } : {}),
  });
}
