// Caspian Diagnostic Centre, ABG (arterial blood gas) landing page.
// Standalone renderer: /tests/abg-test-hyderabad (rewrite in vercel.json).
// Why its own function and not an entry in api/page.js TESTS: this page carries
// sections the fixed test template has no room for (reference ranges, home-visit
// rules, a block for referring doctors and nursing homes), and api/page.js is too
// large to edit safely through the GitHub connector.
// Template, CSS and shell are copied verbatim from api/page.js so the page looks
// identical. If the shell there changes, mirror the change here.
//
// NOTE: keep the slug in api/sitemap.js TEST_SLUGS in sync.
const BASE = "https://www.caspianlabs.in";
const PHONE_DISPLAY = "+91 90593 41154";
const PHONE_TEL = "+919059341154";
const WA = "https://wa.me/919059341154";

/* Site photos (Caspian staff shoot, Aug 2026) hosted on Supabase Storage, public bucket "caspianlabs" in project caspian-cme.
   1600px JPEGs. Add a new photo: upload to site/<name>.jpg in that bucket, then reference it here. */
const PHOTO_BASE = "https://gjpbiiqkvzysmdpioexk.supabase.co/storage/v1/object/public/caspianlabs/site/";
const PHOTOS = {
  lab: ["lab-analysers.jpg", "Caspian Diagnostic Centre laboratory: biochemistry analysers and sample racks"],
  labWide: ["lab-wide.jpg", "Laboratory at Caspian Diagnostic Centre, Vijay Nagar Colony"],
  technician: ["lab-technician.jpg", "Lab technician processing samples at Caspian Diagnostic Centre"],
  xray: ["xray-room.jpg", "Digital X-ray room at Caspian Diagnostic Centre"],
  echo: ["echo-cardiologist.jpg", "Cardiologist performing a 2D echo at Caspian"],
  nurse: ["nurse-patient.jpg", "Nurse attending a patient at Caspian"],
  reception: ["reception.jpg", "Reception at Caspian, Vijay Nagar Colony"],
  team: ["team.jpg", "The Caspian team"],
  ultrasound: ["ultrasound-scan.jpg", "Ultrasound scan at Caspian"]
};
function photoUrl(key) { return PHOTOS[key] ? PHOTO_BASE + PHOTOS[key][0] : ""; }
function photoFig(key, caption) {
  if (!PHOTOS[key]) return "";
  return `<figure class="ph"><img src="${PHOTO_BASE + PHOTOS[key][0]}" alt="${esc(PHOTOS[key][1])}" width="1600" height="1067" loading="lazy" decoding="async">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ""}</figure>`;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
function inr(n) { return "₹" + n.toLocaleString("en-IN"); }
function waLink(text) { return WA + "?text=" + encodeURIComponent(text); }

const CSS = `:root{--blue:#0A5C9E;--blue-dark:#08487d;--teal:#0c776e;--ink:#152b3c;--muted:#5b6b7a;--line:#e3ecf3;--bg:#f6f9fc;--wa:#0f8440}
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

function pageShell({ title, desc, canonical, breadcrumbHtml, heroH1, heroSub, bodyHtml, ld, ogImage }) {
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

function ldBreadcrumb(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({ "@type": "ListItem", "position": i + 1, "name": it[0], "item": BASE + it[1] }))
  };
}
function ldProduct(name, desc, price, url) {
  return {
    "@context": "https://schema.org", "@type": "Product",
    "name": name, "description": desc, "url": url, "image": BASE + "/ogimage.png",
    "brand": { "@type": "Brand", "name": "Caspian Diagnostic Centre" },
    "offers": { "@type": "Offer", "price": String(price), "priceCurrency": "INR", "availability": "https://schema.org/InStock", "url": url }
  };
}
function ldFaq(faqs) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f[0], "acceptedAnswer": { "@type": "Answer", "text": f[1] } }))
  };
}
function ldMedicalTest(name, desc, url) {
  return { "@context": "https://schema.org", "@type": "MedicalTest", "name": name, "description": desc, "url": url };
}

function faqBlock(faqs) {
  return faqs.map(f => `<details class="faq"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("\n");
}

/* ------------------------------------------------------------------ */
/* ABG page content                                                    */
/* ------------------------------------------------------------------ */

