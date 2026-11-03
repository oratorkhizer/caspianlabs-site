// Scroll-moment analytics: sends to Caspian's own event log, and to GA4 / Vercel if the page has them.
(function(){
  if (window.sigTrack) return;
  var URL_ = "https://gjpbiiqkvzysmdpioexk.supabase.co/functions/v1/moment-event";
  var sent = {};
  function vid(){ try{ var v=localStorage.getItem("sig-vid"); if(!v){ v=Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem("sig-vid",v);} return v; }catch(e){ return "anon"; } }
  window.sigTrack = function(site, ev, meta, repeat){
    if (!repeat) { if (sent[site+ev]) return; sent[site+ev]=1; }
    var body = JSON.stringify({ site:site, event:ev, path:location.pathname, visitor:vid(),
      device: innerWidth<=760 ? "phone":"desk", meta: meta||null });
    try { if (!(navigator.sendBeacon && navigator.sendBeacon(URL_, body))) fetch(URL_, {method:"POST", body:body, keepalive:true}); } catch(e){}
    try { if (window.gtag) gtag("event", "moment_"+ev, Object.assign({ site:site }, meta||{})); } catch(e){}
    try { if (window.va) va("event", { name:"moment_"+ev, data:Object.assign({ site:site }, meta||{}) }); } catch(e){}
  };
})();

/* Signature scroll moment (Nov 2026, v2): "From a tube to a report you can understand".
   v2: the first frame is the page's hero (H1, one line, Book / WhatsApp / Call), the section is
   shorter, a visitor who has seen it once gets the end state as one screen (with Replay), and
   every step is measured with sigTrack (site key "labs").
   One scroll handler, one progress value p (0..1) drives everything, so it also runs backwards.
   Reduced motion, or no clip-path support: nothing is switched on and the flat layout stays. */
