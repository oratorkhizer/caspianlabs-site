/**
 * Telugu, Urdu and Hindi pages, added 10 September 2026.
 *
 *   /te, /ur, /hi                        the lab's front page in that language
 *   /te/<page>, /ur/<page>, /hi/<page>   four more pages each
 *
 * The rewrites are in vercel.json. The text lives in api/_lang/*.js (the
 * underscore keeps Vercel from turning those files into functions of their
 * own). English source: api/_lang/en.js.
 *
 * WHY SEPARATE ADDRESSES AND NOT THE LANGUAGE SWITCH
 * assets/i18n.js swaps the homepage text in the browser. Google never sees
 * that, so none of it can be found in a search. A page at its own address,
 * with lang and hreflang set, can be.
 *
 * NOTHING IS INDEXED UNTIL A NATIVE SPEAKER HAS APPROVED IT
 * Each language file carries `approved: false`. While it is false, every page
 * in that language is served with noindex (meta tag and X-Robots-Tag header),
 * carries no hreflang, and is left out of the sitemap. A medical sentence in
 * Telugu or Urdu that nobody fluent has read is not published to Google.
 *
 * To approve a language after review: set approved: true, reviewedBy and
 * reviewedOn in that language's file, then add its pages to api/sitemap.js.
 * The hreflang links switch on by themselves.
 *
 * FOR THE REVIEWER: add ?review=1 to any address, for example
 * https://www.caspianlabs.in/te?review=1 . Every translated block then shows
 * the English it was made from underneath it, and the front page lists all
 * five pages with review links. Nothing else changes.
 *
 * PRICES AND TEST NAMES are in PAGES below, not in the translations, so a
 * price change is one edit. They MUST match the PACKAGES and TESTS arrays in
 * api/page.js and the Crelio catalogue, which is what the online payment
 * charges.
 */

import en from "./_lang/en.js";
import te from "./_lang/te.js";
import ur from "./_lang/ur.js";
import hi from "./_lang/hi.js";

const LANGS = { te, ur, hi };
const ORDER = ["te", "ur", "hi"];

const BASE = "https://www.caspianlabs.in";
const PHONE_DISPLAY = "90593 41154";
const PHONE_TEL = "+919059341154";
const WA = "https://wa.me/919059341154";

const book = (name) => `/?test=${encodeURIComponent(name)}#all-tests`;

/** Per page: the English original, the booking link, price and fixed lists. */
const PAGES = {
  home: {
    english: "/",
    book: "/#all-tests",
  },
  "home-sample-collection": {
    english: "/home-sample-collection-hyderabad",
    book: "/#all-tests",
    areas: [
      "Mehdipatnam", "Masab Tank", "Asif Nagar", "Gudimalkapur", "Attapur",
      "Tolichowki", "Lakdikapul", "Nampally", "Banjara Hills", "Humayun Nagar",
      "Langar Houz", "Karwan",
    ],
  },
  "diabetes-screening": {
    english: "/packages/comprehensive-diabetes-screening-hyderabad",
    book: book("Comprehensive Diabetes Screening"),
    price: 899,
    includes: [
      "HbA1c (Glycated Haemoglobin)", "Lipid Profile", "Serum Creatinine",
      "Urine Albumin/Creatinine Ratio (UACR)",
    ],
  },
  "full-body-checkup": {
    english: "/packages/full-body-checkup-hyderabad",
    book: book("Full Body Check Up"),
    price: 1795,
    includes: [
      "Complete Blood Count (CBC)", "ESR", "HbA1c", "Lipid Profile",
      "Liver Function Test (LFT)", "Kidney Function Test (KFT)",
      "Iron Studies (TIBC)", "Thyroid Profile I", "Vitamin D (25-OH)",
      "Vitamin B12", "Serum Calcium", "Complete Urine Analysis (CUE)",
    ],
  },
  "hba1c-test": {
    english: "/tests/hba1c-test-hyderabad",
    book: book("HbA1c (Glycated Haemoglobin)"),
    price: 600,
  },
};

const PAGE_ORDER = ["home", "home-sample-collection", "diabetes-screening", "full-body-checkup", "hba1c-test"];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const pathFor = (code, page) => (page === "home" ? `/${code}` : `/${code}/${page}`);

