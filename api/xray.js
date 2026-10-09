// Caspian Diagnostic Centre, X-ray price list page.
// Served at /x-ray via the rewrite in vercel.json (old guesses /x-ray-hyderabad and
// /tests/x-ray-hyderabad redirect here).
// Source of truth for prices: Dr Khizer's final radiology list, 9 Oct 2026
// (63 tests: 1 view Rs 350, 2 views Rs 600, 3 views Rs 850, 4 views Rs 1,200).
// X-ray is not in the Crelio CODE_MAP, so every "Book" button goes to WhatsApp.
//
// NOTE: keep "/x-ray" in api/sitemap.js in sync.
import {
  BASE, PHONE_DISPLAY, PHONE_TEL,
  esc, inr, waLink, photoFig, photoUrl,
  pageShell, ldBreadcrumb, ldFaq, faqBlock
} from "./_shell.js";

const URL = BASE + "/x-ray";
const HOME_XRAY = 2000;

// [code, test name, used for, views, price, extra search words]
const GROUPS = [
  ["Head and neck", [
    ["XR-SKL1", "Skull, AP or Lateral (single view)", "Head injury, swelling or lump on the skull", 1, 350, "head"],
    ["XR-SKL2", "Skull, AP and Lateral", "Head injury, skull shape, bone lesions", 2, 600, "head"],
    ["XR-PNS", "PNS, Water's view", "Sinusitis, blocked nose, facial pain", 1, 350, "sinus paranasal sinusitis waters"],
    ["XR-NPX", "Nasopharynx for adenoids, Lateral", "Snoring, mouth breathing and enlarged adenoids in children", 1, 350, "adenoid child snoring"],
    ["XR-STN", "Soft tissue neck, Lateral", "Swallowed fish bone or object, neck swelling", 1, 350, "neck throat fish bone foreign body"],
    ["XR-MAS", "Mastoids, both sides, Lateral", "Long-standing ear discharge or ear infection", 2, 600, "ear mastoid"]
  ]],
  ["Chest and abdomen", [
    ["XR-CHE1", "Chest, PA or AP", "Cough, fever, breathlessness, TB screening, pre-op and job fitness", 1, 350, "cxr lungs tb pneumonia pre-employment"],
    ["XR-CHEL", "Chest, Lateral (left or right)", "Added view to locate a shadow seen on the front view", 1, 350, "cxr lungs side"],
    ["XR-CHE2", "Chest, PA and Lateral", "Fuller look at the lungs and heart in one visit", 2, 600, "cxr lungs"],
    ["XR-RIB", "Ribs, AP and Oblique", "Rib pain after a fall or injury", 2, 600, "rib fracture chest wall"],
    ["XR-ABD", "Abdomen, AP erect or supine", "Severe tummy pain, vomiting, suspected blockage", 1, 350, "stomach tummy abdomen erect"],
    ["XR-KUB", "KUB (kidneys, ureters, bladder)", "Kidney or ureter stones", 1, 350, "kidney stone urine"]
  ]],
  ["Spine", [
    ["XR-CS1", "Cervical spine, AP or Lateral", "Neck pain, stiffness", 1, 350, "neck spondylosis"],
    ["XR-CS2", "Cervical spine, AP and Lateral", "Neck pain, cervical spondylosis, arm tingling", 2, 600, "neck spondylosis"],
    ["XR-CSFE", "Cervical spine, Flexion and Extension Lateral", "Checks for slipping of neck bones on movement", 2, 600, "neck dynamic instability"],
    ["XR-DS1", "Dorsal spine, AP or Lateral", "Upper or mid back pain", 1, 350, "thoracic back"],
    ["XR-DS2", "Dorsal spine, AP and Lateral", "Upper back pain, posture, compression fracture", 2, 600, "thoracic back"],
    ["XR-DLS", "Dorsolumbar spine, AP and Lateral", "Whole mid and lower back in one visit", 4, 1200, "thoracolumbar back d l spine"],
    ["XR-LS1", "Lumbar spine, AP or Lateral", "Lower back pain", 1, 350, "lower back lbp"],
    ["XR-LS2", "Lumbar spine, AP and Lateral", "Lower back pain, sciatica, disc space narrowing", 2, 600, "lower back lbp sciatica ls spine"],
    ["XR-LSFE", "Lumbar spine, Flexion and Extension Lateral", "Checks for slipping of back bones (listhesis)", 2, 600, "lower back dynamic listhesis"],
    ["XR-SAC", "Sacrum and coccyx, AP and Lateral", "Tailbone pain after a fall", 2, 600, "tailbone coccyx"],
    ["XR-SIJ", "Sacroiliac joints, AP", "Low back and buttock pain, morning stiffness", 1, 350, "si joint sacroiliitis"]
  ]],
  ["Pelvis and hip", [
    ["XR-PEL", "Pelvis AP (includes both hips)", "Hip or groin pain, fall in the elderly, arthritis", 1, 350, "hip pelvis groin"],
    ["XR-HIP1", "Hip, AP or Lateral", "Pain in one hip", 1, 350, "hip"],
    ["XR-HIP2", "Hip, AP and Lateral", "Hip arthritis, injury, avascular necrosis follow-up", 2, 600, "hip avn"],
    ["XR-HIPB", "Both hips, AP and Lateral", "Pain in both hips", 3, 850, "hip both"]
  ]],
  ["Shoulder and arm", [
    ["XR-SHO1", "Shoulder, AP or Axial or Y view", "Shoulder pain or injury", 1, 350, "shoulder"],
    ["XR-SHO2", "Shoulder, AP and Axial", "Frozen shoulder, dislocation, injury", 2, 600, "shoulder frozen dislocation"],
    ["XR-SHOB", "Both shoulders, AP and Axial", "Pain in both shoulders", 4, 1200, "shoulder both"],
    ["XR-CLA", "Clavicle, AP", "Collar bone injury after a fall", 1, 350, "collar bone clavicle fracture"],
    ["XR-HUM", "Humerus, AP and Lateral", "Upper arm injury", 2, 600, "arm upper"],
    ["XR-ELB2", "Elbow, AP and Lateral", "Elbow pain, injury, swelling", 2, 600, "elbow"],
    ["XR-ELBFE", "Elbow, Lateral in Flexion and Extension", "Elbow stiffness, loss of movement", 2, 600, "elbow"],
    ["XR-ELBB", "Both elbows, AP and Lateral", "Pain in both elbows", 4, 1200, "elbow both"],
    ["XR-FOR", "Forearm, AP and Lateral", "Forearm injury", 2, 600, "arm lower radius ulna"]
  ]],
  ["Wrist and hand", [
    ["XR-WR1", "Wrist, PA or Lateral", "Wrist pain", 1, 350, "wrist"],
    ["XR-WR2", "Wrist, PA and Lateral", "Wrist injury, fall on an outstretched hand", 2, 600, "wrist fracture"],
    ["XR-WRB", "Both wrists, PA and Lateral", "Pain in both wrists, arthritis", 4, 1200, "wrist both"],
    ["XR-SCA", "Scaphoid series", "Wrist pain at the base of the thumb after a fall", "series", 600, "scaphoid thumb wrist"],
    ["XR-HD1", "Hand, PA or Oblique", "Hand pain or swelling", 1, 350, "hand"],
    ["XR-HD2", "Hand, PA and Oblique", "Hand injury, finger joint arthritis", 2, 600, "hand"],
    ["XR-HDB", "Both hands, PA", "Rheumatoid arthritis, joint swelling in both hands", 2, 600, "hand both rheumatoid"],
    ["XR-BAGE", "Bone age, left hand and wrist PA", "Child's growth: short or tall stature, early or late puberty", 1, 350, "bone age child growth height paediatric"],
    ["XR-FNG", "Finger, PA and Lateral", "Finger injury", 2, 350, "finger"]
  ]],
  ["Thigh, knee and leg", [
    ["XR-FEM", "Femur, AP and Lateral", "Thigh bone injury or pain", 2, 600, "thigh femur"],
    ["XR-KN1", "Knee, AP or Lateral", "Knee pain (can be taken standing)", 1, 350, "knee"],
    ["XR-KN2", "Knee, AP and Lateral", "Knee pain, injury, osteoarthritis", 2, 600, "knee osteoarthritis"],
    ["XR-KNBAP", "Both knees, AP standing", "Knee arthritis in both knees, joint space", 2, 600, "knee both standing weight bearing"],
    ["XR-KNB", "Both knees, AP and Lateral", "Pain in both knees", 4, 1200, "knee both"],
    ["XR-KNBS", "Both knees standing, AP and Lateral", "Knee osteoarthritis, before a knee replacement opinion", 4, 1200, "knee both standing weight bearing"],
    ["XR-PAT", "Both knees, Skyline (patella) view", "Pain at the front of the knee, kneecap problems", 2, 600, "kneecap patella"],
    ["XR-LEG1", "Leg (tibia and fibula), AP", "Shin pain or injury", 1, 350, "leg shin tibia"],
    ["XR-LEG2", "Leg (tibia and fibula), AP and Lateral", "Shin injury", 2, 600, "leg shin tibia fibula"]
  ]],
  ["Ankle and foot", [
    ["XR-ANK1", "Ankle, AP or Lateral", "Ankle pain", 1, 350, "ankle"],
    ["XR-ANK2", "Ankle, AP and Lateral", "Ankle sprain or twist, injury", 2, 600, "ankle sprain"],
    ["XR-ANKB", "Both ankles, AP and Lateral", "Pain in both ankles", 4, 1200, "ankle both"],
    ["XR-FT1", "Foot, AP or Oblique", "Foot pain", 1, 350, "foot"],
    ["XR-FT2", "Foot, AP and Oblique", "Foot injury, bunion, arthritis", 2, 600, "foot bunion"],
    ["XR-FT3", "Diabetic foot series: AP, Oblique and Lateral", "Foot ulcer, Charcot foot or bone infection in diabetes", 3, 850, "diabetic foot charcot ulcer osteomyelitis diabetes"],
    ["XR-FTB", "Both feet, AP and Oblique", "Pain in both feet", 4, 1200, "foot both"],
    ["XR-CAL", "Calcaneum, Axial and Lateral", "Heel pain, heel spur, heel injury", 2, 600, "heel spur calcaneum"],
    ["XR-TOE", "Toes, AP and Oblique", "Toe injury", 2, 350, "toe"]
  ]]
];
const ALL = GROUPS.flatMap(g => g[1]);

