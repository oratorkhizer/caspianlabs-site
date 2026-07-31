// Caspian Diagnostic Centre — blog (Phase 3, task 3.3)
// Serves /blog (index) and /blog/:slug via rewrites in vercel.json.
// Same pattern as api/page.js: one function, content as data, CDN-cached.
//
// NOTE: keep BLOG slugs in api/sitemap.js in sync when adding articles.
// To publish a new article: add an object to ARTICLES, add its slug to sitemap.js.

const BASE = "https://www.caspianlabs.in";
const PHONE_DISPLAY = "+91 90593 41154";
const PHONE_TEL = "+919059341154";
const WA = "https://wa.me/919059341154";

/* ------------------------------------------------------------------ */
/* Articles                                                            */
/* ------------------------------------------------------------------ */
// body: array of blocks. ["h2", text] | ["p", html-allowed text] | ["ul", [items]] | ["note", text]

const ARTICLES = [
  {
    slug: "what-does-hba1c-mean",
    title: "What does HbA1c mean? A diabetologist explains",
    metaTitle: "What Does HbA1c Mean? Normal Range & Results Explained | Caspian Labs Blog",
    desc: "HbA1c explained simply by a Hyderabad diabetologist — what the test measures, normal and prediabetes ranges, why it beats a single sugar reading, and how often to test.",
    date: "2026-07-31",
    readMins: 5,
    intro: "If you or a family member has diabetes — or your doctor suspects it — you've probably seen “HbA1c” on a lab slip. It is the single most important number in diabetes care, yet most patients are never told what it actually means. Here is the plain-language version I give my own patients.",
    body: [
      ["h2", "HbA1c is your three-month sugar average"],
      ["p", "Glucose in your blood naturally sticks to haemoglobin, the protein inside red blood cells. The more sugar in your blood, the more of it gets stuck. HbA1c (glycated haemoglobin) measures what percentage of your haemoglobin has sugar attached."],
      ["p", "Because red blood cells live for about three months, HbA1c reflects your <b>average</b> blood sugar over roughly the past 8–12 weeks. That is what makes it special: a fasting sugar tells me about one morning; HbA1c tells me about your whole quarter."],
      ["h2", "What the numbers mean"],
      ["ul", [
        "<b>Below 5.7%</b> — normal.",
        "<b>5.7% to 6.4%</b> — prediabetes. Your sugar is running higher than it should, but there is still time to reverse course with diet, activity and weight management.",
        "<b>6.5% or above</b> — in the diabetes range. Your doctor will usually confirm with a repeat test or a sugar reading before making the diagnosis."
      ]],
      ["p", "For people already living with diabetes, the target is individual — commonly below 7%, but your doctor may set it higher or lower depending on your age, other conditions and risk of low sugar. Don't chase a number you saw online; chase the one your doctor set for you."],
      ["h2", "Why one high reading isn't the full story — and one good reading isn't either"],
      ["p", "Patients often eat carefully for two days before a sugar test and feel relieved by a good fasting number. HbA1c is honest: it averages the festival sweets, the skipped walks and the good weeks alike. The reverse is also true — a single high random sugar after a heavy biryani does not mean your control is poor. This is exactly why doctors rely on HbA1c to judge how treatment is really going."],
      ["h2", "How often should you test?"],
      ["ul", [
        "<b>Living with diabetes:</b> every 3 months if treatment is being adjusted or targets aren't met; every 6 months once stable.",
        "<b>Prediabetes:</b> at least once a year, alongside lifestyle changes.",
        "<b>Family history of diabetes, over 35, or overweight:</b> screening every 1–3 years is sensible — diabetes is silent in its early years."
      ]],
      ["h2", "A few things that can affect the result"],
      ["p", "Because the test rides on red blood cells, conditions that change those cells — significant anaemia, recent blood loss or transfusion, some haemoglobin variants — can nudge HbA1c up or down. If your HbA1c doesn't match your home sugar readings, tell your doctor; a simple CBC and iron check often explains the gap."],
      ["h2", "The practical bits"],
      ["p", "No fasting is needed — you can walk in any time of day. It's a simple blood sample, the report is ready the same day, and at Caspian it costs ₹600 with free home collection on orders above ₹500. If you're due for a fuller review, our <a href=\"/packages/comprehensive-diabetes-screening-hyderabad\">Comprehensive Diabetes Screening (₹899)</a> pairs HbA1c with cholesterol and early kidney checks — the complications worth catching early."],
      ["note", "This article is general information, not personal medical advice. Discuss your own numbers with your doctor — every target should be individualised."]
    ],
    cta: { label: "Book an HbA1c test (₹600)", href: "/tests/hba1c-test-hyderabad" },
    related: ["/tests/hba1c-test-hyderabad", "/packages/comprehensive-diabetes-screening-hyderabad", "/tests/blood-sugar-test-hyderabad"],
    relatedLabels: ["HbA1c Test — ₹600", "Diabetes Screening Package — ₹899", "Blood Sugar Test — ₹80"]
  },
  {
    slug: "fasting-before-blood-test",
    title: "Fasting before a blood test: the rules, test by test",
    metaTitle: "Fasting Before a Blood Test — Which Tests Need It & For How Long | Caspian Labs Blog",
    desc: "Which blood tests need fasting and for how long? A Hyderabad lab explains fasting rules for lipid profile, blood sugar, thyroid, HbA1c and more — plus what you can drink.",
    date: "2026-07-31",
    readMins: 4,
    intro: "“Should I come empty stomach?” is the question our phlebotomists hear most. Fast unnecessarily and you've skipped breakfast for nothing; eat before a fasting test and the sample may be wasted. Here are the actual rules, test by test.",
    body: [
      ["h2", "Tests that DO need fasting (8–12 hours)"],
      ["ul", [
        "<b>Fasting blood sugar (FBS)</b> — the definition of the test. 8–12 hours without food; water is fine.",
        "<b>Lipid profile (cholesterol)</b> — we advise 8–12 hours of fasting, mainly because triglycerides rise sharply after meals. (Some modern guidelines accept non-fasting lipids — if your doctor has said non-fasting is fine for you, follow their advice.)",
        "<b>Full-body and metabolic packages</b> — because they include fasting sugar and lipids, the whole package is best done fasting, in the morning."
      ]],
      ["h2", "Tests that do NOT need fasting"],
      ["ul", [
        "<b>HbA1c</b> — measures a 3-month average; breakfast cannot change it.",
        "<b>CBC, ESR, CRP</b> — blood counts and inflammation markers.",
        "<b>Thyroid tests (TSH, T3, T4)</b> — food doesn't matter; morning samples are preferred if you're tracking values over time.",
        "<b>Vitamin D and Vitamin B12</b>, <b>creatinine and urea</b>, <b>urine routine</b>, <b>blood group</b> — all fine after food."
      ]],
      ["h2", "The in-between one: post-prandial sugar (PPBS)"],
      ["p", "PPBS is not a fasting test — it's a <b>timed</b> one. Eat your normal meal, note the time you start eating, and give the sample exactly 2 hours later. Eating a deliberately light meal to “score better” only hides the truth from your doctor."],
      ["h2", "What counts as fasting?"],
      ["ul", [
        "<b>Water is allowed</b> — and encouraged. Being well-hydrated actually makes the blood draw easier.",
        "<b>Not allowed:</b> tea, coffee (even black), milk, juice, gutka, and food of any kind. Smoking is best avoided too.",
        "<b>Medicines:</b> most regular tablets can be taken with water, but ask your doctor — especially for diabetes medicines and insulin, which are usually taken <i>after</i> the fasting sample, with breakfast ready."
      ]],
      ["h2", "Practical tips from our collection team"],
      ["ul", [
        "Book a morning slot: finish dinner by 10 pm, give the sample by 8–10 am, and the fast takes care of itself while you sleep.",
        "Booking home collection? Keep your breakfast ready — you can eat the moment the sample is drawn.",
        "Don't fast much beyond 14 hours; very long fasts can themselves skew some results.",
        "Not sure about your specific test? Message us on WhatsApp with the test name — we'll confirm in a minute."
      ]],
      ["h2", "The bottom line"],
      ["p", "Only sugar (fasting/PP) and lipid tests routinely need preparation — most everything else can be done any time at our centre, which is open 24/7. When you book at Caspian, our team tells you the exact preparation for your tests, and reminds you the evening before a fasting appointment."],
      ["note", "This article is general information, not personal medical advice. For test choices and medicine timing during fasting, follow your own doctor's instructions."]
    ],
    cta: { label: "Book a fasting-friendly morning slot", href: "/#all-tests" },
    related: ["/tests/lipid-profile-test-hyderabad", "/tests/blood-sugar-test-hyderabad", "/home-sample-collection-hyderabad"],
    relatedLabels: ["Lipid Profile — ₹450", "Blood Sugar Test — ₹80", "Home Sample Collection"]
  }
];

