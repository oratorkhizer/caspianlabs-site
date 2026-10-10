// Caspian Diagnostic Centre, "tests before <surgery>" pages (11 Oct 2026).
// Served at /pre-op-tests/<slug> via the rewrite in vercel.json. Each page points to the
// Major Surgical Profile (api/surgical.js, Rs 2,500, report in 3 hours, 24/7) and lists
// the extra tests a surgeon may add for that particular operation.
//
// Dr Khizer's decisions, 11 Oct 2026: build all 11 surgeries; clinical lines reviewed by
// Dr Raheel Raza (consultant pathologist). Add-on prices are copied from the live homepage
// catalogue; a test with no catalogue price shows "Ask us", never an invented number.
// Keep SLUGS in api/sitemap.js in sync with SURGERIES below. No em dashes.
import {
  BASE, PHONE_DISPLAY, PHONE_TEL,
  esc, inr, waLink, photoFig, photoUrl,
  pageShell, ldBreadcrumb, ldFaq, faqBlock
} from "./_shell.js";

const PROFILE_URL = "/packages/surgical-profile-hyderabad";
const PRICE = 2500;
const REVIEWER = { name: "Dr Raheel Raza", title: "MBBS, DCP (Gandhi), Consultant Pathologist" };

const PROFILE_TESTS = "CBC, ESR, LFT, blood urea, serum creatinine, electrolytes, random blood sugar, PT/INR, BT/CT, HIV, HBsAg, HCV, blood group, TSH, ECG and chest X-ray";

// [label, price or null, page or null]
const ADDONS = {
  hba1c: ["HbA1c", 600, "/tests/hba1c-test-hyderabad"],
  cue: ["Urine routine (CUE)", 200, "/tests/urine-routine-test-hyderabad"],
  culture: ["Urine culture", null, null],
  psa: ["PSA", 1200, "/tests/psa-test-hyderabad"],
  lipid: ["Lipid profile", 450, "/tests/lipid-profile-test-hyderabad"],
  vitd: ["Vitamin D", 1350, "/tests/vitamin-d-test-hyderabad"],
  b12: ["Vitamin B12", 800, "/tests/vitamin-b12-test-hyderabad"],
  iron: ["Iron deficiency profile", 1000, null],
  ferritin: ["Serum ferritin", 400, "/tests/ferritin-test-hyderabad"],
  thyroid: ["Thyroid profile (T3, T4, TSH)", 470, "/packages/thyroid-profile-test-hyderabad"],
  tpo: ["Anti-TPO antibodies", 1000, "/tests/anti-tpo-test-hyderabad"],
  calcium: ["Serum calcium", 160, "/tests/calcium-test-hyderabad"],
  uric: ["Uric acid", 160, "/tests/uric-acid-test-hyderabad"],
  echo: ["2D Echo", 1200, "/tests/2d-echo-test-hyderabad"],
  hcg: ["Beta HCG (pregnancy test)", 950, "/tests/beta-hcg-test-hyderabad"],
  crp: ["CRP", 550, "/tests/crp-test-hyderabad"],
  insulin: ["Fasting insulin", 950, "/tests/insulin-fasting-test-hyderabad"],
  vdrl: ["VDRL (syphilis screen)", null, null],
  amylase: ["Serum amylase or lipase", null, null],
  cortisol: ["Serum cortisol", null, null]
};

