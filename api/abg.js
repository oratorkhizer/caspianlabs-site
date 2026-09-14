// Caspian Diagnostic Centre, ABG and VBG (blood gas) landing page.
// Served at /tests/abg-test-hyderabad via the rewrite in vercel.json.
// Shell, CSS and JSON-LD builders live in api/_shell.js so this file stays small
// and content edits do not mean re-uploading the whole template.
//
// NOTE: keep the slug in api/sitemap.js TEST_SLUGS in sync.
// PHOTO: switch HERO_PHOTO to "abg" once site/abg-analyser.jpg is uploaded to the
// Supabase caspianlabs bucket. Until then it falls back to the lab technician photo.
import {
  BASE, PHONE_DISPLAY, PHONE_TEL,
  esc, inr, waLink, photoFig, photoUrl,
  pageShell, ldBreadcrumb, ldProduct, ldFaq, ldMedicalTest, faqBlock
} from "./_shell.js";

const SLUG = "abg-test-hyderabad";
const URL = BASE + "/tests/" + SLUG;
const PRICE = 999;        // at the centre, ABG or VBG
const PRICE_HOME = 1499;  // collected at the patient's home, within 3 km
const RADIUS = "3 km";
const HERO_PHOTO = "technician";
const NAME = "ABG Test (Arterial Blood Gas)";
const DESC = "ABG and VBG (blood gas) testing in Hyderabad at ₹999, open 24/7, result in 20 minutes on our own analyser. One sample also reports electrolytes, lactate, glucose and haemoglobin. Caspian Diagnostic Centre, Vijay Nagar Colony. Home collection within 3 km at ₹1,499.";

const ABOUT = [
  "An arterial blood gas, or ABG, is a blood test taken from an artery, usually at the wrist. It is the quickest way to find out how well your lungs are moving oxygen into your blood and carbon dioxide out of it, and whether the acid level of your blood has gone off balance.",
  "A pulse oximeter on the finger only estimates oxygen. An ABG measures it directly, and it also measures carbon dioxide and bicarbonate, which the oximeter cannot see at all. That is why doctors ask for an ABG when someone is badly breathless, drowsy, very sick, or not improving as expected.",
  "At Caspian the sample is run on our own blood gas analyser in the lab, so the result is ready in about 20 minutes and the doctor can act on it the same visit. We are open 24 hours, all seven days."
];