/* ------------------------------------------------------------------ */
/* Template                                                            */
/* ------------------------------------------------------------------ */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const CSS = `:root{--blue:#0A5C9E;--blue-dark:#08487d;--teal:#0c776e;--ink:#152b3c;--muted:#5b6b7a;--line:#e3ecf3;--bg:#f6f9fc;--wa:#0f8440}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;color:var(--ink);line-height:1.75;background:var(--bg)}
a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}
.top{background:var(--blue-dark);color:#eaf3fb;font-size:13px;padding:7px 0}
.top .w{max-width:820px;margin:0 auto;padding:0 20px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
header .w{max-width:820px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px}
.brand b{color:var(--blue);font-size:18px;font-weight:800;letter-spacing:-.02em}
.brand span{font-size:10px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;display:block}
.home{font-size:14px;font-weight:600}
.crumbs{max-width:820px;margin:14px auto 0;padding:0 20px;font-size:13px;color:var(--muted)}
.crumbs a{color:var(--muted)}
main{max-width:820px;margin:0 auto;padding:20px 20px 10px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:30px 34px;box-shadow:0 4px 14px rgba(10,92,158,.06)}
@media(max-width:560px){.card{padding:22px 20px}}
h1{font-size:30px;line-height:1.25;letter-spacing:-.01em;margin-bottom:10px}
.byline{color:var(--muted);font-size:14px;margin-bottom:6px}
.byline b{color:var(--ink)}
.intro{font-size:17px;color:#33465a;margin:16px 0 6px;font-style:italic}
.card h2{color:var(--blue);font-size:20px;margin:26px 0 8px}
.card p{color:#33465a;font-size:16px;margin-bottom:12px}
.card ul{padding-left:24px;margin-bottom:12px}
.card li{color:#33465a;font-size:16px;margin-bottom:8px}
.note{background:#eaf3fb;border:1px solid #cfe1f1;border-radius:10px;padding:12px 16px;margin:18px 0 8px;font-size:14px;color:#33465a}
.cta-box{background:linear-gradient(135deg,var(--blue),#0f8fb0);border-radius:12px;color:#fff;padding:22px 24px;margin:24px 0 6px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}
.cta-box b{font-size:17px}
.btn{display:inline-block;border-radius:10px;padding:11px 18px;font-weight:700;font-size:15px}
.btn-white{background:#fff;color:var(--blue)}.btn-white:hover{text-decoration:none}
.btn-wa{background:var(--wa);color:#fff}.btn-wa:hover{text-decoration:none;filter:brightness(1.06)}
.share{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:22px;padding-top:16px;border-top:1px solid var(--line);font-size:14px}
.share a,.share button{border:1px solid var(--line);background:#fbfdff;border-radius:999px;padding:7px 15px;font-size:13.5px;font-weight:600;color:var(--blue);cursor:pointer;font-family:inherit}
.share a:hover,.share button:hover{text-decoration:none;border-color:var(--blue)}
.rel{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.rel a{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font-size:13.5px;font-weight:600}
.rel a:hover{text-decoration:none;border-color:var(--blue)}
.post{display:block;background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px 28px;box-shadow:0 4px 14px rgba(10,92,158,.06);margin-bottom:16px}
.post:hover{text-decoration:none;border-color:var(--blue)}
.post h2{color:var(--ink);font-size:21px;margin-bottom:6px}
.post .pm{color:var(--muted);font-size:13.5px;margin-bottom:8px}
.post p{color:#33465a;font-size:15px}
.post .more{color:var(--blue);font-weight:700;font-size:14.5px}
footer{background:var(--blue-dark);color:#cde2f2;margin-top:34px;padding:30px 0 22px;font-size:13px}
footer .w{max-width:820px;margin:0 auto;padding:0 20px}
footer .legal{color:#fff;font-weight:700;margin-bottom:4px}
footer .links{display:flex;flex-wrap:wrap;gap:6px 16px;margin:14px 0 12px}
footer .links a{color:#cde2f2}
footer .fine{color:#9cc0dd;line-height:1.6}`;

