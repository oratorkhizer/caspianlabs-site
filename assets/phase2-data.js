/* ============================================================
   Caspian Diagnostic Centre — Phase 2 content data
   ------------------------------------------------------------
   This file holds client-supplied content. Every feature in
   phase2.js stays invisible until its data below is filled in,
   so this file can ship empty and be populated incrementally.
   ============================================================ */
window.CDC_DATA = {

  /* 2.1 — Reviews are shown via the embedded Elfsight Google-reviews widget
     (client decision, 30 Jul 2026): no curated reviews on the site. */

  /* 2.3 — Consultant pathologist. { name: "Dr …", quals: "MD (Pathology), …" } */
  pathologist: { name: "Dr Raheel Raza", quals: "Consultant Pathologist" },

  /* 2.3 — NABL: set ONLY when accreditation is confirmed. { certNo: "MC-…" } */
  nabl: null,

  /* 2.5 — Home-collection coverage. Array of pincodes as strings,
     or { code: "500057", area: "Vijay Nagar Colony" } objects. */
  pincodes: [],

  /* 2.5 — Expected visit window text, e.g. "Visits between 6 am – 9 pm, every day" */
  visitWindow: "",

  /* 2.6 — Turnaround times. Each: { category: "Routine biochemistry & haematology", time: "Same day" } */
  tat: [],

  /* 2.4 — Online payment: filled when Razorpay goes live (key id only — never the secret). */
  razorpayKeyId: ""
};
