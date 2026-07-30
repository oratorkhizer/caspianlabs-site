// Caspian Diagnostic Centre — SEO landing pages (Phase 3, task 3.1/3.2)
// One serverless renderer serves every /packages/* and /tests/* page plus
// /home-sample-collection-hyderabad, via rewrites in vercel.json.
// Why a function and not 35 static files: one place to edit content/template,
// CDN-cached (s-maxage) so it behaves like static for visitors and crawlers.
//
// NOTE: keep the slug lists in api/sitemap.js in sync when adding/removing pages.
// Prices are the real Crelio selling prices mirrored from the homepage TESTS array.

const BASE = "https://www.caspianlabs.in";
const PHONE_DISPLAY = "+91 90593 41154";
const PHONE_TEL = "+919059341154";
const WA = "https://wa.me/919059341154";

/* ------------------------------------------------------------------ */
/* Package data                                                        */
/* ------------------------------------------------------------------ */

const PACKAGES = [
  {
    slug: "full-body-checkup-hyderabad",
    name: "Full Body Check Up",
    price: 1795,
    tagline: "60+ parameters · our most popular package",
    desc: "Full body checkup in Hyderabad at ₹1,795 — 60+ parameters covering CBC, HbA1c, lipid, liver, kidney, thyroid, vitamins D & B12 and urine analysis. Free home sample collection above ₹500.",
    about: [
      "The Full Body Check Up is our most-ordered preventive package — a single visit (or a single home-collection appointment) that screens every major organ system: blood counts, three-month sugar control, cholesterol, liver, kidneys, thyroid, iron stores, key vitamins and a complete urine analysis.",
      "It is designed as an annual health audit for adults of any age — especially useful if you have a family history of diabetes, heart disease or thyroid problems, or simply haven't been tested in over a year."
    ],
    includes: ["Complete Blood Count (CBC)", "ESR", "HbA1c (3-month sugar)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Iron Studies (TIBC)", "Thyroid Profile I", "Vitamin D (25-OH)", "Vitamin B12", "Serum Calcium", "Complete Urine Analysis (CUE)"],
    fasting: "yes",
    idealFor: ["Adults due for an annual health check", "Family history of diabetes, heart or thyroid disease", "Anyone with fatigue, weight change or low energy"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Full Body Check Up (₹1,795).",
    related: ["t:hba1c-test-hyderabad", "t:lipid-profile-test-hyderabad", "p:metabolic-wellness-inbody-hyderabad", "p:essential-health-checkup-hyderabad"]
  },
  {
    slug: "essential-health-checkup-hyderabad",
    name: "Caspian Essential Checkup",
    price: 899,
    tagline: "Quick essential screening",
    desc: "Essential health checkup in Hyderabad at ₹899 — CBC, blood sugar, lipid profile, liver function, TSH and complete urine analysis. Free home collection above ₹500 at Caspian Diagnostic Centre.",
    about: [
      "The Caspian Essential Checkup covers the six investigations doctors ask for most often — blood counts, sugar, cholesterol, liver enzymes, thyroid (TSH) and urine — at a budget-friendly price.",
      "It is a sensible first checkup if you have never been tested before, or a quick interim screen between fuller annual checkups."
    ],
    includes: ["Complete Blood Count (CBC)", "Blood Sugar (Random)", "Lipid Profile", "Liver Function Test (LFT)", "TSH", "Complete Urine Analysis (CUE)"],
    fasting: "confirm",
    idealFor: ["First-time health screening", "Young adults on a budget", "Quick pre-consultation workup"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Caspian Essential Checkup (₹899).",
    related: ["p:full-body-checkup-hyderabad", "t:cbc-test-hyderabad", "t:tsh-test-hyderabad"]
  },
  {
    slug: "comprehensive-diabetes-screening-hyderabad",
    name: "Comprehensive Diabetes Screening",
    price: 899,
    tagline: "Know your sugar control",
    desc: "Diabetes screening package in Hyderabad at ₹899 — HbA1c, lipid profile, serum creatinine and urine albumin/creatinine ratio (UACR). Designed by a diabetologist. Free home collection above ₹500.",
    about: [
      "This screening panel checks the four numbers that matter most in diabetes care: HbA1c (your three-month average sugar), cholesterol, kidney function (creatinine) and early kidney damage (urine albumin/creatinine ratio, UACR).",
      "Caspian is led by a diabetologist, and this panel mirrors what we monitor in clinic: not just sugar control, but the heart and kidney complications diabetes can silently cause."
    ],
    includes: ["HbA1c (Glycated Haemoglobin)", "Lipid Profile", "Serum Creatinine", "Urine Albumin/Creatinine Ratio (UACR)"],
    fasting: "no",
    idealFor: ["People living with diabetes — recommended every 3–6 months", "Prediabetes or family history of diabetes", "Annual complication screening"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Comprehensive Diabetes Screening (₹899).",
    related: ["t:hba1c-test-hyderabad", "t:blood-sugar-test-hyderabad", "t:serum-creatinine-test-hyderabad", "t:lipid-profile-test-hyderabad"]
  },
  {
    slug: "thyroid-profile-test-hyderabad",
    name: "Thyroid Profile (T3, T4, TSH)",
    price: 470,
    tagline: "Complete thyroid check",
    desc: "Thyroid profile test in Hyderabad at ₹470 — T3, T4 and TSH from a single blood sample. Same-day reports on WhatsApp. Free home sample collection above ₹500.",
    about: [
      "The thyroid profile measures the three key thyroid numbers — T3, T4 and TSH — from a single blood sample, giving a complete picture of whether your thyroid is underactive (hypothyroid), overactive (hyperthyroid) or normal.",
      "Thyroid problems are extremely common — especially in women — and cause tiredness, weight change, hair fall, irregular periods and mood changes that are easy to miss."
    ],
    includes: ["T3 — Total Tri-iodothyronine", "T4 — Total Thyroxine", "TSH — Thyroid Stimulating Hormone"],
    fasting: "no",
    idealFor: ["Tiredness, weight gain or hair fall", "Irregular periods or fertility concerns", "Monitoring thyroid medication (as advised)"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Thyroid Profile (₹470).",
    related: ["t:tsh-test-hyderabad", "p:full-body-checkup-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "metabolic-wellness-inbody-hyderabad",
    name: "Metabolic Wellness + InBody",
    price: 1795,
    tagline: "Full body checkup + body composition",
    desc: "Metabolic wellness package in Hyderabad at ₹1,795 — every Full Body Check Up test plus InBody body-composition analysis mapping fat, muscle and metabolism. At Caspian Diagnostic Centre, Vijay Nagar.",
    about: [
      "This package combines our complete Full Body Check Up (60+ blood and urine parameters) with an InBody body-composition analysis — a quick, painless scan that maps your body fat, muscle mass, and metabolic profile.",
      "Blood tests tell you what is happening inside; the InBody scan tells you what your weight is actually made of. Together they are ideal for weight-loss programmes, fitness goals and metabolic health tracking — an approach designed by our obesity specialist."
    ],
    includes: ["Everything in the Full Body Check Up", "InBody body-composition analysis", "Fat, muscle & metabolic mapping"],
    fasting: "yes",
    idealFor: ["Weight-loss or fitness programmes", "Tracking metabolic health over time", "Anyone curious what their weight is made of"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Metabolic Wellness Checkup (₹1,795).",
    related: ["p:full-body-checkup-hyderabad", "t:hba1c-test-hyderabad", "p:comprehensive-diabetes-screening-hyderabad"]
  },
  {
    slug: "womens-health-checkup-hyderabad",
    name: "Women's Health Profile",
    price: 3000,
    tagline: "Tailored for women",
    desc: "Women's health checkup in Hyderabad at ₹3,000 — iron studies, vitamins D & B12, folic acid, calcium, CA-125, kidney & lipid profile, sugar and urine analysis. Free home collection above ₹500.",
    about: [
      "The Women's Health Profile screens the conditions that most commonly affect women — iron-deficiency anaemia, vitamin D and B12 deficiency, bone health markers, cholesterol and kidney function — plus CA-125, a marker used in ovarian health assessment.",
      "Anaemia and vitamin deficiencies are widespread among Indian women and often go unnoticed for years behind everyday tiredness. A yearly panel like this catches them early, when they are easiest to correct."
    ],
    includes: ["Lipid Profile", "Kidney Function Test (KFT)", "Iron Studies (Iron, TIBC, Transferrin)", "Folic Acid", "Vitamin D (25-OH)", "Vitamin B12", "Serum Calcium", "Fasting Blood Sugar", "CA-125", "Complete Urine Analysis (CUE)"],
    fasting: "yes",
    idealFor: ["Tiredness, hair fall or heavy periods", "Annual screening for women 30+", "Bone and vitamin health after pregnancy or menopause"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Women's Health package (₹3,000).",
    related: ["t:ferritin-test-hyderabad", "t:vitamin-d-test-hyderabad", "t:vitamin-b12-test-hyderabad", "p:thyroid-profile-test-hyderabad"]
  },
  {
    slug: "senior-citizen-health-checkup-hyderabad",
    name: "Senior Citizen Health Check",
    price: 3500,
    tagline: "Complete elder-care check (Male / Female)",
    desc: "Senior citizen health checkup in Hyderabad at ₹3,500 — sugar & HbA1c, lipid & kidney profile, iron studies, vitamins D & B12, calcium, PSA (men) and urine tests. Home collection available.",
    about: [
      "A comprehensive annual panel designed for adults 60 and above, covering the areas that matter most with age: sugar control (HbA1c and fasting sugar), heart risk (lipids), kidney function, anaemia (iron studies and folic acid), bone health (vitamin D, calcium) and — for men — prostate screening (PSA).",
      "Separate male and female versions are available at the same price. Home sample collection makes it easy for elders who prefer not to travel — our phlebotomist visits at a time that suits the family."
    ],
    includes: ["HbA1c & Fasting Sugar", "Lipid Profile", "Kidney Function Test (KFT)", "Iron Studies & Folic Acid", "Vitamin D & Vitamin B12", "Serum Calcium", "PSA (men) / relevant markers", "Urine ACR & Complete Urine Analysis"],
    fasting: "yes",
    idealFor: ["Adults 60+ due for an annual check", "Elders on long-term medication", "Families arranging home-collection checkups for parents"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Senior Citizen Health Check (₹3,500). Please note male/female version needed.",
    related: ["p:full-body-checkup-hyderabad", "t:psa-test-hyderabad", "t:vitamin-d-test-hyderabad", "p:heart-health-checkup-hyderabad"]
  },
  {
    slug: "heart-health-checkup-hyderabad",
    name: "Heart Health Check",
    price: 999,
    tagline: "Cardiologist-led · ECG + 2D Echo + consult",
    desc: "Heart health checkup in Hyderabad at ₹999 — ECG, blood sugar (GRBS), 2D Echo and a consultation with cardiologist Dr Sayyed Muzammil at Caspian, Vijay Nagar Colony.",
    about: [
      "The Heart Health Check bundles the two core cardiac investigations — an ECG and a 2D Echocardiogram — with a blood-sugar check and a face-to-face consultation with our cardiologist, Dr Sayyed Muzammil, who reviews your results the same visit.",
      "At ₹999 including the specialist consult, it is one of the most accessible cardiac screening packages in Hyderabad — recommended if you have high BP, diabetes, chest discomfort, breathlessness, or a family history of heart disease."
    ],
    includes: ["ECG (Electrocardiogram)", "GRBS (blood sugar)", "2D Echocardiogram", "Consultation with Dr Sayyed Muzammil (Cardiologist)"],
    fasting: "no",
    idealFor: ["High blood pressure or diabetes", "Chest discomfort, palpitations or breathlessness", "Family history of heart disease", "Fitness clearance before starting exercise"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Heart Health Check (₹999).",
    ekaLink: "https://www.eka.care/doctor/dr-sayyed-muzammil-physician-cardiologist",
    homeCollection: false,
    related: ["t:lipid-profile-test-hyderabad", "t:hba1c-test-hyderabad", "p:senior-citizen-health-checkup-hyderabad"]
  },
  {
    slug: "premium-health-checkup-men-hyderabad",
    name: "Premium Health Check — Men 45+",
    price: 4399,
    tagline: "Our most thorough package",
    desc: "Premium men's health checkup in Hyderabad at ₹4,399 — advanced lipids (ApoA1/ApoB, Lp(a)), HsCRP cardiac risk, PSA, HbA1c, liver, kidney, vitamins, cortisol and more. For men 45 and above.",
    about: [
      "Our most thorough screening package, built for men 45 and above. Beyond the standard full-body panel, it adds advanced cardiac-risk markers — Apolipoprotein A1 and B, Lipoprotein(a) and high-sensitivity CRP — plus prostate screening (PSA), cortisol, amylase and rheumatoid factor.",
      "These advanced lipid markers can reveal inherited heart risk that a routine cholesterol test misses — particularly relevant for South Asian men, who face higher cardiac risk at younger ages."
    ],
    includes: ["CBC, ESR & HbA1c", "Full Lipid Profile + ApoA1/ApoB + Lp(a)", "HsCRP (cardiac risk)", "Liver & Kidney Function", "PSA (prostate)", "Vitamin D & B12", "Cortisol & Amylase", "Rheumatoid Factor", "Complete Urine Analysis"],
    fasting: "yes",
    idealFor: ["Men 45+ due for a thorough annual check", "Strong family history of early heart disease", "Executives wanting a single comprehensive screen"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Premium Health Check for Men 45+ (₹4,399).",
    related: ["p:heart-health-checkup-hyderabad", "t:psa-test-hyderabad", "p:full-body-checkup-hyderabad"]
  },
  {
    slug: "haj-umrah-fitness-package-hyderabad",
    name: "Haj / Umrah Fitness Package",
    price: 500,
    tagline: "Pilgrim medical fitness package",
    desc: "Haj and Umrah medical fitness package in Hyderabad at ₹500 — CBC, blood sugar, kidney function, ECG, chest X-ray and blood grouping for pilgrims at Caspian Diagnostic Centre.",
    about: [
      "A compact fitness panel for pilgrims preparing for Haj or Umrah — covering the essential checks: blood counts, sugar, kidney function, an ECG, a chest X-ray and blood grouping (ABO & Rh).",
      "The full package is completed in a single visit to our centre in Vijay Nagar Colony, with reports delivered on WhatsApp — handy for travel documentation and peace of mind before the journey."
    ],
    includes: ["Complete Blood Count (CBC)", "Blood Sugar (Random)", "Kidney Function Test", "ECG", "Chest X-ray", "Blood Group (ABO & Rh)"],
    fasting: "no",
    idealFor: ["Pilgrims preparing for Haj or Umrah", "Group bookings for travelling families", "Pre-travel fitness certification workup"],
    waText: "Hi Caspian Diagnostic Centre, I'd like to book the Haj/Umrah Fitness package (₹500).",
    homeCollection: false,
    related: ["t:chest-x-ray-hyderabad", "t:blood-group-test-hyderabad", "t:cbc-test-hyderabad"]
  }
];

/* ------------------------------------------------------------------ */
/* Test data                                                           */
/* ------------------------------------------------------------------ */

const TESTS = [
  {
    slug: "hba1c-test-hyderabad", name: "HbA1c Test (Glycated Haemoglobin)", short: "HbA1c", price: 600, sample: "Blood", fasting: "no",
    desc: "HbA1c test in Hyderabad at ₹600 — measures your average blood sugar over the past 3 months. No fasting needed. Same-day report on WhatsApp from Caspian Diagnostic Centre.",
    about: [
      "HbA1c (glycated haemoglobin) shows your average blood sugar over the past two to three months — a far more reliable picture of sugar control than a single day's reading.",
      "It is the test doctors use both to diagnose diabetes and prediabetes and to track how well treatment is working. As a diabetologist-led lab, HbA1c is one of our most-run tests."
    ],
    whoShould: ["People with diabetes — usually every 3 months", "Anyone with prediabetes or a family history of diabetes", "Symptoms like excessive thirst, frequent urination or unexplained weight loss"],
    related: ["p:comprehensive-diabetes-screening-hyderabad", "t:blood-sugar-test-hyderabad", "t:lipid-profile-test-hyderabad"]
  },
  {
    slug: "blood-sugar-test-hyderabad", name: "Blood Sugar Test (Fasting / PP / Random)", short: "Blood Sugar", price: 80, sample: "Blood", fasting: "depends",
    desc: "Blood sugar test in Hyderabad at ₹80 — fasting (FBS), post-prandial (PPBS) or random (RBS) glucose. Quick same-day reports at Caspian Diagnostic Centre or with home collection.",
    about: [
      "Blood glucose can be measured three ways: fasting (FBS, after 8–12 hours without food), post-prandial (PPBS, 2 hours after a meal) and random (RBS, any time). Each costs ₹80.",
      "Fasting and post-prandial sugars together show how your body handles food, and are commonly ordered as a pair. For a three-month average, see the HbA1c test."
    ],
    whoShould: ["Routine diabetes screening and monitoring", "Symptoms of high or low sugar", "As part of pre-operative or annual checkups"],
    faqExtra: [["What is the difference between FBS, PPBS and RBS?", "FBS is taken after an overnight fast, PPBS exactly 2 hours after a meal, and RBS at any time of day. Your doctor may ask for one or a combination — our team can guide you when you book."]],
    related: ["t:hba1c-test-hyderabad", "p:comprehensive-diabetes-screening-hyderabad"]
  },
  {
    slug: "cbc-test-hyderabad", name: "Complete Blood Count (CBC)", short: "CBC", price: 350, sample: "Blood", fasting: "no",
    desc: "CBC test in Hyderabad at ₹350 — complete blood count covering haemoglobin, RBC, WBC and platelets. Same-day report on WhatsApp. Free home collection above ₹500.",
    about: [
      "The Complete Blood Count is the most commonly ordered blood test in medicine. It counts your red cells, white cells and platelets, and measures haemoglobin — screening for anaemia, infection, and many other conditions in one go.",
      "It is the starting point for investigating fever, fatigue, weakness, unusual bruising, or as part of any routine checkup."
    ],
    whoShould: ["Fever or suspected infection", "Tiredness, weakness or pale skin (anaemia)", "Routine annual screening"],
    related: ["t:esr-test-hyderabad", "t:crp-test-hyderabad", "p:full-body-checkup-hyderabad"]
  },
  {
    slug: "tsh-test-hyderabad", name: "TSH Test (Thyroid Stimulating Hormone)", short: "TSH", price: 350, sample: "Blood", fasting: "no",
    desc: "TSH test in Hyderabad at ₹350 — the single best screening test for thyroid function. Same-day report on WhatsApp from Caspian Diagnostic Centre, Vijay Nagar.",
    about: [
      "TSH is the single most sensitive screening test for thyroid problems. A high TSH usually points to an underactive thyroid (hypothyroidism); a low TSH to an overactive one (hyperthyroidism).",
      "If your TSH is abnormal, your doctor may follow up with the full thyroid profile (T3, T4 and TSH) — available here at ₹470."
    ],
    whoShould: ["Tiredness, weight change or hair fall", "Monitoring thyroid medication doses", "Fertility or menstrual irregularity workup"],
    related: ["p:thyroid-profile-test-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "lipid-profile-test-hyderabad", name: "Lipid Profile (Cholesterol Test)", short: "Lipid Profile", price: 450, sample: "Blood", fasting: "yes",
    desc: "Lipid profile test in Hyderabad at ₹450 — total cholesterol, HDL, LDL and triglycerides. Fasting sample, same-day report. Free home collection above ₹500.",
    about: [
      "The lipid profile measures the fats in your blood: total cholesterol, HDL (protective cholesterol), LDL (the artery-clogging kind) and triglycerides — together the standard assessment of heart-disease risk.",
      "High cholesterol has no symptoms; the only way to know is to test. Indian guidelines suggest adults check their lipids regularly from their 20s onwards, more often with diabetes, high BP or family history."
    ],
    whoShould: ["Adults screening heart-disease risk", "People with diabetes or high blood pressure", "Monitoring statin (cholesterol medicine) treatment"],
    related: ["p:heart-health-checkup-hyderabad", "t:hba1c-test-hyderabad", "p:full-body-checkup-hyderabad"]
  },
  {
    slug: "liver-function-test-hyderabad", name: "Liver Function Test (LFT)", short: "LFT", price: 450, sample: "Blood", fasting: "confirm",
    desc: "Liver function test (LFT) in Hyderabad at ₹450 — bilirubin, SGPT, SGOT, ALP, protein and albumin. Same-day report on WhatsApp. Free home collection above ₹500.",
    about: [
      "The LFT panel measures bilirubin, liver enzymes (SGPT/ALT, SGOT/AST, ALP), total protein and albumin — together showing how well your liver is working and whether it is inflamed or damaged.",
      "It is ordered for jaundice, suspected fatty liver, alcohol-related concerns, medication monitoring, and as part of routine checkups — fatty liver is increasingly common alongside diabetes and obesity."
    ],
    whoShould: ["Yellowing of eyes/skin, dark urine or abdominal pain", "Fatty liver follow-up or alcohol-related screening", "People on long-term medication that affects the liver"],
    related: ["t:kidney-function-test-hyderabad", "p:full-body-checkup-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "kidney-function-test-hyderabad", name: "Kidney Function Test (KFT)", short: "KFT", price: 400, sample: "Blood", fasting: "confirm",
    desc: "Kidney function test (KFT) in Hyderabad at ₹400 — urea, creatinine and electrolytes (sodium, potassium, chloride). Same-day report. Free home collection above ₹500.",
    about: [
      "The KFT panel measures urea, creatinine and key electrolytes (sodium, potassium, chloride) — the standard screen of how well your kidneys are filtering waste and balancing salts.",
      "Diabetes and high blood pressure are the two biggest causes of kidney damage in India, and early damage is silent — which is why regular KFT screening matters for anyone with either condition."
    ],
    whoShould: ["People with diabetes or high blood pressure", "Swelling of feet, reduced urine output or frothy urine", "Before starting certain medications, as advised"],
    related: ["t:serum-creatinine-test-hyderabad", "t:electrolytes-test-hyderabad", "t:urine-routine-test-hyderabad"]
  },
  {
    slug: "vitamin-d-test-hyderabad", name: "Vitamin D Test (25-OH)", short: "Vitamin D", price: 1350, sample: "Blood", fasting: "no",
    desc: "Vitamin D (25-hydroxy) test in Hyderabad at ₹1,350 — checks vitamin D deficiency, a leading cause of bone pain and fatigue. No fasting needed. Report on WhatsApp.",
    about: [
      "The 25-hydroxy vitamin D test is the standard way to measure your body's vitamin D stores. Deficiency is remarkably common in India despite abundant sunshine — indoor lifestyles and limited sun exposure are the usual culprits.",
      "Low vitamin D contributes to bone and back pain, muscle aches, fatigue and weakened bones (osteoporosis). Testing before supplementing helps your doctor pick the right dose."
    ],
    whoShould: ["Bone pain, back pain or muscle aches", "Fatigue or low mood", "Post-menopausal women and elders (bone health)"],
    related: ["t:calcium-test-hyderabad", "t:vitamin-b12-test-hyderabad", "p:womens-health-checkup-hyderabad"]
  },
  {
    slug: "vitamin-b12-test-hyderabad", name: "Vitamin B12 Test", short: "Vitamin B12", price: 800, sample: "Blood", fasting: "no",
    desc: "Vitamin B12 test in Hyderabad at ₹800 — checks B12 deficiency, a common cause of fatigue, tingling and anaemia, especially in vegetarians. Report on WhatsApp same day.",
    about: [
      "Vitamin B12 is essential for nerves and blood formation. Deficiency is especially common in vegetarians (B12 comes mainly from animal foods) and in people on long-term acidity or diabetes medication.",
      "Symptoms build slowly: tiredness, tingling or numbness in hands and feet, memory issues and anaemia. A simple blood test confirms it, and treatment is straightforward."
    ],
    whoShould: ["Vegetarians and vegans", "Tingling/numbness in hands or feet", "Long-term users of acidity (PPI) or metformin medicines"],
    related: ["t:vitamin-d-test-hyderabad", "t:cbc-test-hyderabad", "t:ferritin-test-hyderabad"]
  },
  {
    slug: "urine-routine-test-hyderabad", name: "Complete Urine Analysis (CUE)", short: "Urine Routine", price: 200, sample: "Urine", fasting: "no",
    desc: "Complete urine examination (CUE) in Hyderabad at ₹200 — screens urine infection, kidney problems and diabetes-related changes. Same-day report at Caspian Diagnostic Centre.",
    about: [
      "The complete urine examination checks your urine physically, chemically and under the microscope — screening for urinary infection, kidney disease, sugar in urine and more.",
      "It is quick, painless and remarkably informative: burning urination, frequent urination, foul-smelling or cloudy urine, and routine diabetes checks are all common reasons to test."
    ],
    whoShould: ["Burning or frequent urination (suspected UTI)", "Routine diabetes and kidney screening", "Pregnancy-related routine checks"],
    related: ["t:kidney-function-test-hyderabad", "t:blood-sugar-test-hyderabad"]
  },
  {
    slug: "crp-test-hyderabad", name: "CRP Test (C-Reactive Protein)", short: "CRP", price: 550, sample: "Blood", fasting: "no",
    desc: "CRP test in Hyderabad at ₹550 — measures inflammation in the body, used in fever workups and infection monitoring. Same-day report on WhatsApp.",
    about: [
      "C-reactive protein rises quickly when there is inflammation or infection anywhere in the body, making it a useful marker for diagnosing infections and tracking whether treatment is working.",
      "It is commonly ordered alongside CBC and ESR in fever panels, joint pain workups, and post-infection monitoring."
    ],
    whoShould: ["Fever or suspected infection", "Monitoring response to antibiotics", "Joint pain and inflammation workups"],
    related: ["t:esr-test-hyderabad", "t:cbc-test-hyderabad", "t:typhoid-widal-test-hyderabad"]
  },
  {
    slug: "esr-test-hyderabad", name: "ESR Test", short: "ESR", price: 170, sample: "Blood", fasting: "no",
    desc: "ESR test in Hyderabad at ₹170 — erythrocyte sedimentation rate, a simple marker of inflammation used in fever, arthritis and TB workups. Same-day report.",
    about: [
      "The erythrocyte sedimentation rate is a time-tested marker of inflammation. A raised ESR signals that something inflammatory is going on — infection, arthritis, TB or other chronic conditions — and prompts further targeted testing.",
      "It is almost always interpreted together with CBC and CRP rather than alone."
    ],
    whoShould: ["Prolonged or unexplained fever", "Joint pains and suspected arthritis", "TB and chronic infection workups"],
    related: ["t:crp-test-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "serum-creatinine-test-hyderabad", name: "Serum Creatinine Test", short: "Creatinine", price: 250, sample: "Blood", fasting: "no",
    desc: "Serum creatinine test in Hyderabad at ₹250 — the key blood marker of kidney function. Same-day report on WhatsApp. Free home collection above ₹500.",
    about: [
      "Creatinine is a waste product your kidneys filter out; when kidney function drops, blood creatinine rises. It is the single most-used marker of kidney health and the basis for calculating eGFR (your kidney filtration rate).",
      "People with diabetes or high BP should check creatinine at least yearly — kidney damage caught early can often be slowed significantly."
    ],
    whoShould: ["Diabetes or high blood pressure (yearly screening)", "Before scans with contrast dye, as advised", "Monitoring known kidney disease"],
    related: ["t:kidney-function-test-hyderabad", "t:blood-urea-test-hyderabad", "t:urine-routine-test-hyderabad"]
  },
  {
    slug: "uric-acid-test-hyderabad", name: "Uric Acid Test", short: "Uric Acid", price: 160, sample: "Blood", fasting: "confirm",
    desc: "Uric acid test in Hyderabad at ₹160 — checks for gout and high uric acid. Same-day report at Caspian Diagnostic Centre, Vijay Nagar, or with home collection.",
    about: [
      "Uric acid builds up when the body makes too much or excretes too little — and high levels can crystallise in joints, causing gout: sudden, severe pain classically in the big toe.",
      "High uric acid is also linked with kidney stones and often travels with diabetes and obesity, so it is worth checking as part of metabolic screening."
    ],
    whoShould: ["Sudden severe joint pain (classically the big toe)", "History of kidney stones", "Monitoring gout treatment"],
    related: ["t:kidney-function-test-hyderabad", "t:serum-creatinine-test-hyderabad"]
  },
  {
    slug: "blood-urea-test-hyderabad", name: "Blood Urea Test", short: "Blood Urea", price: 160, sample: "Blood", fasting: "no",
    desc: "Blood urea test in Hyderabad at ₹160 — a kidney function marker usually tested along with creatinine. Same-day report on WhatsApp.",
    about: [
      "Urea is a protein-breakdown waste product cleared by the kidneys. Raised urea, read together with creatinine, helps assess kidney function and hydration status.",
      "It is part of every kidney panel and most pre-operative and hospital admission workups."
    ],
    whoShould: ["Kidney function screening with creatinine", "Swelling, reduced urine output or dehydration", "Pre-operative workups"],
    related: ["t:serum-creatinine-test-hyderabad", "t:kidney-function-test-hyderabad"]
  },
  {
    slug: "ferritin-test-hyderabad", name: "Serum Ferritin Test", short: "Ferritin", price: 400, sample: "Blood", fasting: "no",
    desc: "Ferritin test in Hyderabad at ₹400 — measures your body's iron stores, the key test for diagnosing iron-deficiency anaemia. Same-day report on WhatsApp.",
    about: [
      "Ferritin reflects your body's iron stores — low ferritin is the earliest and most specific sign of iron deficiency, often falling well before haemoglobin does.",
      "Iron deficiency is the most common nutritional deficiency in India, particularly in women, and shows up as tiredness, hair fall, breathlessness on climbing stairs and pale skin."
    ],
    whoShould: ["Women with heavy periods or hair fall", "Low haemoglobin on a CBC", "Unexplained fatigue"],
    related: ["t:cbc-test-hyderabad", "p:womens-health-checkup-hyderabad", "t:vitamin-b12-test-hyderabad"]
  },
  {
    slug: "blood-group-test-hyderabad", name: "Blood Group Test (ABO & Rh)", short: "Blood Group", price: 160, sample: "Blood", fasting: "no",
    desc: "Blood group test in Hyderabad at ₹160 — ABO and Rh typing with same-day certificate-ready report. Walk in any time, we're open 24/7.",
    about: [
      "ABO and Rh typing determines your blood group — needed for pregnancy records, surgery, blood donation, visa/travel documentation, and simply for everyone to know.",
      "It is a quick test with a same-day report you can keep on record."
    ],
    whoShould: ["Pregnancy registration and antenatal records", "Pre-operative and admission requirements", "Travel, visa or ID documentation"],
    related: ["t:cbc-test-hyderabad", "p:haj-umrah-fitness-package-hyderabad"]
  },
  {
    slug: "beta-hcg-test-hyderabad", name: "Beta HCG Test (Pregnancy)", short: "Beta HCG", price: 950, sample: "Blood", fasting: "no",
    desc: "Beta HCG blood test in Hyderabad at ₹950 — the most sensitive pregnancy test, quantifying the pregnancy hormone. Confidential same-day report on WhatsApp.",
    about: [
      "The beta HCG blood test measures the exact level of the pregnancy hormone — far more sensitive than urine kits, detecting pregnancy earlier and tracking how levels rise in early pregnancy.",
      "Doctors also use serial beta HCG values to monitor early-pregnancy health. Reports are handled confidentially and delivered directly to you."
    ],
    whoShould: ["Early pregnancy confirmation", "Serial monitoring advised by your gynaecologist", "Before certain medical procedures"],
    related: ["p:womens-health-checkup-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "psa-test-hyderabad", name: "PSA Test (Prostate)", short: "PSA", price: 1200, sample: "Blood", fasting: "no",
    desc: "PSA test in Hyderabad at ₹1,200 — prostate-specific antigen screening for men, usually from age 50 (earlier with family history). Same-day report on WhatsApp.",
    about: [
      "Prostate-specific antigen is a blood marker used to screen for prostate enlargement and prostate cancer in men — typically from age 50, or earlier with a family history.",
      "A raised PSA does not by itself mean cancer — infections and benign enlargement also raise it — but it tells your doctor whether further evaluation is needed."
    ],
    whoShould: ["Men 50+ for routine screening", "Urinary difficulty — weak stream, frequent night urination", "Family history of prostate cancer (screen earlier)"],
    related: ["p:premium-health-checkup-men-hyderabad", "p:senior-citizen-health-checkup-hyderabad", "t:urine-routine-test-hyderabad"]
  },
  {
    slug: "dengue-test-hyderabad", name: "Dengue Test (NS1, IgG & IgM)", short: "Dengue Profile", price: 2000, sample: "Blood", fasting: "no",
    desc: "Dengue test in Hyderabad at ₹2,000 — NS1 antigen with IgG & IgM antibodies to detect dengue at any stage of fever. Urgent same-day reports; open 24/7.",
    about: [
      "Our dengue profile combines the NS1 antigen (positive in the first days of fever) with IgM and IgG antibodies (which rise later) — so dengue can be detected whatever day of illness you test on.",
      "During monsoon season, early confirmation matters: it tells your doctor to monitor platelets and hydration closely. We are open 24/7 for urgent fever testing."
    ],
    whoShould: ["High fever with body ache, headache or rash", "Fever during monsoon/dengue season", "Platelet monitoring alongside CBC"],
    faqExtra: [["Which dengue test is right for my fever day?", "NS1 antigen is most useful in the first 1–5 days of fever; IgM/IgG antibodies from day 4–5 onwards. Our profile includes all three, so timing doesn't matter — one sample covers every stage."]],
    related: ["t:cbc-test-hyderabad", "t:malaria-test-hyderabad", "t:typhoid-widal-test-hyderabad"]
  },
  {
    slug: "malaria-test-hyderabad", name: "Malaria Test (Profile)", short: "Malaria", price: 500, sample: "Blood", fasting: "no",
    desc: "Malaria test in Hyderabad at ₹500 — smear and antigen testing for falciparum and vivax malaria. Urgent same-day fever testing, open 24/7.",
    about: [
      "Our malaria profile identifies malaria parasites (both falciparum and vivax) by smear examination and antigen detection — confirming not just whether you have malaria, but which type, since treatment differs.",
      "Malaria fever classically comes in cycles with chills and sweating. Because falciparum malaria can turn serious quickly, we run fever tests around the clock."
    ],
    whoShould: ["Fever with chills and sweating episodes", "Fever after travel to malaria-prone areas", "Fever panels together with dengue and typhoid"],
    related: ["t:dengue-test-hyderabad", "t:typhoid-widal-test-hyderabad", "t:cbc-test-hyderabad"]
  },
  {
    slug: "typhoid-widal-test-hyderabad", name: "Typhoid Test (Widal)", short: "Widal", price: 180, sample: "Blood", fasting: "no",
    desc: "Widal typhoid test in Hyderabad at ₹180 — quick screening for typhoid fever. Same-day report; comprehensive typhoid profile also available. Open 24/7.",
    about: [
      "The Widal test screens for antibodies against the typhoid bacteria — a quick, affordable first-line test when fever has lasted several days, especially with abdominal discomfort or loss of appetite.",
      "For more definitive answers, a comprehensive typhoid profile (₹2,000) including newer antibody tests is also available; our team can advise which suits your fever duration."
    ],
    whoShould: ["Fever lasting more than 3–4 days", "Fever with abdominal pain or poor appetite", "Suspected water/food-borne infection"],
    related: ["t:dengue-test-hyderabad", "t:malaria-test-hyderabad", "t:crp-test-hyderabad"]
  },
  {
    slug: "electrolytes-test-hyderabad", name: "Electrolyte Profile (Na / K / Cl)", short: "Electrolytes", price: 200, sample: "Blood", fasting: "no",
    desc: "Serum electrolytes test in Hyderabad at ₹200 — sodium, potassium and chloride levels. Important for elders, BP patients and dehydration. Same-day report.",
    about: [
      "The electrolyte panel measures sodium, potassium and chloride — salts that keep your heart rhythm, nerves and fluid balance working. Imbalances are common with vomiting, diarrhoea, kidney problems and certain BP medicines (diuretics).",
      "Low sodium in particular is a frequent, under-recognised cause of weakness and confusion in elders."
    ],
    whoShould: ["Elders with weakness, confusion or low intake", "People on diuretics or BP medication", "Vomiting, diarrhoea or dehydration"],
    related: ["t:kidney-function-test-hyderabad", "t:serum-creatinine-test-hyderabad"]
  },
  {
    slug: "calcium-test-hyderabad", name: "Serum Calcium Test", short: "Calcium", price: 160, sample: "Blood", fasting: "no",
    desc: "Serum calcium test in Hyderabad at ₹160 — checks calcium levels for bone health, often tested with vitamin D. Same-day report on WhatsApp.",
    about: [
      "Serum calcium reflects the calcium available in your blood — essential for bones, muscles and nerves. It is usually interpreted together with vitamin D, which controls calcium absorption.",
      "Both low and high calcium cause problems: cramps, tingling and weak bones on one side; kidney stones and other issues on the other."
    ],
    whoShould: ["Bone pain or muscle cramps", "With vitamin D testing for bone health", "Kidney stone workups"],
    related: ["t:vitamin-d-test-hyderabad", "p:womens-health-checkup-hyderabad"]
  },
  {
    slug: "chest-x-ray-hyderabad", name: "Chest X-ray (PA / AP view)", short: "Chest X-ray", price: 300, sample: "Imaging — done at our centre", fasting: "no",
    desc: "Digital chest X-ray in Hyderabad at ₹300 — for cough, fever, TB screening and pre-op checks. Same-day film & report. Portable home chest X-ray available at ₹2,000.",
    about: [
      "Our digital chest X-ray (PA or AP view) is the most-requested imaging test — used for persistent cough, fever, breathlessness, TB screening and pre-operative fitness. Film and report are delivered the same day.",
      "Can't travel? We also offer a portable chest X-ray at home (₹2,000) — our visiting X-ray team brings the equipment to your bedside, ideal for elderly or bedridden patients. Caspian is a PCPNDT-registered imaging centre."
    ],
    whoShould: ["Persistent cough or breathlessness", "TB screening and fever workups", "Pre-operative and employment fitness checks"],
    faqExtra: [["Can I get a chest X-ray at home?", "Yes — a portable chest X-ray at home is available for ₹2,000 across Hyderabad. Our visiting team brings portable equipment to your bedside; ideal for elderly, bedridden or post-surgery patients. Message us on WhatsApp to schedule."]],
    homeCollection: false,
    related: ["p:haj-umrah-fitness-package-hyderabad", "t:cbc-test-hyderabad", "t:esr-test-hyderabad"]
  }
];

/* ------------------------------------------------------------------ */
/* Home-collection page data                                           */
/* ------------------------------------------------------------------ */

const HOME_PAGE = {
  slug: "home-sample-collection-hyderabad",
  title: "Home Sample Collection in Hyderabad — Free Above ₹500 | Caspian Diagnostic Centre",
  h1: "Home Sample Collection in Hyderabad",
  desc: "Book blood test home collection in Hyderabad. Trained phlebotomists visit your home, free on orders above ₹500. Reports on WhatsApp. Call or WhatsApp +91 90593 41154."
};

/* ------------------------------------------------------------------ */
/* Shared template                                                     */
/* ------------------------------------------------------------------ */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
function inr(n) { return "₹" + n.toLocaleString("en-IN"); }
function waLink(text) { return WA + "?text=" + encodeURIComponent(text); }

function findRef(ref) {
  const [kind, slug] = ref.split(":");
  if (kind === "p") { const p = PACKAGES.find(x => x.slug === slug); return p && { href: "/packages/" + p.slug, label: p.name }; }
  const t = TESTS.find(x => x.slug === slug); return t && { href: "/tests/" + t.slug, label: t.short + " Test" };
}

function fastingText(f) {
  if (f === "yes") return "Yes — 8–12 hours of fasting is recommended. Water is fine. Book a morning slot and our team will remind you the evening before.";
  if (f === "no") return "No special preparation or fasting is needed. You can give this sample at any time of day.";
  if (f === "depends") return "Fasting sugar (FBS) needs 8–12 hours of fasting; post-prandial (PPBS) is taken exactly 2 hours after a meal; random (RBS) needs no preparation. Our team will guide you when you book.";
  return "Fasting is sometimes advised depending on the tests your doctor ordered — our team will confirm exactly what to do when you book.";
}

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
.note{background:#eaf3fb;border:1px solid #cfe1f1;border-radius:10px;padding:12px 16px;margin:14px 0;font-size:14px}
footer{background:var(--blue-dark);color:#cde2f2;margin-top:34px;padding:30px 0 22px;font-size:13px}
footer .w{max-width:900px;margin:0 auto;padding:0 20px}
footer .legal{color:#fff;font-weight:700;margin-bottom:4px}
footer .links{display:flex;flex-wrap:wrap;gap:6px 16px;margin:14px 0 12px}
footer .links a{color:#cde2f2}
footer .fine{color:#9cc0dd;line-height:1.6}`;

function pageShell({ title, desc, canonical, breadcrumbHtml, heroH1, heroSub, bodyHtml, ld }) {
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
<meta property="og:image" content="${BASE}/ogimage.png">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
${ldTags}
<style>${CSS}</style></head><body>
<div class="top"><div class="w"><span>\u{1F4CD} 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad 500057</span><span>\u{1F557} Open 24/7 · \u{1F4DE} <a href="tel:${PHONE_TEL}" style="color:#eaf3fb">${PHONE_DISPLAY}</a></span></div></div>
<header><div class="w">
  <a class="brand" href="/"><svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#0A5C9E"/><path d="M24 10c5 6 8 10 8 14.5A8 8 0 0 1 16 24.5C16 20 19 16 24 10Z" fill="#fff"/><circle cx="24" cy="25" r="3.4" fill="#14B8A6"/></svg><span><b>Caspian</b><span>Diagnostic Centre</span></span></a>
  <a class="home" href="/">&larr; Back to site</a>
</div></header>
<nav class="crumbs" aria-label="Breadcrumb">${breadcrumbHtml}</nav>
<div class="hero"><div class="w"><h1>${esc(heroH1)}</h1><p>${esc(heroSub)}</p></div></div>
<main>${bodyHtml}</main>
<footer><div class="w">
  <div class="legal">Caspian Lifesciences Private Limited</div>
  <div class="fine">Operating as Caspian Diagnostic Centre · 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad, Telangana 500057</div>
  <div class="links"><a href="/">Home</a><a href="/home-sample-collection-hyderabad">Home Collection</a><a href="/about.html">About Us</a><a href="/pricing.html">Pricing</a><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/refund.html">Refund Policy</a><a href="/contact.html">Contact Us</a></div>
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
function relatedBlock(refs) {
  const links = (refs || []).map(findRef).filter(Boolean);
  if (!links.length) return "";
  return `<h2>Related tests &amp; packages</h2><div class="rel">${links.map(l => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</div>`;
}
function sideCard({ price, priceNote, waText, ekaLink, homeCollection }) {
  const wa = `<a class="btn btn-wa" href="${waLink(waText)}" target="_blank" rel="noopener">\u{1F4AC} Book on WhatsApp</a>`;
  const eka = ekaLink ? `<a class="btn btn-blue" href="${ekaLink}" target="_blank" rel="noopener">Book cardiologist slot</a>` : "";
  return `<aside class="side">
<div class="price-lbl">Price</div>
<div class="price">${inr(price)}</div>
<div class="meta">${priceNote}</div>
${eka}${wa}
<a class="btn btn-blue" href="/#all-tests">Book online</a>
<a class="btn btn-line" href="tel:${PHONE_TEL}">\u{1F4DE} Call ${PHONE_DISPLAY}</a>
<div class="fine">${homeCollection === false ? "<span class=\"tick\">✓</span>Done at our centre — Vijay Nagar Colony, open 24/7" : "<span class=\"tick\">✓</span>Free home collection on orders above ₹500"}<br><span class="tick">✓</span>Reports on WhatsApp<br><span class="tick">✓</span>Open 24/7, all days</div>
</aside>`;
}

/* ------------------------------------------------------------------ */
/* Page renderers                                                      */
/* ------------------------------------------------------------------ */

function commonFaqs(name, price, fasting, homeCollection) {
  const faqs = [
    [`How much does the ${name} cost in Hyderabad?`, `The ${name} costs ${inr(price)} at Caspian Diagnostic Centre, Vijay Nagar Colony, Hyderabad. There are no hidden charges, and home collection is free on orders above ₹500.`],
    ["Do I need to fast before this test?", fastingText(fasting)],
    ["When will I get my report?", "Most routine reports are delivered the same day or within 24 hours, directly on WhatsApp. Timing can vary for specialised tests — our team will tell you the expected time when you book."]
  ];
  if (homeCollection === false) {
    faqs.push(["Where is this done?", "At Caspian Diagnostic Centre, 10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad 500057. We are open 24/7 — walk in any time or book a slot on WhatsApp."]);
  } else {
    faqs.push(["Can I book home sample collection?", "Yes — our trained phlebotomists collect samples at your home across Hyderabad, free on orders above ₹500. Choose Home Collection when booking online, or message us on WhatsApp with your area and preferred time."]);
  }
  return faqs;
}

function renderPackage(p) {
  const url = `${BASE}/packages/${p.slug}`;
  const faqs = commonFaqs(p.name + " package", p.price, p.fasting, p.homeCollection).concat(p.faqExtra || []);
  const body = `<div class="grid"><div class="card">
<h2>About this package</h2>
${p.about.map(t => `<p>${esc(t)}</p>`).join("\n")}
<h2>What's included</h2>
<ul class="inc">${p.includes.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Who is this for?</h2>
<ul>${p.idealFor.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Preparation</h2>
<p>${esc(fastingText(p.fasting))}</p>
<div class="note">\u{1F4A1} Not sure if this is the right package? Message us on <a href="${waLink("Hi Caspian Diagnostic Centre, I need help choosing a health package.")}" target="_blank" rel="noopener">WhatsApp</a> — our team (led by practising doctors) will help you choose.</div>
<h2>Frequently asked questions</h2>
${faqBlock(faqs)}
${relatedBlock(p.related)}
</div>
${sideCard({ price: p.price, priceNote: p.tagline, waText: p.waText, ekaLink: p.ekaLink, homeCollection: p.homeCollection })}</div>`;
  return pageShell({
    title: `${p.name} in Hyderabad — ${inr(p.price)} | Caspian Diagnostic Centre`,
    desc: p.desc,
    canonical: url,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="/#packages">Health Packages</a> › ${esc(p.name)}`,
    heroH1: `${p.name} in Hyderabad`,
    heroSub: `${p.tagline} · ${inr(p.price)} · Reports on WhatsApp`,
    bodyHtml: body,
    ld: [
      ldBreadcrumb([["Home", "/"], ["Health Packages", "/#packages"], [p.name, "/packages/" + p.slug]]),
      ldProduct(p.name, p.desc, p.price, url),
      ldFaq(faqs)
    ]
  });
}

function renderTest(t) {
  const url = `${BASE}/tests/${t.slug}`;
  const faqs = commonFaqs(t.short + " test", t.price, t.fasting, t.homeCollection).concat(t.faqExtra || []);
  const body = `<div class="grid"><div class="card">
<h2>What does this test check?</h2>
${t.about.map(x => `<p>${esc(x)}</p>`).join("\n")}
<h2>Test details</h2>
<table class="facts">
<tr><td>Price</td><td>${inr(t.price)}</td></tr>
<tr><td>Sample</td><td>${esc(t.sample)}</td></tr>
<tr><td>Fasting</td><td>${t.fasting === "yes" ? "Yes — 8–12 hours" : t.fasting === "no" ? "Not required" : t.fasting === "depends" ? "Depends on type — see FAQ" : "Sometimes — we'll confirm"}</td></tr>
<tr><td>Report</td><td>Same day / within 24 hours, on WhatsApp</td></tr>
<tr><td>${t.homeCollection === false ? "Where" : "Home collection"}</td><td>${t.homeCollection === false ? "At our centre — Vijay Nagar Colony, open 24/7" : "Available across Hyderabad — free on orders above ₹500"}</td></tr>
</table>
<h2>When should you take it?</h2>
<ul>${t.whoShould.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Frequently asked questions</h2>
${faqBlock(faqs)}
${relatedBlock(t.related)}
<div class="note">This page is for general information and is not a substitute for medical advice. Please discuss your reports with your doctor — you can consult our physicians at Caspian Healthcare.</div>
</div>
${sideCard({ price: t.price, priceNote: (t.homeCollection === false ? "At our centre · same-day report" : "Home collection available · same-day report"), waText: `Hi Caspian Diagnostic Centre, I'd like to book the ${t.name} (${inr(t.price)}).`, homeCollection: t.homeCollection })}</div>`;
  return pageShell({
    title: `${t.name} in Hyderabad — ${inr(t.price)} | Caspian Diagnostic Centre`,
    desc: t.desc,
    canonical: url,
    breadcrumbHtml: `<a href="/">Home</a> › <a href="/#all-tests">All Tests</a> › ${esc(t.short)}`,
    heroH1: `${t.name} in Hyderabad`,
    heroSub: `${inr(t.price)} · ${t.fasting === "yes" ? "Fasting required" : t.fasting === "no" ? "No fasting needed" : "Preparation varies"} · Same-day report on WhatsApp`,
    bodyHtml: body,
    ld: [
      ldBreadcrumb([["Home", "/"], ["All Tests", "/#all-tests"], [t.short, "/tests/" + t.slug]]),
      ldMedicalTest(t.name, t.desc, url),
      ldProduct(t.name, t.desc, t.price, url),
      ldFaq(faqs)
    ]
  });
}

function renderHome() {
  const url = `${BASE}/${HOME_PAGE.slug}`;
  const faqs = [
    ["Is home sample collection really free?", "Yes — home collection is free anywhere in our Hyderabad coverage area on orders above ₹500. For smaller orders a small visit charge applies, which our team confirms before booking."],
    ["Which areas of Hyderabad do you cover?", "We collect from homes across Hyderabad, centred on Vijay Nagar Colony, Masab Tank, Mehdipatnam, Asif Nagar and surrounding areas. Message us on WhatsApp with your area and we'll confirm your slot right away."],
    ["How do I prepare for a home visit?", "If your test needs fasting (8–12 hours for fasting sugar or lipid profile), book a morning slot and don't eat after dinner — water is fine. Keep your doctor's prescription handy if you have one. Our phlebotomist carries everything else."],
    ["When will I get my reports?", "Most routine reports are delivered the same day or within 24 hours, directly on WhatsApp — no need to visit the centre."],
    ["Is home collection safe and hygienic?", "Yes — our trained phlebotomists use sterile, single-use equipment for every visit, and samples are transported to our lab under proper conditions for processing."],
    ["Can I get an X-ray or CGM at home too?", "Yes. We offer a portable chest X-ray at home (₹2,000) for patients who can't travel, and CGM (continuous glucose monitor) sensors fitted at home at MRP with no application charge."]
  ];
  const popular = ["t:cbc-test-hyderabad", "t:hba1c-test-hyderabad", "t:tsh-test-hyderabad", "t:lipid-profile-test-hyderabad", "t:vitamin-d-test-hyderabad", "p:full-body-checkup-hyderabad", "p:comprehensive-diabetes-screening-hyderabad", "p:senior-citizen-health-checkup-hyderabad"];
  const body = `<div class="grid"><div class="card">
<h2>Skip the travel — we come to you</h2>
<p>Caspian Diagnostic Centre offers professional blood-sample collection at your home, anywhere in our Hyderabad coverage area. A trained phlebotomist visits at a time that suits you, collects the sample using sterile single-use equipment, and your report arrives on WhatsApp — usually the same day.</p>
<p>Home collection is <b>free on orders above ₹500</b>, and is especially loved by elders, busy families, new mothers and anyone recovering from illness.</p>
<h2>How it works</h2>
<ul>
<li><b>1. Book</b> — message us on WhatsApp, call ${PHONE_DISPLAY}, or book online and choose <em>Home collection</em>.</li>
<li><b>2. We visit</b> — our phlebotomist arrives at your chosen time with everything needed.</li>
<li><b>3. Report on WhatsApp</b> — most reports the same day or within 24 hours.</li>
</ul>
<h2>Beyond blood tests</h2>
<p>We also bring imaging and monitoring home: a <a href="/tests/chest-x-ray-hyderabad">portable chest X-ray at home</a> (₹2,000) for bedridden or elderly patients, and CGM (continuous glucose monitoring) sensors — FreeStyle Libre 2+ and Guardian IV — fitted at home at MRP with no application charge.</p>
<h2>Frequently asked questions</h2>
${faqBlock(faqs)}
<h2>Popular tests booked with home collection</h2>
<div class="rel">${popular.map(findRef).filter(Boolean).map(l => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</div>
</div>
${sideCard({ price: 0, priceNote: "", waText: "Hi Caspian Diagnostic Centre, I'd like to book home sample collection. My area is: ", homeCollection: true }).replace('<div class="price-lbl">Price</div>', '<div class="price-lbl">Home collection</div>').replace(`<div class="price">${inr(0)}</div>`, '<div class="price">FREE</div>').replace('<div class="meta"></div>', '<div class="meta">on orders above ₹500</div>')}</div>`;
  return pageShell({
    title: HOME_PAGE.title,
    desc: HOME_PAGE.desc,
    canonical: url,
    breadcrumbHtml: `<a href="/">Home</a> › Home Sample Collection`,
    heroH1: HOME_PAGE.h1,
    heroSub: "Free on orders above ₹500 · Trained phlebotomists · Reports on WhatsApp",
    bodyHtml: body,
    ld: [
      ldBreadcrumb([["Home", "/"], ["Home Sample Collection", "/" + HOME_PAGE.slug]]),
      ldFaq(faqs)
    ]
  });
}

function render404() {
  return pageShell({
    title: "Page not found | Caspian Diagnostic Centre",
    desc: "The page you were looking for could not be found.",
    canonical: BASE + "/",
    breadcrumbHtml: `<a href="/">Home</a>`,
    heroH1: "Page not found",
    heroSub: "The page you were looking for doesn't exist or has moved.",
    bodyHtml: `<div class="card"><p>Sorry — we couldn't find that page. It may have moved.</p><p><a href="/">← Back to the homepage</a> · <a href="/#all-tests">Search all tests</a> · <a href="/#packages">Health packages</a></p></div>`,
    ld: []
  });
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export default function handler(req, res) {
  const { kind, slug } = req.query || {};
  let html = null;
  let status = 200;

  if (kind === "package") {
    const p = PACKAGES.find(x => x.slug === slug);
    html = p ? renderPackage(p) : null;
  } else if (kind === "test") {
    const t = TESTS.find(x => x.slug === slug);
    html = t ? renderTest(t) : null;
  } else if (kind === "home") {
    html = renderHome();
  }

  if (!html) { html = render404(); status = 404; }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", status === 200 ? "public, s-maxage=3600, stale-while-revalidate=86400" : "no-store");
  res.status(status).send(html);
}
