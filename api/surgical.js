// Caspian Diagnostic Centre, Major Surgical Profile landing page (11 Oct 2026).
// Served at /packages/surgical-profile-hyderabad via the rewrite in vercel.json
// (placed BEFORE the /packages/:slug rewrite). Shell, CSS and JSON-LD builders live
// in api/_shell.js. Keep the path in api/sitemap.js PAGES in sync.
//
// Facts from Dr Khizer, 11 Oct 2026: price Rs 2,500, report in 3 hours at any hour
// (24/7), contents exactly as listed in TESTS below. The old Pre-Operative Mini and
// Maxi profiles were retired the same day (scripts/surgical-profile.mjs removes them
// from the homepage catalogue). No Crelio code yet, so booking is call, WhatsApp or
// walk in rather than pay-online. ASCII-safe prose, no em dashes.
import { PREOP_SURGERIES } from "./preop.js";
import {
  BASE, PHONE_DISPLAY, PHONE_TEL,
  esc, inr, waLink, photoFig, photoUrl,
  pageShell, ldBreadcrumb, ldProduct, ldFaq, faqBlock
} from "./_shell.js";

const SLUG = "surgical-profile-hyderabad";
const URL = BASE + "/packages/" + SLUG;
const PRICE = 2500;
const TAT = "3 hours";
const HERO_PHOTO = "lab";
const NAME = "Major Surgical Profile";
const DESC = "Major surgical profile (pre-operative tests) in Hyderabad at ₹2,500, report in 3 hours, day or night. CBC, ESR, LFT, urea, creatinine, electrolytes, RBS, PT/INR, BT/CT, HIV, HBsAg, HCV, blood group, TSH, ECG and chest X-ray. Caspian Diagnostic Centre, Vijay Nagar Colony, open 24/7.";

// [test, why the surgical team wants it]
const TESTS = [
  ["Complete Blood Count (CBC)", "Haemoglobin, white cells and platelets. Anaemia, infection or low platelets can change the plan or the need for blood on standby."],
  ["ESR", "A general marker of inflammation or infection in the body."],
  ["Liver Function Test (LFT)", "How well the liver is working. The liver handles most anaesthetic drugs and makes clotting factors."],
  ["Blood Urea", "Kidney function and hydration."],
  ["Serum Creatinine", "Kidney function. Decides drug doses and whether contrast or certain painkillers are safe."],
  ["Electrolytes (sodium, potassium, chloride)", "A low or high potassium or sodium can upset the heart rhythm under anaesthesia and must be corrected first."],
  ["Random Blood Sugar (RBS)", "Picks up uncontrolled or undiagnosed diabetes, which raises the risk of wound infection and slow healing."],
  ["PT / INR", "How long the blood takes to clot. Essential if you take blood thinners or have liver disease."],
  ["Bleeding Time and Clotting Time (BT / CT)", "A basic check of platelet function and clotting before any cut is made."],
  ["HIV 1 & 2", "Mandatory infection screening before surgery, for the safety of the patient and the operating team."],
  ["HBsAg (Hepatitis B)", "Mandatory infection screening before surgery."],
  ["Anti-HCV (Hepatitis C)", "Mandatory infection screening before surgery."],
  ["Blood Group (ABO & Rh)", "Needed so that blood can be cross-matched and kept ready if the surgery needs a transfusion."],
  ["TSH (thyroid)", "An untreated thyroid problem affects heart rate, blood pressure and recovery from anaesthesia."],
  ["ECG", "The heart's rhythm and electrical activity. Required by most anaesthetists, especially above 40 or with BP, diabetes or heart symptoms."],
  ["Chest X-ray", "Lungs and heart size. Required for general anaesthesia in most hospitals."]
];

