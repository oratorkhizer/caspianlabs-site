// Caspian Diagnostic Centre, body-part X-ray pages served at /x-ray/<slug> by api/xray.js.
// Underscore prefix keeps Vercel from routing this file as a function.
// Each part lists the X-ray codes it covers; names and prices come from GROUPS in api/xray.js,
// so a price change there flows to these pages automatically.
// Chest has no entry here on purpose: it already has its own page at /tests/chest-x-ray-hyderabad.
//
// NOTE: keep PART_SLUGS in api/sitemap.js in sync with the keys of PARTS.

export const PARTS = {
  "knee": {
    name: "Knee X-ray", h1: "Knee X-ray in Hyderabad",
    codes: ["XR-KN1", "XR-KN2", "XR-KNBAP", "XR-KNB", "XR-KNBS", "XR-PAT"],
    about: [
      "A knee X-ray shows the bones of the knee joint: the lower end of the thigh bone, the top of the shin bone and the kneecap. It shows fractures, the gap between the bones (joint space), bone spurs and other signs of osteoarthritis.",
      "X-rays taken while you stand show the true joint space, because the knee is carrying your weight. That is why orthopaedic doctors often ask for standing views when they suspect knee arthritis or are planning a knee replacement."
    ],
    uses: ["Knee pain that has lasted more than a few weeks", "Swelling or pain after a fall, twist or sports injury", "Grading osteoarthritis (wear and tear)", "Before a knee replacement opinion", "Pain at the front of the knee or kneecap problems (skyline view)"],
    faqs: [
      ["Which knee X-ray should I ask for?", "Follow your doctor's prescription. For one painful knee, AP and Lateral (₹600) is the usual pair. For arthritis in both knees, doctors usually ask for both knees standing, AP and Lateral (₹1,200). If you are not sure, send us the prescription on WhatsApp."],
      ["Will an X-ray show a ligament or meniscus tear?", "No. An X-ray shows bones, not soft tissue. A torn ligament or meniscus needs an MRI. Doctors usually start with an X-ray to rule out a fracture or arthritis first."],
      ["Should the X-ray be taken standing or lying down?", "For arthritis, standing views are better because they show how much joint space is left under body weight. For an injury, the technician will take the views that are safe for you."]
    ],
    related: ["hip-pelvis", "ankle", "lumbar-spine"]
  },
  "lumbar-spine": {
    name: "Lumbar Spine X-ray", h1: "Lumbar Spine (Lower Back) X-ray in Hyderabad",
    codes: ["XR-LS1", "XR-LS2", "XR-LSFE", "XR-DLS", "XR-SAC", "XR-SIJ"],
    about: [
      "A lumbar spine X-ray shows the five bones of the lower back. It shows their alignment, the height of the spaces between them, bone spurs (spondylosis), fractures and whether one bone has slipped forward on another (listhesis).",
      "It does not show discs or nerves directly. A slipped or bulging disc pressing on a nerve needs an MRI. Flexion and extension views, taken while you bend forward and backward, show whether the bones move more than they should."
    ],
    uses: ["Lower back pain lasting more than a few weeks", "Back pain after a fall or injury", "Back pain in older adults, to look for spondylosis or a compression fracture", "Checking for a slipped vertebra (listhesis)", "Tailbone pain (sacrum and coccyx views)"],
    faqs: [
      ["Will a lumbar X-ray show a slipped disc?", "No. Discs are soft tissue and do not show on an X-ray. The X-ray shows the bones and the space between them; a narrowed space can suggest disc wear. Your doctor will ask for an MRI if a disc problem is suspected."],
      ["What are flexion and extension views?", "Two side views taken while you bend forward and then lean back. They show whether a spine bone slides out of place on movement. Ask for them only if your doctor has written them."],
      ["Can I have a back X-ray if I am pregnant?", "Tell the technician before the X-ray. A back X-ray points at the pelvis, so it is usually postponed during pregnancy unless your doctor says it is urgent."]
    ],
    related: ["cervical-spine", "hip-pelvis", "knee"]
  },
  "cervical-spine": {
    name: "Cervical Spine X-ray", h1: "Cervical Spine (Neck) X-ray in Hyderabad",
    codes: ["XR-CS1", "XR-CS2", "XR-CSFE"],
    about: [
      "A cervical spine X-ray shows the seven bones of the neck. It shows their alignment, the spaces between them, bone spurs from cervical spondylosis and fractures after an injury.",
      "Flexion and extension views, taken while you bend your head forward and back, show whether the neck bones move more than they should. Nerve or disc problems behind arm tingling or numbness need an MRI."
    ],
    uses: ["Neck pain or stiffness lasting more than a few weeks", "Neck pain after a fall or road accident", "Cervical spondylosis", "Pain or tingling spreading into the arms", "Checking neck stability on movement"],
    faqs: [
      ["Will a neck X-ray show a pinched nerve?", "No. It shows bones and the spaces between them. A nerve pressed by a disc or bone spur needs an MRI. The X-ray is usually the first step."],
      ["Do I need to remove my chain or earrings?", "Yes. Remove chains, earrings and hair clips, because metal over the neck hides the bones on the X-ray."]
    ],
    related: ["lumbar-spine", "shoulder", "pns-sinus"]
  },
  "kub": {
    name: "KUB X-ray", h1: "KUB X-ray (Kidney, Ureter, Bladder) in Hyderabad",
    codes: ["XR-KUB", "XR-ABD"],
    about: [
      "KUB stands for kidneys, ureters and bladder. It is a plain X-ray of the abdomen that covers the whole urinary tract in one picture. Its main use is to look for stones that contain calcium, which show up white on the X-ray.",
      "Not every stone shows on a KUB. Uric acid stones and very small stones can be missed, and bowel gas can hide a stone. That is why doctors often pair a KUB with an ultrasound, or ask for a CT scan when the picture is not clear."
    ],
    uses: ["Pain in the side or back that comes in waves (renal colic)", "Blood in the urine", "Following up a known kidney or ureter stone", "Checking the position of a stent", "Severe tummy pain or suspected bowel blockage (abdomen view)"],
    faqs: [
      ["Do I need to fast before a KUB X-ray?", "Follow your doctor's advice. Some doctors ask you to come on an empty stomach, or to take a mild laxative the night before, so that bowel gas does not hide a stone."],
      ["Will a KUB show every kidney stone?", "No. Calcium stones show well, but uric acid stones and very small stones may not. Your doctor may also ask for an ultrasound or a CT scan."],
      ["KUB or ultrasound: which is better?", "They show different things and are often used together. Ultrasound shows the kidneys and any swelling without radiation; KUB shows stones along the full length of the ureters. Your doctor will decide."]
    ],
    related: ["lumbar-spine", "hip-pelvis"]
  },
  "pns-sinus": {
    name: "PNS (Sinus) X-ray", h1: "PNS (Sinus) and Adenoid X-ray in Hyderabad",
    codes: ["XR-PNS", "XR-NPX", "XR-STN"],
    about: [
      "A PNS X-ray (paranasal sinuses, Water's view) shows the air spaces in the bones of the face. In sinusitis these spaces can look cloudy, show thickened lining or show a fluid level.",
      "For children who snore or breathe through the mouth, a side view of the nasopharynx shows how much the adenoids are narrowing the airway. A CT scan is needed when an ENT surgeon is planning sinus surgery."
    ],
    uses: ["Blocked nose, facial pain or headache that keeps coming back", "Suspected sinusitis", "Snoring and mouth breathing in children (adenoid view)", "A swallowed fish bone or object (soft tissue neck view)"],
    faqs: [
      ["Is a sinus X-ray enough, or do I need a CT?", "For a first look at sinusitis, the X-ray is often enough. If your ENT doctor is planning surgery or the X-ray is unclear, they will ask for a CT scan."],
      ["Is the adenoid X-ray safe for my child?", "Yes. It is a single side view with a very small dose. One parent can stay with the child, and a lead apron protects the rest of the body."]
    ],
    related: ["cervical-spine", "bone-age"]
  },
  "shoulder": {
    name: "Shoulder X-ray", h1: "Shoulder X-ray in Hyderabad",
    codes: ["XR-SHO1", "XR-SHO2", "XR-SHOB", "XR-CLA"],
    about: [
      "A shoulder X-ray shows the ball and socket of the shoulder joint, the collar bone and the shoulder blade. It shows fractures, dislocation, arthritis and calcium deposits in the tendons.",
      "In frozen shoulder the X-ray is often normal; doctors use it to rule out other causes. Tears of the rotator cuff tendons need an ultrasound or MRI."
    ],
    uses: ["Shoulder pain after a fall", "Suspected dislocation", "Frozen shoulder, to rule out other causes", "Shoulder arthritis", "Collar bone (clavicle) injury"],
    faqs: [
      ["Will an X-ray show a rotator cuff tear?", "No. Tendons do not show on X-ray. An ultrasound or MRI is needed for a tear. The X-ray rules out a fracture, arthritis or calcium deposits."],
      ["Is a shoulder X-ray useful in frozen shoulder?", "The X-ray is usually normal in frozen shoulder, which is itself useful: it rules out arthritis, a fracture or calcium deposits as the cause of the stiffness."]
    ],
    related: ["cervical-spine", "hand-wrist"]
  },
  "hip-pelvis": {
    name: "Hip and Pelvis X-ray", h1: "Hip and Pelvis X-ray in Hyderabad",
    codes: ["XR-PEL", "XR-HIP1", "XR-HIP2", "XR-HIPB"],
    about: [
      "A pelvis X-ray (AP view) shows both hip joints and the pelvic bones in one picture, so the doctor can compare the two sides. Lateral views of one or both hips add a side-on look at the joint.",
      "It shows fractures, hip arthritis and later stages of avascular necrosis (AVN). Early AVN can be missed on X-ray, so your doctor may ask for an MRI if the X-ray is normal but the pain continues."
    ],
    uses: ["Hip or groin pain", "A fall in an older person, to rule out a hip fracture", "Hip arthritis", "Follow-up of avascular necrosis or a hip replacement", "Low back and buttock pain (SI joints, on the spine page)"],
    faqs: [
      ["Does a pelvis X-ray include both hips?", "Yes. The pelvis AP view shows both hips in a single film for ₹350. Lateral views of a hip are added only if your doctor asks for them."],
      ["Can I have a hip or pelvis X-ray in pregnancy?", "Tell the technician before the X-ray. Pelvic X-rays are usually avoided in pregnancy unless your doctor says it is urgent."]
    ],
    related: ["knee", "lumbar-spine", "kub"]
  },
  "ankle": {
    name: "Ankle X-ray", h1: "Ankle X-ray in Hyderabad",
    codes: ["XR-ANK1", "XR-ANK2", "XR-ANKB"],
    about: [
      "An ankle X-ray shows the lower ends of the shin bones and the top of the foot. Its main job after a twist is to tell a sprain from a fracture.",
      "Ligament injuries do not show on an X-ray. If the X-ray is normal but the ankle stays painful and unstable, your doctor may ask for an MRI."
    ],
    uses: ["A twisted ankle with swelling or pain on walking", "Ankle pain after a fall", "Ankle arthritis", "Follow-up after an ankle fracture"],
    faqs: [
      ["How do I know if my twisted ankle needs an X-ray?", "Your doctor will decide, but an X-ray is usually advised if you cannot take four steps, or if there is pain on pressing the bony points of the ankle."],
      ["Will an X-ray show a torn ligament?", "No. It shows bones. A torn ligament needs an ultrasound or MRI if the doctor suspects one."]
    ],
    related: ["foot", "knee"]
  },
  "foot": {
    name: "Foot X-ray", h1: "Foot X-ray and Diabetic Foot X-ray in Hyderabad",
    codes: ["XR-FT1", "XR-FT2", "XR-FT3", "XR-FTB", "XR-CAL", "XR-TOE"],
    about: [
      "A foot X-ray shows the bones of the foot and toes. It shows fractures, bunions, arthritis, heel spurs and, in diabetes, changes of bone infection (osteomyelitis) and Charcot foot.",
      "For people with diabetes we offer a three-view diabetic foot series (AP, Oblique and Lateral) for ₹850. Early bone infection can take a couple of weeks to show on X-ray, so your doctor may repeat the X-ray or ask for an MRI if a wound is not healing."
    ],
    uses: ["A foot ulcer or wound that is not healing in diabetes", "Hot, red, swollen foot in diabetes (suspected Charcot foot)", "Foot pain after an injury or a dropped object", "Heel pain or heel spur (calcaneum views)", "Bunion or toe deformity"],
    faqs: [
      ["Which X-ray do I need for a diabetic foot ulcer?", "Most doctors ask for the three-view diabetic foot series: AP, Oblique and Lateral (₹850). It gives the best chance of seeing early bone changes under the ulcer."],
      ["Does a normal X-ray mean there is no bone infection?", "Not always. Early bone infection may not show for a couple of weeks. If the wound is not healing, your doctor may repeat the X-ray or ask for an MRI."],
      ["Does a heel spur cause heel pain?", "Not always. Many people have a spur without pain, and many with heel pain have no spur. The X-ray helps your doctor rule out a fracture or other bone problem."]
    ],
    related: ["ankle", "knee"]
  },
  "hand-wrist": {
    name: "Hand and Wrist X-ray", h1: "Hand and Wrist X-ray in Hyderabad",
    codes: ["XR-WR1", "XR-WR2", "XR-WRB", "XR-SCA", "XR-HD1", "XR-HD2", "XR-HDB", "XR-FNG"],
    about: [
      "A hand or wrist X-ray shows the small bones of the wrist, hand and fingers. It shows fractures after a fall, arthritis and the joint changes of rheumatoid arthritis.",
      "A fall on an outstretched hand can break the scaphoid, a small wrist bone near the base of the thumb. This fracture is easy to miss on standard views, so a scaphoid series uses extra angles, and the X-ray is sometimes repeated after 10 to 14 days."
    ],
    uses: ["Wrist pain after a fall on an outstretched hand", "Finger or hand injury", "Swollen, painful finger joints (rheumatoid arthritis)", "Pain at the base of the thumb (scaphoid series)", "Child's growth assessment (see bone age)"],
    faqs: [
      ["What is a scaphoid series?", "A set of wrist X-rays from extra angles to look for a break in the scaphoid bone. It is advised when the wrist hurts at the base of the thumb after a fall."],
      ["Why would my doctor repeat a wrist X-ray?", "Some small wrist fractures do not show on the first X-ray. If pain continues, a repeat X-ray after 10 to 14 days can show a fracture that was hidden at first."]
    ],
    related: ["bone-age", "shoulder"]
  },
  "bone-age": {
    name: "Bone Age X-ray", h1: "Bone Age X-ray for Children in Hyderabad",
    codes: ["XR-BAGE"],
    about: [
      "A bone age X-ray is a single X-ray of the left hand and wrist. The radiologist compares the child's growth plates with standard reference pictures and reports the skeletal age, which may be ahead of or behind the child's actual age.",
      "Your child's paediatrician reads the bone age together with height charts. It helps to understand short or tall stature, early or late puberty, and how much growth may be left."
    ],
    uses: ["Child who is much shorter or taller than classmates", "Early or late puberty", "Estimating how much growth is left", "Follow-up during growth or hormone treatment"],
    faqs: [
      ["Why the left hand?", "The left hand is the standard used by the reference charts, so results can be compared reliably. It does not matter whether the child is left- or right-handed."],
      ["Is it safe for my child?", "Yes. It is a single X-ray of the hand with a very small dose, far from the body. One parent can stay with the child."],
      ["Do we need to prepare?", "No preparation is needed. Bring the child's height records or growth chart if you have them, for the paediatrician."]
    ],
    related: ["hand-wrist", "pns-sinus"]
  }
};
