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
