/* Caspian Diagnostic Centre — language toggle (Phase 3, task 3.4 + key-section extension)
   Telugu / Urdu / Hindi versions of: hero, key CTAs, "book in 3 steps" panel,
   home-collection band, FAQ, AND (extension) the Services cards, Health-package
   cards and the All-Tests search prompts.
   Injected as a <select> in the header; choice remembered in localStorage.
   Same-URL toggle (no separate URLs), so no hreflang needed.
   TRANSLATIONS DRAFTED FOR DR KHIZER'S REVIEW — edit strings freely; English is
   captured live from the page. Test acronyms, ₹ prices and product names are left
   in English inside the section cards on purpose. */
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
      services: {
        eyebrow: "మేము అందించేవి",
        h2: "సమగ్ర డయాగ్నోస్టిక్ సేవలు",
        lead: "సాధారణ బ్లడ్ టెస్టుల నుంచి ప్రత్యేక ప్రొఫైల్స్ వరకు — అన్నీ ఒకే చోట, ప్రతి దశలోనూ కఠినమైన నాణ్యత నియంత్రణతో.",
        cards: [
          ["బయోకెమిస్ట్రీ", "బ్లడ్ షుగర్, లిపిడ్ ప్రొఫైల్, లివర్ &amp; కిడ్నీ ఫంక్షన్, ఎలక్ట్రోలైట్స్, మెటబాలిక్ ప్యానెల్స్."],
          ["హెమటాలజీ", "కంప్లీట్ బ్లడ్ కౌంట్ (CBC), ESR, పెరిఫెరల్ స్మియర్, కోఆగ్యులేషన్, ఎనీమియా వర్కప్స్."],
          ["క్లినికల్ ప్యాథాలజీ", "యూరిన్ &amp; స్టూల్ రొటీన్, సీమెన్ అనాలిసిస్, బాడీ ఫ్లూయిడ్ పరీక్ష, మరిన్ని."],
          ["మైక్రోబయాలజీ &amp; సెరాలజీ", "కల్చర్ &amp; సెన్సిటివిటీ, ఇన్ఫెక్షన్ స్క్రీనింగ్, విడాల్, డెంగ్యూ, టైఫాయిడ్, వైరల్ మార్కర్స్."],
          ["హార్మోన్లు &amp; ఇమ్యునాలజీ", "థైరాయిడ్, డయాబెటిస్ (HbA1c), విటమిన్, ఫెర్టిలిటీ, హార్మోన్ పరీక్షలు."],
          ["డిజిటల్ ఎక్స్-రే", "ఛాతీ, వెన్నెముక, కాళ్లు-చేతులు, KUB &amp; మరిన్ని — మా సెంటర్‌లో <strong>₹300 నుంచి</strong>. ప్రయాణించలేరా? <strong>ఇంటి వద్దే పోర్టబుల్ ఛాతీ ఎక్స్-రే</strong> ₹2,000కి అందుబాటులో."],
          ["ఇంటి వద్దే CGM", "కంటిన్యూయస్ గ్లూకోజ్ మానిటరింగ్ మీ ఇంటి వద్దే — <strong>FreeStyle Libre 2+</strong> లేదా <strong>Guardian IV</strong> సెన్సర్ MRPకి, <strong>అప్లికేషన్ ఛార్జ్ లేదు</strong>. మరిన్ని సెన్సర్లు (Linx, GlucoRx) త్వరలో. కంపాటబుల్ / NFC ఫోన్ అవసరం."],
          ["హెల్త్ చెకప్ ప్యాకేజీలు", "వ్యక్తులు, కుటుంబాలు, కార్పొరేట్ వెల్‌నెస్ కోసం ఎంపిక చేసిన ప్రివెంటివ్ ప్యాకేజీలు."]
        ]
      },
      packages: {
        eyebrow: "జనప్రియ హెల్త్ ప్యాకేజీలు",
        h2: "ప్రివెంటివ్ చెకప్‌లు, న్యాయమైన ధరలో",
        lead: "ముందుగా స్క్రీన్ చేయించుకోండి, ఆరోగ్యంగా ఉండండి. కింద ఒక ప్యాకేజీ ఎంచుకోండి లేదా మీ కోసం ఒకటి రూపొందించమని అడగండి.",
        book: "ఈ ప్యాకేజీని బుక్ చేయండి",
        cards: [
          ["క్యాస్పియన్ ఎసెన్షియల్ చెకప్", "త్వరిత అవసర స్క్రీనింగ్"],
          ["కాంప్రిహెన్సివ్ డయాబెటిస్ స్క్రీనింగ్", "మీ షుగర్ నియంత్రణ తెలుసుకోండి"],
          ["థైరాయిడ్ ప్రొఫైల్", "పూర్తి థైరాయిడ్ చెక్"],
          ["ఫుల్ బాడీ చెక్ అప్", "60+ పారామీటర్లు"],
          ["మెటబాలిక్ వెల్‌నెస్ + InBody", "ఫుల్ బాడీ + బాడీ కంపొజిషన్"],
          ["మహిళల ఆరోగ్యం", "మహిళల కోసం ప్రత్యేకం"],
          ["సీనియర్ సిటిజన్ హెల్త్", "పూర్తి వృద్ధుల సంరక్షణ చెక్"],
          ["హార్ట్ హెల్త్ చెక్", "కార్డియాలజిస్ట్ నేతృత్వంలో"],
          ["ప్రీమియం హెల్త్ చెక్ — పురుషులు 45+", "మా అత్యంత సమగ్ర ప్యాకేజీ"],
          ["హజ్ / ఉమ్రా ఫిట్‌నెస్", "యాత్రికుల ఫిట్‌నెస్ ప్యాకేజీ"]
        ]
      },
      tests: {
        eyebrow: "పూర్తి టెస్ట్ మెనూ",
        h2: "అన్ని టెస్టులు &amp; ప్రొఫైల్స్ శోధించండి",
        lead: "ఒకే టెస్ట్ కావాలా — విటమిన్ D, థైరాయిడ్, షుగర్ లేదా నిర్దిష్ట ప్రొఫైల్? మా మెనూలో శోధించండి, ధర చూడండి, ఒక్క ట్యాప్‌లో ఆన్‌లైన్ బుక్ చేయండి.",
        placeholder: "టెస్ట్ లేదా ప్రొఫైల్ శోధించండి — ఉదా. థైరాయిడ్, విటమిన్ డి, షుగర్, డెంగ్యూ…",
        portal: "✅ సెల్ఫ్-సర్వీస్ బుకింగ్ ఇక్కడే — ఏ టెస్ట్‌పైనైనా <b>Book</b> నొక్కి సెకన్లలో ఆన్‌లైన్ రిజర్వ్ చేయండి. ప్రస్తుతం సెంటర్‌లో లేదా ఇంటి వద్దే చెల్లించండి; సురక్షిత ఆన్‌లైన్ చెల్లింపు త్వరలో."
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
      services: {
        eyebrow: "हम क्या देते हैं",
        h2: "व्यापक डायग्नोस्टिक सेवाएँ",
        lead: "रूटीन ब्लड वर्क से लेकर विशेष प्रोफाइल तक — सब एक ही छत के नीचे, हर चरण पर सख़्त गुणवत्ता नियंत्रण के साथ।",
        cards: [
          ["बायोकेमिस्ट्री", "ब्लड शुगर, लिपिड प्रोफाइल, लिवर व किडनी फंक्शन, इलेक्ट्रोलाइट्स और मेटाबॉलिक पैनल।"],
          ["हेमेटोलॉजी", "कम्प्लीट ब्लड काउंट (CBC), ESR, पेरिफेरल स्मीयर, कोऐग्युलेशन और एनीमिया वर्कअप।"],
          ["क्लिनिकल पैथोलॉजी", "यूरिन व स्टूल रूटीन, सीमेन एनालिसिस, बॉडी फ्लूइड जाँच और भी बहुत कुछ।"],
          ["माइक्रोबायोलॉजी व सेरोलॉजी", "कल्चर व सेंसिटिविटी, संक्रमण स्क्रीनिंग, विडाल, डेंगू, टाइफाइड और वायरल मार्कर।"],
          ["हार्मोन व इम्यूनोलॉजी", "थायरॉइड, डायबिटीज (HbA1c), विटामिन, फर्टिलिटी और हार्मोन जाँच।"],
          ["डिजिटल एक्स-रे", "छाती, रीढ़, हाथ-पैर, KUB व अधिक — हमारे सेंटर पर <strong>₹300 से</strong>। यात्रा नहीं कर सकते? <strong>घर पर पोर्टेबल छाती एक्स-रे</strong> ₹2,000 में उपलब्ध।"],
          ["घर पर CGM", "कंटीन्युअस ग्लूकोज मॉनिटरिंग आपके घर पर — <strong>FreeStyle Libre 2+</strong> या <strong>Guardian IV</strong> सेंसर MRP पर, <strong>कोई एप्लिकेशन शुल्क नहीं</strong>। और सेंसर (Linx, GlucoRx) जल्द। कम्पैटिबल / NFC फोन आवश्यक।"],
          ["हेल्थ चेकअप पैकेज", "व्यक्तियों, परिवारों और कॉर्पोरेट वेलनेस के लिए चुने हुए प्रिवेंटिव पैकेज।"]
        ]
      },
      packages: {
        eyebrow: "लोकप्रिय हेल्थ पैकेज",
        h2: "प्रिवेंटिव चेकअप, ईमानदार दाम पर",
        lead: "जल्दी जाँच कराएँ, आगे रहें। नीचे से एक पैकेज चुनें या हमसे अपने लिए एक बनवाएँ।",
        book: "यह पैकेज बुक करें",
        cards: [
          ["कैस्पियन एसेंशियल चेकअप", "त्वरित आवश्यक स्क्रीनिंग"],
          ["कॉम्प्रिहेंसिव डायबिटीज स्क्रीनिंग", "अपना शुगर नियंत्रण जानें"],
          ["थायरॉइड प्रोफाइल", "पूरी थायरॉइड जाँच"],
          ["फुल बॉडी चेक अप", "60+ पैरामीटर"],
          ["मेटाबॉलिक वेलनेस + InBody", "फुल बॉडी + बॉडी कंपोजिशन"],
          ["महिला स्वास्थ्य", "महिलाओं के लिए विशेष"],
          ["सीनियर सिटिजन हेल्थ", "संपूर्ण वृद्ध देखभाल जाँच"],
          ["हार्ट हेल्थ चेक", "कार्डियोलॉजिस्ट द्वारा"],
          ["प्रीमियम हेल्थ चेक — पुरुष 45+", "हमारा सबसे विस्तृत पैकेज"],
          ["हज / उमरा फिटनेस", "यात्री फिटनेस पैकेज"]
        ]
      },
      tests: {
        eyebrow: "पूरा टेस्ट मेन्यू",
        h2: "सभी टेस्ट व प्रोफाइल खोजें",
        lead: "सिर्फ़ एक टेस्ट चाहिए — विटामिन D, थायरॉइड, शुगर या कोई खास प्रोफाइल? हमारा मेन्यू खोजें, दाम देखें, और एक टैप में ऑनलाइन बुक करें।",
        placeholder: "कोई टेस्ट या प्रोफाइल खोजें — जैसे थायरॉइड, विटामिन डी, शुगर, डेंगू…",
        portal: "✅ सेल्फ-सर्विस बुकिंग यहीं है — किसी भी टेस्ट पर <b>Book</b> दबाकर सेकंडों में ऑनलाइन रिज़र्व करें। फ़िलहाल सेंटर पर या घर पर भुगतान करें; सुरक्षित ऑनलाइन भुगतान जल्द आ रहा है।"
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
      services: {
        eyebrow: "ہم کیا پیش کرتے ہیں",
        h2: "جامع تشخیصی خدمات",
        lead: "روٹین بلڈ ٹیسٹ سے لے کر خصوصی پروفائلز تک — سب ایک ہی چھت کے نیچے، ہر مرحلے پر سخت کوالٹی کنٹرول کے ساتھ۔",
        cards: [
          ["بایوکیمسٹری", "بلڈ شوگر، لپڈ پروفائل، لیور و کڈنی فنکشن، الیکٹرولائٹس اور میٹابولک پینلز۔"],
          ["ہیماٹولوجی", "کمپلیٹ بلڈ کاؤنٹ (CBC)، ESR، پیریفرل سمیئر، کوایگولیشن اور انیمیا ورک اپ۔"],
          ["کلینیکل پیتھالوجی", "یورین و اسٹول روٹین، سیمن اینالیسس، باڈی فلوئڈ جانچ اور مزید۔"],
          ["مائیکروبیولوجی و سیرولوجی", "کلچر و سینسٹیویٹی، انفیکشن اسکریننگ، وڈال، ڈینگی، ٹائیفائیڈ اور وائرل مارکرز۔"],
          ["ہارمونز و امیونولوجی", "تھائرائیڈ، ذیابیطس (HbA1c)، وٹامن، فرٹیلیٹی اور ہارمون ٹیسٹ۔"],
          ["ڈیجیٹل ایکس رے", "سینہ، ریڑھ، ہاتھ پاؤں، KUB و مزید — ہمارے سینٹر پر <strong>₹300 سے</strong>۔ سفر نہیں کر سکتے؟ <strong>گھر پر پورٹیبل سینے کا ایکس رے</strong> ₹2,000 میں دستیاب۔"],
          ["گھر پر CGM", "کنٹینیوس گلوکوز مانیٹرنگ آپ کے گھر پر — <strong>FreeStyle Libre 2+</strong> یا <strong>Guardian IV</strong> سینسر MRP پر، <strong>کوئی ایپلیکیشن چارج نہیں</strong>۔ مزید سینسر (Linx, GlucoRx) جلد۔ کمپیٹیبل / NFC فون درکار۔"],
          ["ہیلتھ چیک اپ پیکجز", "افراد، خاندانوں اور کارپوریٹ ویلنیس کے لیے منتخب پریوینٹیو پیکجز۔"]
        ]
      },
      packages: {
        eyebrow: "مقبول ہیلتھ پیکجز",
        h2: "پریوینٹیو چیک اپ، مناسب قیمت پر",
        lead: "جلدی اسکریننگ کرائیں، آگے رہیں۔ نیچے سے ایک پیکج منتخب کریں یا اپنے لیے بنوائیں۔",
        book: "یہ پیکج بک کریں",
        cards: [
          ["کیسپین ایسینشل چیک اپ", "فوری ضروری اسکریننگ"],
          ["جامع ذیابیطس اسکریننگ", "اپنا شوگر کنٹرول جانیں"],
          ["تھائرائیڈ پروفائل", "مکمل تھائرائیڈ جانچ"],
          ["فُل باڈی چیک اپ", "‎60+ پیرامیٹرز"],
          ["میٹابولک ویلنیس + InBody", "فُل باڈی + باڈی کمپوزیشن"],
          ["خواتین کی صحت", "خواتین کے لیے خصوصی"],
          ["سینئر سٹیزن ہیلتھ", "مکمل بزرگ نگہداشت جانچ"],
          ["ہارٹ ہیلتھ چیک", "کارڈیالوجسٹ کی زیرِ نگرانی"],
          ["پریمیم ہیلتھ چیک — مرد 45+", "ہمارا سب سے جامع پیکج"],
          ["حج / عمرہ فٹنس", "عازمین فٹنس پیکج"]
        ]
      },
      tests: {
        eyebrow: "مکمل ٹیسٹ مینو",
        h2: "تمام ٹیسٹ و پروفائلز تلاش کریں",
        lead: "صرف ایک ٹیسٹ چاہیے — وٹامن D، تھائرائیڈ، شوگر یا کوئی خاص پروفائل؟ ہمارا مینو تلاش کریں، قیمت دیکھیں، اور ایک ٹیپ میں آن لائن بک کریں۔",
        placeholder: "کوئی ٹیسٹ یا پروفائل تلاش کریں — مثلاً تھائرائیڈ، وٹامن ڈی، شوگر، ڈینگی…",
        portal: "✅ سیلف سروس بکنگ یہیں ہے — کسی بھی ٹیسٹ پر <b>Book</b> دبا کر سیکنڈوں میں آن لائن ریزرو کریں۔ فی الحال سینٹر پر یا گھر پر ادائیگی کریں؛ محفوظ آن لائن ادائیگی جلد آ رہی ہے۔"
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

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function setTxt(el, v) { if (el && v != null) el.textContent = v; }
  function setHtml(el, v) { if (el && v != null) el.innerHTML = v; }

  function lastTextNode(el) {
    for (var i = el.childNodes.length - 1; i >= 0; i--) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim()) return n;
    }
    return null;
  }

  var bookBtns = []; // package "Book this package" buttons (cached at init)

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
      cardH3: q(".hero-card h3, .hero-card .hc-title"),
      cardP: q(".hero-card > p"),
      steps: qa(".hero-card .step"),
      cardBtn: q(".hero-card > a.btn"),
      band: band,
      bandH2: band ? band.querySelector("h2") : null,
      bandP: band ? band.querySelector("p") : null,
      bandBtns: band ? Array.prototype.slice.call(band.querySelectorAll(".act .btn")) : [],
      svcSec: q("#services"),
      svcEyebrow: q("#services .eyebrow"),
      svcH2: q("#services .center h2"),
      svcLead: q("#services .lead"),
      svcCards: qa("#services .cards .card"),
      pkgSec: q("#packages"),
      pkgEyebrow: q("#packages .eyebrow"),
      pkgH2: q("#packages .center h2"),
      pkgLead: q("#packages .lead"),
      pkgCards: qa("#packages .pkgs .pkg"),
      tstSec: q("#all-tests"),
      tstEyebrow: q("#all-tests .eyebrow"),
      tstH2: q("#all-tests .center h2"),
      tstLead: q("#all-tests .lead"),
      tstInput: q("#dirInput"),
      tstPortal: q("#all-tests .dir-portal"),
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
    var d = {
      dir: "ltr", lang: "en",
      hero: {
        h1: e.h1.textContent, sub: e.sub ? e.sub.textContent : "",
        ctaBook: e.ctaBook ? e.ctaBook.textContent.trim() : "",
        ctaWa: e.ctaWa && lastTextNode(e.ctaWa) ? lastTextNode(e.ctaWa).textContent.trim() : "",
        assure: e.assure.map(function (x) { var t = lastTextNode(x); return t ? t.textContent.trim() : ""; })
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
      services: {
        eyebrow: e.svcEyebrow ? e.svcEyebrow.textContent : "", h2: e.svcH2 ? e.svcH2.textContent : "", lead: e.svcLead ? e.svcLead.textContent : "",
        cards: e.svcCards.map(function (c) { var h = c.querySelector("h3"), p = c.querySelector("p"); return [h ? h.textContent : "", p ? p.innerHTML : ""]; })
      },
      packages: {
        eyebrow: e.pkgEyebrow ? e.pkgEyebrow.textContent : "", h2: e.pkgH2 ? e.pkgH2.textContent : "", lead: e.pkgLead ? e.pkgLead.textContent : "",
        book: "Book this package",
        cards: e.pkgCards.map(function (c) { var h = c.querySelector(".top h3"), n = c.querySelector(".cnt"); return [h ? h.textContent : "", n ? n.textContent : ""]; })
      },
      tests: {
        eyebrow: e.tstEyebrow ? e.tstEyebrow.textContent : "", h2: e.tstH2 ? e.tstH2.textContent : "", lead: e.tstLead ? e.tstLead.textContent : "",
        placeholder: e.tstInput ? e.tstInput.getAttribute("placeholder") : "",
        portal: e.tstPortal ? e.tstPortal.innerHTML : ""
      },
      faq: {
        eyebrow: e.faqEyebrow ? e.faqEyebrow.textContent : "", h2: e.faqH2 ? e.faqH2.textContent : "", lead: e.faqLead ? e.faqLead.textContent : "",
        items: e.faqItems.map(function (it) { var s = it.querySelector("summary"), p = it.querySelector("p"); return [s ? s.textContent : "", p ? p.innerHTML : ""]; })
      }
    };
    // cache the package "Book this package" buttons for reliable re-labelling
    bookBtns = qa("#packages .pkg .act a.btn-primary").filter(function (b) { return b.textContent.trim() === d.packages.book; });
    return d;
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

    // hero
    setTxt(e.h1, dict.hero.h1);
    setTxt(e.sub, dict.hero.sub);
    setTxt(e.ctaBook, dict.hero.ctaBook);
    if (e.ctaWa) { var wt = lastTextNode(e.ctaWa); if (wt) wt.textContent = " " + dict.hero.ctaWa; }
    e.assure.forEach(function (x, i) { var t = lastTextNode(x); if (t && dict.hero.assure[i]) t.textContent = " " + dict.hero.assure[i]; });

    // hero-card
    setTxt(e.cardH3, dict.card.h3);
    setTxt(e.cardP, dict.card.p);
    e.steps.forEach(function (s, i) {
      var b = s.querySelector("b"), sp = s.querySelector("span");
      if (dict.card.steps[i]) { setTxt(b, dict.card.steps[i][0]); setTxt(sp, dict.card.steps[i][1]); }
    });
    setTxt(e.cardBtn, dict.card.btn);

    // home-collection band
    setTxt(e.bandH2, dict.band.h2);
    setHtml(e.bandP, dict.band.p);
    e.bandBtns.forEach(function (b, i) {
      if (!dict.band.btns[i]) return;
      var t = lastTextNode(b);
      if (t) { t.textContent = " " + dict.band.btns[i]; } else { b.textContent = dict.band.btns[i]; }
    });

    // services
    if (dict.services) {
      setTxt(e.svcEyebrow, dict.services.eyebrow);
      setTxt(e.svcH2, dict.services.h2);
      setTxt(e.svcLead, dict.services.lead);
      e.svcCards.forEach(function (c, i) {
        if (!dict.services.cards[i]) return;
        setTxt(c.querySelector("h3"), dict.services.cards[i][0]);
        setHtml(c.querySelector("p"), dict.services.cards[i][1]);
      });
    }

    // packages
    if (dict.packages) {
      setTxt(e.pkgEyebrow, dict.packages.eyebrow);
      setTxt(e.pkgH2, dict.packages.h2);
      setTxt(e.pkgLead, dict.packages.lead);
      e.pkgCards.forEach(function (c, i) {
        if (!dict.packages.cards[i]) return;
        setTxt(c.querySelector(".top h3"), dict.packages.cards[i][0]);
        setTxt(c.querySelector(".cnt"), dict.packages.cards[i][1]);
      });
      bookBtns.forEach(function (b) { setTxt(b, dict.packages.book); });
    }

    // all-tests
    if (dict.tests) {
      setTxt(e.tstEyebrow, dict.tests.eyebrow);
      setTxt(e.tstH2, dict.tests.h2);
      setTxt(e.tstLead, dict.tests.lead);
      if (e.tstInput && dict.tests.placeholder) e.tstInput.setAttribute("placeholder", dict.tests.placeholder);
      setHtml(e.tstPortal, dict.tests.portal);
    }

    // faq
    setTxt(e.faqEyebrow, dict.faq.eyebrow);
    setTxt(e.faqH2, dict.faq.h2);
    setTxt(e.faqLead, dict.faq.lead);
    e.faqItems.forEach(function (it, i) {
      if (!dict.faq.items[i]) return;
      setTxt(it.querySelector("summary"), dict.faq.items[i][0]);
      setHtml(it.querySelector("p"), dict.faq.items[i][1]);
      setDir(it, dict);
    });

    // direction + lang on swapped regions (Urdu = RTL)
    setDir(e.heroLeft, dict);
    setDir(e.card, dict);
    setDir(e.band, dict);
    [e.svcSec, e.pkgSec, e.tstSec].forEach(function (sec) { if (sec) setDir(sec.querySelector(".wrap") || sec, dict); });
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