const SLUG = "abg-test-hyderabad";
const URL = BASE + "/tests/" + SLUG;
const PRICE = 999;
const NAME = "ABG Test (Arterial Blood Gas)";
const DESC = "ABG (arterial blood gas) test in Hyderabad at ₹999, open 24/7 with the result in 20 minutes. Trained arterial sampling at Caspian Diagnostic Centre, Vijay Nagar Colony, and home visits on request.";

const ABOUT = [
  "An arterial blood gas, or ABG, is a blood test taken from an artery, usually at the wrist. It is the quickest way to find out how well your lungs are moving oxygen into your blood and carbon dioxide out of it, and whether the acid level of your blood has gone off balance.",
  "A pulse oximeter on the finger only estimates oxygen. An ABG measures it directly, and it also measures carbon dioxide and bicarbonate, which the oximeter cannot see at all. That is why doctors ask for an ABG when someone is badly breathless, drowsy, very sick, or not improving as expected.",
  "At Caspian the sample is run on our own blood gas analyser in the lab, so the result is ready in about 20 minutes and the doctor can act on it the same visit. We are open 24 hours, all seven days."
];

const RANGES = [
  ["pH", "7.35 to 7.45", "How acidic or alkaline your blood is"],
  ["pCO₂ (carbon dioxide)", "35 to 45 mmHg", "How well the lungs are clearing carbon dioxide"],
  ["pO₂ (oxygen)", "80 to 100 mmHg", "How much oxygen is dissolved in arterial blood"],
  ["HCO₃⁻ (bicarbonate)", "22 to 26 mmol/L", "The body's acid buffer, largely handled by the kidneys"],
  ["Base excess", "-2 to +2 mmol/L", "How far the buffer stores are above or below normal"],
  ["SaO₂ (oxygen saturation)", "95 to 100%", "Percentage of haemoglobin carrying oxygen"]
];

const WHO = [
  "Breathlessness that is getting worse, or a COPD or asthma flare-up",
  "A low reading on a pulse oximeter, or oxygen levels that keep dropping",
  "Pneumonia, severe chest infection or suspected respiratory failure",
  "Drowsiness or confusion in someone with a known lung problem",
  "Diabetic ketoacidosis, severe vomiting or diarrhoea, or kidney disease, where the acid balance can swing",
  "Poisoning, overdose or a suspected drug reaction",
  "Before starting home oxygen or a BiPAP machine, and to check how well it is working",
  "Severe obesity with heavy snoring or daytime sleepiness, where carbon dioxide can build up at night",
  "Fitness assessment before surgery in someone with lung disease",
  "Any patient in an ICU or on a ventilator whose treatment is being adjusted"
];

const FAQS = [
  ["How much does the ABG test cost in Hyderabad?", "The ABG test costs ₹999 at Caspian Diagnostic Centre, Vijay Nagar Colony. There is no extra charge for a home visit on this test. You can pay by UPI, card or cash at the centre."],
  ["How long does the ABG report take?", "About 20 minutes from the time the sample is taken. The sample is run on our own analyser inside the lab, so nothing is sent out and nothing waits for a batch."],
  ["Is the ABG test painful?", "It is more uncomfortable than a normal blood test, because the sample comes from an artery rather than a vein. It is over in a few seconds. Our technicians do arterial sampling regularly, which is the single biggest factor in how comfortable it feels, and we press the site firmly for a few minutes afterwards to prevent bruising."],
  ["Do I need to fast before an ABG?", "No. There is no fasting and no preparation. If you are on oxygen, stay on it and tell us the flow rate, because the result is read against it. Do not stop oxygen to give the sample unless your doctor has told you to."],
  ["Do I need a doctor's prescription?", "For a test at the centre, bring the prescription if you have one, as it helps us note the clinical details that go with the result. For a home visit we do need a doctor's order."],
  ["I am on blood thinners. Can I still have an ABG?", "Usually yes, but tell us before the sample is taken. If you take warfarin, acitrom, clopidogrel, apixaban, rivaroxaban or a similar medicine, or you bruise and bleed easily, we will take extra care and press the site for longer. For a home visit we may ask you to come to the centre instead."],
  ["Can the test be done at home?", "Yes, on request, with a doctor's order and if your address is close enough for us to bring the sample straight back. An arterial sample has to reach the analyser quickly or the result is no longer reliable, so we confirm the area on the phone before we send someone."],
  ["Is an ABG the same as a normal blood test?", "No. A routine blood test takes blood from a vein in the arm. An ABG takes it from an artery, most often the radial artery at the wrist, because only arterial blood tells us how much oxygen is actually reaching the body."],
  ["Are you open at night?", "Yes. The lab and the analyser are staffed 24 hours a day, all seven days, including Sundays and public holidays. ABG is most often needed at odd hours, which is exactly why we keep it available."],
  ["Which doctor should I show the report to?", "The doctor who asked for the test. If you do not have one, our physicians at Caspian Healthcare in the same building can see you, and in an emergency go straight to a hospital rather than waiting for a report."]
];

