/*
  REPORT EXPLAINER. Sits on a page that has no boxes to fill (the /reports
  guide on caspianhealthcare.in, and "Read my report" on caspianlabs.in).
  Uses report-reader.js to read the PDF or photo on the device, then shows
  each recognised value against the usual range, in plain words, with a link
  to the calculator that works that value up. The values go to the calculator
  in the URL hash, which never reaches a server.

  The ranges below are the ones the /reports page prints. Where the lab has
  printed its own reference range, that range is shown too and used for the
  tests whose ranges differ between labs (liver enzymes, TSH, calcium).

  USE
    ReportExplain.mount('#selector', { tools: 'https://www.caspianhealthcare.in' })
  tools is the base of the calculator links (default: same site).
*/
(function () {
  'use strict';
  if (!window.ReportReader) return;
  var RR = window.ReportReader, esc = RR.esc;

  // [key, label, unit, band function -> [class, words], tool, toolKeys]
  // class: ok, warn, bad, info.
  function b(cls, t) { return [cls, t]; }
  var GROUPS = [
    { name: 'Sugar', rows: [
      ['hba1c', 'HbA1c', '%', function (v) { return v < 5.7 ? b('ok', 'Below 5.7: not in the diabetes range') : v < 6.5 ? b('warn', '5.7 to 6.4: prediabetes range') : b('bad', '6.5 or above: diabetes range (or, if you already have diabetes, your control number; most targets are under 7)'); }, 'tools/diabetes-type', ['hba1c', 'fpg', 'tg', 'hdl', 'cpep', 'cpepU', 'gad', 'ia2', 'znt8', 'bket', 'ht', 'wt', 'age', 'sex']],
      ['fpg', 'Fasting glucose', 'mg/dL', function (v) { return v < 100 ? b('ok', 'Under 100: normal') : v < 126 ? b('warn', '100 to 125: prediabetes range') : b('bad', '126 or above: diabetes range, if repeated'); }],
      ['ppg', 'Glucose 2 hours after food', 'mg/dL', function (v) { return v < 140 ? b('ok', 'Under 140: normal') : v < 200 ? b('warn', '140 to 199: prediabetes range') : b('bad', '200 or above: diabetes range, if repeated'); }],
      ['cpep', 'C-peptide', '', function (v, f, F) { var u = F.cpepU ? F.cpepU.v : 'ngml'; return b('info', 'Shows how much insulin your own pancreas makes. Read it with the glucose at the same time and with the type-of-diabetes calculator.'); }],
      ['gad', 'GAD antibody', '', function (v) { return v === 'pos' ? b('warn', 'Positive: points towards autoimmune (type 1 or LADA) diabetes') : b('ok', 'Negative'); }],
      ['bket', 'Blood ketones', 'mmol/L', function (v) { return v < 0.6 ? b('ok', 'Under 0.6: normal') : v < 1.5 ? b('warn', '0.6 to 1.4: raised, drink fluids and recheck') : v < 3 ? b('bad', '1.5 to 2.9: high, contact the clinic today') : b('bad', '3 or above: possible ketoacidosis, emergency'); }]
    ] },
    { name: 'Cholesterol (lipid profile)', rows: [
      ['ldl', 'LDL cholesterol', 'mg/dL', function (v) { return v < 100 ? b('ok', 'Under 100: the general aim (under 70 with diabetes plus other risk, or heart disease)') : v < 130 ? b('warn', '100 to 129: above the general aim') : v < 190 ? b('warn', '130 or above: raised') : b('bad', '190 or above: very high; an inherited cause is possible'); }, 'tools/lpa-risk', ['lpa', 'lpaU', 'tc', 'hdl', 'ldl', 'tg', 'egfr', 'cac', 'age', 'sex']],
      ['hdl', 'HDL cholesterol', 'mg/dL', function (v, f, F) { var fem = F.sex && F.sex.v === 'f'; var lim = fem ? 50 : 40; return v > lim ? b('ok', 'Above ' + lim + ': good (higher is better)') : b('warn', lim + ' or below: low for ' + (F.sex ? (fem ? 'a woman' : 'a man') : 'most adults')); }],
      ['tg', 'Triglycerides', 'mg/dL', function (v) { return v < 150 ? b('ok', 'Under 150: normal') : v < 500 ? b('warn', '150 or above: raised; moves fastest with sugar, alcohol and refined carbohydrate') : b('bad', '500 or above: very high, needs treatment'); }],
      ['tc', 'Total cholesterol', 'mg/dL', function (v) { return b('info', (v < 200 ? 'Under 200. ' : '200 or above. ') + 'The least useful of the four: it adds the good to the bad. Read LDL and non-HDL instead.'); }],
      ['nonhdl', 'Non-HDL cholesterol', 'mg/dL', function (v) { return v < 130 ? b('ok', 'Under 130: the general aim') : b('warn', '130 or above: raised; a better risk marker than LDL alone in diabetes'); }],
      ['lpa', 'Lipoprotein(a)', '', function (v, f, F) { var nm = F.lpaU && F.lpaU.v === 'nmol'; var x = nm ? v : v * 2.5; return x >= 125 ? b('warn', (nm ? '125 nmol/L' : '50 mg/dL') + ' or above: raised. Lp(a) is inherited and does not change with diet; it adds to heart risk') : x >= 75 ? b('info', (nm ? '75 to 125 nmol/L' : '30 to 50 mg/dL') + ': grey zone; adds a little risk, read with the rest of the profile') : b('ok', 'Below ' + (nm ? '75 nmol/L' : '30 mg/dL') + ': not raised'); }]
    ] },
    { name: 'Liver', rows: [
      ['alt', 'ALT (SGPT)', 'U/L', function (v, f) { var hi = f.ref && f.ref[1] ? f.ref[1] : 40; return v <= hi ? b('ok', 'Within the lab’s range') : v <= hi * 3 ? b('warn', 'Mildly raised: in this clinic most often fatty liver, which reverses with weight and sugar control') : b('bad', 'More than three times the upper limit: needs a doctor soon'); }, 'obesity/tools/liver', ['alt', 'ast', 'plt', 'age']],
      ['ast', 'AST (SGOT)', 'U/L', function (v, f) { var hi = f.ref && f.ref[1] ? f.ref[1] : 40; return v <= hi ? b('ok', 'Within the lab’s range') : v <= hi * 3 ? b('warn', 'Mildly raised; read with ALT') : b('bad', 'More than three times the upper limit: needs a doctor soon'); }],
      ['ggt', 'GGT', 'U/L', function (v, f) { var hi = f.ref && f.ref[1] ? f.ref[1] : 55; return v <= hi ? b('ok', 'Within the lab’s range') : b('warn', 'Raised: alcohol, fatty liver and some medicines raise it'); }],
      ['alp', 'Alkaline phosphatase', 'U/L', function (v, f) { var hi = f.ref && f.ref[1] ? f.ref[1] : 130; return v <= hi ? b('ok', 'Within the lab’s range') : b('warn', 'Raised: bile duct, bone or growth; your doctor will read it with GGT'); }],
      ['bil', 'Total bilirubin', 'mg/dL', function (v) { return v <= 1.2 ? b('ok', 'Up to 1.2: normal') : v <= 3 ? b('warn', 'Mildly raised; on its own with normal enzymes this is often Gilbert’s syndrome, which is harmless') : b('bad', 'Above 3: needs a doctor soon'); }],
      ['alb', 'Albumin', 'g/dL', function (v) { return v >= 3.5 ? b('ok', '3.5 or above: normal') : b('warn', 'Below 3.5: low; long illness, liver or kidney disease, or poor intake'); }]
    ] },
    { name: 'Thyroid', rows: [
      ['tsh', 'TSH', 'mIU/L', function (v, f) { var lo = f.ref && f.ref[0] != null ? f.ref[0] : 0.4, hi = f.ref && f.ref[1] ? f.ref[1] : 4.0; return v < lo ? b('warn', 'Below ' + lo + ': low TSH, which (counter-intuitively) means an overactive thyroid; repeat with free T4') : v <= hi ? b('ok', lo + ' to ' + hi + ': normal') : v <= 10 ? b('warn', 'Above ' + hi + ': mildly raised, an underactive thyroid is possible; repeat with free T4 before treating') : b('bad', 'Above 10: raised, see your doctor'); }],
      ['ft4', 'Free T4', 'ng/dL', function (v, f) { var lo = f.ref && f.ref[0] != null ? f.ref[0] : 0.8, hi = f.ref && f.ref[1] ? f.ref[1] : 1.8; return v < lo ? b('warn', 'Below the range: read with TSH') : v > hi ? b('warn', 'Above the range: read with TSH') : b('ok', 'Within the range'); }]
    ] },
    { name: 'Kidney', rows: [
      ['egfr', 'eGFR', 'mL/min/1.73m²', function (v) { return v >= 90 ? b('ok', '90 or above: normal') : v >= 60 ? b('info', '60 to 89: mildly reduced; normal for many older adults; read with the urine test') : v >= 30 ? b('warn', '30 to 59: reduced; chronic kidney disease if it stays there for 3 months') : b('bad', 'Below 30: severely reduced, see a doctor soon'); }, 'tools/egfr', ['cr', 'cys', 'acr', 'acrU', 'pcr', 'k', 'age', 'sex', 'ht', 'wt']],
      ['cr', 'Creatinine', 'mg/dL', function (v, f, F) { return b('info', F.egfr ? 'Hard to read on its own; eGFR above is the number to use.' : 'Hard to read on its own because it depends on muscle. The kidney calculator turns it into eGFR.'); }],
      ['cys', 'Cystatin C', 'mg/L', function (v) { return v <= 1.0 ? b('ok', 'Up to 1.0: normal') : b('warn', 'Above 1.0: suggests reduced kidney filtering; more accurate than creatinine in Indians'); }],
      ['acr', 'Urine albumin-creatinine ratio', '', function (v, f, F) { var mm = F.acrU && F.acrU.v === 'mgmmol'; var x = mm ? v * 8.84 : v; return x < 30 ? b('ok', 'Under 30 mg/g: normal') : x < 300 ? b('warn', '30 to 299 mg/g: moderately increased; the earliest sign of diabetic kidney disease, and treatable; repeat on an early-morning sample') : b('bad', '300 mg/g or above: severely increased, see your doctor'); }],
      ['urea', 'Urea', 'mg/dL', function (v) { return v <= 45 ? b('ok', 'Within the usual range') : b('warn', 'Raised: dehydration, high protein intake or reduced kidney function; read with creatinine'); }],
      ['uric', 'Uric acid', 'mg/dL', function (v, f, F) { var lim = F.sex && F.sex.v === 'f' ? 6 : 7; return v <= lim ? b('ok', 'Up to ' + lim + ': normal') : b('warn', 'Above ' + lim + ': raised; gout and kidney stones become more likely'); }],
      ['k', 'Potassium', 'mmol/L', function (v) { return v < 3.5 ? b('warn', 'Below 3.5: low') : v <= 5.0 ? b('ok', '3.5 to 5.0: normal') : v <= 5.5 ? b('warn', '5.1 to 5.5: mildly high; some blood-pressure and kidney medicines do this; repeat') : b('bad', 'Above 5.5: high, same-day review'); }],
      ['na', 'Sodium', 'mmol/L', function (v) { return v < 135 ? b('warn', 'Below 135: low') : v <= 145 ? b('ok', '135 to 145: normal') : b('warn', 'Above 145: high'); }]
    ] },
    { name: 'Vitamins and blood', rows: [
      ['vitd', 'Vitamin D (25-OH)', 'ng/mL', function (v) { return v < 20 ? b('warn', 'Under 20: deficiency (near universal in urban India)') : v < 30 ? b('warn', '20 to 29: insufficiency') : v <= 100 ? b('ok', '30 or above: sufficient') : b('warn', 'Above 100: too high, stop supplements and tell your doctor'); }],
      ['b12', 'Vitamin B12', '', function (v, f, F) { var pg = F.b12U && F.b12U.v === 'pmol' ? v / 0.738 : v; return pg < 200 ? b('warn', 'Below 200 pg/mL: low; common in vegetarians and on long-term metformin or acidity tablets; tingling feet can be this') : pg < 300 ? b('info', '200 to 300 pg/mL: borderline') : b('ok', 'Not low'); }, 'tools/anaemia', ['hb', 'mcv', 'rdw', 'rbc', 'hct', 'retic', 'wbc', 'plt', 'fer', 'tsat', 'crp', 'sfe', 'tibc', 'egfr', 'b12', 'b12U', 'fol', 'a2', 'ibil', 'ldh', 'dat', 'cr', 'age', 'sex']],
      ['hb', 'Haemoglobin', 'g/dL', function (v, f, F) { var fem = F.sex && F.sex.v === 'f'; var cut = F.sex ? (fem ? 12 : 13) : 12.5; var lab = F.sex ? (fem ? '12 for women' : '13 for men') : '12 for women, 13 for men'; return v >= cut ? b('ok', 'Not anaemic (cut-off ' + lab + ')') : v >= 8 ? b('warn', 'Below ' + lab + ': anaemia; the cause must be found, most often iron') : b('bad', 'Below 8: severe anaemia, see a doctor today'); }],
      ['fer', 'Ferritin', 'ng/mL', function (v, f, F) { var inf = F.crp && F.crp.v > 5; return v < 15 ? b('warn', 'Below 15: iron stores are empty') : v < (inf ? 70 : 45) ? b('warn', 'Low iron likely' + (inf ? ' (CRP is raised, so the cut-off is 70)' : '')) : v > 500 ? b('warn', 'Above 500: high; inflammation, liver disease or iron overload') : b('ok', 'Iron stores adequate'); }],
      ['fol', 'Folate', 'ng/mL', function (v) { return v < 3 ? b('warn', 'Below 3: low') : b('ok', 'Not low'); }],
      ['plt', 'Platelets', '', function (v) { var n = v > 5000 ? v / 1000 : (v < 10 ? v * 100 : v); return n < 150 ? (n < 50 ? b('bad', 'Below 50,000: low, same-day review') : b('warn', 'Below 1.5 lakh: low; dengue, some medicines and liver disease are common causes')) : n > 450 ? b('warn', 'Above 4.5 lakh: raised; often a reaction to iron deficiency or inflammation') : b('ok', '1.5 to 4.5 lakh: normal'); }],
      ['wbc', 'White cells', '', function (v) { var n = v > 300 ? v / 1000 : v; return n < 4 ? b('warn', 'Below 4,000: low; viral fevers and some medicines') : n > 11 ? b('warn', 'Above 11,000: raised; infection or inflammation') : b('ok', '4,000 to 11,000: normal'); }],
      ['crp', 'CRP', 'mg/L', function (v) { return v <= 5 ? b('ok', 'Up to 5: not raised') : v <= 50 ? b('warn', 'Raised: inflammation or infection somewhere') : b('bad', 'Above 50: strongly raised, see a doctor'); }],
      ['esr', 'ESR', 'mm/hr', function (v) { return v <= 20 ? b('ok', 'Up to 20: not raised') : b('info', 'Raised: a non-specific marker; anaemia, age and infection all raise it'); }],
      ['ca', 'Calcium', 'mg/dL', function (v, f) { var lo = f.ref && f.ref[0] != null ? f.ref[0] : 8.5, hi = f.ref && f.ref[1] ? f.ref[1] : 10.5; return v < lo ? b('warn', 'Below the range: low; read with albumin and vitamin D') : v > hi ? b('warn', 'Above the range: high; needs a repeat and a parathyroid hormone test') : b('ok', 'Within the range'); }],
      ['psa', 'PSA', 'ng/mL', function (v) { return v < 4 ? b('ok', 'Below 4: in the usual range (age-specific limits are lower for younger men)') : b('warn', '4 or above: raised; infection, enlargement or cancer can do this; a urologist should see it'); }]
    ] },
    { name: 'Heart', rows: [
      ['ntprobnp', 'NT-proBNP', 'pg/mL', function (v) { return v < 125 ? b('ok', 'Below 125: heart failure unlikely') : v < 450 ? b('warn', '125 or above: needs an echo to look for heart failure') : b('bad', 'Well above 125: see a doctor soon'); }, 'tools/heart-failure', ['ntprobnp', 'bnp', 'lvef', 'ee', 'pasp', 'qrs', 'egfr', 'cr', 'k', 'fer', 'tsat', 'fpg', 'hdl', 'age', 'sex', 'ht', 'wt']],
      ['bnp', 'BNP', 'pg/mL', function (v) { return v < 35 ? b('ok', 'Below 35: heart failure unlikely') : b('warn', '35 or above: needs an echo'); }],
      ['lvef', 'Ejection fraction (LVEF)', '%', function (v) { return v >= 50 ? b('ok', '50 or above: pumping function preserved') : v >= 41 ? b('warn', '41 to 49: mildly reduced') : b('bad', '40 or below: reduced; heart failure treatment makes a large difference here'); }],
      ['pasp', 'Pulmonary artery pressure (PASP)', 'mmHg', function (v) { return v <= 35 ? b('ok', 'Up to 35: normal') : b('warn', 'Above 35: raised pressure in the lung circulation; read with the rest of the echo'); }],
      ['qrs', 'QRS duration', 'ms', function (v) { return v < 120 ? b('ok', 'Below 120: normal') : b('info', '120 or above: wide; matters for device decisions in heart failure'); }],
      ['cac', 'Coronary calcium score', '', function (v) { return v === 0 ? b('ok', 'Zero: no calcified plaque seen') : v < 100 ? b('info', '1 to 99: some plaque') : v < 400 ? b('warn', '100 to 399: moderate plaque; statin treatment is usually advised') : b('bad', '400 or above: extensive plaque'); }]
    ] },
    { name: 'Blood gas', rows: [
      ['ph', 'pH', '', function (v) { return v < 7.35 ? b('bad', 'Below 7.35: acidosis') : v > 7.45 ? b('bad', 'Above 7.45: alkalosis') : b('ok', '7.35 to 7.45: normal'); }],
      ['pco2', 'pCO₂', 'mmHg', function (v) { return v < 35 ? b('warn', 'Below 35: low') : v > 45 ? b('warn', 'Above 45: high') : b('ok', '35 to 45: normal'); }],
      ['po2', 'pO₂', 'mmHg', function (v) { return v < 60 ? b('bad', 'Below 60: low oxygen') : v < 80 ? b('warn', '60 to 79: slightly low') : b('ok', '80 or above: normal (arterial)'); }],
      ['hco3', 'Bicarbonate', 'mmol/L', function (v) { return v < 22 ? b('warn', 'Below 22: low') : v > 28 ? b('warn', 'Above 28: high') : b('ok', '22 to 28: normal'); }],
      ['lact', 'Lactate', 'mmol/L', function (v) { return v <= 2 ? b('ok', 'Up to 2: normal') : v <= 4 ? b('warn', '2 to 4: raised') : b('bad', 'Above 4: high'); }]
    ] },
    { name: 'CGM (sensor) report', rows: [
      ['tir', 'Time in range (70 to 180)', '%', function (v) { return v >= 70 ? b('ok', '70% or more: the consensus target') : v >= 50 ? b('warn', 'Below 70%: room to improve') : b('bad', 'Below 50%: well below target'); }, 'tools/cgm-report', ['tir', 'vhigh', 'high', 'low', 'vlow', 'gmean', 'gmeanU', 'gmi', 'gcv', 'gactive', 'gdays', 'hba1c']],
      ['vlow', 'Time very low (below 54)', '%', function (v) { return v <= 1 ? b('ok', '1% or less: at target') : b('bad', 'Above 1%: too many serious lows'); }],
      ['low', 'Time low (54 to 69)', '%', function (v) { return v <= 4 ? b('ok', '4% or less: at target') : b('warn', 'Above 4%: too many lows'); }],
      ['gmi', 'GMI', '%', function (v) { return v < 7 ? b('ok', 'Below 7: at the usual target') : b('warn', '7 or above: above the usual target'); }],
      ['gcv', 'Variability (CV)', '%', function (v) { return v <= 36 ? b('ok', '36% or less: stable') : b('warn', 'Above 36%: unstable sugars'); }],
      ['gactive', 'Sensor active', '%', function (v) { return v >= 70 ? b('ok', '70% or more: enough data') : b('warn', 'Below 70%: not enough data to judge'); }]
    ] }
  ];
  var ALLKEYS = [];
  GROUPS.forEach(function (g) { g.rows.forEach(function (r) { ALLKEYS.push(r[0]); (r[5] || []).forEach(function (k) { if (ALLKEYS.indexOf(k) < 0) ALLKEYS.push(k); }); }); });

  function fmt(v) { return typeof v === 'number' ? (Math.round(v * 100) / 100).toString() : String(v); }
  function refText(f) { if (!f.ref) return ''; return f.ref[0] == null ? 'under ' + f.ref[1] : f.ref[0] + ' to ' + f.ref[1]; }

  function mount(sel, o) {
    o = o || {};
    var host = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!host) return;
    host.innerHTML = '<div class="rr-up"></div><div class="rr-sum"></div>';
    var up = host.querySelector('.rr-up'), sum = host.querySelector('.rr-sum');
    var base = (o.tools || '').replace(/\/$/, '');
    RR.attach({
      mount: up, keysOnly: true, keys: ALLKEYS, fields: {},
      title: o.title || 'Read my report',
      intro: o.intro || 'Choose the lab’s PDF, or a clear photo of each page. The report is read on this phone or computer and is <strong>not uploaded anywhere</strong>. You get each value against its usual range, in plain words.',
      button: o.button || 'Upload my report (PDF or photo)',
      labels: labelsOf(), show: { sex: { m: 'male', f: 'female' }, gad: { pos: 'positive', neg: 'negative' }, ia2: { pos: 'positive', neg: 'negative' }, znt8: { pos: 'positive', neg: 'negative' } },
      onFound: function (F, C) { render(F, C); },
      onUndo: function () { sum.innerHTML = ''; }
    });

    function labelsOf() { var L = {}; GROUPS.forEach(function (g) { g.rows.forEach(function (r) { L[r[0]] = r[1]; }); }); L.age = 'Age'; L.sex = 'Sex'; L.cr = L.cr || 'Creatinine'; return L; }

    function render(F, C) {
      var h = '', any = 0, flags = { bad: 0, warn: 0 };
      GROUPS.forEach(function (g) {
        var rows = g.rows.filter(function (r) { return F[r[0]] != null; });
        if (!rows.length) return;
        any += rows.length;
        var tool = null;
        g.rows.forEach(function (r) { if (!tool && r[4]) tool = r; });
        h += '<h3>' + esc(g.name) + '</h3><div class="rr-scroll"><table><thead><tr><th>Test</th><th>Your value</th><th>What it means</th></tr></thead><tbody>';
        rows.forEach(function (r) {
          var f = F[r[0]], res;
          try { res = r[3](f.v, f, F); } catch (e) { res = ['info', '']; }
          if (res[0] === 'bad') flags.bad++; if (res[0] === 'warn') flags.warn++;
          var unit = r[2] || (F[r[0] + 'U'] ? ({ pg: 'pg/mL', pmol: 'pmol/L', nmol: 'nmol/L', mgdl: 'mg/dL', mmol: 'mmol/L', mgg: 'mg/g', mgmmol: 'mg/mmol', ngml: 'ng/mL', pmoll: 'pmol/L', nmoll: 'nmol/L' })[F[r[0] + 'U'].v] || '' : '');
          var shownV = (r[0] === 'gad' || r[0] === 'ia2' || r[0] === 'znt8') ? (f.v === 'pos' ? 'positive' : 'negative') + (f.num != null ? ' (' + f.num + ')' : '') : fmt(f.v) + (unit ? ' ' + unit : '');
          h += '<tr><td><strong>' + esc(r[1]) + '</strong>' + (f.date && C && C.dated.length > 1 ? '<br><small class="rr-note">' + RR.fmtDay(f.date) + '</small>' : '') + '</td><td class="rr-num">' + esc(shownV) + (f.weak ? ' <span title="Less certain">?</span>' : '') + (f.ref ? '<br><small class="rr-note" style="font-weight:400">lab range ' + esc(refText(f)) + '</small>' : '') + '</td><td><span class="rr-dot rr-' + res[0] + '"></span>' + esc(res[1]) + '</td></tr>';
        });
        h += '</tbody></table></div>';
        if (tool && tool[4]) {
          var keys = tool[5].filter(function (k) { return F[k] != null; });
          if (keys.length) h += '<p class="rr-row"><a class="rr-btn rr-ghost" href="' + base + '/' + tool[4] + '#rr=' + RR.encode(F, keys) + '">Work this up in the ' + esc(toolName(tool[4])) + ' &rarr;</a></p>';
        }
      });
      var lead = '';
      if (!any) lead = '<div class="rr-msg rr-warn"><p>Nothing here matched the tests this page knows. The reader covers sugar, lipids, liver, thyroid, kidney, vitamins, blood counts, heart tests, blood gas and sensor reports.</p></div>';
      else lead = '<div class="rr-msg ' + (flags.bad ? 'rr-bad' : flags.warn ? 'rr-warn' : 'rr-ok') + '"><p><strong>' + any + ' value' + (any > 1 ? 's' : '') + ' explained below.</strong> ' + (flags.bad ? flags.bad + ' well outside the range. ' : '') + (flags.warn ? flags.warn + ' outside the usual range. ' : '') + 'One flagged value is a reason to repeat or discuss, not a diagnosis.</p></div>';
      sum.innerHTML = '<div class="rr" style="border-style:solid">' + lead + h + (any ? '<p class="rr-note">Ranges are general ones for adults who are not pregnant. Where the lab printed its own range it is shown under the value. Take this page to your doctor; nothing you uploaded has left this device.</p>' : '') + '</div>';
      var st = document.getElementById('rr-style2');
      if (!st) { st = document.createElement('style'); st.id = 'rr-style2'; st.textContent = '.rr .rr-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px;vertical-align:-1px}.rr .rr-dot.rr-ok{background:#1d7a46}.rr .rr-dot.rr-warn{background:#e0a100}.rr .rr-dot.rr-bad{background:#b3261e}.rr .rr-dot.rr-info{background:#0b6fc2}.rr .rr-sum table td:first-child{min-width:140px}'; document.head.appendChild(st); }
      sum.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function toolName(slug) { return { 'tools/diabetes-type': 'diabetes type calculator', 'tools/lpa-risk': 'Lp(a) heart risk check', 'obesity/tools/liver': 'liver score calculator', 'tools/egfr': 'kidney (eGFR) calculator', 'tools/anaemia': 'anaemia work-up', 'tools/heart-failure': 'heart failure check', 'tools/cgm-report': 'CGM report reader' }[slug] || slug; }
  }
  window.ReportExplain = { mount: mount, GROUPS: GROUPS, KEYS: ALLKEYS };
})();
