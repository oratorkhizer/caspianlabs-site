/**
 * English source for the /te, /ur and /hi pages, added 10 September 2026.
 *
 * This is NOT served as a page. The English pages are the existing ones
 * (/, /home-sample-collection-hyderabad, /packages/..., /tests/...). This
 * file is the text the three translations are made from, block for block,
 * and it is what ?review=1 prints under each translated block so a reviewer
 * can check one against the other on a phone.
 *
 * RULE: every language file must have the same pages, the same blocks in the
 * same order, and the same number of paragraphs, list items and FAQs as this
 * one. api/lang.js refuses to render a page whose shape does not match, and
 * says which block is out of step, rather than quietly printing a paragraph
 * next to the wrong English.
 *
 * Prices, test names and area names are NOT in the text. They are filled in
 * by api/lang.js from its PAGES table, so a price change is one edit there,
 * not four.
 */
export default {
  code: "en",
  name: "English",
  ui: {
    open: "Open 24 hours",
    home: "Home",
    price: "Price",
    homeCollection: "Home collection",
    free500: "Free on orders of ₹500 or more",
    bookOnline: "Book and pay online",
    bookNote: "The online booking form is in English.",
    whatsapp: "Message us on WhatsApp",
    call: "Call",
    includes: "Tests in this package",
    faqs: "Questions people ask",
    pagesTitle: "Read more in this language",
    readEnglish: "Read this page in English",
    otherLanguages: "Also available in",
    disclaimer: "This page is general information. Please discuss your report with a doctor.",
    draftBanner: "Draft translation, awaiting review. This page is hidden from Google until a reviewer approves it.",
  },
  pages: {
    home: {
      title: "Caspian Diagnostic Centre, Hyderabad | Laboratory open 24 hours",
      desc: "Blood tests, health checkup packages and digital X-ray in Vijay Nagar Colony, Hyderabad. Open 24 hours. Home sample collection. Reports on WhatsApp.",
      h1: "Caspian Diagnostic Centre",
      sub: "A laboratory open 24 hours in Vijay Nagar Colony, Hyderabad",
      wa: "Hello Caspian Diagnostic Centre, I would like to book a test.",
      blocks: [
        { h: "What we do", p: [
          "Blood and urine tests, health checkup packages and digital X-ray, in the same building as Caspian Healthcare hospital.",
          "Reports are checked by a consultant pathologist and sent to you on WhatsApp. Most routine reports come the same day.",
        ] },
        { h: "Sample collection at home", p: [
          "Our phlebotomist can come to your home. The home visit is free on orders of ₹500 or more, and ₹100 below that.",
        ] },
        { h: "How to book", li: [
          "Book and pay online on our website.",
          "Or send us a message on WhatsApp.",
          "Or call us. We answer at any hour.",
        ] },
      ],
      faqs: [
        ["Is the laboratory really open at night?", "Yes. Sample collection and testing run 24 hours a day, every day."],
        ["Do I need a doctor's prescription?", "Not for routine tests and health packages. If your doctor has given you a prescription, please bring it."],
        ["Where are you?", "10-3-761/8, Ahmed Plaza, Vijay Nagar Colony, Hyderabad 500057, opposite the Post Office, in the same building as Caspian Healthcare."],
      ],
    },

    "home-sample-collection": {
      title: "Blood Test Sample Collection at Home, Hyderabad | Caspian Diagnostic Centre",
      desc: "A trained phlebotomist collects your blood sample at home in Hyderabad. Free on orders of ₹500 or more, ₹100 otherwise. Reports on WhatsApp.",
      h1: "Blood sample collection at home",
      sub: "Free on orders of ₹500 or more · Reports on WhatsApp",
      wa: "Hello Caspian Diagnostic Centre, I would like a home sample collection. My area is: ",
      blocks: [
        { h: "We come to your home", p: [
          "A trained phlebotomist visits at a time that suits you and collects the sample with sterile, single-use equipment. Your report comes on WhatsApp, usually the same day.",
          "This helps elders, busy families, new mothers and anyone who is unwell.",
        ] },
        { h: "Charges", li: [
          "Free on orders of ₹500 or more.",
          "₹100 per visit below ₹500. You see this before you pay.",
          "Fasting sugar and after-meal sugar (FBS and PPBS) need two visits, so the second visit is ₹100.",
        ] },
        { h: "Areas we cover", p: [
          "The fastest slots are in these areas, close to our centre. We also come to other parts of Hyderabad on request.",
        ], areas: true },
        { h: "How it works", li: [
          "Book online and choose home collection, or message us on WhatsApp.",
          "Our phlebotomist comes at the time you chose.",
          "Your report comes to you on WhatsApp.",
        ] },
        { h: "Before the visit", p: [
          "If your test needs fasting, do not eat for 8–12 hours before the visit. Water is fine. Book a morning slot, and keep your doctor's prescription ready if you have one.",
        ] },
      ],
      faqs: [
        ["When will I get my report?", "Most routine reports come the same day or within 24 hours, on WhatsApp."],
        ["Is it safe?", "Yes. Every visit uses sterile, single-use equipment."],
      ],
    },

    "diabetes-screening": {
      title: "Diabetes Screening Package, Hyderabad | Caspian Diagnostic Centre",
      desc: "HbA1c, lipid profile, serum creatinine and urine albumin (UACR) in one diabetes screening package in Hyderabad. Free home collection. Reports on WhatsApp.",
      h1: "Comprehensive Diabetes Screening",
      sub: "4 tests · Planned by a diabetologist",
      wa: "Hello Caspian Diagnostic Centre, I would like to book the Comprehensive Diabetes Screening.",
      blocks: [
        { h: "What this package checks", p: [
          "The four numbers that matter most in diabetes: HbA1c (your average sugar over 3 months), cholesterol, kidney function (creatinine) and early kidney damage (urine albumin, UACR).",
          "Diabetes can harm the heart and the kidneys without any symptoms. This package looks for that early.",
        ], includes: true },
        { h: "Who should take it", li: [
          "People with diabetes, every 3 to 6 months.",
          "People with prediabetes, or with diabetes in the family.",
          "Anyone due for a yearly check for diabetes complications.",
        ] },
        { h: "Preparation", p: [
          "HbA1c does not need fasting. This package also has a lipid profile, so when you book, our team will tell you whether to come fasting.",
        ] },
      ],
      faqs: [
        ["Is home collection free for this package?", "Yes. This package costs more than ₹500, so the home visit is free."],
        ["When will I get the report?", "Most reports come the same day or within 24 hours, on WhatsApp."],
      ],
    },

    "full-body-checkup": {
      title: "Full Body Check Up, Hyderabad | Caspian Diagnostic Centre",
      desc: "12 tests including CBC, HbA1c, lipid, liver, kidney, thyroid, iron, vitamin D and vitamin B12, in Hyderabad. Free home collection. Reports on WhatsApp.",
      h1: "Full Body Check Up",
      sub: "12 tests · Our most booked package",
      wa: "Hello Caspian Diagnostic Centre, I would like to book the Full Body Check Up.",
      blocks: [
        { h: "What it covers", p: [
          "One sample and one visit to check the main systems of the body: blood counts, 3-month sugar, cholesterol, liver, kidneys, thyroid, iron, vitamin D, vitamin B12, calcium and urine.",
          "It is a yearly health check for adults of any age.",
        ], includes: true },
        { h: "Who should take it", li: [
          "Adults due for a yearly health check.",
          "People with diabetes, heart disease or thyroid problems in the family.",
          "Anyone with tiredness, weight change or low energy.",
        ] },
        { h: "Preparation", p: [
          "Please do not eat for 8–12 hours before the sample. Water is fine. Book a morning slot.",
        ] },
      ],
      faqs: [
        ["Is home collection free for this package?", "Yes. This package costs more than ₹500, so the home visit is free."],
        ["Should a doctor see the report?", "Yes. A doctor should read the report along with your health history. Doctors see patients at Caspian Healthcare, in the same building."],
      ],
    },

    "hba1c-test": {
      title: "HbA1c Test, Hyderabad | Caspian Diagnostic Centre",
      desc: "HbA1c shows your average blood sugar over the last 3 months. No fasting needed. Home collection available. Report on WhatsApp, Hyderabad.",
      h1: "HbA1c test",
      sub: "No fasting needed · Report on WhatsApp",
      wa: "Hello Caspian Diagnostic Centre, I would like to book an HbA1c test.",
      blocks: [
        { h: "What HbA1c tells you", p: [
          "HbA1c shows your average blood sugar over the last 2 to 3 months. A single sugar reading changes from day to day; HbA1c gives the fuller picture.",
          "Doctors use it to find diabetes and prediabetes, and to see how well treatment is working.",
        ] },
        { h: "Who should take it", li: [
          "People with diabetes, usually every 3 months.",
          "People with prediabetes, or with diabetes in the family.",
          "Anyone with a lot of thirst, frequent urination or weight loss without a reason.",
        ] },
        { h: "Preparation", p: [
          "No fasting is needed. You can give the sample at any time of day.",
        ] },
      ],
      faqs: [
        ["Can the sample be taken at home?", "Yes. This test costs more than ₹500, so the home visit is free."],
        ["What do the numbers mean?", "Your doctor will read it with your other results. As a general guide, below 5.7% is normal, 5.7% to 6.4% is prediabetes, and 6.5% or above points to diabetes."],
      ],
    },
  },
};
