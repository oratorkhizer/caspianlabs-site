/* Microsoft Clarity loader for www.caspianlabs.in. Added 3 November 2026,
   approved by Dr Khizer. The project is set to Strict masking.

   Microsoft's terms say Clarity must never process health data, so it runs
   on public information pages only. It never runs on:
     /pay              payment page
     /read-my-report   the on-device report reader (PDF and photo)
     /r/...            report links
     /api/...          server endpoints
   pay.html and read-my-report.html do not load this file at all; the path
   check below is a second lock.

   The home page has the booking and payment window (#bkOv). Any element
   marked data-clarity-stop stops recording the moment it is shown, and if it
   is already open when the page loads, Clarity is never started.

   It waits for the page to finish loading, so it never holds up the first
   paint. Only the live host records; previews and localhost never do. */
(function () {
  "use strict";
  var ID = "z7zi8rkfnw";
  var HOSTS = ["www.caspianlabs.in", "caspianlabs.in"];
  var EXCLUDE = ["/pay", "/read-my-report", "/r", "/api"];

  if (window.__cdcClarity) return;
  window.__cdcClarity = true;
  if (HOSTS.indexOf(location.hostname) === -1) return;

  function norm(raw) {
    var p = String(raw || "/").split(/[?#]/)[0].toLowerCase();
    p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+/g, "/");
    if (p.length > 1) p = p.replace(/\/$/, "");
    return p || "/";
  }
  function allowed(raw) {
    var p = norm(raw);
    for (var i = 0; i < EXCLUDE.length; i++) {
      if (p === EXCLUDE[i] || p.indexOf(EXCLUDE[i] + "/") === 0) return false;
    }
    return true;
  }

  var started = false, stopped = false;

  function shown(el) {
    try { return getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden"; }
    catch (e) { return false; }
  }
  function anyStopShown() {
    var els = document.querySelectorAll("[data-clarity-stop]");
    for (var i = 0; i < els.length; i++) if (shown(els[i])) return true;
    return false;
  }
  function stop() {
    if (stopped) return;
    stopped = true;
    if (started && typeof window.clarity === "function") {
      try { window.clarity("stop"); } catch (e) { /* ignore */ }
    }
  }

  function start() {
    if (started || stopped) return;
    if (!allowed(location.pathname)) return;
    if (anyStopShown()) { stopped = true; return; }
    started = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", ID);

    var els = document.querySelectorAll("[data-clarity-stop]");
    if (els.length && window.MutationObserver) {
      var mo = new MutationObserver(function () { if (anyStopShown()) { stop(); mo.disconnect(); } });
      for (var j = 0; j < els.length; j++) mo.observe(els[j], { attributes: true, attributeFilter: ["class", "style", "hidden"] });
    }
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();


/* Diabetes Promise bar for World Diabetes Day 2026, added 11 Nov 2026 at Dr Khizer's request.
   It links to caspianfoundation.in/pledge, removes itself after 30 Nov 2026,
   and can be deleted from this file any time after that. */
(function () {
  try {
    if (new Date() > new Date('2026-12-01T00:00:00+05:30')) return;
    if (/\/pledge/.test(location.pathname)) return;
    try { if (localStorage.getItem('dp_bar_x')) return; } catch (e) {}
    var src = location.hostname.replace(/^www\./, '');
    var bar = document.createElement('div');
    bar.id = 'dp-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'World Diabetes Day');
    bar.style.cssText = 'position:relative;z-index:2147483000;background:#1d6b52;color:#fff;font:600 15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:10px 46px 10px 16px;text-align:center';
    bar.innerHTML = 'World Diabetes Day, 14 Nov: <a href="https://caspianfoundation.in/pledge?utm_source=' + src + '&utm_medium=banner" style="color:#f2cc8f;text-decoration:underline">make your Diabetes Promise in one minute</a>' +
      '<button type="button" aria-label="Close" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 8px">&times;</button>';
    bar.querySelector('button').onclick = function () {
      bar.remove();
      try { localStorage.setItem('dp_bar_x', '1'); } catch (e) {}
    };
    var add = function () { document.body.insertBefore(bar, document.body.firstChild); };
    if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  } catch (e) {}
})();