const PANEL = [
  ["Blood gas", [
    ["pH", "7.35 to 7.45"],
    ["pCO₂, carbon dioxide", "35 to 45.5 mmHg"],
    ["pO₂, oxygen", "80 to 100 mmHg"],
    ["Bicarbonate (cHCO₃)", "22 to 28 mmol/L"],
    ["Total CO₂ and base excess", "Calculated on the report"]
  ]],
  ["Oxygen handling", [
    ["SO₂, oxygen saturation", "Measured on the sample"],
    ["Oxygen content", "Calculated"],
    ["A-a gradient (alveolar to arterial oxygen difference)", "Calculated"]
  ]],
  ["Haemoglobin", [
    ["Haematocrit", "35 to 51%"],
    ["Haemoglobin", "11.67 to 17 g/dl"]
  ]],
  ["Electrolytes", [
    ["Sodium", "135 to 150 mmol/L"],
    ["Potassium", "3.5 to 5.1 mmol/L"],
    ["Ionised calcium", "1.10 to 1.35 mmol/L"],
    ["Chloride", "92 to 110 mmol/L"]
  ]],
  ["Metabolites", [
    ["Glucose", "80 to 140 mg/dl"],
    ["Lactate", "0.50 to 2.00 mmol/L"]
  ]],
  ["Calculated", [
    ["Anion gap", "Reported with and without potassium"],
    ["Osmolality", "275 to 295 mmol/kg"],
    ["Corrected and total calcium", "Calculated"]
  ]]
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
  ["How much does the ABG test cost in Hyderabad?", "₹999 at our centre in Vijay Nagar Colony, for an ABG or a VBG. If you need the sample collected at home, within 3 km of the centre, it is ₹1,499. You can pay by UPI, card or cash."],
  ["Why does the home visit cost more?", "Because it is a dedicated trip, not a stop on a collection round. A blood gas sample has to be back on the analyser within minutes, so a trained technician leaves for your address and comes straight back with it. We would rather charge for that honestly than promise a cheap home visit and hand you a result that has been sitting in a bag."],
  ["How long does the ABG report take?", "About 20 minutes from the time the sample is taken. The sample is run on our own analyser inside the lab, so nothing is sent out and nothing waits for a batch."],
  ["Is the ABG test painful?", "It is more uncomfortable than a normal blood test, because the sample comes from an artery rather than a vein. It is over in a few seconds. Our technicians do arterial sampling regularly, which is the single biggest factor in how comfortable it feels, and we press the site firmly for a few minutes afterwards to prevent bruising."],
  ["What is the difference between ABG and VBG?", "An ABG uses arterial blood and is the only one that tells your doctor how much oxygen is actually reaching your body. A VBG uses an ordinary vein sample, like any routine blood test, and answers most acid and bicarbonate questions well. If the question is about oxygen, it has to be an ABG. Your doctor decides which one you need. Both cost the same with us, because the analyser run is the same."],
  ["Do I need to fast before a blood gas test?", "No. There is no fasting and no preparation. If you are on oxygen, stay on it and tell us the flow rate, because the result is read against it. Do not stop oxygen to give the sample unless your doctor has told you to."],
  ["Do I need a doctor's prescription?", "For a test at the centre, bring the prescription if you have one, as it helps us note the clinical details that go with the result. For a home visit we do need a doctor's order."],
  ["I am on blood thinners. Can I still have an ABG?", "Usually yes, but tell us before the sample is taken. If you take warfarin, acitrom, clopidogrel, apixaban, rivaroxaban or a similar medicine, or you bruise and bleed easily, we will take extra care and press the site for longer. For a home visit we may ask you to come to the centre instead."],
  ["Who comes home to take the sample?", "One of our own technicians, trained and qualified in arterial sampling. We do not send a general collection boy for a blood gas. The same person carries the sample straight back to the analyser."],
  ["Are you open at night?", "Yes. The lab and the analyser are staffed 24 hours a day, all seven days, including Sundays and public holidays. A blood gas is most often needed at odd hours, which is exactly why we keep it available."],
  ["Which doctor should I show the report to?", "The doctor who asked for the test. If you do not have one, our physicians at Caspian Healthcare in the same building can see you, and in an emergency go straight to a hospital rather than waiting for a report."]
];

const DOC_POINTS = [
  ["Send us the patient", "Any hour, no appointment needed. Result in about 20 minutes, handed over or sent on WhatsApp, and we will call you directly if a value is critical."],
  ["One sample, full panel", "Blood gas, sodium, potassium, ionised calcium, chloride, lactate, glucose, haemoglobin and haematocrit, with anion gap, osmolality and A-a gradient calculated. No separate electrolyte order needed."],
  ["Send us the sample", "If your nurse has drawn it, use a heparinised syringe, expel all air, cap it at once, label it with the patient's name, time of draw and the oxygen the patient is on, and get it to us within 15 minutes. Do not send a sample with a needle attached."],
  ["Standing rates", "If you run a nursing home, dialysis unit, polyclinic or home-care team and you send us volume, call us for a standing rate and a monthly account instead of paying per test."],
  ["Reachable at any hour", "One number, 24 hours: " + PHONE_DISPLAY + ". If our analyser is ever down for a cartridge change, we will tell you on the call rather than after you have sent the patient."]
];

function panel() {
  return PANEL.map(g => `<tr><td>${esc(g[0])}</td><td>${g[1].map(x => `<b>${esc(x[0])}</b><span style="color:var(--muted)"> &middot; ${esc(x[1])}</span>`).join("<br>")}</td></tr>`).join("");
}

