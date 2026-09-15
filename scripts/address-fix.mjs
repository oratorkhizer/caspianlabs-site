// Site-wide text replacements applied at build time, after scripts/inject-optin.mjs has
// copied the static site into public/. Run from vercel.json buildCommand, chained after it.
//
// Why this file and not the source files: index.html (164KB) and api/page.js (79KB) are too
// large to push through the GitHub connector, and the same string appears in a dozen files.
// One pair here keeps every page consistent.
//
// NOTE: static pages are listed under public/ because that is what gets deployed. API files
// are listed at their real path because Vercel builds functions from api/ in place.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PAIRS = [
  // Sep 2026: the owner's call. Caspian itself is the landmark, not the building name.
  ["Ahmed Plaza", "Opposite Post Office"],
];

// Per-file pairs, applied BEFORE the PAIRS above. (15 Sep 2026: the translated copies were missed
// on 14 Sep.) Unicode is written as \u escapes so this file stays plain ASCII for the connector.
// The /te /hi /ur pages and api/_lang/en.js already say "opposite the Post Office" in the next
// sentence, so there the building name is only dropped. The homepage language toggle (i18n.js)
// swaps the building name for the translated "Opposite Post Office".
const FILE_PAIRS = {
  "api/_lang/en.js": [["Ahmed Plaza, ", ""]],
  "api/_lang/te.js": [["అహ్మద్ ప్లాజా, ", ""]],
  "api/_lang/hi.js": [["अहमद प्लाज़ा, ", ""]],
  "api/_lang/ur.js": [["احمد پلازہ، ", ""]],
  "public/assets/i18n.js": [
    ["అహ్మద్ ప్లాజా", "పోస్ట్ ఆఫీస్ ఎదురుగా"],
    ["अहमद प्लाज़ा", "पोस्ट ऑफ़िस के सामने"],
    ["احمد پلازہ", "پوسٹ آفس کے سامنے"],
  ],
};

const FILES = [
  "public/index.html",
  "public/about.html",
  "public/contact.html",
  "public/pricing.html",
  "public/terms.html",
  "public/privacy.html",
  "public/refund.html",
  "public/cancellation.html",
  "public/shipping.html",
  "api/page.js",
  "api/blog.js",
  "api/lang.js",
  "api/_shell.js",
  ...Object.keys(FILE_PAIRS),
];

let applied = 0;
for (const file of FILES) {
  if (!existsSync(file)) { console.warn("address-fix: missing " + file); continue; }
  let t = readFileSync(file, "utf8");
  let n = 0;
  for (const [find, rep] of [...(FILE_PAIRS[file] || []), ...PAIRS]) {
    const c = t.split(find).length - 1;
    if (c) { t = t.split(find).join(rep); n += c; }
  }
  if (n) { writeFileSync(file, t); applied += n; console.log("address-fix: " + n + " in " + file); }
}
console.log("address-fix: applied " + applied);