function shell({ title, desc, canonical, crumbs, bodyHtml, ld }) {
  const ldTags = ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE}/ogimage.png">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
${ldTags}
<style>${CSS}</style></head><body>
<div class="top"><div class="w"><span>\u{1F4CD} Ahmed Plaza, Vijay Nagar Colony, Hyderabad</span><span>\u{1F557} Open 24/7 · \u{1F4DE} <a href="tel:${PHONE_TEL}" style="color:#eaf3fb">${PHONE_DISPLAY}</a></span></div></div>
<header><div class="w">
  <a class="brand" href="/"><svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#0A5C9E"/><path d="M24 10c5 6 8 10 8 14.5A8 8 0 0 1 16 24.5C16 20 19 16 24 10Z" fill="#fff"/><circle cx="24" cy="25" r="3.4" fill="#14B8A6"/></svg><span><b>Caspian</b><span>Diagnostic Centre</span></span></a>
  <a class="home" href="/blog">Health Blog</a>
</div></header>
<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
<main>${bodyHtml}</main>
<footer><div class="w">
  <div class="legal">Caspian Lifesciences Private Limited</div>
  <div class="fine">Operating as Caspian Diagnostic Centre · 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad, Telangana 500057</div>
  <div class="links"><a href="/">Home</a><a href="/blog">Blog</a><a href="/home-sample-collection-hyderabad">Home Collection</a><a href="/about.html">About Us</a><a href="/pricing.html">Pricing</a><a href="/privacy.html">Privacy</a><a href="/contact.html">Contact Us</a></div>
  <div class="fine">\u{1F4DE} ${PHONE_DISPLAY}  ·  ✉️ <a href="mailto:info@caspianlabs.in" style="color:#cde2f2">info@caspianlabs.in</a>  ·  \u{1F4AC} <a href="${WA}" style="color:#cde2f2">WhatsApp</a></div>
  <div class="fine" style="margin-top:10px">© 2026 Caspian Lifesciences Private Limited. All rights reserved.</div>