/**
 * Same pages, same blocks, same counts as the English. Returns a message
 * naming the first mismatch, or null.
 */
function shapeError(lang, page) {
  const a = en.pages[page];
  const b = lang.pages && lang.pages[page];
  if (!b) return `${lang.code}: page "${page}" is missing`;
  for (const key of ["title", "desc", "h1", "sub", "wa"]) {
    if (!b[key]) return `${lang.code}/${page}: "${key}" is missing`;
  }
  if ((b.blocks || []).length !== a.blocks.length) return `${lang.code}/${page}: ${b.blocks.length} blocks, English has ${a.blocks.length}`;
  for (let i = 0; i < a.blocks.length; i++) {
    for (const key of ["p", "li"]) {
      const n = (a.blocks[i][key] || []).length;
      const m = (b.blocks[i][key] || []).length;
      if (n !== m) return `${lang.code}/${page}: block ${i + 1} has ${m} ${key}, English has ${n}`;
    }
  }
  if ((b.faqs || []).length !== a.faqs.length) return `${lang.code}/${page}: ${b.faqs.length} FAQs, English has ${a.faqs.length}`;
  for (const key of Object.keys(en.ui)) {
    if (!lang.ui[key]) return `${lang.code}: ui string "${key}" is missing`;
  }
  return null;
}

const CSS = `:root{--blue:#0A5C9E;--blue-dark:#08487d;--teal:#0c776e;--ink:#152b3c;--muted:#5b6b7a;--line:#e3ecf3;--bg:#f6f9fc;--wa:#0f8440}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,'Noto Sans Telugu','Noto Sans Devanagari',Arial,sans-serif;color:var(--ink);line-height:1.8;background:var(--bg)}
html[lang=ur] body{font-family:'Noto Nastaliq Urdu','Jameel Noori Nastaleeq','Noto Naskh Arabic','Segoe UI',Tahoma,sans-serif;line-height:2.2}
a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}
.w{max-width:900px;margin:0 auto;padding:0 20px}
.top{background:var(--blue-dark);color:#eaf3fb;font-size:13px;padding:7px 0}
.top .w{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.top a{color:#eaf3fb}
header{background:#fff;border-bottom:1px solid var(--line)}
header .w{padding-top:12px;padding-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;color:var(--ink)}
.brand b{color:var(--blue);font-size:18px;font-weight:800}
.brand small{display:block;font-size:10px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase}
.langs{display:flex;gap:6px;flex-wrap:wrap;font-size:14px}
.langs a{border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:var(--ink);background:#fff}
.langs a[aria-current]{background:var(--blue);border-color:var(--blue);color:#fff}
.draft{background:#fff4dc;border-bottom:1px solid #f0d9a0;color:#6b4200;font-size:14px;padding:10px 0}
.hero{background:linear-gradient(135deg,var(--blue),#0f8fb0);color:#fff;padding:30px 0}
.hero h1{font-size:28px;line-height:1.35}
.hero p{opacity:.95;font-size:16px;margin-top:6px}
main .w{padding-top:24px;padding-bottom:10px}
.grid{display:grid;grid-template-columns:1fr 290px;gap:22px;align-items:start}
@media(max-width:760px){.grid{grid-template-columns:1fr}}
.card,.side{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px 26px;box-shadow:0 4px 14px rgba(10,92,158,.06)}
.card h2{color:var(--blue);font-size:20px;margin:26px 0 8px}
.card h2:first-child{margin-top:0}
.card p,.card li{color:#33465a;font-size:16px;margin-bottom:10px}
.card ul{padding-inline-start:22px;margin-bottom:10px}
.inc{list-style:none;padding:0!important;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px}
@media(max-width:560px){.inc{grid-template-columns:1fr}}
.inc li{padding-inline-start:22px;position:relative;direction:ltr;text-align:start}
.inc li:before{content:"✓";position:absolute;inset-inline-start:0;color:var(--teal);font-weight:700}
.areas{direction:ltr;text-align:start;font-weight:600}
details.faq{border:1px solid var(--line);border-radius:10px;margin-bottom:8px;background:#fbfdff}
details.faq summary{cursor:pointer;padding:12px 16px;font-weight:600}
details.faq p{padding:0 16px 12px}
.en{direction:ltr;text-align:left;font-family:'Segoe UI',system-ui,Arial,sans-serif;line-height:1.6;background:#f3f4f6;border-inline-start:3px solid #9ca3af;color:#374151!important;font-size:14px!important;padding:6px 10px;margin:-4px 0 12px;border-radius:4px}
.side .lbl{font-size:13px;color:var(--muted)}
.side .price{font-size:34px;font-weight:800;margin:2px 0 8px;direction:ltr;text-align:start}
.side .fine{font-size:13px;color:var(--muted);line-height:1.6;margin-top:8px}
.btn{display:block;text-align:center;border-radius:10px;padding:12px 14px;font-weight:700;font-size:15px;margin-bottom:10px}
.btn-blue{background:var(--blue);color:#fff}.btn-wa{background:var(--wa);color:#fff}.btn-line{border:2px solid var(--blue);color:var(--blue)}
.btn:hover{text-decoration:none;filter:brightness(1.06)}
.pages{list-style:none;padding:0!important}
.pages li{margin-bottom:8px}
.pages a{font-weight:600}
.num{direction:ltr;unicode-bidi:isolate}
footer{background:var(--blue-dark);color:#cde2f2;margin-top:34px;padding:26px 0 22px;font-size:13px;direction:ltr;text-align:left}
footer a{color:#cde2f2}
footer .fine{color:#9cc0dd;line-height:1.7}`;