// ---------------------------------------------------------------------------------------------
// Inserts: new content added at build time for the same reason (big files, no push route).
// Each anchor must match exactly once, and an insert is skipped if its marker is already there.
//
// 15 Sep 2026: homepage FAQ "What if my test result is not what I expected?". Owner's choice of
// wording: pathologist review, repeat test if needed, NO free-repeat promise. Appended as the LAST
// FAQ so i18n.js (which matches FAQ items by position) keeps the existing seven in step. Added to
// the visible list, the FAQPage JSON-LD and the te/hi/ur arrays. Translations are DRAFTS.
// In the translations, [square brackets] mark the WhatsApp link text.
const WA = "https://wa.me/919059341154?text=Hi%20Caspian%20Diagnostic%20Centre%2C%20I%20have%20a%20question%20about%20my%20test%20result.";
const waLink = (text) => '<a href="' + WA + '" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600">' + text + "</a>";
const FAQ_Q = "What if my test result is not what I expected?";
const FAQ_A = "Please contact us. Our pathologist will review your result and, if needed, we will arrange a repeat test. [Message us on WhatsApp] at +91 90593 41154 with your name and bill number. Please do not start, stop or change any medicine because of one unexpected result; speak to your doctor first.";
const withLink = (s) => s.replace(/\[([^\]]+)\]/, (m, x) => waLink(x));
const plain = (s) => s.replace(/\[([^\]]+)\]/, "$1");
const FAQ_TR = [
  // [text that ends the last existing item, question, answer]
  ["అపాయింట్‌మెంట్ బుక్ చేసుకోండి</a>.\"]", "నా రిపోర్ట్ ఊహించినట్టు రాకపోతే ఏం చేయాలి?", "దయచేసి మమ్మల్ని సంప్రదించండి. మా పాథాలజిస్ట్ మీ రిపోర్ట్‌ను పరిశీలిస్తారు, అవసరమైతే టెస్ట్ మళ్ళీ చేస్తాము. మీ పేరు, బిల్ నంబర్‌తో +91 90593 41154 కి [వాట్సాప్ చేయండి]. ఒక్క అనుకోని రిపోర్ట్ ఆధారంగా ఏ మందునూ మొదలుపెట్టవద్దు, ఆపవద్దు, మార్చవద్దు; ముందుగా మీ డాక్టర్‌తో మాట్లాడండి."],
  ["अपॉइंटमेंट बुक करें</a>।\"]", "अगर मेरी रिपोर्ट उम्मीद से अलग आए तो क्या करूँ?", "कृपया हमसे संपर्क करें। हमारे पैथोलॉजिस्ट आपकी रिपोर्ट की जाँच करेंगे और ज़रूरत होने पर हम टेस्ट दोबारा करवाएँगे। अपना नाम और बिल नंबर लिखकर +91 90593 41154 पर [WhatsApp करें]। सिर्फ़ एक अनपेक्षित रिपोर्ट के आधार पर कोई दवा शुरू, बंद या बदलें नहीं; पहले अपने डॉक्टर से बात करें।"],
  ["اپائنٹمنٹ بک کریں</a>۔\"]", "اگر میری رپورٹ توقع کے مطابق نہ آئے تو کیا کروں؟", "براہ کرم ہم سے رابطہ کریں۔ ہمارے پیتھالوجسٹ آپ کی رپورٹ کا جائزہ لیں گے اور ضرورت ہو تو ہم ٹیسٹ دوبارہ کریں گے۔ اپنا نام اور بل نمبر لکھ کر ‎+91 90593 41154 پر [واٹس ایپ کریں]۔ صرف ایک غیر متوقع رپورٹ کی بنیاد پر کوئی دوا شروع، بند یا تبدیل نہ کریں؛ پہلے اپنے ڈاکٹر سے بات کریں۔"],
];
const INSERTS = [
  ["public/index.html", "faq-unexpected-result", "caspianhealthcare.in</a>.</p></details>\n    </div>",
    "caspianhealthcare.in</a>.</p></details>\n" +
    '      <details class="faq-item" id="faq-unexpected-result"><summary>' + FAQ_Q + "</summary><p>" + withLink(FAQ_A) + "</p></details>\n    </div>"],
  ["public/index.html", '"name":"' + FAQ_Q + '"', 'book a doctor appointment online on Eka."}}',
    'book a doctor appointment online on Eka."}},\n    ' +
    JSON.stringify({ "@type": "Question", name: FAQ_Q, acceptedAnswer: { "@type": "Answer", text: plain(FAQ_A) } })],
  ...FAQ_TR.map(([end, q, a]) => ["public/assets/i18n.js", JSON.stringify(q), end + "\n        ]",
    end + ",\n          " + JSON.stringify([q, withLink(a)]).replace('","', '", "') + "\n        ]"]),
];
for (const [file, marker, anchor, rep] of INSERTS) {
  if (!existsSync(file)) { console.warn("insert: missing " + file); continue; }
  const t = readFileSync(file, "utf8");
  if (t.includes(marker)) { console.log("insert: already present in " + file); continue; }
  const c = t.split(anchor).length - 1;
  if (c !== 1) { console.warn("insert: CHECK anchor matched " + c + " times in " + file + ", skipped: " + anchor.slice(0, 50)); continue; }
  writeFileSync(file, t.replace(anchor, () => rep));
  console.log("insert: added to " + file);
}