const DOC_POINTS = [
  ["Send us the patient", "Any hour, no appointment needed. Result in about 20 minutes, handed over or sent on WhatsApp, and we will call you directly if a value is critical."],
  ["Send us the sample", "If your nurse has drawn it, use a heparinised syringe, expel all air, cap it at once, label it with the patient's name, time of draw and the oxygen the patient is on, and get it to us within 15 minutes. Do not send a sample with a needle attached."],
  ["Tie-up rates", "If you run a nursing home, dialysis unit, polyclinic or home-care team and you send us volume, call us for a standing rate and a monthly account instead of paying per test."],
  ["Reachable at any hour", "One number, 24 hours: " + PHONE_DISPLAY + ". If our analyser is ever down for a cartridge change, we will tell you on the call rather than after you have sent the patient."]
];

function ranges() {
  return RANGES.map(r => `<tr><td>${r[0]}</td><td><b>${esc(r[1])}</b><br><span style="color:var(--muted);font-size:14px">${esc(r[2])}</span></td></tr>`).join("");
}

function renderAbg() {
  const waBook = waLink("Hi Caspian Diagnostic Centre, I would like to book an ABG test (₹999). Please tell me when I can come.");
  const waHome = waLink("Hi Caspian Diagnostic Centre, I need an ABG test at home. My area is:");
  const waDoc = waLink("Hi Caspian Diagnostic Centre, I am a doctor. I would like to discuss ABG rates and sample handling for my patients.");

  const side = `<aside class="side">
<div class="price-lbl">Price</div>
<div class="price">${inr(PRICE)}</div>
<div class="meta">Open 24/7 &middot; result in 20 minutes</div>
<a class="btn btn-blue" href="tel:${PHONE_TEL}">\u{1F4DE} Call now, we are open 24/7</a>
<a class="btn btn-wa" href="${waBook}" target="_blank" rel="noopener">\u{1F4AC} Book on WhatsApp</a>
<a class="btn btn-line" href="${waHome}" target="_blank" rel="noopener">Ask for a home visit</a>
<div class="fine"><span class="tick">✓</span>Result in about 20 minutes, on our own analyser<br><span class="tick">✓</span>Technicians trained in arterial sampling<br><span class="tick">✓</span>No fasting, no appointment needed<br><span class="tick">✓</span>Home visit on request, no extra visit charge<br><span class="tick">✓</span>Open 24/7, all days</div>
</aside>`;

  const body = `<div class="grid"><div class="card">
<div class="note"><b>Needed urgently?</b> Walk in at any hour, or call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> and we will keep the analyser ready. If the patient is severely breathless, blue around the lips, or very drowsy, go to a hospital emergency room first. An ABG report is not a substitute for emergency care.</div>
${photoFig("technician")}<h2>What does an ABG test check?</h2>
${ABOUT.map(x => `<p>${esc(x)}</p>`).join("\n")}
<h2>Test details</h2>
<table class="facts">
<tr><td>Price</td><td>${inr(PRICE)}</td></tr>
<tr><td>Sample</td><td>A small arterial sample, usually from the radial artery at the wrist</td></tr>
<tr><td>Fasting</td><td>Not required. Stay on your oxygen and tell us the flow rate</td></tr>
<tr><td>Report</td><td>About 20 minutes, run on our own analyser in the lab</td></tr>
<tr><td>Availability</td><td>24 hours, all seven days, walk in without an appointment</td></tr>
<tr><td>Home visit</td><td>On request, with a doctor's order, within our fast-reach area. No extra visit charge</td></tr>
</table>
<h2>What the report shows</h2>
<p>These are the usual adult values for an arterial sample. Normal ranges shift with age, with altitude, in pregnancy and when a patient is on oxygen, so read your own report against the ranges printed on it and discuss it with your doctor.</p>
<table class="facts">${ranges()}</table>
<h2>When does a doctor order an ABG?</h2>
<ul>${WHO.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Why people come to us for this test</h2>
<p>Most standalone labs in Hyderabad either do not keep a blood gas analyser, or they keep one but have nobody on the night shift who draws arterial samples confidently. Both problems are the patient's problem at two in the morning, which is when this test is usually needed.</p>
<ul>
<li>Our own blood gas analyser, in the lab, maintained and quality-checked</li>
<li>Technicians who do arterial sampling regularly, so the puncture is quick and clean</li>
<li>Open 24 hours, every day of the year, with no appointment</li>
<li>Result in about 20 minutes, while you wait</li>
<li>One flat price of ${inr(PRICE)}, with nothing added for a home visit</li>
</ul>
<h2>Can it be done at home?</h2>
<p>Yes, on request. Please read these three points first, because they are what decides whether a home sample gives your doctor a usable result.</p>
<ul>
<li><b>We need a doctor's order.</b> An ABG is not a screening test, and the result only means something read alongside the clinical picture.</li>
<li><b>Your address has to be close enough.</b> An arterial sample starts changing within minutes of being drawn, so it must reach the analyser quickly. Call us and we will tell you honestly whether your area is within our fast-reach range. If it is not, coming to the centre is the better option, and we will not pretend otherwise.</li>
<li><b>Tell us about bleeding risk and about oxygen.</b> If the patient is on blood thinners or bruises easily, say so when you book. If the patient is on oxygen, keep it running and tell us the flow rate.</li>
</ul>
<p>A home visit is the right answer for a patient who genuinely cannot travel, such as someone bed-bound, on home oxygen, or recovering after a hospital stay. It is not the right answer for a patient who is unstable. In that situation, please call a doctor or an ambulance rather than a lab.</p>
<p><a class="btn btn-wa" style="display:inline-block;width:auto;padding:12px 20px" href="${waHome}" target="_blank" rel="noopener">\u{1F4AC} Ask about a home visit</a></p>
<h2>For doctors, nursing homes and home-care teams</h2>
<p>If your setup does not have a blood gas analyser, or yours is down, we can be your ABG point of call at any hour.</p>
<table class="facts">${DOC_POINTS.map(d => `<tr><td>${esc(d[0])}</td><td>${esc(d[1])}</td></tr>`).join("")}</table>
<p><a class="btn btn-wa" style="display:inline-block;width:auto;padding:12px 20px" href="${waDoc}" target="_blank" rel="noopener">\u{1F4AC} Talk to us about referral rates</a></p>
<h2>Frequently asked questions</h2>
${faqBlock(FAQS)}
<h2>Related tests</h2>
<div class="rel"><a href="/tests/chest-x-ray-hyderabad">Chest X-ray</a><a href="/tests/ecg-test-hyderabad">ECG</a><a href="/tests/electrolytes-test-hyderabad">Electrolytes Test</a><a href="/tests/cbc-test-hyderabad">CBC Test</a><a href="/tests">All tests</a></div>
<div class="note">This page is for general information and is not a substitute for medical advice. An ABG should be ordered and interpreted by a doctor. If you are struggling to breathe, do not wait for a test, go to the nearest emergency room.</div>
</div>
${side}</div>`;

  return pageShell({
    title: `ABG Test (Arterial Blood Gas) in Hyderabad at ${inr(PRICE)} | 24/7 | Caspian Diagnostic Centre`,
    desc: DESC,
    canonical: URL,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="/tests">All Tests</a> › ABG Test`,
    heroH1: "ABG Test (Arterial Blood Gas) in Hyderabad",
    heroSub: `${inr(PRICE)} · Open 24/7 · Result in 20 minutes · At our centre or at home`,
    bodyHtml: body,
    ogImage: photoUrl("technician"),
    ld: [
      ldBreadcrumb([["Home", "/"], ["All Tests", "/tests"], ["ABG Test", "/tests/" + SLUG]]),
      ldMedicalTest(NAME, DESC, URL),
      ldProduct(NAME, DESC, PRICE, URL),
      ldFaq(FAQS)
    ]
  });
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderAbg());
}