function renderPage(code, page, review) {
  const L = LANGS[code];
  const t = L.pages[page];
  const s = en.pages[page];
  const cfg = PAGES[page];
  const ui = L.ui;
  const path = pathFor(code, page);
  const url = BASE + path;
  const indexable = L.approved === true;
  const q = review ? "?review=1" : "";

  const enLine = (text) => (review ? `<p class="en">${esc(text)}</p>` : "");

  const hreflang = indexable
    ? [`<link rel="alternate" hreflang="en-IN" href="${BASE}${cfg.english}">`]
        .concat(ORDER.filter((c) => LANGS[c].approved === true).map((c) => `<link rel="alternate" hreflang="${c}-IN" href="${BASE}${pathFor(c, page)}">`))
        .join("\n")
    : "";

  const blocks = t.blocks.map((b, i) => {
    const eb = s.blocks[i];
    let html = `<h2>${esc(b.h)}</h2>${enLine(eb.h)}`;
    (b.p || []).forEach((para, j) => { html += `<p>${esc(para)}</p>${enLine(eb.p[j])}`; });
    if (b.li) {
      html += "<ul>" + b.li.map((item, j) => `<li>${esc(item)}${review ? `<span class="en" style="display:block;margin:4px 0 0">${esc(eb.li[j])}</span>` : ""}</li>`).join("") + "</ul>";
    }
    if (eb.areas && cfg.areas) html += `<p class="areas">${cfg.areas.map(esc).join(" · ")}</p>`;
    if (eb.includes && cfg.includes) html += `<h2>${esc(ui.includes)}</h2><ul class="inc">${cfg.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    return html;
  }).join("\n");

  const faqs = t.faqs.map(([qq, a], i) => {
    const [eq, ea] = s.faqs[i];
    return `<details class="faq"${review ? " open" : ""}><summary>${esc(qq)}</summary>${review ? `<p class="en">${esc(eq)}</p>` : ""}<p>${esc(a)}</p>${enLine(ea)}</details>`;
  }).join("");

  const pageLinks = page === "home"
    ? `<h2>${esc(ui.pagesTitle)}</h2>${enLine(en.ui.pagesTitle)}<ul class="pages">${PAGE_ORDER.filter((p) => p !== "home").map((p) => `<li><a href="${pathFor(code, p)}${q}">${esc(L.pages[p].h1)}</a></li>`).join("")}</ul>`
    : "";

  const side = `<aside class="side">
${cfg.price ? `<div class="lbl">${esc(ui.price)}</div><div class="price">${inr(cfg.price)}</div>` : `<div class="lbl">${esc(ui.homeCollection)}</div><p class="fine" style="margin:4px 0 12px">${esc(ui.free500)}</p>`}
<a class="btn btn-blue" href="${cfg.book}">${esc(ui.bookOnline)}</a>
<a class="btn btn-wa" href="${WA}?text=${encodeURIComponent(t.wa)}">${esc(ui.whatsapp)}</a>
<a class="btn btn-line" href="tel:${PHONE_TEL}">${esc(ui.call)} <span class="num">${PHONE_DISPLAY}</span></a>
<p class="fine">${esc(ui.bookNote)}</p>
<p class="fine"><a href="${cfg.english}">${esc(ui.readEnglish)}</a></p>
</aside>`;

  const langLinks = ORDER.map((c) => `<a href="${pathFor(c, page)}${q}"${c === code ? ' aria-current="true"' : ""} lang="${c}">${esc(LANGS[c].name)}</a>`).join("")
    + `<a href="${cfg.english}" lang="en">English</a>`;

  return `<!DOCTYPE html><html lang="${code}" dir="${L.dir}"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
${indexable ? "" : '<meta name="robots" content="noindex, nofollow">'}
<link rel="canonical" href="${url}">
${hreflang}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/ogimage.png">
<meta property="og:locale" content="${code}_IN">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${CSS}</style></head><body>
${indexable ? "" : `<div class="draft"><div class="w">${esc(en.ui.draftBanner)}${review ? " Grey boxes show the English original." : ""}</div></div>`}
<div class="top"><div class="w"><span>10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad 500057</span><span>${esc(ui.open)} · <a href="tel:${PHONE_TEL}" class="num">${PHONE_DISPLAY}</a></span></div></div>
<header><div class="w">
<a class="brand" href="/${code}${q}"><svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#0A5C9E"/><path d="M24 10c5 6 8 10 8 14.5A8 8 0 0 1 16 24.5C16 20 19 16 24 10Z" fill="#fff"/><circle cx="24" cy="25" r="3.4" fill="#14B8A6"/></svg><span dir="ltr"><b>Caspian</b><small>Diagnostic Centre</small></span></a>
<nav class="langs" aria-label="Language">${langLinks}</nav>
</div></header>
<div class="hero"><div class="w"><h1>${esc(t.h1)}</h1>${review ? `<p class="en">${esc(s.h1)}</p>` : ""}<p>${esc(t.sub)}</p>${review ? `<p class="en">${esc(s.sub)}</p>` : ""}</div></div>
<main><div class="w"><div class="grid"><div class="card">
${blocks}
<h2>${esc(ui.faqs)}</h2>${enLine(en.ui.faqs)}
${faqs}
${pageLinks}
<p class="fine" style="margin-top:18px;font-size:14px;color:var(--muted)">${esc(ui.disclaimer)}</p>${enLine(en.ui.disclaimer)}
</div>
${side}
</div></div></main>
<footer><div class="w">
<div class="fine"><b style="color:#fff">Caspian Diagnostic Centre</b>, operated by Caspian Lifesciences Private Limited · 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad, Telangana 500057</div>
<div class="fine" style="margin-top:8px"><a href="/">English website</a> · <a href="/tests">All tests</a> · <a href="/packages">Packages</a> · <a href="/privacy.html">Privacy</a> · <a href="/refund.html">Refund policy</a></div>
<div class="fine" style="margin-top:8px">Govt. of Telangana Regn. 07F-APMCE-1846 · PCPNDT Regn. 0116A1337</div>
</div></footer>
</body></html>`;
}

export default function handler(req, res) {
  const { l, slug } = req.query || {};
  const code = String(l || "");
  const page = slug ? String(slug) : "home";
  const review = String((req.query || {}).review || "") === "1";

  const L = LANGS[code];
  if (!L || !PAGES[page]) {
    res.setHeader("Location", "/");
    res.status(302).end();
    return;
  }

  const problem = shapeError(L, page);
  if (problem) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(500).send(`Translation file out of step with api/_lang/en.js: ${problem}`);
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (L.approved !== true) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", review ? "no-store" : "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderPage(code, page, review));
}
