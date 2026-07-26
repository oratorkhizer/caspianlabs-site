// Caspian Diagnostic Centre — live test/profile catalog proxy (Vercel Serverless Function)
// Repo path: /api/tests.js   →   GET https://www.caspianlabs.in/api/tests
//
// Fetches Crelio's full test master (getAllTestsAndProfiles) using the server-side token,
// normalises it to a clean, patient-facing list, and caches it at the edge. The website's
// search can then show the SAME catalogue the reception sees, always in sync — with no token
// ever exposed to the browser. If the token isn't set, returns notConfigured so the site
// falls back to its built-in curated list.
//
// Env vars (already set in Vercel): CRELIO_TOKEN. Optional: CRELIO_TESTS_BASE (default livehealth.solutions).

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  // Cache 6h at Vercel's edge, serve stale up to 24h while revalidating — the catalogue rarely changes.
  res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  if (!process.env.CRELIO_TOKEN) {
    return res.status(503).json({ ok: false, notConfigured: true, error: "Catalog API not configured" });
  }

  const base = (process.env.CRELIO_TESTS_BASE || "https://livehealth.solutions").replace(/\/$/, "");
  const url = `${base}/getAllTestsAndProfiles/?token=${encodeURIComponent(process.env.CRELIO_TOKEN)}`;

  try {
    const r = await fetch(url, { method: "GET" });
    const text = await r.text();
    if (!r.ok) return res.status(502).json({ ok: false, error: "Crelio catalog error", status: r.status, detail: text.slice(0, 300) });

    let data; try { data = JSON.parse(text); } catch { return res.status(502).json({ ok: false, error: "Non-JSON from Crelio", head: text.slice(0, 300) }); }

    // The payload may be an array, or wrapped ({data|tests|result|...}). Find the array.
    let arr = Array.isArray(data) ? data : null;
    if (!arr && data && typeof data === "object") {
      for (const k of ["data", "tests", "testList", "result", "results", "records", "profiles"]) {
        if (Array.isArray(data[k])) { arr = data[k]; break; }
      }
      if (!arr) { // maybe {tests:[...],profiles:[...]} — merge any arrays found
        const merged = [];
        for (const v of Object.values(data)) if (Array.isArray(v)) merged.push(...v);
        if (merged.length) arr = merged;
      }
    }
    if (!arr) return res.status(200).json({ ok: true, count: 0, note: "No array found", rawKeys: data && typeof data === "object" ? Object.keys(data) : typeof data, tests: [] });

    const pick = (o, keys) => { for (const k of keys) { if (o[k] !== undefined && o[k] !== null && String(o[k]).trim() !== "") return o[k]; } return undefined; };

    const tests = arr.map((o) => {
      if (!o || typeof o !== "object") return null;
      const name = pick(o, ["testName", "TestName", "test_name", "name", "Name", "profileName", "ProfileName"]);
      const code = pick(o, ["testCode", "TestCode", "test_code", "code", "Code", "profileCode", "shortCode"]);
      const id = pick(o, ["testID", "testId", "TestID", "id", "ID", "dictionaryId"]);
      const priceRaw = pick(o, ["cost", "price", "rate", "mrp", "MRP", "amount", "testCost", "testRate", "testMRP"]);
      const dept = pick(o, ["department", "departmentName", "category", "Category", "categoryName"]);
      const type = pick(o, ["type", "testType", "itemType"]) || (pick(o, ["profileName", "profileCode"]) ? "profile" : "test");
      const price = priceRaw !== undefined ? Number(String(priceRaw).replace(/[^\d.]/g, "")) : null;
      if (!name) return null;
      return {
        name: String(name).trim(),
        code: code !== undefined ? String(code).trim() : null,
        id: id !== undefined ? String(id).trim() : null,
        price: Number.isFinite(price) ? price : null,
        dept: dept ? String(dept).trim() : null,
        type: String(type).toLowerCase().indexOf("profile") >= 0 ? "profile" : "test",
      };
    }).filter(Boolean);

    // de-dupe by name (keep first with a price)
    const seen = new Map();
    for (const t of tests) {
      const key = t.name.toLowerCase();
      if (!seen.has(key) || (seen.get(key).price == null && t.price != null)) seen.set(key, t);
    }
    const clean = Array.from(seen.values());

    return res.status(200).json({ ok: true, count: clean.length, tests: clean });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error contacting Crelio", detail: String(e) });
  }
}