const SURGERIES = [
  {
    slug: "c-section",
    title: "Tests Before C-Section (Caesarean) in Hyderabad",
    short: "C-section",
    anaes: "Usually spinal anaesthesia; general anaesthesia in some emergencies",
    emergency: true,
    intro: [
      "A caesarean section is one of the most common operations in India. Most are done under spinal anaesthesia, where the needle goes into the lower back. For that, the anaesthetist needs to know that your platelets and clotting are normal, because bleeding near the spine is dangerous.",
      "Your obstetrician will also want your haemoglobin, blood group and infection status on file before the day. Blood loss in a C-section is more than in a normal delivery, so blood may need to be kept ready."
    ],
    addons: [
      ["cue", "To check for a urine infection, which is common in late pregnancy and must be treated before surgery."],
      ["vdrl", "Many hospitals ask for it along with HIV, HBsAg and HCV as part of the antenatal infection screen."],
      ["hba1c", "If you had diabetes in pregnancy (GDM) or diabetes before pregnancy, to see how well sugar has been controlled."]
    ],
    points: [
      "Platelets (in the CBC), PT/INR and BT/CT are the tests the anaesthetist looks at first before a spinal.",
      "If your blood group is Rh negative, tell your doctor. You may need an anti-D injection after delivery.",
      "If your haemoglobin is low, the obstetrician may plan iron or blood before the surgery. Do not wait until the last week to find out.",
      "Most of these tests are often done earlier in pregnancy. Ask your doctor which ones need repeating close to the date."
    ],
    faqs: [
      ["Are these tests safe in pregnancy?", "Yes. The blood tests are simple blood draws. The chest X-ray is usually not needed in pregnancy and is done only if your doctor specifically asks for it, with an abdominal shield. Tell our staff that you are pregnant before any X-ray."],
      ["My C-section is an emergency. Should I come to you first?", "No. In an emergency, go straight to your hospital. They will take the samples there. This profile is for a planned C-section, or when the hospital asks you to get the tests done before admission."],
      ["How close to the C-section date should the tests be done?", "Usually within the last one to two weeks before the planned date, but your obstetrician decides. If your date is tomorrow, we can still give you the report in 3 hours."]
    ],
    related: ["t:blood-group-test-hyderabad", "t:cbc-test-hyderabad", "t:pt-inr-test-hyderabad", "t:urine-routine-test-hyderabad"]
  },
  {
    slug: "hernia-surgery",
    title: "Tests Before Hernia Surgery in Hyderabad",
    short: "hernia surgery",
    anaes: "Spinal or general anaesthesia; small hernias sometimes under local",
    intro: [
      "Hernia repair, open or laparoscopic, is one of the most common planned operations. Laparoscopic repair is done under general anaesthesia. Open repair is often done under spinal anaesthesia.",
      "Many people with a hernia are middle-aged or older, smoke, or have a chronic cough or constipation that pushed the hernia out in the first place. The pre-op tests check the heart, lungs, sugar and clotting before the anaesthetic."
    ],
    addons: [
      ["hba1c", "If you have diabetes. Poorly controlled sugar raises the risk of wound and mesh infection."],
      ["echo", "If you have heart disease, breathlessness on walking, or an abnormal ECG."],
      ["psa", "In older men whose hernia came from straining to pass urine, the surgeon may check the prostate first."],
      ["cue", "To rule out a urine infection before the mesh is placed."]
    ],
    points: [
      "A chronic cough or straining is often the cause. The chest X-ray helps the surgeon check the lungs.",
      "If the hernia is painful, hard or cannot be pushed back, it may be obstructed. That is an emergency: go to a hospital, not a lab.",
      "Small hernias repaired under local anaesthesia may need only a few of these tests. Your surgeon decides."
    ],
    faqs: [
      ["Is the test list different for laparoscopic and open hernia surgery?", "Not much. Laparoscopic repair is under general anaesthesia, so the ECG and chest X-ray matter more. Open repair is often under spinal, so clotting and platelets matter more. The Major Surgical Profile covers both."],
      ["My hernia is small. Do I need all 16 tests?", "Not always. If it is being repaired under local anaesthesia, your surgeon may ask for only sugar and the infection tests. Send us the list and we will do only those."]
    ],
    related: ["t:ecg-test-hyderabad", "t:chest-x-ray-hyderabad", "t:hba1c-test-hyderabad", "t:2d-echo-test-hyderabad"]
  },
  {
    slug: "gallbladder-surgery",
    title: "Tests Before Gallbladder Surgery (Cholecystectomy) in Hyderabad",
    short: "gallbladder surgery",
    anaes: "General anaesthesia",
    intro: [
      "Gallbladder removal, usually by laparoscopy (laparoscopic cholecystectomy), is done for gallstones that cause pain, infection or jaundice. It is always under general anaesthesia.",
      "The liver function test is the key test here. A raised bilirubin or liver enzymes can mean a stone has slipped into the bile duct, which changes how the surgery is planned."
    ],
    addons: [
      ["amylase", "If you had severe upper abdominal pain going to the back, to check for pancreatitis caused by a stone."],
      ["hba1c", "If you have diabetes. Gallbladder infection is more serious in people with high sugar."],
      ["echo", "In older patients or those with heart disease, before general anaesthesia."]
    ],
    points: [
      "Bring your ultrasound abdomen report. The surgeon will read it together with the LFT.",
      "If the LFT shows jaundice, the surgeon may order an MRCP or ERCP before removing the gallbladder.",
      "Fever with right-sided pain and yellow eyes needs urgent hospital care, not just tests."
    ],
    faqs: [
      ["Why is the LFT so important before gallbladder surgery?", "Because it shows whether a stone has blocked the bile duct. If bilirubin, ALP or GGT are high, the surgeon may need to clear the duct first or change the operation plan."],
      ["Do I need to fast for these tests?", "No. The sugar test in this profile is random, so you can eat. But if you are having the surgery the same day, follow your surgeon's fasting instructions."]
    ],
    related: ["t:liver-function-test-hyderabad", "t:cbc-test-hyderabad", "t:crp-test-hyderabad", "t:hba1c-test-hyderabad"]
  },
  {
    slug: "hysterectomy",
    title: "Tests Before Hysterectomy and Fibroid Surgery in Hyderabad",
    short: "hysterectomy",
    anaes: "General or spinal anaesthesia",
    intro: [
      "A hysterectomy (removal of the uterus), myomectomy (removal of fibroids) or ovarian cyst surgery is done by open, laparoscopic or vaginal route. All need general or spinal anaesthesia.",
      "Many women having this surgery have had heavy bleeding for months. So haemoglobin and iron levels matter a lot: a low haemoglobin is often corrected before the operation."
    ],
    addons: [
      ["iron", "To see if heavy bleeding has used up your iron stores. Low iron is treated before surgery to reduce the need for blood."],
      ["ferritin", "A cheaper single test of iron stores, if the full iron profile is not asked."],
      ["hcg", "In women who could be pregnant, to rule out pregnancy before surgery on the uterus."],
      ["cue", "To rule out a urine infection, since the bladder lies right next to the uterus."],
      ["hba1c", "If you have diabetes."]
    ],
    points: [
      "Bring your ultrasound pelvis report and any Pap smear or biopsy report.",
      "If your haemoglobin is very low, your gynaecologist may postpone the surgery and give iron first. This is common and safer.",
      "Women above 40, or with BP or diabetes, may also be asked for a 2D echo."
    ],
    faqs: [
      ["My haemoglobin is low. Will my surgery be cancelled?", "Not cancelled, but it may be delayed until the haemoglobin comes up with iron tablets, an iron injection or a transfusion. Your gynaecologist decides. Getting the tests early gives time to correct it."],
      ["Do I need a pregnancy test before a hysterectomy?", "If there is any chance of pregnancy, yes. Most hospitals ask for it in women of child-bearing age before any surgery on the uterus."]
    ],
    related: ["t:cbc-test-hyderabad", "t:ferritin-test-hyderabad", "t:beta-hcg-test-hyderabad", "p:womens-health-checkup-hyderabad"]
  },
  {
    slug: "knee-replacement",
    title: "Tests Before Knee Replacement Surgery in Hyderabad",
    short: "knee replacement",
    anaes: "Usually spinal anaesthesia, sometimes with a nerve block",
    intro: [
      "Knee replacement is a major operation, usually in people above 55 who often also have BP, diabetes or heart disease. The pre-op tests matter more here than in most surgeries.",
      "The biggest fear after a joint replacement is infection of the new joint. So the surgeon wants to make sure there is no hidden infection anywhere, and that sugar is well controlled."
    ],
    addons: [
      ["hba1c", "Very important. Many surgeons postpone joint replacement if HbA1c is high, because the infection risk rises sharply."],
      ["cue", "A hidden urine infection can seed bacteria into the new joint. It must be treated first."],
      ["culture", "If the urine routine shows infection, to choose the right antibiotic."],
      ["echo", "Commonly asked in older patients and anyone with heart disease, BP or breathlessness."],
      ["crp", "A baseline for inflammation, useful after surgery to watch for infection."],
      ["vitd", "Low vitamin D is common and affects bone and muscle recovery."]
    ],
    points: [
      "Get dental problems and any skin infection near the knee treated before the surgery date.",
      "Blood thinners like aspirin or clopidogrel may need to be stopped before surgery. Only your doctor should decide this.",
      "Both knees together is a bigger operation. The anaesthetist may ask for more tests."
    ],
    faqs: [
      ["Why does my orthopaedic surgeon want HbA1c?", "Because high sugar is one of the biggest risk factors for infection in the new joint. Many surgeons prefer HbA1c below about 8% before a joint replacement. Your surgeon will tell you the target."],
      ["Do I need a 2D echo before knee replacement?", "Often yes, if you are older, have BP, diabetes or heart symptoms, or your ECG is abnormal. The anaesthetist or physician decides."]
    ],
    related: ["t:hba1c-test-hyderabad", "t:2d-echo-test-hyderabad", "t:urine-routine-test-hyderabad", "t:vitamin-d-test-hyderabad"]
  },
  {
    slug: "kidney-stone-surgery",
    title: "Tests Before Kidney Stone Surgery (PCNL, URS, RIRS) in Hyderabad",
    short: "kidney stone surgery",
    anaes: "Spinal or general anaesthesia",
    intro: [
      "Kidney and ureter stones are removed by PCNL (through a small cut in the back), URS or RIRS (with a scope through the urine passage). All are done under spinal or general anaesthesia.",
      "For stone surgery, the urine tests and kidney function are the most important. Operating on an infected kidney can spread infection into the blood, so the urine must be clear first."
    ],
    addons: [
      ["cue", "Essential. Shows infection, blood and crystals in the urine."],
      ["culture", "Most urologists want a sterile urine culture before stone surgery. If it grows bacteria, antibiotics are given first."],
      ["calcium", "Most stones are calcium stones. A high calcium level needs to be looked into."],
      ["uric", "High uric acid can cause uric acid stones."]
    ],
    points: [
      "Bring your CT KUB or ultrasound report. The urologist plans the surgery from it.",
      "Creatinine and urea (in the profile) show whether the stone has affected kidney function.",
      "Fever with stone pain is an emergency. Go to a hospital."
    ],
    faqs: [
      ["Why is a urine culture needed before stone surgery?", "Because bacteria can hide behind a stone. If the urine is infected during surgery, the infection can enter the blood (urosepsis). A sterile culture, or a course of the right antibiotic first, makes the surgery much safer."],
      ["Can I do the urine test at home collection?", "Yes, the urine sample can be collected at home. But the ECG and chest X-ray in the profile are done at our centre."]
    ],
    related: ["t:urine-routine-test-hyderabad", "t:kidney-function-test-hyderabad", "t:calcium-test-hyderabad", "t:uric-acid-test-hyderabad"]
  },
  {
    slug: "appendix-surgery",
    title: "Tests Before Appendix Surgery (Appendicectomy) in Hyderabad",
    short: "appendix surgery",
    anaes: "General anaesthesia",
    emergency: true,
    intro: [
      "Appendicitis is a common reason for emergency surgery, usually done by laparoscopy under general anaesthesia. The surgery is often done within hours of the diagnosis.",
      "Because of that, the tests are often needed at night or on a Sunday. That is exactly why we keep this profile running 24 hours with a 3-hour report."
    ],
    addons: [
      ["cue", "To rule out a urine infection or kidney stone, which can feel like appendicitis."],
      ["hcg", "In women of child-bearing age, to rule out pregnancy, including ectopic pregnancy, which can cause similar pain."],
      ["crp", "Often raised in appendicitis. Helps the surgeon with the diagnosis."]
    ],
    points: [
      "If you have severe pain in the lower right abdomen with fever or vomiting, go to a hospital first. Do not wait for lab reports.",
      "The white cell count in the CBC is usually raised in appendicitis.",
      "This page is for patients whose surgeon has already examined them and asked for pre-op tests before admission."
    ],
    faqs: [
      ["Can a blood test confirm appendicitis?", "No single blood test confirms it. A raised white cell count and CRP support the diagnosis, but the surgeon decides based on the examination and usually an ultrasound or CT scan."],
      ["My surgeon said operate tonight. Can you give reports in time?", "Yes. We are open 24/7 and the report is ready in 3 hours. Call " + PHONE_DISPLAY + " on the way."]
    ],
    related: ["t:cbc-test-hyderabad", "t:crp-test-hyderabad", "t:urine-routine-test-hyderabad", "t:beta-hcg-test-hyderabad"]
  },
  {
    slug: "fracture-surgery",
    title: "Tests Before Fracture Surgery in Hyderabad",
    short: "fracture surgery",
    anaes: "Spinal, general or regional block, depending on the bone",
    emergency: true,
    intro: [
      "Fractures of the hip, thigh, leg, arm or wrist often need surgery with plates, nails or screws. Many of these are done within a day or two of the injury, and the tests are needed fast.",
      "Hip fractures in elderly people are a special case. The sooner they are operated, the better the recovery, so pre-op tests should never be the reason for delay."
    ],
    addons: [
      ["echo", "Very often asked in elderly patients with a hip fracture, before anaesthesia."],
      ["hba1c", "If diabetic. Affects wound healing and infection risk."],
      ["vitd", "A fracture after a minor fall can mean weak bones. Low vitamin D is very common."],
      ["calcium", "Checked along with vitamin D when bones are weak."]
    ],
    points: [
      "We also do X-rays at our centre. See our X-ray page for the fracture film itself.",
      "Tell us about blood thinners. They change the PT/INR and the timing of surgery.",
      "A badly injured or bleeding patient must go to a hospital emergency first."
    ],
    faqs: [
      ["Is a 2D echo needed before hip fracture surgery?", "In many elderly patients, yes, especially with heart symptoms, a murmur or an abnormal ECG. The anaesthetist decides. It should not delay the surgery for long."],
      ["Can you do the X-ray of the fracture too?", "Yes, we have digital X-ray at the centre, open 24/7. See our X-ray page for prices."]
    ],
    related: ["t:2d-echo-test-hyderabad", "t:vitamin-d-test-hyderabad", "t:calcium-test-hyderabad", "t:chest-x-ray-hyderabad"]
  },
  {
    slug: "piles-fistula-surgery",
    title: "Tests Before Piles, Fissure and Fistula Surgery in Hyderabad",
    short: "piles and fistula surgery",
    anaes: "Usually spinal anaesthesia; some laser procedures under local or short general",
    intro: [
      "Surgery for piles (haemorrhoids), fissure and fistula, including laser procedures, is very common. Most are done under spinal anaesthesia as day care or with a one-night stay.",
      "Piles that bleed for a long time can cause anaemia, so the haemoglobin in the CBC matters. Fistula and abscess heal slowly when sugar is high."
    ],
    addons: [
      ["hba1c", "If diabetic, or if you have a repeated abscess or fistula. High sugar delays healing and causes recurrence."],
      ["iron", "If you have had bleeding for months and the haemoglobin is low."]
    ],
    points: [
      "Short procedures under local anaesthesia may need fewer tests. Ask your surgeon for the exact list.",
      "Long-standing bleeding should always be shown to a doctor, because other causes need to be ruled out."
    ],
    faqs: [
      ["Do I need all these tests for laser piles surgery?", "It depends on the anaesthesia. Under spinal or general anaesthesia, most surgeons ask for the full profile. Under local anaesthesia, fewer tests may be enough. Send us your surgeon's list."],
      ["Why is my sugar checked before fistula surgery?", "Because high sugar is a common reason for fistula and abscess coming back, and for slow wound healing. If it is high, your doctor will control it first."]
    ],
    related: ["t:cbc-test-hyderabad", "t:hba1c-test-hyderabad", "t:blood-sugar-test-hyderabad", "t:ferritin-test-hyderabad"]
  },
  {
    slug: "thyroid-surgery",
    title: "Tests Before Thyroid Surgery (Thyroidectomy) in Hyderabad",
    short: "thyroid surgery",
    anaes: "General anaesthesia",
    intro: [
      "Thyroidectomy is done for a large goitre, a nodule that could be cancer, or an overactive thyroid that is not controlled by medicine. It is always under general anaesthesia.",
      "The thyroid must be at a normal level before surgery. An overactive thyroid at the time of surgery can cause a dangerous rise in heart rate."
    ],
    addons: [
      ["thyroid", "The profile has TSH. The surgeon also wants T3 and T4 to confirm the thyroid is in the normal range."],
      ["calcium", "A baseline is important. The small parathyroid glands sit behind the thyroid, and calcium can drop after surgery."],
      ["vitd", "Low vitamin D makes the calcium drop after surgery worse. Many surgeons check and correct it first."],
      ["tpo", "Sometimes asked to look for autoimmune thyroid disease."]
    ],
    points: [
      "Bring your ultrasound neck and FNAC (needle test) reports.",
      "An ENT check of the vocal cords is usually done before surgery. That is a clinic exam, not a lab test.",
      "The chest X-ray also shows if a large goitre is pushing on the windpipe."
    ],
    faqs: [
      ["Why is calcium checked before thyroid surgery?", "Because the parathyroid glands, which control calcium, lie right behind the thyroid. After surgery the calcium can fall for a while. Knowing your starting level helps the doctor manage it."],
      ["Is TSH alone enough before thyroidectomy?", "Usually not. Most surgeons want T3 and T4 as well, especially if you have an overactive thyroid. The thyroid profile can be added to the surgical profile."]
    ],
    related: ["t:tsh-test-hyderabad", "p:thyroid-profile-test-hyderabad", "t:calcium-test-hyderabad", "t:anti-tpo-test-hyderabad"]
  },
  {
    slug: "bariatric-surgery",
    title: "Tests Before Bariatric (Weight Loss) Surgery in Hyderabad",
    short: "bariatric surgery",
    anaes: "General anaesthesia",
    intro: [
      "Bariatric surgery, such as sleeve gastrectomy or gastric bypass, is a planned operation for severe obesity. It needs a wider workup than most surgeries, because obesity often comes with diabetes, fatty liver, sleep apnoea and vitamin deficiencies.",
      "The Major Surgical Profile covers the anaesthesia basics. Bariatric teams add metabolic and nutrition tests on top, so that deficiencies can be corrected before surgery and followed after it."
    ],
    addons: [
      ["hba1c", "Most people having bariatric surgery have diabetes or prediabetes."],
      ["lipid", "Cholesterol and triglycerides, often high in obesity."],
      ["vitd", "Very commonly low, and drops further after surgery."],
      ["b12", "Absorption falls after surgery. A baseline is needed."],
      ["iron", "Iron deficiency is common before and after bariatric surgery."],
      ["thyroid", "To rule out an underactive thyroid as a cause of weight gain."],
      ["uric", "Often raised in obesity."],
      ["insulin", "Sometimes asked to assess insulin resistance."],
      ["cortisol", "Sometimes asked to rule out a hormone cause of weight gain."],
      ["echo", "Commonly asked, because obesity strains the heart."],
      ["cue", "Routine urine check before surgery."]
    ],
    points: [
      "Many bariatric teams also ask for a sleep study, because untreated sleep apnoea is a major anaesthesia risk. A home sleep study is available at Caspian Healthcare in the same building.",
      "An upper GI endoscopy is often done before surgery. That is done by a gastroenterologist, not in the lab.",
      "Your bariatric surgeon decides the final list. Send it to us and we will tell you the total."
    ],
    faqs: [
      ["Why so many tests before bariatric surgery?", "Because obesity affects almost every organ, and bariatric surgery changes how you absorb vitamins and iron for life. Baseline values help your team correct deficiencies before surgery and track them after."],
      ["Is the Major Surgical Profile enough on its own?", "No. It covers the anaesthesia and safety tests. The bariatric team will almost always add the metabolic and vitamin tests listed on this page."]
    ],
    related: ["t:hba1c-test-hyderabad", "t:vitamin-d-test-hyderabad", "t:vitamin-b12-test-hyderabad", "p:metabolic-wellness"]
  }
];