</div></footer>
</body></html>`;
}

function blockHtml(b) {
  if (b[0] === "h2") return `<h2>${esc(b[1])}</h2>`;
  if (b[0] === "p") return `<p>${b[1]}</p>`;
  if (b[0] === "ul") return `<ul>${b[1].map(i => `<li>${i}</li>`).join("")}</ul>`;
  if (b[0] === "note") return `<div class="note">${esc(b[1])}</div>`;
  return "";
}

function plain(html) { return html.replace(/<[^>]+>/g, ""); }

function renderArticle(a) {
  const url = `${BASE}/blog/${a.slug}`;
  const shareText = encodeURIComponent(a.title + " — " + url);
  const body = `<article class="card">
<h1>${esc(a.title)}</h1>
<div class="byline">By <b>Dr Khizer Hussain Junaidy</b>, Diabetologist &amp; Obesity Specialist · ${fmtDate(a.date)} · ${a.readMins} min read</div>
<p class="intro">${a.intro}</p>
${a.body.map(blockHtml).join("\n")}
<div class="cta-box"><b>${esc(a.cta.label)}</b><span><a class="btn btn-white" href="${a.cta.href}">Book now</a> <a class="btn btn-wa" href="${WA}?text=${encodeURIComponent("Hi Caspian Diagnostic Centre, I read your article “" + a.title + "” and would like to book a test.")}" target="_blank" rel="noopener">WhatsApp us</a></span></div>
<div class="share" aria-label="Share this article">Share:
<a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener">WhatsApp</a>
<a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener">Facebook</a>
<a href="https://twitter.com/intent/tweet?text=${shareText}" target="_blank" rel="noopener">X</a>
<button type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText('${url}').then(()=>{this.textContent='Copied!'})">Copy link</button>
</div>
<h2 style="margin-top:22px">Related</h2>
<div class="rel">${a.related.map((h, i) => `<a href="${h}">${esc(a.relatedLabels[i])}</a>`).join("")}</div>
</article>`;
  return shell({
    title: a.metaTitle,
    desc: a.desc,
    canonical: url,
    crumbs: `<a href="/">Home</a> › <a href="/blog">Blog</a> › ${esc(a.title)}`,
    bodyHtml: body,
    ld: [
      {
        "@context": "https://schema.org", "@type": "MedicalWebPage",
        "name": a.title, "url": url
      },
      {
        "@context": "https://schema.org", "@type": "Article",
        "headline": a.title,
        "description": a.desc,
        "image": BASE + "/ogimage.png",
        "datePublished": a.date,
        "dateModified": a.date,
        "author": { "@type": "Person", "name": "Dr Khizer Hussain Junaidy", "jobTitle": "Diabetologist & Obesity Specialist", "worksFor": { "@type": "MedicalBusiness", "name": "Caspian Diagnostic Centre" } },
        "publisher": { "@type": "Organization", "name": "Caspian Diagnostic Centre", "logo": { "@type": "ImageObject", "url": BASE + "/ogimage.png" } },
        "mainEntityOfPage": url
      },
      {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": BASE + "/blog" },
          { "@type": "ListItem", "position": 3, "name": a.title, "item": url }
        ]
      }
    ]
  });
}

function renderIndex() {
  const url = `${BASE}/blog`;
  const body = `<div style="margin:6px 0 20px">