// Indications, grouped. Plain words, no promise that any one surgery needs exactly this set.
const INDICATIONS = [
  ["Emergency and same-day surgery", [
    "Appendicitis (appendix removal)",
    "Gallbladder stones with pain or infection (cholecystectomy)",
    "Obstructed or strangulated hernia",
    "Intestinal obstruction or perforation",
    "Fractures and dislocations needing fixation",
    "Abscess drainage, wound debridement and diabetic foot surgery",
    "Testicular torsion, kidney or ureteric stone with blockage",
    "Ectopic pregnancy, bleeding in pregnancy or miscarriage procedures (D&C)"
  ]],
  ["Women's health and maternity", [
    "Caesarean section, planned or emergency",
    "Hysterectomy, fibroid or ovarian cyst surgery",
    "Laparoscopy for infertility, endometriosis or tubal ligation (family planning)"
  ]],
  ["General and laparoscopic surgery", [
    "Hernia repair (inguinal, umbilical, incisional)",
    "Gallbladder removal (laparoscopic cholecystectomy)",
    "Piles, fissure and fistula surgery",
    "Thyroid surgery (thyroidectomy)",
    "Breast lump removal and other lump or cyst excisions",
    "Bariatric (weight loss) surgery"
  ]],
  ["Bones and joints", [
    "Knee or hip replacement",
    "Spine surgery",
    "Arthroscopy (keyhole joint surgery)",
    "Plate, nail or implant removal"
  ]],
  ["Urology and kidney", [
    "Kidney stone surgery (PCNL, URS, RIRS)",
    "Prostate surgery (TURP)",
    "Hydrocele surgery",
    "Dialysis fistula or catheter placement"
  ]],
  ["ENT and dental", [
    "Tonsil, adenoid and sinus surgery (FESS)",
    "Septoplasty and ear surgery",
    "Dental surgery under general anaesthesia"
  ]],
  ["Heart and other procedures", [
    "Angiography and angioplasty, pacemaker",
    "Kidney or liver biopsy",
    "Varicose vein procedures",
    "Cosmetic and plastic surgery"
  ]]
];

const FAQS = [
  ["How much does a pre-operative surgical profile cost in Hyderabad?", "Our Major Surgical Profile is ₹2,500 for all 16 tests, including the ECG and chest X-ray. Booked one by one, the same tests cost well over ₹2,500."],
  ["How fast will I get the report?", "In 3 hours from the time we take your sample, at any hour of the day or night, including Sundays and holidays. The report comes on WhatsApp and you can collect a print at the centre."],
  ["My hospital admission is tonight or early tomorrow. Can you still do it?", "Yes. That is exactly what this profile is for. We are open 24/7. Walk in or call us first on " + PHONE_DISPLAY + " so the team is ready when you arrive."],
  ["Do I need to fast?", "Not for these tests, because the sugar test is a random blood sugar. But if your surgeon has told you to stay empty stomach for the surgery itself, follow the surgeon's instruction. Our tests will not be affected."],
  ["Do I need a doctor's prescription?", "It is not required, but bring it if you have one. If your surgeon or hospital has asked for extra tests not in this list, show us the slip and we will add them."],
  ["Will my hospital accept your reports?", "Most hospitals and surgeons accept reports from any registered laboratory. A few large hospitals insist on repeating some tests in their own lab. If you are unsure, ask your surgeon's team before you come."],
  ["Is the ECG and chest X-ray done at your centre?", "Yes, both are done here in the same visit, so you do not have to go anywhere else. That is why this profile is done at the centre and not by home collection."],
  ["I take blood thinners. Anything I should do?", "Tell us when you come, and tell your surgeon. Medicines like aspirin, clopidogrel, warfarin (Acitrom), apixaban or rivaroxaban change the PT/INR and bleeding results. Do not stop them on your own: only your doctor should decide that."],
  ["What if a result comes out abnormal?", "Our pathologist reviews it, and we will call you if a value needs urgent attention. Show the report to your surgeon and anaesthetist. Some abnormal results simply mean the surgery is done with extra care; some mean it should wait until the problem is corrected."],
  ["My surgeon asked for only a few of these tests. Do I have to take the full profile?", "No. You can take any test on its own at our standard price. The full profile makes sense when your list is long, because it costs less than the tests booked separately."]
];

