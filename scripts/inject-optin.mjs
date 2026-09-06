// Build step (see vercel.json buildCommand): copies the static site into public/ and
// injects the WhatsApp opt-in section into public/index.html. Idempotent.
// Why: index.html is too large to re-upload through the GitHub connector, so the section
// lives here and is inserted at build time. api/ is left in place; Vercel builds it as functions.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "public";
const SKIP = new Set(["api", "scripts", "node_modules", "public", ".git", ".github", ".vercel", "package.json", "package-lock.json", "vercel.json", "README.md"]);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const name of readdirSync(".")) {
  if (SKIP.has(name) || name.startsWith(".")) continue;
  cpSync(name, join(OUT, name), { recursive: true });
}
console.log("optin: copied static files to public/");

const FILE = join(OUT, "index.html");
let html = readFileSync(FILE, "utf8");
if (html.includes('id="updates"')) { console.log("optin: already present"); process.exit(0); }

const CSS = "  /* WhatsApp opt-in */\n.optin{background:var(--bg-blue);border:1px solid var(--line);border-radius:var(--radius);padding:32px 30px;display:grid;grid-template-columns:1.1fr 1fr;gap:28px;align-items:center}\n.optin h2{margin:6px 0 8px;font-size:26px}\n.optin .lead{margin:0}\n.optin form{display:grid;gap:10px}\n.optin input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #cfe1f1;border-radius:10px;font:inherit;font-size:15px;background:#fff}\n.optin .btn{justify-content:center}\n.optin-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}\n.optin-msg{margin:0;min-height:1.2em;font-size:14px;color:var(--muted)}\n.optin-msg.err{color:#b42318}\n.optin-msg.ok{color:#0c776e;font-weight:600}\n.optin-fine{margin:0;font-size:12px;color:var(--muted)}\n@media(max-width:820px){.optin{grid-template-columns:1fr;padding:24px 20px}.optin h2{font-size:22px}}";
const SECTION = "<!-- WHATSAPP OPT-IN -->\n<section class=\"sec\" id=\"updates\">\n  <div class=\"wrap\">\n    <div class=\"optin\">\n      <div class=\"optin-text\">\n        <div class=\"eyebrow\">Offers and camp dates</div>\n        <h2>Get package offers and camp dates on WhatsApp</h2>\n        <p class=\"lead\">Leave your number. We will message you when a health package is on offer or a free screening camp is announced. No spam. Reply STOP any time.</p>\n      </div>\n      <form id=\"optinForm\" novalidate>\n        <input type=\"text\" name=\"name\" placeholder=\"Your name (optional)\" autocomplete=\"name\" maxlength=\"80\">\n        <input type=\"tel\" name=\"phone\" placeholder=\"WhatsApp number\" autocomplete=\"tel\" inputmode=\"numeric\" required>\n        <input class=\"optin-hp\" type=\"text\" name=\"website\" tabindex=\"-1\" autocomplete=\"off\" aria-hidden=\"true\">\n        <button class=\"btn btn-wa\" type=\"submit\" id=\"optinBtn\">Notify me on WhatsApp</button>\n        <p class=\"optin-msg\" id=\"optinMsg\" aria-live=\"polite\"></p>\n        <p class=\"optin-fine\">We use your number only for these updates.</p>\n      </form>\n    </div>\n  </div>\n</section>\n";
const SCRIPT = "<script>\n(function(){\n  var f=document.getElementById('optinForm'),m=document.getElementById('optinMsg'),b=document.getElementById('optinBtn');\n  if(!f)return;\n  var EP='https://gjpbiiqkvzysmdpioexk.supabase.co/functions/v1/subscribe';\n  f.addEventListener('submit',function(e){\n    e.preventDefault();\n    var phone=f.phone.value.replace(/\\D/g,'');\n    if(phone.length===11&&phone.charAt(0)==='0')phone=phone.slice(1);\n    if(!((phone.length===10&&/^[6-9]/.test(phone))||(phone.length===12&&phone.indexOf('91')===0))){m.className='optin-msg err';m.textContent='Please enter a 10-digit Indian mobile number.';return;}\n    b.disabled=true;m.className='optin-msg';m.textContent='Saving...';\n    fetch(EP,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({site:'caspianlabs',channel:'whatsapp',contact:phone,name:f.name.value,interest:'offers_camps',source_path:location.pathname,website:f.website.value})})\n    .then(function(r){return r.json()}).then(function(j){\n      if(!j.ok)throw new Error(j.error||'failed');\n      if(typeof gtag==='function')gtag('event','optin_submit',{event_category:'engagement',event_label:'offers_camps'});\n      f.innerHTML='<p class=\"optin-msg ok\">Done. We will message you on WhatsApp when there is an offer or a camp.</p>';\n    }).catch(function(){b.disabled=false;m.className='optin-msg err';m.innerHTML='Could not save right now. <a href=\"https://wa.me/919059341154?text='+encodeURIComponent('Hi Caspian Diagnostic Centre, please add me to your offers and camp updates.')+'\" target=\"_blank\" rel=\"noopener\">Message us on WhatsApp</a> instead.';});\n  });\n})();\n</script>";