const INCLUDED = [
  "Digital X-ray at our centre in Vijay Nagar Colony",
  "Reported by a radiologist",
  "Report the same day",
  "Report on WhatsApp",
  "Printed film included",
  "Walk in, no appointment needed"
];

const PREP = [
  ["Pregnancy", "If you are pregnant, or might be, tell the technician before the X-ray. Most X-rays can wait, or the belly can be shielded."],
  ["Metal", "Remove jewellery, hair clips, belts and anything with metal over the area being X-rayed. Wear clothes without zips or buttons if you can; a gown is available."],
  ["Children", "One parent can stay with the child. We use a lead apron to protect the rest of the body."],
  ["KUB and abdomen", "Follow your doctor's advice. Some doctors ask you to come on an empty stomach so the bowel does not hide a stone."],
  ["Bring along", "Your doctor's prescription and any old X-rays of the same area, so the radiologist can compare."]
];

const FAQS = [
  ["How much does an X-ray cost at Caspian?", "One view costs ₹350, two views of one part ₹600, a three-view series ₹850 and two views of both sides ₹1,200. A chest X-ray PA view is ₹350. The full list of 63 X-rays and prices is on this page."],
  ["Do I need an appointment?", "No. Walk in to our centre in Vijay Nagar Colony with your prescription. You can also message us on WhatsApp first so we are ready for you."],
  ["When will I get the report?", "The same day. A radiologist reports every X-ray and the report is sent to you on WhatsApp. The printed film is included."],
  ["Which X-ray does my doctor mean by AP, PA, Lateral or Oblique?", "These are the directions the X-ray is taken from: front to back (AP), back to front (PA), from the side (Lateral) or at an angle (Oblique). Most problems need two views, for example knee AP and Lateral. If you are not sure, send us the prescription on WhatsApp and we will tell you which one it is and the price."],
  ["Is an X-ray safe?", "A plain X-ray uses a very small dose of radiation, and only the area being checked is exposed. Tell the technician if you are or may be pregnant."],
  ["Can I get an X-ray at home?", `A portable chest X-ray at home can be arranged for bedridden or elderly patients through our partner radiology team, at ${inr(HOME_XRAY)}. Message us on WhatsApp to arrange it.`],
  ["Which side should I mention, left or right?", "Tell us the side when you book or at the counter. The price is the same for either side; X-rays of both sides are listed separately."]
];