function renderSurgical() {
  const waBook = waLink(`Hi Caspian Diagnostic Centre, I need the Major Surgical Profile (₹${PRICE}, report in ${TAT}). My surgery/admission is on:`);
  const waRx = waLink("Hi Caspian Diagnostic Centre, my surgeon has given me a list of pre-operative tests. I am sending a photo. Please tell me the total.");

  const side = `<aside class="side">
<div class="price-lbl">All 16 tests</div>
<div class="price">${inr(PRICE)}</div>
<div class="meta">Report in <b>${TAT}</b>, day or night<br>ECG and chest X-ray included</div>
<a class="btn btn-blue" href="tel:${PHONE_TEL}">\u{1F4DE} Call now, we are open 24/7</a>
<a class="btn btn-blue" href="/?test=${encodeURIComponent("Major Surgical Profile")}#all-tests" style="background:#08487d">Book &amp; pay online</a>
<a class="btn btn-wa" href="${waBook}" target="_blank" rel="noopener">\u{1F4AC} Book on WhatsApp</a>
<a class="btn btn-line" href="${waRx}" target="_blank" rel="noopener">Send your surgeon's test list</a>
<div class="fine"><span class="tick">✓</span>Report in 3 hours, at any hour<br><span class="tick">✓</span>All tests, ECG and X-ray in one visit<br><span class="tick">✓</span>No fasting needed<br><span class="tick">✓</span>Report on WhatsApp and in print<br><span class="tick">✓</span>Open 24/7, all days</div>
</aside>`;

  const body = `<div class="grid"><div class="card">
<div class="note"><b>Admission tonight or tomorrow morning?</b> Come in at any hour. Your report will be ready in 3 hours. Call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> on the way and we will be ready for you.</div>
${photoFig(HERO_PHOTO)}<h2>What is a surgical profile?</h2>
<p>Before most operations, the surgeon and the anaesthetist want to know that your blood, kidneys, liver, heart and lungs are fit for anaesthesia and surgery. They also need to screen for infections and know your blood group in case blood is needed. This set of tests is called a pre-operative workup, pre-anaesthetic checkup tests, or a surgical profile.</p>
<p>Often the tests are asked for at the last minute: on the day of the surgeon's visit, or the evening before admission. Many labs take a day or more, which delays the admission. We keep every test in this profile running in our own lab around the clock, and do the ECG and chest X-ray in the same building, so the whole report is ready in 3 hours.</p>
<h2>Package details</h2>
<table class="facts">
<tr><td>Price</td><td><b>${inr(PRICE)}</b> for all 16 tests</td></tr>
<tr><td>Report time</td><td><b>${TAT}</b> from sample collection, at any hour</td></tr>
<tr><td>Sample</td><td>Blood, plus ECG and chest X-ray at the centre</td></tr>
<tr><td>Fasting</td><td>Not required</td></tr>
<tr><td>Where</td><td>Caspian Diagnostic Centre, 10-3-761/8, Opposite Post Office, Vijay Nagar Colony, Hyderabad 500057</td></tr>
<tr><td>Timings</td><td>24 hours, all seven days, no appointment needed</td></tr>
</table>
<h2>What's included, and why each test matters</h2>
<table class="facts">${TESTS.map(t => `<tr><td><b>${esc(t[0])}</b></td><td>${esc(t[1])}</td></tr>`).join("")}</table>
<h2>When is a surgical profile needed?</h2>
<p>Any surgery or procedure done under general or spinal anaesthesia, or deep sedation, usually needs some or all of these tests. Common reasons people come to us:</p>
${INDICATIONS.map(g => `<h3 style="margin:18px 0 6px;font-size:17px">${esc(g[0])}</h3><ul>${g[1].map(i => `<li>${esc(i)}</li>`).join("")}</ul>`).join("\n")}
<div class="note"><b>Small procedures under local anaesthesia do not need this full profile.</b> For cataract surgery, endoscopy, small biopsies, wisdom tooth removal and similar procedures, most surgeons ask only for blood sugar and the infection tests (HIV, HBsAg, HCV), and an ECG in older patients. Do not pay for tests you do not need: send us your surgeon's list and we will do only those, at our standard prices.</div>
<p>Your surgeon or anaesthetist decides the exact tests for your surgery. Some procedures need only a few of them; some patients need extra tests such as a 2D echo, HbA1c or urine test. If you have been given a list, <a href="${waRx}" target="_blank" rel="noopener">send us a photo on WhatsApp</a> and we will tell you the total.</p>
<h2>Tests before your surgery</h2>
<p>Some operations need a few extra tests on top of this profile. See what surgeons usually add for:</p>
<div class="rel">${PREOP_SURGERIES.map(x => `<a href="/pre-op-tests/${x.slug}">${esc(x.title.replace(/^Tests Before /, "").replace(/ in Hyderabad$/, ""))}</a>`).join("")}</div>
<h2>Why 3 hours matters</h2>
<ul>
<li><b>No delayed admission.</b> Hospitals often will not book the theatre until the reports are in. A next-day report can push your surgery by a day.</li>
<li><b>One visit, one place.</b> Blood tests, ECG and chest X-ray are all done here. No running between a lab, a cardiology clinic and an X-ray centre.</li>
<li><b>Night and Sunday too.</b> Emergencies do not keep office hours, and neither do we.</li>
<li><b>Reviewed by a pathologist.</b> If a value needs urgent attention, we call you, so it is not discovered for the first time on the operating table.</li>
</ul>
<h2>What to bring</h2>
<ul>
<li>Your surgeon's prescription or test list, if you have one</li>
<li>A list of the medicines you take, especially blood thinners, diabetes and BP medicines</li>
<li>Old reports, ECGs or X-rays, if you have them</li>
<li>Your hospital's admission slip, if they gave you one</li>
</ul>
<h2>For surgeons, hospitals and nursing homes</h2>
<p>If you operate in or near Vijay Nagar Colony, send your patients to us for the pre-operative workup. Reports are ready in 3 hours at any hour, and we can send a copy straight to you on WhatsApp. Call us to set up a standing arrangement.</p>
<p><a class="btn btn-wa" style="display:inline-block;width:auto;padding:12px 20px" href="${waLink("Hi Caspian Diagnostic Centre, I am a surgeon / hospital. I would like to discuss pre-operative workups for my patients.")}" target="_blank" rel="noopener">\u{1F4AC} Talk to us about referrals</a></p>
<h2>Frequently asked questions</h2>
${faqBlock(FAQS)}
<h2>Related tests</h2>
<div class="rel"><a href="/tests/ecg-test-hyderabad">ECG</a><a href="/tests/chest-x-ray-hyderabad">Chest X-ray</a><a href="/tests/2d-echo-test-hyderabad">2D Echo</a><a href="/tests/cbc-test-hyderabad">CBC Test</a><a href="/tests/blood-group-test-hyderabad">Blood Group</a><a href="/tests/hba1c-test-hyderabad">HbA1c</a><a href="/packages">All packages</a></div>
<div class="note">This page is general information. Fitness for surgery is decided by your surgeon and anaesthetist, who will read these reports together with your examination and history.</div>
<p class="reviewed" style="font-size:14px;color:#5b6b7a;margin-top:14px">Medically reviewed by Dr Raheel Raza, MBBS, DCP (Gandhi), Consultant Pathologist.</p>
</div>
${side}</div>`;

  return pageShell({
    title: `Surgical Profile Test Price in Hyderabad: ${inr(PRICE)} | Report in 3 Hours | Caspian Labs`,
    desc: DESC,
    canonical: URL,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="/packages">Health Packages</a> › Surgical Profile`,
    heroH1: "Surgical Profile Test in Hyderabad, Report in 3 Hours",
    heroSub: `16 tests including ECG and chest X-ray · ${inr(PRICE)} · Open 24/7, day or night`,
    bodyHtml: body,
    ogImage: photoUrl(HERO_PHOTO),
    ld: [
      ldBreadcrumb([["Home", "/"], ["Health Packages", "/packages"], ["Surgical Profile", "/packages/" + SLUG]]),
      ldProduct(NAME, DESC, PRICE, URL),
      ldFaq(FAQS),
      { "@context": "https://schema.org", "@type": "MedicalWebPage", name: NAME, url: URL, inLanguage: "en-IN", reviewedBy: { "@type": "Physician", name: "Dr Raheel Raza", jobTitle: "MBBS, DCP (Gandhi), Consultant Pathologist" } }
    ]
  });
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderSurgical());
}