function insertBefore(src, anchor, add, label) {
  const i = src.indexOf(anchor);
  if (i < 0) throw new Error("optin: anchor not found: " + label);
  return src.slice(0, i) + add + src.slice(i);
}
function insertAfter(src, anchor, add, label) {
  const i = src.indexOf(anchor);
  if (i < 0) throw new Error("optin: anchor not found: " + label);
  const j = i + anchor.length;
  return src.slice(0, j) + add + src.slice(j);
}

html = insertBefore(html, "</style>", CSS + "\n", "first </style>");
html = insertBefore(html, "<!-- ALL TESTS DIRECTORY -->", SECTION + "\n", "all-tests comment");
html = insertAfter(html, '<script src="/assets/i18n.js" defer></script>', "\n" + SCRIPT, "i18n script tag");
// Photos (Caspian staff shoot, Aug 2026; hosted on Supabase Storage, public bucket "caspianlabs", project caspian-cme).
// Injected here so the 160 KB index.html need not be re-uploaded. Idempotent via the id="gallery" check.
const PB = "https://gjpbiiqkvzysmdpioexk.supabase.co/storage/v1/object/public/caspianlabs/site/";
const PHOTO_CSS = "  /* Photos */\n.about-grid .imgbox-photo{padding:0;overflow:hidden;min-height:0;display:block;background:none}\n.imgbox-photo img{width:100%;height:100%;min-height:320px;object-fit:cover;display:block;border-radius:var(--radius)}\n.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}\n.gal figure{margin:0;border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);background:#fff}\n.gal img{width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;display:block}\n.gal figcaption{font-size:13px;color:var(--muted);padding:9px 12px}\n@media(max-width:820px){.gal{grid-template-columns:1fr 1fr}}\n@media(max-width:520px){.gal{grid-template-columns:1fr}}";
const GALLERY = [
  ["lab-analysers.jpg", "Laboratory", "Biochemistry and haematology analysers"],
  ["lab-technician.jpg", "Sample processing", "Every sample logged and processed in-house"],
  ["xray-room.jpg", "Digital X-ray", "Chest, spine, limbs and more, at the centre"],
  ["lab-wide.jpg", "Laboratory floor", "Analysers, centrifuges and cold storage in one room"],
  ["reception.jpg", "Reception", "Open 24/7, walk in any time"],
  ["team.jpg", "Our team", "Trained staff who handle every sample with care"]
];
const GALLERY_HTML = "<!-- GALLERY -->\n<section class=\"sec sec-soft\" id=\"gallery\">\n  <div class=\"wrap\">\n    <div class=\"center\" style=\"max-width:700px\">\n      <div class=\"eyebrow\">Inside Caspian</div>\n      <h2>A look inside our centre</h2>\n      <p class=\"lead center\">Photos from our laboratory, imaging rooms and front desk in Vijay Nagar Colony.</p>\n    </div>\n    <div class=\"gal\">\n" + GALLERY.map(([f, t, c]) => "      <figure><img src=\"" + PB + f + "\" alt=\"" + t + " at Caspian Diagnostic Centre\" width=\"1600\" height=\"1067\" loading=\"lazy\" decoding=\"async\"><figcaption><b>" + t + "</b> · " + c + "</figcaption></figure>\n").join("") + "    </div>\n  </div>\n</section>\n\n";
if (!html.includes('id="gallery"')) {
  html = insertBefore(html, "</style>", PHOTO_CSS + "\n", "first </style> (photos)");
  html = html.replace(/<div class="imgbox">[\s\S]*?<\/div>\s*<\/div>/, '<div class="imgbox imgbox-photo"><img src="' + PB + 'lab-analysers.jpg" alt="Laboratory at Caspian Diagnostic Centre, Vijay Nagar Colony" width="1600" height="1067" loading="lazy" decoding="async"></div>');
  html = insertBefore(html, "<!-- FAQ -->", GALLERY_HTML, "FAQ comment (gallery)");
  console.log("photos: injected");
}
// Fifth doctor card (Dr Sameer Ahmed, pulmonologist), injected so index.html need not be re-uploaded. Idempotent.
if (!html.includes("dr-sameer-ahmed")) {
  const CAL = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><line x1="3" y1="9.5" x2="21" y2="9.5"/><line x1="8" y1="2.5" x2="8" y2="6"/><line x1="16" y1="2.5" x2="16" y2="6"/></svg>';
  const SAMEER = '      <div class="doc">\n        <div class="av">SA</div>\n        <div class="dn"><a href="https://www.caspianhealthcare.in/doctors/dr-sameer-ahmed" style="color:inherit">Dr Mohammad Sameer Ahmed</a></div>\n        <div class="ds">Pulmonologist</div>\n        <div class="de">10 years experience</div>\n        <div class="db"><a href="https://www.eka.care/doctor/sameer-ahmed-1785177731" target="_blank" rel="noopener">' + CAL + 'Book appointment</a></div>\n      </div>\n';
  html = insertBefore(html, '    </div>\n    <div class="doc-all">', SAMEER, "doc-grid close before doc-all (Sameer card)");
  console.log("doctors: Sameer card injected");
}
writeFileSync(FILE, html);
console.log("optin: injected");