<h1>Caspian Health Blog</h1>
<p style="color:#5b6b7a;font-size:16px;max-width:600px">Plain-language health guides from the doctors and lab team at Caspian Diagnostic Centre, Hyderabad.</p>
</div>
${ARTICLES.map(a => `<a class="post" href="/blog/${a.slug}">
<h2>${esc(a.title)}</h2>
<div class="pm">Dr Khizer Hussain Junaidy · ${fmtDate(a.date)} · ${a.readMins} min read</div>
<p>${esc(a.desc)}</p>
<span class="more">Read article →</span>
</a>`).join("\n")}`;
  return shell({
    title: "Health Blog | Caspian Diagnostic Centre, Hyderabad",
    desc: "Plain-language health guides from Caspian Diagnostic Centre, Hyderabad — understanding your tests, fasting rules, diabetes care and preventive health.",
    canonical: url,
    crumbs: `<a href="/">Home</a> › Blog`,
    bodyHtml: body,
    ld: [
      {
        "@context": "https://schema.org", "@type": "Blog",
        "name": "Caspian Health Blog", "url": url,
        "publisher": { "@type": "Organization", "name": "Caspian Diagnostic Centre" }
      },
      {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": url }
        ]
      }
    ]
  });
}

function render404() {
  return shell({
    title: "Article not found | Caspian Diagnostic Centre",
    desc: "The article you were looking for could not be found.",
    canonical: BASE + "/blog",
    crumbs: `<a href="/">Home</a> › <a href="/blog">Blog</a>`,
    bodyHtml: `<div class="card"><h1>Article not found</h1><p style="margin-top:10px">Sorry — we couldn't find that article. <a href="/blog">Browse all articles →</a></p></div>`,
    ld: []
  });
}

export default function handler(req, res) {
  const { slug } = req.query || {};
  let html, status = 200;
  if (!slug) {
    html = renderIndex();
  } else {
    const a = ARTICLES.find(x => x.slug === slug);
    if (a) { html = renderArticle(a); }
    else { html = render404(); status = 404; }
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", status === 200 ? "public, s-maxage=3600, stale-while-revalidate=86400" : "no-store");
  res.status(status).send(html);
}