function viewsLabel(n) { return typeof n === "string" ? "Series" : n === 1 ? "1 view" : n + " views"; }

function renderXray() {
  const title = "X-ray Price List in Hyderabad, from ₹350 | Caspian Labs";
  const desc = "Digital X-ray prices in Hyderabad: chest X-ray ₹350, knee, spine, hip, hand, foot and 63 more from ₹350. Radiologist report the same day on WhatsApp. Walk in, Vijay Nagar Colony.";

  const rows = GROUPS.map(([g, tests]) => `<h3 class="xg">${esc(g)}</h3>
<ul class="xl">${tests.map(t => {
    const [code, name, used, views, price, words] = t;
    const k = (name + " " + used + " " + words + " xray x-ray").toLowerCase();
    return `<li data-k="${esc(k)}"><div class="xn"><b>${esc(name)}</b><span>${esc(used)}</span></div><div class="xv">${viewsLabel(views)}</div><div class="xp">${inr(price)}</div><a class="xb" href="${waLink("Hi Caspian Diagnostic Centre, I want an X-ray: " + name + " (" + inr(price) + "). Side (left/right): ")}" target="_blank" rel="noopener" aria-label="Book ${esc(name)} on WhatsApp">Book</a></li>`;
  }).join("")}</ul>`).join("\n");

  const body = `<style>
.xs{width:100%;padding:12px 14px;border:2px solid var(--line);border-radius:10px;font-size:15px;margin:4px 0 6px}
.xs:focus{outline:none;border-color:var(--blue)}
.xg{color:var(--ink);font-size:16px;margin:22px 0 6px;padding-bottom:4px;border-bottom:2px solid var(--line)}
.card .xl{list-style:none;padding:0;margin:0}
.card .xl li{display:grid;grid-template-columns:1fr 64px 70px 64px;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);margin:0}
.xn b{display:block;font-size:14.5px;color:var(--ink)}
.xn span{display:block;font-size:13px;color:var(--muted);line-height:1.45}
.xv{font-size:12.5px;color:var(--muted)}
.xp{font-weight:800;font-size:15px;text-align:right}
.xb{background:var(--wa);color:#fff;border-radius:8px;padding:6px 0;text-align:center;font-weight:700;font-size:13px}
.xb:hover{text-decoration:none;filter:brightness(1.06)}
.xnone{display:none;color:var(--muted);font-size:14px;padding:12px 0}
.xrule{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0 4px}
.xrule div{background:#f2f8fd;border:1px solid var(--line);border-radius:10px;padding:10px;text-align:center;font-size:13px;color:var(--muted)}
.xrule b{display:block;font-size:18px;color:var(--ink)}
.prep dt{font-weight:700;color:var(--ink);font-size:15px;margin-top:10px}
.prep dd{color:#33465a;font-size:15px;margin:2px 0 0}
@media(max-width:560px){.card .xl li{grid-template-columns:1fr 64px 58px}.xv{display:none}.xrule{grid-template-columns:repeat(2,1fr)}}
</style>
<div class="card">
${photoFig("xray", "The digital X-ray room at Caspian Diagnostic Centre")}
<h2>Simple, fixed prices</h2>
<p>Every X-ray is priced by the number of views taken, so you know the cost before you come.</p>
<div class="xrule"><div><b>${inr(350)}</b>1 view</div><div><b>${inr(600)}</b>2 views</div><div><b>${inr(850)}</b>3 views</div><div><b>${inr(1200)}</b>both sides, 2 views each</div></div>
<h2>What every X-ray includes</h2>
<ul class="inc">${INCLUDED.map(x => `<li>${esc(x)}</li>`).join("")}</ul>

<h2 id="price-list">All X-ray prices</h2>
<label for="xs" class="price-lbl">Search by body part or problem, for example "knee", "back pain" or "kidney stone"</label>
<input id="xs" class="xs" type="search" placeholder="Search X-rays" autocomplete="off">
<p class="xnone" id="xnone">No match. <a href="${waLink("Hi Caspian Diagnostic Centre, which X-ray do I need? My prescription says: ")}" target="_blank" rel="noopener">Send us your prescription on WhatsApp</a> and we will tell you the X-ray and price.</p>
${rows}
<p class="note" style="margin-top:18px">Left or right: tell us the side when you book. The price is the same for either side.</p>

<h2>Before your X-ray</h2>
<dl class="prep">${PREP.map(p => `<dt>${esc(p[0])}</dt><dd>${esc(p[1])}</dd>`).join("")}</dl>

<h2>X-ray at home</h2>
<p>For bedridden or elderly patients who cannot travel, a portable chest X-ray at home can be arranged through our partner radiology team, at ${inr(HOME_XRAY)}. <a href="${waLink("Hi Caspian Diagnostic Centre, I need a chest X-ray at home. Address: ")}" target="_blank" rel="noopener">Ask on WhatsApp</a>.</p>

<h2>Frequently asked questions</h2>
${faqBlock(FAQS)}
<p style="margin-top:16px">Need blood tests as well? <a href="/tests">See blood test prices</a> or <a href="/packages">health checkup packages</a>.</p>
</div>
<script>
(function(){var s=document.getElementById('xs');if(!s)return;var li=[].slice.call(document.querySelectorAll('.xl li')),hs=[].slice.call(document.querySelectorAll('.xg')),none=document.getElementById('xnone');
s.addEventListener('input',function(){var q=s.value.toLowerCase().trim().split(/\\s+/).filter(Boolean),n=0;
li.forEach(function(x){var k=x.getAttribute('data-k'),ok=q.every(function(w){return k.indexOf(w)>-1});x.style.display=ok?'':'none';if(ok)n++});
hs.forEach(function(h){var u=h.nextElementSibling,v=[].some.call(u.children,function(c){return c.style.display!=='none'});h.style.display=v?'':'none';u.style.display=v?'':'none'});
none.style.display=n?'none':'block';});})();
</script>`;

  const ld = [
    ldBreadcrumb([["Home", "/"], ["X-ray", "/x-ray"]]),
    {
      "@context": "https://schema.org", "@type": "OfferCatalog", "name": "X-ray price list, Caspian Diagnostic Centre", "url": URL,
      "itemListElement": ALL.map(t => ({
        "@type": "Offer", "price": String(t[4]), "priceCurrency": "INR", "url": URL,
        "itemOffered": { "@type": "MedicalTest", "name": "X-ray " + t[1], "description": t[2] },
        "seller": { "@type": "MedicalClinic", "name": "Caspian Diagnostic Centre", "url": BASE }
      }))
    },
    ldFaq(FAQS)
  ];

  return pageShell({
    title, desc, canonical: URL,
    breadcrumbHtml: `<a href="/">Home</a> › X-ray`,
    heroH1: "X-ray in Hyderabad: Prices for 63 X-rays",
    heroSub: `From ${inr(350)} · Radiologist report the same day on WhatsApp · Walk in, no appointment · ${PHONE_DISPLAY}`,
    bodyHtml: body, ld, ogImage: photoUrl("xray")
  });
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(renderXray());
}