// Text fixes (scripts/text-fixes.json): the owner's no-em-dash rule, applied to files too large
// to edit through the GitHub connector. "unique" pairs apply once and only when the match is unique;
// "global" pairs (product names used as lookup keys) apply everywhere so all files stay consistent.
import { existsSync } from "node:fs";
const fixes = { unique: {}, global: { files: [], pairs: [] } };
for (const f of ["scripts/text-fixes.json", "scripts/text-fixes-2.json"]) {
  if (!existsSync(f)) continue;
  const x = JSON.parse(readFileSync(f, "utf8"));
  for (const [file, pairs] of Object.entries(x.unique || {})) (fixes.unique[file] ||= []).push(...pairs);
  for (const file of (x.global && x.global.files) || []) if (!fixes.global.files.includes(file)) fixes.global.files.push(file);
  fixes.global.pairs.push(...((x.global && x.global.pairs) || []));
}
let applied = 0, skipped = 0;
for (const [file, pairs] of Object.entries(fixes.unique)) {
  if (!existsSync(file)) { console.warn("text-fixes: missing " + file); continue; }
  let t = readFileSync(file, "utf8");
  for (const [find, rep] of pairs) {
    const n = t.split(find).length - 1;
    if (n === 1) { t = t.replace(find, rep); applied++; }
    else { skipped++; console.warn("text-fixes: skipped (" + n + " matches) in " + file + ": " + find.slice(0, 60)); }
  }
  writeFileSync(file, t);
}
for (const file of fixes.global.files) {
  if (!existsSync(file)) { console.warn("text-fixes: missing " + file); continue; }
  let t = readFileSync(file, "utf8");
  for (const [find, rep] of fixes.global.pairs) { const n = t.split(find).length - 1; if (n) { t = t.split(find).join(rep); applied += n; } }
  writeFileSync(file, t);
}
console.log("text-fixes: applied " + applied + ", skipped " + skipped);
