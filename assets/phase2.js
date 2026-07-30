/* ============================================================
   Caspian Diagnostic Centre — Phase 2 renderers
   Reviews · pathologist credentials · pincode coverage · TAT
   Every block is a no-op until its data exists in CDC_DATA
   (assets/phase2-data.js), so shipping this early is safe.
   ============================================================ */
(function () {
  'use strict';
  var D = window.CDC_DATA || {};
  var WA_HELP = 'https://wa.me/919059341154?text=';

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function css(text) { var s = document.createElement('style'); s.textContent = text; document.head.appendChild(s); }
  function track(name, params) { if (typeof gtag === 'function') { try { gtag('event', name, params || {}); } catch (e) {} } }

  /* ---------- 2.1 Real patient reviews ---------- */
  (function reviews() {
    var list = D.reviews;
    if (!list || !list.length) return;
    var sec = document.querySelector('#reviews .wrap');
    if (!sec) return;

    css('.cdc-rev-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:32px}' +
      '.cdc-rev{background:#fff;border:1px solid var(--line,#e3ecf3);border-radius:16px;padding:20px 18px;box-shadow:0 2px 10px rgba(15,23,42,.05);display:flex;flex-direction:column;gap:8px}' +
      '.cdc-rev .st{color:#b06000;font-weight:800;font-size:14px;letter-spacing:2px}' +
      '.cdc-rev .tx{color:#33445c;font-size:14.5px;line-height:1.6;margin:0}' +
      '.cdc-rev .nm{margin-top:auto;font-weight:700;color:#0f2444;font-size:13.5px}' +
      '.cdc-rev .nm small{display:block;font-weight:600;color:#5b6b7a;font-size:12px;margin-top:1px}' +
      '.cdc-rev-count{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:14px;color:#33445c;font-weight:600}');

    // Hide the third-party widget once curated reviews are live
    var widget = sec.querySelector('[class*="elfsight-app"]');
    if (widget && widget.parentElement) widget.parentElement.style.display = 'none';

    var grid = el('div', { class: 'cdc-rev-grid' });
    list.slice(0, 6).forEach(function (r) {
      var stars = '★★★★★'.slice(0, Math.max(1, Math.min(5, r.rating || 5)));
      grid.appendChild(el('article', { class: 'cdc-rev' },
        '<div class="st" aria-hidden="true">' + stars + '</div>' +
        '<p class="tx">“' + esc(r.text) + '”</p>' +
        '<div class="nm">' + esc(r.name) + (r.when ? '<small>' + esc(r.when) + ' · Google review</small>' : '<small>Google review</small>') + '</div>'));
    });
    sec.appendChild(grid);

    // Review count beside the 4.9 badge(s), linked to the Google profile
    if (D.reviewCount) {
      var badge = document.querySelector('.grating');
      if (badge) {
        var lbl = badge.querySelector('.glbl');
        if (lbl) lbl.innerHTML += ' · <b>' + esc(D.reviewCount) + ' reviews</b>';
        badge.setAttribute('aria-label', 'Rated 4.9 out of 5 from ' + D.reviewCount + ' Google reviews — read them on Google');
        if (D.reviewsUrl) badge.href = D.reviewsUrl;
      }
      var head = sec.querySelector('.center');
      if (head) head.appendChild(el('div', { class: 'cdc-rev-count' },
        '<span aria-hidden="true" style="color:#b06000">★</span> 4.9 from <a href="' + esc(D.reviewsUrl || '#') + '" target="_blank" rel="noopener" style="color:var(--blue,#1a56db);font-weight:700">' + esc(D.reviewCount) + ' Google reviews</a>'));
    }
  })();

  /* ---------- 2.3 Pathologist credentials / NABL ---------- */
  (function credentials() {
    var p = D.pathologist;
    if (!p || !p.name) return;
    var why = document.querySelector('#why .wrap');
    if (!why) return;
    css('.cdc-cred{max-width:640px;margin:34px auto 0;background:#fff;border:1px solid var(--line,#e3ecf3);border-left:4px solid var(--blue,#1a56db);border-radius:14px;padding:18px 22px;box-shadow:0 2px 10px rgba(15,23,42,.05)}' +
      '.cdc-cred b{color:#0f2444;font-size:15.5px}.cdc-cred span{display:block;color:#33445c;font-size:14px;margin-top:3px;line-height:1.5}' +
      '.cdc-cred .nabl{display:inline-block;margin-top:8px;background:#eef4ff;color:#153e8a;font-weight:700;font-size:12.5px;padding:4px 10px;border-radius:8px}');
    var html = '<b>Reports verified by ' + esc(p.name) + '</b><span>' + esc(p.quals || '') + '</span>';
    if (D.nabl && D.nabl.certNo) html += '<span class="nabl">NABL accredited · Certificate ' + esc(D.nabl.certNo) + '</span>';
    why.appendChild(el('div', { class: 'cdc-cred' }, html));
  })();

  /* ---------- 2.6 Turnaround times ---------- */
  (function tat() {
    var rows = D.tat;
    if (!rows || !rows.length) return;
    css('.cdc-tat{width:100%;border-collapse:collapse;margin-top:10px;font-size:14px}' +
      '.cdc-tat th,.cdc-tat td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line,#e3ecf3);color:#33445c}' +
      '.cdc-tat th{color:#0f2444;font-size:13px}');
    var table = '<table class="cdc-tat"><caption style="text-align:left;font-weight:700;color:#0f2444;padding:4px 0 8px">Typical report turnaround times</caption>' +
      '<thead><tr><th scope="col">Test category</th><th scope="col">Report in</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + esc(r.category) + '</td><td>' + esc(r.time) + '</td></tr>'; }).join('') +
      '</tbody></table>';
    // Extend the existing FAQ answer about report timing
    var items = document.querySelectorAll('#faq details.faq-item');
    for (var i = 0; i < items.length; i++) {
      var s = items[i].querySelector('summary');
      if (s && /receive my report/i.test(s.textContent)) {
        items[i].appendChild(el('div', null, table));
        return;
      }
    }
    // Fallback: append as its own FAQ item
    var listEl = document.querySelector('#faq .faq-list');
    if (listEl) listEl.appendChild(el('details', { class: 'faq-item' }, '<summary>How soon will my report be ready?</summary>' + table));
  })();

  /* ---------- 2.5 Home-collection coverage + pincode validation ---------- */
  (function coverage() {
    var pins = (D.pincodes || []).map(function (p) { return typeof p === 'string' ? { code: p, area: '' } : p; });
    if (!pins.length) return;

    // Coverage list in the Home Collection band
    var band = document.querySelector('#home-collection .band > div:first-child');
    if (band) {
      css('.cdc-pins{margin-top:12px;font-size:14px;line-height:1.7}.cdc-pins b{display:block;margin-bottom:2px}' +
        '.cdc-pins .pc{display:inline-block;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:2px 9px;margin:2px 3px 2px 0;font-weight:600;font-size:13px}');
      var chips = pins.map(function (p) { return '<span class="pc">' + esc(p.area ? p.area + ' – ' + p.code : p.code) + '</span>'; }).join('');
      band.appendChild(el('div', { class: 'cdc-pins' },
        '<b>We collect from:</b> ' + chips + (D.visitWindow ? '<br><b style="margin-top:6px">Visit timings:</b> ' + esc(D.visitWindow) : '')));
    }

    // Pincode field in the booking form (only matters for Home collection)
    var addrWrap = document.getElementById('bkAddrWrap');
    var form = document.getElementById('bkForm');
    if (!addrWrap || !form) return;
    var f = el('div', { class: 'bk-f', id: 'bkPinWrap' },
      '<label for="bkPin">Pincode <span class="req">*</span></label>' +
      '<input id="bkPin" type="text" inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="6-digit pincode">');
    addrWrap.parentNode.insertBefore(f, addrWrap.nextSibling);
    f.style.display = 'none';
    // mirror visibility of the address block (address only shows in home mode)
    var sync = function () { f.style.display = addrWrap.style.display; };
    new MutationObserver(sync).observe(addrWrap, { attributes: true, attributeFilter: ['style'] });
    sync();

    var codes = pins.map(function (p) { return String(p.code); });
    form.addEventListener('submit', function (ev) {
      var isHome = addrWrap.style.display !== 'none';
      if (!isHome) return;
      var v = (document.getElementById('bkPin').value || '').replace(/\D/g, '');
      var err = document.getElementById('bkErr');
      function stop(msg) {
        ev.preventDefault(); ev.stopImmediatePropagation();
        if (err) { err.innerHTML = msg; err.style.display = 'block'; }
        var pinEl = document.getElementById('bkPin');
        if (pinEl) { pinEl.setAttribute('aria-invalid', 'true'); try { pinEl.focus(); } catch (e) {} }
      }
      var pinEl = document.getElementById('bkPin');
      if (pinEl) pinEl.removeAttribute('aria-invalid');
      if (!/^\d{6}$/.test(v)) { stop('Please enter the 6-digit pincode for the collection address.'); return; }
      if (codes.indexOf(v) === -1) {
        track('pincode_outside_coverage', { event_category: 'booking', event_label: v });
        stop('We don’t cover pincode <b>' + esc(v) + '</b> for home collection yet — but we may still be able to help. ' +
          '<a href="' + WA_HELP + encodeURIComponent('Hi Caspian Diagnostic Centre, I’d like a home collection at pincode ' + v + ' — is that possible?') + '" target="_blank" rel="noopener" style="font-weight:700">Message us on WhatsApp</a> or visit our centre — we’re open 24/7.');
        return;
      }
    }, true); // capture: runs before the main booking handler
  })();
})();