const COMMON_FAQS = [
  ["How fast will I get the report?", "In 3 hours from the time we take your sample, at any hour of the day or night, including Sundays and holidays. The report comes on WhatsApp, and you can collect a print at the centre."],
  ["How much do the extra tests cost?", "The Major Surgical Profile is ₹2,500. Extra tests are added at our standard price, shown in the table on this page. Send us your surgeon's list on WhatsApp and we will tell you the exact total before you come."]
];

function refLink(ref) {
  const [k, slug] = ref.split(":");
  const path = (k === "p" ? "/packages/" : "/tests/") + slug;
  const label = slug.replace(/-(test-)?hyderabad$/, "").replace(/-/g, " ").replace(/\b(\w)/g, c => c.toUpperCase())
    .replace(/\bCbc\b/, "CBC").replace(/\bCrp\b/, "CRP").replace(/\bHba1c\b/, "HbA1c").replace(/\bTsh\b/, "TSH").replace(/\b2d\b/, "2D")
    .replace(/\bPt Inr\b/, "PT/INR").replace(/\bAnti Tpo\b/, "Anti-TPO").replace(/\bBeta Hcg\b/, "Beta HCG").replace(/\bB12\b/, "B12");
  return `<a href="${path}">${esc(label)}</a>`;
}

function renderSurgery(s) {
  const url = `${BASE}/pre-op-tests/${s.slug}`;
  const waBook = waLink(`Hi Caspian Diagnostic Centre, I need pre-op tests before ${s.short}. My surgery/admission is on:`);
  const waRx = waLink(`Hi Caspian Diagnostic Centre, my surgeon has given me a list of tests before ${s.short}. I am sending a photo. Please tell me the total.`);
  const faqs = s.faqs.concat(COMMON_FAQS);
  const desc = `Pre-operative tests before ${s.short} in Hyderabad: the full surgical profile at ₹2,500 with ECG and chest X-ray, report in 3 hours, open 24/7. Plus the extra tests surgeons often add. Caspian Diagnostic Centre, Vijay Nagar Colony.`;

  const addonRows = s.addons.map(([key, why]) => {
    const a = ADDONS[key];
    const name = a[2] ? `<a href="${a[2]}">${esc(a[0])}</a>` : esc(a[0]);
    const price = a[1] ? inr(a[1]) : "Ask us";
    return `<tr><td><b>${name}</b><br><span style="color:var(--muted)">${price}</span></td><td>${esc(why)}</td></tr>`;
  }).join("");

  const side = `<aside class="side">
<div class="price-lbl">Major Surgical Profile</div>
<div class="price">${inr(PRICE)}</div>
<div class="meta">16 tests incl. ECG and chest X-ray<br>Report in <b>3 hours</b>, day or night</div>
<a class="btn btn-blue" href="tel:${PHONE_TEL}">\u{1F4DE} Call now, we are open 24/7</a>
<a class="btn btn-wa" href="${waBook}" target="_blank" rel="noopener">\u{1F4AC} Book on WhatsApp</a>
<a class="btn btn-line" href="${waRx}" target="_blank" rel="noopener">Send your surgeon's test list</a>
<div class="fine"><span class="tick">✓</span>Report in 3 hours, at any hour<br><span class="tick">✓</span>All tests, ECG and X-ray in one visit<br><span class="tick">✓</span>Extra tests added at standard price<br><span class="tick">✓</span>Open 24/7, all days</div>
</aside>`;

  const emergencyNote = s.emergency
    ? `<div class="note"><b>Emergency?</b> If the patient is in severe pain, bleeding, or very unwell, go straight to a hospital emergency. The hospital will take the samples. Come to us when your surgeon asks for the tests before a planned admission.</div>`
    : `<div class="note"><b>Admission tonight or tomorrow?</b> Come in at any hour. Your report will be ready in 3 hours. Call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> on the way.</div>`;

  const body = `<div class="grid"><div class="card">
${emergencyNote}
<h2>Before ${esc(s.short)}: what the surgeon needs to know</h2>
${s.intro.map(p => `<p>${esc(p)}</p>`).join("\n")}
<table class="facts">
<tr><td>Anaesthesia</td><td>${esc(s.anaes)}</td></tr>
<tr><td>Basic tests</td><td><a href="${PROFILE_URL}">Major Surgical Profile</a>, ${inr(PRICE)}</td></tr>
<tr><td>Report time</td><td><b>3 hours</b> from sample collection, 24/7</td></tr>
<tr><td>Fasting</td><td>Not needed for the profile</td></tr>
</table>
<h2>Step 1: the Major Surgical Profile</h2>
<p>Almost every surgeon and anaesthetist asks for these basic tests before ${esc(s.short)}: ${PROFILE_TESTS}. We do all of them in one visit for <b>${inr(PRICE)}</b>, with the report in 3 hours. <a href="${PROFILE_URL}">See why each test matters</a>.</p>
<h2>Step 2: extra tests your surgeon may add</h2>
<p>Depending on your age, health and the hospital's protocol, your surgeon may ask for some of these as well. They are not part of the profile and are charged separately.</p>
<table class="facts">${addonRows}</table>
<h2>Points specific to ${esc(s.short)}</h2>
<ul>${s.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
<p>Your surgeon and anaesthetist decide the final list. If you have one, <a href="${waRx}" target="_blank" rel="noopener">send us a photo on WhatsApp</a> and we will do exactly those tests and tell you the total first.</p>
<h2>Frequently asked questions</h2>
${faqBlock(faqs)}
<h2>Related tests</h2>
<div class="rel">${s.related.map(refLink).join("")}<a href="${PROFILE_URL}">Surgical profile</a></div>
<div class="note">This page is general information. Fitness for surgery is decided by your surgeon and anaesthetist.</div>
<p class="reviewed" style="font-size:14px;color:#5b6b7a;margin-top:14px">Medically reviewed by ${esc(REVIEWER.name)}, ${esc(REVIEWER.title)}.</p>
</div>
${side}</div>`;

  return pageShell({
    title: `${s.title} | Report in 3 Hours | Caspian Labs`,
    desc,
    canonical: url,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="${PROFILE_URL}">Surgical Profile</a> › ${esc(s.title.replace(/ in Hyderabad$/, ""))}`,
    heroH1: s.title,
    heroSub: `Full surgical profile ${inr(PRICE)} · Report in 3 hours · Open 24/7, day or night`,
    bodyHtml: body,
    ogImage: photoUrl("lab"),
    ld: [
      ldBreadcrumb([["Home", "/"], ["Surgical Profile", PROFILE_URL], [s.title, "/pre-op-tests/" + s.slug]]),
      ldFaq(faqs),
      { "@context": "https://schema.org", "@type": "MedicalWebPage", name: s.title, url, inLanguage: "en-IN", reviewedBy: { "@type": "Physician", name: REVIEWER.name, jobTitle: REVIEWER.title } }
    ]
  });
}

export const PREOP_SURGERIES = SURGERIES.map(s => ({ slug: s.slug, title: s.title }));

export default function handler(req, res) {
  const slug = (req.query || {}).slug;
  const s = SURGERIES.find(x => x.slug === slug);
  if (!s) {
    res.setHeader("Location", PROFILE_URL);
    res.status(302).send("");
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderSurgery(s));
}