(function () {
  var root = document.getElementById("t2r");
  if (!root) return;
  var SITE = "labs", KEY = "sig-seen-labs";
  var track = function (ev, meta, rep) { try { window.sigTrack && window.sigTrack(SITE, ev, meta, rep); } catch (e) {} };

  // view: the moment is first on screen
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      if (en.some(function (x) { return x.isIntersecting; })) { track("view"); io.disconnect(); }
    });
    io.observe(root);
  } else { track("view"); }
  // cta: any link or button inside the moment (Skip and Replay have their own events)
  root.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a,button");
    if (!a || !root.contains(a) || a.classList.contains("t2r-skip") || a.classList.contains("t2r-replay")) return;
    var href = a.getAttribute("href") || "";
    track("cta", { label: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40), href: href.split("?")[0] }, true);
  });
  function markSeen() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  var skip = root.querySelector(".t2r-skip");
  if (skip) skip.addEventListener("click", function () {
    markSeen(); track("skip");
    // jump as the link says, then drop the #home from the address bar
    setTimeout(function () { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }, 0);
  });

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clipOk = window.CSS && CSS.supports && (CSS.supports("clip-path", "inset(0 0 0 0)") || CSS.supports("-webkit-clip-path", "inset(0 0 0 0)"));
  var stickyOk = window.CSS && CSS.supports && CSS.supports("overflow-x", "clip") && CSS.supports("position", "sticky");
  if (reduce || !clipOk || !stickyOk) return;

  var seen = false;
  try { seen = localStorage.getItem(KEY) === "1"; } catch (e) {}
  if (/[?&]replay=1(&|$)/.test(location.search)) seen = false;

  var stage = root.querySelector(".t2r-stage");
  var photo = root.querySelector(".t2r-photo");
  var label = root.querySelector(".t2r-label");
  var labIn = root.querySelector(".t2r-lab-in");
  var card = root.querySelector(".t2r-card");
  var head = card.querySelector(".t2r-head");
  var crease = root.querySelector(".t2r-crease");
  var rows = Array.prototype.slice.call(root.querySelectorAll(".t2r-row"));
  var nav = document.querySelector("header.nav");
  var bar = document.getElementById("stickyBar");

  var navEl = document.querySelector("header.nav");
  var replay = root.querySelector(".t2r-replay");
  if (seen) {
    root.classList.add("t2r-seen");
    root.style.setProperty("--hdr", (navEl ? navEl.offsetHeight : 0) + "px");
    var card0 = root.querySelector(".t2r-card");
    if (window.innerWidth <= 900) card0.classList.add("t2r-tight"); // compact card so the block stays close to one screen
    track("seen_return");
    replay.addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      track("replay");
      root.classList.remove("t2r-seen");
      card0.classList.remove("t2r-tight");
      start();
      var hdr = navEl ? navEl.offsetHeight : 0;
      window.scrollTo({ top: root.getBoundingClientRect().top + window.pageYOffset - hdr, behavior: "instant" });
      if (skip) skip.focus({ preventScroll: true });
    });
    return;
  }
  start();

  function start() {
  root.classList.add("t2r-on");

  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var out = function (t) { return 1 - Math.pow(1 - t, 3); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  // Where the middle tube sits in each photo, as fractions of the image (measured by eye).
  var TUBE = {
    desk: { nw: 1600, nh: 1066, x: .40, y: .71, w: .085, h: .27 },
    phone: { nw: 800, nh: 1111, x: .50, y: .69, w: .21, h: .27 }
  };
  var ZOOM_MAX = 1.1, ORX = .4, ORY = .7; // matches transform-origin 40% 70% in t2r.css

  var G = null; // cached geometry
  function measure() {
    var hdr = nav ? nav.offsetHeight : 0;
    root.style.setProperty("--hdr", hdr + "px");
    var b = bar && getComputedStyle(bar).display !== "none" ? bar.offsetHeight : 0;
    root.style.setProperty("--bar", b + "px");
    var sw = stage.clientWidth, sh = stage.clientHeight;
    // make the whole card fit the space between the header and the phone booking bar
    var avail = sh - b - 44 - 16;
    card.classList.remove("t2r-tight"); card.style.setProperty("--fit", 1);
    if (card.offsetHeight > avail) card.classList.add("t2r-tight");
    if (card.offsetHeight > avail) card.style.setProperty("--fit", (avail / card.offsetHeight).toFixed(4));
    var t = window.innerWidth <= 760 ? TUBE.phone : TUBE.desk;
    var s = Math.max(sw / t.nw, sh / t.nh);
    var ox = (sw - t.nw * s) / 2, oy = (sh - t.nh * s) / 2;
    // tube label centre and size, in stage pixels
    var tube = { x: ox + t.x * t.nw * s, y: oy + t.y * t.nh * s, w: t.w * t.nw * s, h: t.h * t.nh * s };
    var sr = stage.getBoundingClientRect(), hr = head.getBoundingClientRect(), cr = card.getBoundingClientRect();
    G = {
      sw: sw, sh: sh, tube: tube,
      head: { x: hr.left - sr.left + hr.width / 2, y: hr.top - sr.top + hr.height / 2, w: hr.width, h: hr.height },
      cardH: card.offsetHeight, headH: head.offsetHeight, fit: cr.height / card.offsetHeight
    };
    G.head.w = hr.width; G.head.h = hr.height;
    label.style.width = G.head.w + "px";
    label.style.height = G.head.h + "px";
  }
  // a point in the photo after the zoom transform
  function zoomed(x, y, z) {
    var cx = G.sw * ORX, cy = G.sh * ORY;
    return { x: cx + (x - cx) * z, y: cy + (y - cy) * z };
  }

  var ticking = false, last = -1, done = false;
  function frame() {
    ticking = false;
    if (!G) measure();
    var hdr = nav ? nav.offsetHeight : 0;
    var total = root.offsetHeight - stage.offsetHeight;
    var p = clamp(-(root.getBoundingClientRect().top - hdr) / total, 0, 1);
    if (Math.abs(p - last) < .0004) return;
    last = p;
    var st = root.style;

    // 0. the hero (H1 + actions) steps up and away, 1. the intro comes in, the photo moves closer
    var z = lerp(1, ZOOM_MAX, ease(seg(p, .04, .34)));
    st.setProperty("--zoom", z.toFixed(4));
    st.setProperty("--hint", (1 - seg(p, .01, .05)).toFixed(3));
    var ho = 1 - seg(p, .05, .12);
    st.setProperty("--heroo", ho.toFixed(3));
    st.setProperty("--heroy", (-(1 - ho) * 30).toFixed(1) + "px");
    st.setProperty("--herov", ho > .02 ? "visible" : "hidden");
    var ii = seg(p, .12, .18), iout = seg(p, .38, .44), io = Math.min(ii, 1 - iout);
    st.setProperty("--introo", io.toFixed(3));
    st.setProperty("--introy", (iout > 0 ? -iout * 30 : (1 - ii) * 20).toFixed(1) + "px");
    st.setProperty("--introv", io > .02 ? "visible" : "hidden");
    // the dark side panel stays until the text on it has fully gone, so fading text never sits on the busy photo
    st.setProperty("--scrim", (1 - seg(p, .44, .52)).toFixed(3));

    // 2. the label peels off (corner lifts), 3. it flies up and flattens into the report header
    var peel = seg(p, .26, .42), fly = ease(seg(p, .38, .58));
    // The label starts upright along the tube (turned 90 degrees) and ends flat as the report header.
    var a = zoomed(G.tube.x, G.tube.y, z), w0 = G.tube.w * z, h0 = G.tube.h * z;
    var cx = lerp(a.x, G.head.x, fly), cy = lerp(a.y, G.head.y, fly) - Math.sin(peel * Math.PI) * w0 * .25 * (1 - fly);
    var sx = lerp(h0, G.head.w, fly) / G.head.w, sy = lerp(w0, G.head.h, fly) / G.head.h;
    var rot = lerp(-90, 0, fly) + Math.sin(fly * Math.PI) * 8;
    label.style.transform = "translate(" + (cx - G.head.w / 2).toFixed(1) + "px," + (cy - G.head.h / 2).toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg) scale(" + sx.toFixed(4) + "," + sy.toFixed(4) + ")";
    var peelDeg = -48 * Math.sin(out(peel) * Math.PI / 2) * (1 - fly);
    labIn.style.setProperty("--peel", peelDeg.toFixed(2) + "deg");
    labIn.style.setProperty("--lift", (Math.max(peel * (1 - fly * .6), fly * .5)).toFixed(3));
    labIn.style.setProperty("--curl", ((1 - fly) * .7).toFixed(3));
    labIn.style.setProperty("--labtxt", seg(p, .45, .54).toFixed(3));
    st.setProperty("--dim", (seg(p, .32, .58) * .62).toFixed(3));

    // 4. the report unfolds down from the header, rows arrive one by one
    var unfold = ease(seg(p, .58, .72));
    var showCard = p >= .575;
    st.setProperty("--cardv", showCard ? "visible" : "hidden");
    label.style.visibility = showCard ? "hidden" : "visible";
    var open = G.headH + (G.cardH - G.headH) * unfold;
    st.setProperty("--clipb", Math.max(0, G.cardH - open).toFixed(1) + "px");
    card.style.clipPath = card.style.webkitClipPath = "inset(0 0 " + Math.max(0, G.cardH - open).toFixed(1) + "px 0 round 16px)";
    crease.style.setProperty("--crease", open.toFixed(1) + "px");
    crease.style.setProperty("--creaseo", (showCard ? Math.sin(unfold * Math.PI) : 0).toFixed(3));
    rows.forEach(function (r, i) {
      var k = out(seg(p, .6 + i * .04, .66 + i * .04));
      r.style.setProperty("--k", k.toFixed(3));
    });
    var c = out(seg(p, .8, .86));
    st.setProperty("--ctao", c.toFixed(3));
    st.setProperty("--ctav", c > .02 ? "visible" : "hidden");
    st.setProperty("--p", p.toFixed(4));

    if (p > .88 && !done) { done = true; if (typeof gtag === "function") gtag("event", "t2r_report_unfolded", { event_category: "engagement" }); }
    if (p > .03) track("start");
    if (p >= .5) track("half");
    if (p >= .97) { track("complete"); markSeen(); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function onResize() { G = null; last = -1; measure(); onScroll(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  measure();
  frame();
  }
})();
