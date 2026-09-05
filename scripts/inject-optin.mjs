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
writeFileSync(FILE, html);
console.log("optin: injected");

// Text fixes (scripts/text-fixes.json): the owner's no-em-dash rule, applied to files too large
// to edit through the GitHub connector. "unique" pairs apply once and only when the match is unique;
// "global" pairs (product names used as lookup keys) apply everywhere so all files stay consistent.
import { existsSync } from "node:fs";
const fixes = JSON.parse(readFileSync("scripts/text-fixes.json", "utf8"));
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
