// Monthly: rank the WhatsApp catalog by what the lab actually runs, straight from Crelio.
//
//   BB_KEY=... BB_PROJ=... BB_CTX=... node scripts/crelio-demand.mjs [months=12]
//
// BB_* come from Supabase gjpbiiqkvzysmdpioexk li_settings (bb_api_key, bb_project_id, bb_ctx_crelio).
// The bb_ctx_crelio Browserbase context holds the lab's Crelio sign-in (done once by Dr Khizer).
// For each of the last N whole months it calls Crelio's own report API (the one behind
// Finance > Financial Reports > Billing Testwise > Day Wise) INSIDE the signed-in page and
// reduces the rows to {test name: count} there, so no patient detail ever leaves Crelio.
// Counts standalone orders only (rows not inside a package), skips cancelled bills and the demo org.
// Writes api/_demand.js in the same format as scripts/lab-demand.py (the xlsx route), using the
// same slug -> test-name map, scripts/demand-map.json.
//
// Prints one JSON line: {ok, months, period, top, changes} or {ok:false, error}.
// error "LOGGED_OUT" means the Crelio sign-in has expired: a fresh sign-in link is needed.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const MAP = JSON.parse(readFileSync(join(here, "demand-map.json"), "utf8"));
const N = Number(process.argv[2] || 12);
const { BB_KEY, BB_PROJ, BB_CTX } = process.env;
if (!BB_KEY || !BB_PROJ || !BB_CTX) { console.log(JSON.stringify({ ok: false, error: "BB_KEY, BB_PROJ and BB_CTX are required" })); process.exit(1); }

const BB = "https://api.browserbase.com/v1";
const H = { "X-BB-API-Key": BB_KEY, "Content-Type": "application/json" };

// Whole IST months, oldest first: [{label, from, to}] with UTC ISO bounds as Crelio expects.
function months(n) {
  const now = new Date(Date.now() + 5.5 * 3600e3);
  const out = [];
  for (let i = n; i >= 1; i--) {
    const y = now.getUTCFullYear(), m = now.getUTCMonth() - i;
    const start = new Date(Date.UTC(y, m, 1) - 5.5 * 3600e3);
    const end = new Date(Date.UTC(y, m + 1, 1) - 5.5 * 3600e3 - 1000);
    out.push({ label: new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7), from: start.toISOString().replace(/\.\d+Z$/, ".000Z"), to: end.toISOString().replace(/\.\d+Z$/, ".000Z") });
  }
  return out;
}

async function main() {
  const s = await (await fetch(BB + "/sessions", { method: "POST", headers: H, body: JSON.stringify({
    projectId: BB_PROJ, timeout: 900,
    browserSettings: { context: { id: BB_CTX, persist: true } },
    proxies: [{ type: "browserbase", geolocation: { country: "IN", city: "HYDERABAD" } }],
  }) })).json();
  if (!s.id) throw new Error("Browserbase session failed: " + JSON.stringify(s).slice(0, 200));
  let browser;
  try {
    browser = await chromium.connectOverCDP(s.connectUrl);
    const page = browser.contexts()[0].pages()[0] || await browser.contexts()[0].newPage();
    await page.goto("https://livehealth.solutions/crelio-dashboard/#/finance/billRelatedReports", { waitUntil: "commit", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(8000);
    if (/auth\/login/.test(page.url())) throw new Error("LOGGED_OUT");

    const perMonth = [];
    for (const mo of months(N)) {
      const r = await page.evaluate(async ({ from, to }) => {
        const u = `/v4/bill_test_wise_mis/?isTestWiseTab=0&from=${from}&to=${to}&reportType=1&isCustomReportTemplate=0&emailBillingReport=0&return_excel=0&`;
        const res = await fetch(u, { credentials: "include" });
        if (res.status === 401 || res.status === 403) return { status: res.status };
        const t = await res.text();
        let j; try { j = JSON.parse(t); } catch { return { status: res.status, notJson: true }; }
        const counts = {}; let rows = 0;
        for (const d of j.data || []) {
          if (d.is_cancelled) continue;
          if (String(d.org_name || "").trim() === "Demo org test") continue;
          if (d.profile_name && String(d.profile_name).trim()) continue; // inside a package
          const name = String(d.test_name || "").trim(); if (!name) continue;
          counts[name] = (counts[name] || 0) + (Number(d.testQuantity) || 1); rows++;
        }
        return { status: res.status, rows, counts };
      }, mo);
      if (r.status === 401 || r.status === 403 || r.notJson) throw new Error("LOGGED_OUT");
      perMonth.push({ ...mo, ...r });
    }

    // Rank: same rules as scripts/lab-demand.py.
    const withData = perMonth.filter((m) => m.rows > 0);
    if (!withData.length) throw new Error("Crelio returned no rows for the last " + N + " months");
    const last3 = withData.slice(-3);
    const re = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [k, new RegExp(v, "i")]));
    const sum = (ms, slug) => ms.reduce((a, m) => a + Object.entries(m.counts).reduce((b, [n, c]) => b + (re[slug].test(n) ? c : 0), 0), 0);
    const r1 = (x) => Math.round(x * 10) / 10;
    const out = {};
    for (const slug of Object.keys(MAP)) {
      const pm = r1(sum(withData, slug) / withData.length);
      const pm3 = r1(sum(last3, slug) / last3.length);
      out[slug] = { pm, pm3, score: r1(0.3 * pm + 0.7 * pm3) };
    }

    // Compare with the previous ranking for the report.
    let prev = {};
    const f = join(root, "api", "_demand.js");
    if (existsSync(f)) { try { prev = JSON.parse(readFileSync(f, "utf8").split("export const DEMAND = ")[1].replace(/;\s*$/, "")); } catch {} }
    const shown = (d) => d && (d.pm >= 1 || d.pm3 >= 1);
    const changes = Object.keys(out).filter((k) => shown(out[k]) !== shown(prev[k])).map((k) => (shown(out[k]) ? "+" : "-") + k);

    const period = withData[0].label + ".." + withData.at(-1).label;
    writeFileSync(f,
      "// Written by scripts/crelio-demand.mjs from Crelio (Billing Testwise, Day Wise). Do not edit by hand.\n" +
      `// Period: ${period} (${withData.length} months). pm = standalone orders per month, pm3 = last 3 months.\n` +
      "export const DEMAND_PERIOD = " + JSON.stringify(period) + ";\n" +
      "export const DEMAND = " + JSON.stringify(out, null, 1) + ";\n");
    const top = Object.entries(out).sort((a, b) => b[1].score - a[1].score).slice(0, 10).map(([k, v]) => k.replace(/-hyderabad$/, "") + " " + v.score);
    console.log(JSON.stringify({ ok: true, months: withData.length, period, top, changes }));
  } finally {
    await browser?.close().catch(() => {});
    await fetch(BB + "/sessions/" + s.id, { method: "POST", headers: H, body: JSON.stringify({ projectId: BB_PROJ, status: "REQUEST_RELEASE" }) }).catch(() => {});
  }
}

main().catch((e) => { console.log(JSON.stringify({ ok: false, error: String(e.message || e).slice(0, 300) })); process.exit(1); });
