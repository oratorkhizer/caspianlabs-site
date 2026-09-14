// Caspian Diagnostic Centre, shared page shell for standalone landing-page renderers.
// Copied verbatim from api/page.js (constants, photos, helpers, CSS, pageShell, JSON-LD builders)
// so bespoke pages such as api/abg.js look identical to the /tests and /packages pages.
// Underscore prefix keeps Vercel from routing this file as a function.
//
// MAINTENANCE RULE: if the shell in api/page.js changes, mirror the change here.

export const BASE = "https://www.caspianlabs.in";
export const PHONE_DISPLAY = "+91 90593 41154";
export const PHONE_TEL = "+919059341154";
export const WA = "https://wa.me/919059341154";

/* Site photos (Caspian staff shoot, Aug 2026) hosted on Supabase Storage, public bucket "caspianlabs" in project caspian-cme.
   1600px JPEGs. Add a new photo: upload to site/<name>.jpg in that bucket, then reference it here. */
export const PHOTO_BASE = "https://gjpbiiqkvzysmdpioexk.supabase.co/storage/v1/object/public/caspianlabs/site/";
export const PHOTOS = {
  lab: ["lab-analysers.jpg", "Caspian Diagnostic Centre laboratory: biochemistry analysers and sample racks"],
  labWide: ["lab-wide.jpg", "Laboratory at Caspian Diagnostic Centre, Vijay Nagar Colony"],
  technician: ["lab-technician.jpg", "Lab technician processing samples at Caspian Diagnostic Centre"],
  xray: ["xray-room.jpg", "Digital X-ray room at Caspian Diagnostic Centre"],
  echo: ["echo-cardiologist.jpg", "Cardiologist performing a 2D echo at Caspian"],
  nurse: ["nurse-patient.jpg", "Nurse attending a patient at Caspian"],
  reception: ["reception.jpg", "Reception at Caspian, Vijay Nagar Colony"],
  team: ["team.jpg", "The Caspian team"],
  ultrasound: ["ultrasound-scan.jpg", "Ultrasound scan at Caspian"],
  abg: ["abg-analyser.jpg", "SENSA CORE ST-200CC blood gas analyser in the laboratory at Caspian Diagnostic Centre"]
};
export function photoUrl(key) { return PHOTOS[key] ? PHOTO_BASE + PHOTOS[key][0] : ""; }
export function photoFig(key, caption) {
  if (!PHOTOS[key]) return "";
  return `<figure class="ph"><img src="${PHOTO_BASE + PHOTOS[key][0]}" alt="${esc(PHOTOS[key][1])}" width="1600" height="1067" loading="lazy" decoding="async">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ""}</figure>`;
}

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
export function inr(n) { return "₹" + n.toLocaleString("en-IN"); }
export function waLink(text) { return WA + "?text=" + encodeURIComponent(text); }