function renderAbg() {
  const waBook = waLink(`Hi Caspian Diagnostic Centre, I would like to book a blood gas test (ABG or VBG, ₹${PRICE} at the centre). Please tell me when I can come.`);
  const waHome = waLink("Hi Caspian Diagnostic Centre, I need a blood gas test at home. My area is:");
  const waDoc = waLink("Hi Caspian Diagnostic Centre, I am a doctor. I would like to discuss ABG standing rates and sample handling for my patients.");

  const side = `<aside class="side">
<div class="price-lbl">Price at our centre</div>
<div class="price">${inr(PRICE)}</div>
<div class="meta">ABG or VBG &middot; result in 20 minutes<br>At your home within ${RADIUS}: <b>${inr(PRICE_HOME)}</b></div>
<a class="btn btn-blue" href="tel:${PHONE_TEL}">\u{1F4DE} Call now, we are open 24/7</a>
<a class="btn btn-wa" href="${waBook}" target="_blank" rel="noopener">\u{1F4AC} Book on WhatsApp</a>
<a class="btn btn-line" href="${waHome}" target="_blank" rel="noopener">Ask for a home visit</a>
<div class="fine"><span class="tick">✓</span>Result in about 20 minutes, on our own analyser<br><span class="tick">✓</span>Electrolytes, lactate and glucose on the same sample<br><span class="tick">✓</span>Technicians trained and qualified in arterial sampling<br><span class="tick">✓</span>No fasting, no appointment needed<br><span class="tick">✓</span>Open 24/7, all days</div>
</aside>`;

  const body = `<div class="grid"><div class="card">
<div class="note"><b>Needed urgently?</b> Walk in at any hour, or call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> and we will keep the analyser ready. If the patient is severely breathless, blue around the lips, or very drowsy, go to a hospital emergency room first. A blood gas report is not a substitute for emergency care.</div>
${photoFig(HERO_PHOTO)}<h2>What does an ABG test check?</h2>
${ABOUT.map(x => `<p>${esc(x)}</p>`).join("\n")}
<h2>Test details</h2>
<table class="facts">
<tr><td>Price at our centre</td><td><b>${inr(PRICE)}</b> for an ABG or a VBG</td></tr>
<tr><td>Price at your home</td><td><b>${inr(PRICE_HOME)}</b>, within ${RADIUS} of the centre, on a doctor's order</td></tr>
<tr><td>Sample</td><td>ABG: a small arterial sample, usually from the radial artery at the wrist. VBG: an ordinary vein sample</td></tr>
<tr><td>Fasting</td><td>Not required. Stay on your oxygen and tell us the flow rate</td></tr>
<tr><td>Report</td><td>About 20 minutes, run on our own analyser in the lab</td></tr>
<tr><td>Availability</td><td>24 hours, all seven days, walk in without an appointment</td></tr>
</table>
<h2>Why 20 minutes matters</h2>
<p>A blood gas is the one blood test that starts going wrong the moment it leaves the patient. The cells in the syringe keep living: they use up oxygen and make more carbon dioxide. So the longer a sample waits, the lower the oxygen reads, the higher the carbon dioxide reads, and the more the pH drifts. Standard practice is to analyse the sample within about 15 minutes.</p>
<p>This is why a blood gas reported the next day, or even later the same day, is a problem. A result like that has travelled in a bag to a central lab, and the numbers on the page are no longer the numbers in the patient. A doctor may then increase oxygen, or start a machine, on the strength of a value that drifted in transit.</p>
<p>Our analyser is in our own lab, a few steps from where the sample is taken, and it is staffed at every hour. That is the whole reason we can say 20 minutes and mean it.</p>
<h2>What the report shows</h2>
<p>One sample, one price, and a full panel. Our analyser reports the blood gas and, from the same syringe, your electrolytes, lactate, glucose and haemoglobin, with the anion gap and the oxygen gradient worked out for your doctor. There is no separate electrolyte test to order and no second prick.</p>
<table class="facts">${panel()}</table>
<p>Ranges shift with age, with altitude, in pregnancy and when a patient is on oxygen. Read your own report against the ranges printed on it and discuss it with your doctor.</p>
<h2>ABG or VBG, which one do you need?</h2>
<p>Your doctor decides, but it helps to know the difference.</p>
<ul>
<li><b>ABG, arterial blood gas.</b> Blood from an artery at the wrist. This is the only sample that tells your doctor how much oxygen is actually reaching your body. Needed whenever the question is about oxygen, about respiratory failure, or about starting oxygen or BiPAP at home.</li>
<li><b>VBG, venous blood gas.</b> Blood from a vein in the arm, drawn like any routine blood test. It answers most acid and bicarbonate questions well, for example in diabetic ketoacidosis, in severe vomiting, in kidney problems and when screening a sick patient. It is easier to take and far more comfortable, but it cannot be trusted for oxygen.</li>
</ul>
<p>Both cost ${inr(PRICE)} at our centre, because the analyser run and the cartridge are the same. If you are not sure which one your prescription means, send us a photo of it on WhatsApp and we will tell you.</p>
<h2>When does a doctor order a blood gas?</h2>
<ul>${WHO.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Why people come to us for this test</h2>
<p>Most standalone labs in Hyderabad either do not keep a blood gas analyser, or they keep one but have nobody on the night shift who draws arterial samples confidently. Both problems are the patient's problem at two in the morning, which is when this test is usually needed.</p>
<ul>
<li>Our own blood gas analyser, in the lab, maintained and quality-checked</li>
<li>Technicians trained and qualified in arterial sampling, doing it regularly, so the puncture is quick and clean</li>
<li>Open 24 hours, every day of the year, with no appointment</li>
<li>Result in about 20 minutes, while you wait</li>
<li>A full panel on one sample: blood gas, electrolytes, lactate, glucose and haemoglobin</li>
<li>One clear price, ${inr(PRICE)} at the centre and ${inr(PRICE_HOME)} at home within ${RADIUS}, with nothing added afterwards</li>
</ul>
<h2>Can it be done at home?</h2>
<p>Yes, within ${RADIUS} of our centre in Vijay Nagar Colony, for ${inr(PRICE_HOME)}. One of our own technicians comes to you, trained and qualified in arterial sampling, and carries the sample straight back to the analyser. We do not send a general collection assistant for a blood gas, and this is the one test where we do not offer our usual free home collection, because it needs a dedicated trip rather than a stop on a round.</p>
<p>Three things decide whether a home sample gives your doctor a usable result. Please read them before you book.</p>
<ul>
<li><b>We need a doctor's order.</b> A blood gas is not a screening test, and the result only means something read alongside the clinical picture.</li>
<li><b>Your address has to be within ${RADIUS}.</b> The sample starts changing within minutes of being drawn, so it has to reach the analyser quickly. Beyond that distance we will tell you honestly that coming to the centre is the better option, rather than take the booking and hand you a drifted result.</li>
<li><b>Tell us about bleeding risk and about oxygen.</b> If the patient is on blood thinners or bruises easily, say so when you book. If the patient is on oxygen, keep it running and tell us the flow rate.</li>
</ul>
<p>A home visit is the right answer for a patient who genuinely cannot travel, such as someone bed-bound, on home oxygen, or recovering after a hospital stay. It is not the right answer for a patient who is unstable. In that situation, please call a doctor or an ambulance rather than a lab.</p>
<p><a class="btn btn-wa" style="display:inline-block;width:auto;padding:12px 20px" href="${waHome}" target="_blank" rel="noopener">\u{1F4AC} Ask about a home visit</a></p>
<h2>For doctors, nursing homes and home-care teams</h2>
<p>If your setup does not have a blood gas analyser, or yours is down, we can be your blood gas point of call at any hour.</p>
<table class="facts">${DOC_POINTS.map(d => `<tr><td>${esc(d[0])}</td><td>${esc(d[1])}</td></tr>`).join("")}</table>
<p><a class="btn btn-wa" style="display:inline-block;width:auto;padding:12px 20px" href="${waDoc}" target="_blank" rel="noopener">\u{1F4AC} Talk to us about standing rates</a></p>
<h2>Frequently asked questions</h2>
${faqBlock(FAQS)}
<h2>Related tests</h2>
<div class="rel"><a href="/tests/chest-x-ray-hyderabad">Chest X-ray</a><a href="/tests/ecg-test-hyderabad">ECG</a><a href="/tests/electrolytes-test-hyderabad">Electrolytes Test</a><a href="/tests/cbc-test-hyderabad">CBC Test</a><a href="/tests">All tests</a></div>
<div class="note">This page is for general information and is not a substitute for medical advice. A blood gas should be ordered and interpreted by a doctor. If you are struggling to breathe, do not wait for a test, go to the nearest emergency room.</div>
</div>
${side}</div>`;

  return pageShell({
    title: `ABG Test (Arterial Blood Gas) in Hyderabad at ${inr(PRICE)} | 24/7 | Caspian Diagnostic Centre`,
    desc: DESC,
    canonical: URL,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="/tests">All Tests</a> › ABG Test`,
    heroH1: "ABG and VBG Blood Gas Testing in Hyderabad",
    heroSub: `${inr(PRICE)} at our centre, ${inr(PRICE_HOME)} at home within ${RADIUS} · Open 24/7 · Result in 20 minutes`,
    bodyHtml: body,
    ogImage: photoUrl(HERO_PHOTO),
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
