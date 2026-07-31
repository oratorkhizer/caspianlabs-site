/* Caspian Diagnostic Centre — language toggle (Phase 3, task 3.4)
   Telugu / Urdu / Hindi versions of the hero copy, key CTAs, home-collection band and FAQ.
   Injected as a <select> in the header; choice remembered in localStorage.
   Same-URL toggle (no separate URLs), so no hreflang needed.
   TRANSLATIONS DRAFTED FOR DR KHIZER'S REVIEW — edit strings below freely; structure is
   { hero, card, band, faq } per language. English is captured from the page itself. */
(function () {
  "use strict";

  var I18N = {
    te: {
      name: "తెలుగు", dir: "ltr", lang: "te",
      hero: {
        h1: "హైదరాబాద్ నడిబొడ్డున, మీరు నమ్మదగిన ఖచ్చితమైన డయాగ్నోస్టిక్స్.",
        sub: "క్యాస్పియన్ డయాగ్నోస్టిక్ సెంటర్ ఖచ్చితమైన ప్యాథాలజీ పరీక్షలు, అందుబాటు ధరలో హెల్త్ చెకప్ ప్యాకేజీలు, ఇంటి వద్దే శాంపిల్ కలెక్షన్ అందిస్తుంది — రిపోర్టులు నేరుగా మీ వాట్సాప్‌కే.",
        ctaBook: "ఆన్‌లైన్‌లో టెస్ట్ బుక్ చేయండి",
        ctaWa: "లేదా వాట్సాప్ చేయండి",
        assure: ["వేగం, ఖచ్చితత్వం కలిసే చోటు", "ఉచిత హోమ్ కలెక్షన్ (₹500+ ఆర్డర్లపై)", "వాట్సాప్‌లో రిపోర్టులు"]
      },
      card: {
        h3: "3 సులభమైన స్టెప్స్‌లో టెస్ట్ బుక్ చేయండి",
        p: "క్యూలు లేవు, ఇబ్బంది లేదు — బుకింగ్ నుంచి రిపోర్ట్ వరకు.",
        steps: [
          ["బుక్ చేయండి", "సెకన్లలో ఆన్‌లైన్ బుకింగ్ — లేదా వాట్సాప్‌లో మెసేజ్ చేయండి. మీ టెస్ట్ లేదా ప్యాకేజీ ఎంచుకోండి."],
          ["శాంపిల్ ఇవ్వండి", "సెంటర్‌కు రండి లేదా ఉచిత హోమ్ కలెక్షన్ బుక్ చేసుకోండి."],
          ["రిపోర్ట్ పొందండి", "ఖచ్చితమైన డిజిటల్ రిపోర్టులు నేరుగా మీ ఫోన్‌కే."]
        ],
        btn: "ఆన్‌లైన్‌లో టెస్ట్ బుక్ చేయండి"
      },
      band: {
        h2: "ఉచిత హోమ్ శాంపిల్ కలెక్షన్ బుక్ చేయండి",
        p: "ప్రయాణం అవసరం లేదు. హైదరాబాద్ అంతటా మీ ఇంటి నుంచే మా టీమ్ శాంపిల్ తీసుకుంటుంది, రిపోర్ట్ మీ వాట్సాప్‌కే వస్తుంది. <strong>₹500 పైన ఆర్డర్లపై ఉచితం.</strong> <a href=\"/home-sample-collection-hyderabad\" style=\"color:#fff;text-decoration:underline;font-weight:600\">హోమ్ కలెక్షన్ ఎలా పనిచేస్తుందో చూడండి →</a>",
        btns: ["ఆన్‌లైన్‌లో టెస్ట్ బుక్ చేయండి", "లేదా వాట్సాప్ చేయండి", "కాల్ చేసి బుక్ చేయండి"]
      },
      faq: {
        eyebrow: "తెలుసుకోవాల్సినవి",
        h2: "తరచుగా అడిగే ప్రశ్నలు",
        lead: "పేషెంట్లు ఎక్కువగా అడిగే ప్రశ్నలకు క్విక్ సమాధానాలు. ఇంకేదైనా కావాలా? వాట్సాప్‌లో మెసేజ్ చేయండి — మేము 24/7 అందుబాటులో ఉంటాము.",
        items: [
          ["బ్లడ్ టెస్ట్ ముందు ఉపవాసం (ఫాస్టింగ్) అవసరమా?", "ఫాస్టింగ్ షుగర్, లిపిడ్ ప్రొఫైల్ వంటి కొన్ని టెస్టులకు 8–12 గంటల ఉపవాసం అవసరం; చాలా టెస్టులకు అవసరం లేదు. మీ టెస్ట్ పేరుతో వాట్సాప్‌లో మెసేజ్ చేయండి — ఉపవాసం అవసరమో లేదో మేము చెబుతాము."],
          ["హోమ్ శాంపిల్ కలెక్షన్ ఉందా?", "అవును — మా శిక్షణ పొందిన ఫ్లెబోటమిస్టులు మీ ఇంటి నుంచే శాంపిల్ తీసుకుంటారు, ₹500 పైన ఆర్డర్లపై ఉచితం. ఆన్‌లైన్‌లో బుక్ చేసి <em>హోమ్ కలెక్షన్</em> ఎంచుకోండి, లేదా మీ ఏరియా, సమయం తెలిపి వాట్సాప్ చేయండి."],
          ["రిపోర్ట్ ఎప్పుడు వస్తుంది?", "చాలా రొటీన్ రిపోర్టులు అదే రోజు లేదా 24 గంటల్లో సిద్ధమై, నేరుగా వాట్సాప్‌లో పంపబడతాయి. స్పెషలైజ్డ్ టెస్టులకు సమయం మారవచ్చు."],
          ["మీ టైమింగ్స్ ఏమిటి?", "మేము వారంలో ప్రతి రోజూ, <strong>24/7</strong> తెరిచి ఉంటాము."],
          ["టెస్ట్ ఎలా బుక్ చేయాలి?", "caspianlabs.in లో ఆన్‌లైన్ బుక్ చేయండి, +91 90593 41154 కి వాట్సాప్ చేయండి, లేదా అహ్మద్ ప్లాజా, విజయ్ నగర్ కాలనీలోని మా సెంటర్‌కు నేరుగా రండి."],
          ["మీరు ఎక్కడ ఉన్నారు?", "10-3-761/8, అహ్మద్ ప్లాజా, విజయ్ నగర్ కాలనీ, హైదరాబాద్, తెలంగాణ 500057. <a href=\"https://share.google/AIJCsiy3rClrF880u\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--blue);font-weight:600\">డైరెక్షన్స్ →</a>"],
          ["క్యాస్పియన్‌లో డాక్టర్ కన్సల్టేషన్ ఉందా?", "అవును — డాక్టర్ కన్సల్టేషన్లు మా సిస్టర్ క్లినిక్ <strong>క్యాస్పియన్ హెల్త్‌కేర్</strong>‌లో జరుగుతాయి. <a href=\"#doctors\" style=\"color:var(--blue);font-weight:600\">ఇక్కడే ఆన్‌లైన్‌లో అపాయింట్‌మెంట్ బుక్ చేసుకోండి</a>."]
        ]
      }
    },
    hi: {
      name: "हिंदी", dir: "ltr", lang: "hi",
      hero: {
        h1: "हैदराबाद के दिल में, सटीक जाँचें जिन पर आप भरोसा कर सकते हैं।",
        sub: "कैस्पियन डायग्नोस्टिक सेंटर सटीक पैथोलॉजी जाँच, किफ़ायती हेल्थ चेकअप पैकेज और घर बैठे सैंपल कलेक्शन प्रदान करता है — रिपोर्ट सीधे आपके WhatsApp पर।",
        ctaBook: "ऑनलाइन टेस्ट बुक करें",
        ctaWa: "या WhatsApp करें",
        assure: ["जहाँ रफ़्तार मिलती है सटीकता से", "मुफ़्त होम कलेक्शन (₹500+ के ऑर्डर पर)", "WhatsApp पर रिपोर्ट"]
      },
      card: {
        h3: "3 आसान स्टेप्स में टेस्ट बुक करें",
        p: "न लाइन, न झंझट — बुकिंग से रिपोर्ट तक।",
        steps: [
          ["बुक करें", "सेकंडों में ऑनलाइन बुक करें — या WhatsApp पर मैसेज करें। अपना टेस्ट या पैकेज चुनें।"],
          ["सैंपल दें", "सेंटर आएँ या मुफ़्त होम कलेक्शन बुक करें।"],
          ["रिपोर्ट पाएँ", "सटीक डिजिटल रिपोर्ट सीधे आपके फ़ोन पर।"]
        ],
        btn: "ऑनलाइन टेस्ट बुक करें"
      },
      band: {
        h2: "मुफ़्त होम सैंपल कलेक्शन बुक करें",
        p: "कहीं जाने की ज़रूरत नहीं। हैदराबाद भर में हमारी टीम आपके घर से सैंपल लेती है और रिपोर्ट WhatsApp पर आती है। <strong>₹500+ के ऑर्डर पर मुफ़्त।</strong> <a href=\"/home-sample-collection-hyderabad\" style=\"color:#fff;text-decoration:underline;font-weight:600\">होम कलेक्शन कैसे काम करता है →</a>",
        btns: ["ऑनलाइन टेस्ट बुक करें", "या WhatsApp करें", "कॉल करके बुक करें"]
      },
      faq: {
        eyebrow: "जानने योग्य बातें",
        h2: "अक्सर पूछे जाने वाले सवाल",
        lead: "मरीज़ों के सबसे आम सवालों के झटपट जवाब। कुछ और पूछना है? WhatsApp पर मैसेज करें — हम 24/7 खुले हैं।",
        items: [
          ["क्या ब्लड टेस्ट से पहले खाली पेट रहना ज़रूरी है?", "फास्टिंग शुगर और लिपिड प्रोफाइल जैसे कुछ टेस्ट के लिए 8–12 घंटे खाली पेट रहना होता है; ज़्यादातर टेस्ट के लिए नहीं। अपने टेस्ट का नाम WhatsApp पर भेजें — हम बता देंगे कि फास्टिंग ज़रूरी है या नहीं।"],
          ["क्या होम सैंपल कलेक्शन मिलता है?", "हाँ — हमारे प्रशिक्षित फ्लेबोटोमिस्ट आपके घर से सैंपल लेते हैं, ₹500 से ऊपर के ऑर्डर पर मुफ़्त। ऑनलाइन बुक करके <em>होम कलेक्शन</em> चुनें, या अपना एरिया और समय बताकर WhatsApp करें।"],
          ["रिपोर्ट कब मिलेगी?", "ज़्यादातर रूटीन रिपोर्ट उसी दिन या 24 घंटे के भीतर तैयार होकर सीधे WhatsApp पर भेज दी जाती हैं। विशेष टेस्ट में समय अलग हो सकता है।"],
          ["आपकी टाइमिंग क्या है?", "हम हफ़्ते के सातों दिन, <strong>24/7</strong> खुले रहते हैं।"],
          ["टेस्ट कैसे बुक करें?", "caspianlabs.in पर ऑनलाइन बुक करें, +91 90593 41154 पर WhatsApp करें, या अहमद प्लाज़ा, विजय नगर कॉलोनी स्थित हमारे सेंटर पर सीधे आ जाएँ।"],
          ["आप कहाँ स्थित हैं?", "10-3-761/8, अहमद प्लाज़ा, विजय नगर कॉलोनी, हैदराबाद, तेलंगाना 500057। <a href=\"https://share.google/AIJCsiy3rClrF880u\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--blue);font-weight:600\">रास्ता देखें →</a>"],
          ["क्या कैस्पियन में डॉक्टर से परामर्श मिल सकता है?", "हाँ — डॉक्टर परामर्श हमारी सिस्टर क्लिनिक <strong>कैस्पियन हेल्थकेयर</strong> में होते हैं। <a href=\"#doctors\" style=\"color:var(--blue);font-weight:600\">यहीं ऑनलाइन अपॉइंटमेंट बुक करें</a>।"]
        ]
      }
    },
    ur: {
      name: "اردو", dir: "rtl", lang: "ur",
      hero: {
        h1: "حیدرآباد کے قلب میں، درست تشخیص جس پر آپ بھروسہ کر سکتے ہیں۔",
        sub: "کیسپین ڈائیگناسٹک سینٹر درست پیتھالوجی ٹیسٹ، مناسب قیمت کے ہیلتھ چیک اپ پیکیج اور گھر بیٹھے سیمپل کلیکشن فراہم کرتا ہے — رپورٹس سیدھی آپ کے واٹس ایپ پر۔",
        ctaBook: "آن لائن ٹیسٹ بک کریں",
        ctaWa: "یا واٹس ایپ کریں",
        assure: ["جہاں رفتار اور درستگی ملتی ہیں", "مفت ہوم کلیکشن (₹500+ کے آرڈر پر)", "واٹس ایپ پر رپورٹس"]
      },
      card: {
        h3: "3 آسان مراحل میں ٹیسٹ بک کریں",
        p: "نہ قطار، نہ جھنجھٹ — بکنگ سے رپورٹ تک۔",
        steps: [
          ["بک کریں", "سیکنڈوں میں آن لائن بک کریں — یا واٹس ایپ پر میسج کریں۔ اپنا ٹیسٹ یا پیکیج منتخب کریں۔"],
          ["سیمپل دیں", "سینٹر آئیں یا مفت ہوم کلیکشن بک کریں۔"],
          ["رپورٹ حاصل کریں", "درست ڈیجیٹل رپورٹس سیدھی آپ کے فون پر۔"]
        ],
        btn: "آن لائن ٹیسٹ بک کریں"
      },
      band: {
        h2: "مفت ہوم سیمپل کلیکشن بک کریں",
        p: "کہیں جانے کی ضرورت نہیں۔ حیدرآباد بھر میں ہماری ٹیم آپ کے گھر سے سیمپل لیتی ہے اور رپورٹ واٹس ایپ پر آتی ہے۔ <strong>₹500+ کے آرڈر پر مفت۔</strong> <a href=\"/home-sample-collection-hyderabad\" style=\"color:#fff;text-decoration:underline;font-weight:600\">ہوم کلیکشن کیسے کام کرتا ہے ←</a>",
        btns: ["آن لائن ٹیسٹ بک کریں", "یا واٹس ایپ کریں", "کال کر کے بک کریں"]
      },
      faq: {
        eyebrow: "جاننے کی باتیں",
        h2: "اکثر پوچھے جانے والے سوالات",
        lead: "مریضوں کے سب سے عام سوالات کے فوری جوابات۔ کچھ اور پوچھنا ہے؟ واٹس ایپ پر میسج کریں — ہم 24/7 کھلے ہیں۔",
        items: [
          ["کیا بلڈ ٹیسٹ سے پہلے خالی پیٹ رہنا ضروری ہے؟", "فاسٹنگ شوگر اور لپڈ پروفائل جیسے کچھ ٹیسٹوں کے لیے 8–12 گھنٹے خالی پیٹ رہنا ہوتا ہے؛ زیادہ تر ٹیسٹوں کے لیے نہیں۔ اپنے ٹیسٹ کا نام واٹس ایپ پر بھیجیں — ہم بتا دیں گے کہ فاسٹنگ ضروری ہے یا نہیں۔"],
          ["کیا ہوم سیمپل کلیکشن دستیاب ہے؟", "جی ہاں — ہمارے تربیت یافتہ فلیبوٹومسٹ آپ کے گھر سے سیمپل لیتے ہیں، ₹500 سے زائد آرڈر پر مفت۔ آن لائن بک کر کے <em>ہوم کلیکشن</em> منتخب کریں، یا اپنا علاقہ اور وقت بتا کر واٹس ایپ کریں۔"],
          ["رپورٹ کب ملے گی؟", "زیادہ تر روٹین رپورٹس اسی دن یا 24 گھنٹوں میں تیار ہو کر سیدھی واٹس ایپ پر بھیج دی جاتی ہیں۔ خصوصی ٹیسٹوں میں وقت مختلف ہو سکتا ہے۔"],
          ["آپ کے اوقات کیا ہیں؟", "ہم ہفتے کے ساتوں دن، <strong>24/7</strong> کھلے رہتے ہیں۔"],
          ["ٹیسٹ کیسے بک کریں؟", "caspianlabs.in پر آن لائن بک کریں، ‎+91 90593 41154 پر واٹس ایپ کریں، یا احمد پلازہ، وجے نگر کالونی میں ہمارے سینٹر پر تشریف لائیں۔"],
          ["آپ کہاں واقع ہیں؟", "‎10-3-761/8، احمد پلازہ، وجے نگر کالونی، حیدرآباد، تلنگانہ 500057۔ <a href=\"https://share.google/AIJCsiy3rClrF880u\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--blue);font-weight:600\">راستہ دیکھیں ←</a>"],
          ["کیا کیسپین میں ڈاکٹر سے مشورہ ہو سکتا ہے؟", "جی ہاں — ڈاکٹر کنسلٹیشن ہماری سسٹر کلینک <strong>کیسپین ہیلتھ کیئر</strong> میں ہوتے ہیں۔ <a href=\"#doctors\" style=\"color:var(--blue);font-weight:600\">یہیں آن لائن اپائنٹمنٹ بک کریں</a>۔"]
        ]
      }
    }
  };

  var EN = null; // captured from the page on first switch

  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function lastTextNode(el) {
    for (var i = el.childNodes.length - 1; i >= 0; i--) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim()) return n;
    }
    return null;
  }

  function els() {
    var heroLeft = q(".hero .wrap > div:first-child");
    var band = q("#home-collection .band");
    return {
      heroLeft: heroLeft,
      h1: q(".hero h1"),
      sub: q(".hero p.sub"),
      ctaBook: q(".hero .cta .btn-primary"),
      ctaWa: q(".hero .cta .btn-wa"),
      assure: qa(".hero .assure > div"),
      card: q(".hero-card"),
      cardH3: q(".hero-card h3"),
      cardP: q(".hero-card > p"),
      steps: qa(".hero-card .step"),
      cardBtn: q(".hero-card > a.btn"),
      band: band,
      bandH2: band ? band.querySelector("h2") : null,
      bandP: band ? band.querySelector("p") : null,
      bandBtns: band ? Array.prototype.slice.call(band.querySelectorAll(".act .btn")) : [],
      faqSec: q("#faq"),
      faqEyebrow: q("#faq .eyebrow"),
      faqH2: q("#faq .center h2"),
      faqLead: q("#faq .lead"),
      faqItems: qa("#faq .faq-item")
    };
  }

  function capture() {
    var e = els();
    if (!e.h1) return null;
    return {
      dir: "ltr", lang: "en",
      hero: {
        h1: e.h1.textContent, sub: e.sub ? e.sub.textContent : "",
        ctaBook: e.ctaBook ? e.ctaBook.textContent.trim() : "",
        ctaWa: e.ctaWa && lastTextNode(e.ctaWa) ? lastTextNode(e.ctaWa).textContent.trim() : "",
        assure: e.assure.map(function (d) { var t = lastTextNode(d); return t ? t.textContent.trim() : ""; })
      },
      card: {
        h3: e.cardH3 ? e.cardH3.textContent : "", p: e.cardP ? e.cardP.textContent : "",
        steps: e.steps.map(function (s) { var b = s.querySelector("b"), sp = s.querySelector("span"); return [b ? b.textContent : "", sp ? sp.textContent : ""]; }),
        btn: e.cardBtn ? e.cardBtn.textContent.trim() : ""
      },
      band: {
        h2: e.bandH2 ? e.bandH2.textContent : "", p: e.bandP ? e.bandP.innerHTML : "",
        btns: e.bandBtns.map(function (b) { var t = lastTextNode(b); return t ? t.textContent.trim() : b.textContent.trim(); })
      },
      faq: {
        eyebrow: e.faqEyebrow ? e.faqEyebrow.textContent : "", h2: e.faqH2 ? e.faqH2.textContent : "",
        lead: e.faqLead ? e.faqLead.textContent : "",
        items: e.faqItems.map(function (it) { var s = it.querySelector("summary"), p = it.querySelector("p"); return [s ? s.textContent : "", p ? p.innerHTML : ""]; })
      }
    };
  }

  function setDir(el, dict) {
    if (!el) return;
    if (dict.dir === "rtl") { el.setAttribute("dir", "rtl"); } else { el.removeAttribute("dir"); }
    el.setAttribute("lang", dict.lang === "en" ? "en" : dict.lang);
  }

  function apply(code) {
    var dict = code === "en" ? EN : I18N[code];
    if (!dict) return;
    var e = els();
    if (!e.h1) return;

    if (e.h1) e.h1.textContent = dict.hero.h1;
    if (e.sub) e.sub.textContent = dict.hero.sub;
    if (e.ctaBook) e.ctaBook.textContent = dict.hero.ctaBook;
    if (e.ctaWa) { var wt = lastTextNode(e.ctaWa); if (wt) wt.textContent = " " + dict.hero.ctaWa; }
    e.assure.forEach(function (d, i) {
      var t = lastTextNode(d);
      if (t && dict.hero.assure[i]) t.textContent = " " + dict.hero.assure[i];
    });

    if (e.cardH3) e.cardH3.textContent = dict.card.h3;
    if (e.cardP) e.cardP.textContent = dict.card.p;
    e.steps.forEach(function (s, i) {
      var b = s.querySelector("b"), sp = s.querySelector("span");
      if (b && dict.card.steps[i]) b.textContent = dict.card.steps[i][0];
      if (sp && dict.card.steps[i]) sp.textContent = dict.card.steps[i][1];
    });
    if (e.cardBtn) e.cardBtn.textContent = dict.card.btn;

    if (e.bandH2) e.bandH2.textContent = dict.band.h2;
    if (e.bandP) e.bandP.innerHTML = dict.band.p;
    e.bandBtns.forEach(function (b, i) {
      if (!dict.band.btns[i]) return;
      var t = lastTextNode(b);
      if (t) { t.textContent = " " + dict.band.btns[i]; } else { b.textContent = dict.band.btns[i]; }
    });

    if (e.faqEyebrow) e.faqEyebrow.textContent = dict.faq.eyebrow;
    if (e.faqH2) e.faqH2.textContent = dict.faq.h2;
    if (e.faqLead) e.faqLead.textContent = dict.faq.lead;
    e.faqItems.forEach(function (it, i) {
      if (!dict.faq.items[i]) return;
      var s = it.querySelector("summary"), p = it.querySelector("p");
      if (s) s.textContent = dict.faq.items[i][0];
      if (p) p.innerHTML = dict.faq.items[i][1];
      setDir(it, dict);
    });

    // direction + lang on the swapped regions (Urdu = RTL)
    setDir(e.heroLeft, dict);
    setDir(e.card, dict);
    setDir(e.band, dict);
    if (e.faqSec) setDir(e.faqSec.querySelector(".center"), dict);

    try { localStorage.setItem("cdc-lang", code); } catch (err) {}
    var sel = document.getElementById("cdcLangSel");
    if (sel && sel.value !== code) sel.value = code;
  }

  function injectToggle() {
    var navCta = q(".nav-cta");
    if (!navCta || document.getElementById("cdcLangSel")) return;
    var sel = document.createElement("select");
    sel.id = "cdcLangSel";
    sel.setAttribute("aria-label", "Language / భాష / زبان / भाषा");
    sel.style.cssText = "border:1.5px solid var(--line,#e3ecf3);background:#fff;color:#152b3c;border-radius:10px;padding:8px 6px;font-size:13.5px;font-weight:600;font-family:inherit;cursor:pointer;max-width:86px";
    var opts = [["en", "English"], ["te", "తెలుగు"], ["ur", "اردو"], ["hi", "हिंदी"]];
    opts.forEach(function (o) {
      var op = document.createElement("option");
      op.value = o[0]; op.textContent = o[1];
      sel.appendChild(op);
    });
    sel.addEventListener("change", function () { apply(sel.value); });
    navCta.insertBefore(sel, navCta.firstElementChild);
  }

  function init() {
    EN = capture();
    if (!EN) return;
    injectToggle();
    var saved = null;
    try { saved = localStorage.getItem("cdc-lang"); } catch (err) {}
    if (saved && saved !== "en" && I18N[saved]) apply(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