export const CSS = `:root{--blue:#0A5C9E;--blue-dark:#08487d;--teal:#0c776e;--ink:#152b3c;--muted:#5b6b7a;--line:#e3ecf3;--bg:#f6f9fc;--wa:#0f8440}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;color:var(--ink);line-height:1.7;background:var(--bg)}
a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}
.top{background:var(--blue-dark);color:#eaf3fb;font-size:13px;padding:7px 0}
.top .w{max-width:900px;margin:0 auto;padding:0 20px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
header .w{max-width:900px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px}
.brand b{color:var(--blue);font-size:18px;font-weight:800;letter-spacing:-.02em}
.brand span{font-size:10px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;display:block}
.home{font-size:14px;font-weight:600}
.topnav{display:flex;gap:14px;flex-wrap:wrap;font-size:14px;font-weight:600}
.topnav a{color:var(--ink)}.topnav a.home{color:var(--blue)}
@media(max-width:560px){.topnav{gap:10px;font-size:13px}}
.hub{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;list-style:none;padding:0}
.hub li{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.hub li a{font-weight:700;display:block}
.hub li .hp{color:var(--ink);font-weight:800;margin-top:4px}
.hub li .hs{font-size:13px;color:var(--muted)}
.crumbs{max-width:900px;margin:14px auto 0;padding:0 20px;font-size:13px;color:var(--muted)}
.crumbs a{color:var(--muted)}
.hero{background:linear-gradient(135deg,var(--blue),#0f8fb0);color:#fff;padding:30px 0;margin-top:14px}
.hero .w{max-width:900px;margin:0 auto;padding:0 20px}
.hero h1{font-size:27px;letter-spacing:-.01em;line-height:1.3}
.hero p{opacity:.92;font-size:15px;margin-top:6px}
main{max-width:900px;margin:0 auto;padding:26px 20px 10px}
.grid{display:grid;grid-template-columns:1fr 300px;gap:22px;align-items:start}
@media(max-width:760px){.grid{grid-template-columns:1fr}}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px 28px;box-shadow:0 4px 14px rgba(10,92,158,.06)}
.card h2{color:var(--blue);font-size:19px;margin:24px 0 8px}
.card h2:first-child{margin-top:0}
.card p,.card li{color:#33465a;font-size:15px;margin-bottom:10px}
.card ul{padding-left:22px;margin-bottom:10px}
.card li{margin-bottom:6px}
.side{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px;box-shadow:0 4px 14px rgba(10,92,158,.06);position:sticky;top:80px}
.price-lbl{font-size:13px;color:var(--muted)}
.price{font-size:34px;font-weight:800;color:var(--ink);letter-spacing:-.02em;margin:2px 0 4px}
.side .meta{font-size:13px;color:var(--muted);margin-bottom:14px}
.btn{display:block;text-align:center;border-radius:10px;padding:12px 16px;font-weight:700;font-size:15px;margin-bottom:10px}
.btn-wa{background:var(--wa);color:#fff}.btn-wa:hover{text-decoration:none;filter:brightness(1.06)}
.btn-blue{background:var(--blue);color:#fff}.btn-blue:hover{text-decoration:none;filter:brightness(1.06)}
.btn-line{border:2px solid var(--blue);color:var(--blue)}.btn-line:hover{text-decoration:none;background:#eaf3fb}
.side .fine{font-size:12.5px;color:var(--muted);line-height:1.55}
.tick{color:var(--teal);font-weight:700;margin-right:6px}
.facts{width:100%;border-collapse:collapse;margin:8px 0 4px}
.facts td{border:1px solid var(--line);padding:9px 12px;font-size:14px;vertical-align:top}
.facts td:first-child{background:#f2f8fd;font-weight:600;width:40%}
.inc{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;padding-left:0;list-style:none}
@media(max-width:560px){.inc{grid-template-columns:1fr}}
.inc li{padding-left:22px;position:relative}
.inc li:before{content:"✓";position:absolute;left:0;color:var(--teal);font-weight:700}
details.faq{border:1px solid var(--line);border-radius:10px;margin-bottom:8px;background:#fbfdff}
details.faq summary{cursor:pointer;padding:12px 16px;font-weight:600;font-size:14.5px}
details.faq p{padding:0 16px 12px;font-size:14px}
.rel{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.rel a{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font-size:13.5px;font-weight:600}
.rel a:hover{text-decoration:none;border-color:var(--blue)}
.ph{margin:0 0 18px;border-radius:12px;overflow:hidden;background:#eaf3fb}.ph img{width:100%;height:auto;display:block}.ph figcaption{font-size:12.5px;color:var(--muted);padding:6px 10px}
.note{background:#eaf3fb;border:1px solid #cfe1f1;border-radius:10px;padding:12px 16px;margin:14px 0;font-size:14px}
footer{background:var(--blue-dark);color:#cde2f2;margin-top:34px;padding:30px 0 22px;font-size:13px}
footer .w{max-width:900px;margin:0 auto;padding:0 20px}
footer .legal{color:#fff;font-weight:700;margin-bottom:4px}
footer .links{display:flex;flex-wrap:wrap;gap:6px 16px;margin:14px 0 12px}
footer .links a{color:#cde2f2}
footer .fine{color:#9cc0dd;line-height:1.6}`;

export function pageShell({ title, desc, canonical, breadcrumbHtml, heroH1, heroSub, bodyHtml, ld, ogImage }) {
  const ldTags = ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage || (BASE + "/ogimage.png")}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${ldTags}
<style>${CSS}</style></head><body>
<div class="top"><div class="w"><span>\u{1F4CD} 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad 500057</span><span>\u{1F557} Open 24/7 · \u{1F4DE} <a href="tel:${PHONE_TEL}" style="color:#eaf3fb">${PHONE_DISPLAY}</a></span></div></div>
<header><div class="w">
  <a class="brand" href="/"><svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#0A5C9E"/><path d="M24 10c5 6 8 10 8 14.5A8 8 0 0 1 16 24.5C16 20 19 16 24 10Z" fill="#fff"/><circle cx="24" cy="25" r="3.4" fill="#14B8A6"/></svg><span><b>Caspian</b><span>Diagnostic Centre</span></span></a>
  <nav class="topnav" aria-label="Site"><a href="/tests">All Tests</a><a href="/packages">Packages</a><a href="/home-sample-collection-hyderabad">Home Collection</a><a href="/blog">Blog</a><a class="home" href="/">Home</a></nav>
</div></header>
<nav class="crumbs" aria-label="Breadcrumb">${breadcrumbHtml}</nav>
<div class="hero"><div class="w"><h1>${esc(heroH1)}</h1><p>${esc(heroSub)}</p></div></div>
<main>${bodyHtml}</main>
<footer><div class="w">
  <div class="legal">Caspian Lifesciences Private Limited</div>
  <div class="fine">Operating as Caspian Diagnostic Centre · 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad, Telangana 500057</div>
  <div class="links"><a href="/">Home</a><a href="/tests">All Tests</a><a href="/packages">Health Packages</a><a href="/home-sample-collection-hyderabad">Home Collection</a><a href="/blog">Blog</a><a href="/about.html">About Us</a><a href="/pricing.html">Pricing</a><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/refund.html">Refund Policy</a><a href="/contact.html">Contact Us</a></div>
  <div class="fine">\u{1F4DE} ${PHONE_DISPLAY}  ·  ✉️ <a href="mailto:info@caspianlabs.in" style="color:#cde2f2">info@caspianlabs.in</a>  ·  \u{1F4AC} <a href="${WA}" style="color:#cde2f2">WhatsApp</a></div>
  <div class="fine" style="margin-top:10px">© 2026 Caspian Lifesciences Private Limited. All rights reserved. · Govt. of Telangana Regn. 07F-APMCE-1846 · PCPNDT Regn. 0116A1337</div>
</div></footer>
</body></html>`;
}

export function ldBreadcrumb(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({ "@type": "ListItem", "position": i + 1, "name": it[0], "item": BASE + it[1] }))
  };
}
export function ldProduct(name, desc, price, url) {
  return {
    "@context": "https://schema.org", "@type": "Product",
    "name": name, "description": desc, "url": url, "image": BASE + "/ogimage.png",
    "brand": { "@type": "Brand", "name": "Caspian Diagnostic Centre" },
    "offers": { "@type": "Offer", "price": String(price), "priceCurrency": "INR", "availability": "https://schema.org/InStock", "url": url }
  };
}
export function ldFaq(faqs) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f[0], "acceptedAnswer": { "@type": "Answer", "text": f[1] } }))
  };
}
export function ldMedicalTest(name, desc, url) {
  return { "@context": "https://schema.org", "@type": "MedicalTest", "name": name, "description": desc, "url": url };
}

export function faqBlock(faqs) {
  return faqs.map(f => `<details class="faq"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("\n");
}
