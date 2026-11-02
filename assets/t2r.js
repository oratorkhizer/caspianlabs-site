/* Signature scroll moment (Nov 2026): "From a tube to a report you can understand".
   One scroll handler, one progress value p (0..1) drives everything, so it also runs backwards.
   Reduced motion, or no clip-path support: nothing is switched on and the flat layout stays. */
(function () {
  var root = document.getElementById("t2r");
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clipOk = window.CSS && CSS.supports && (CSS.supports("clip-path", "inset(0 0 0 0)") || CSS.supports("-webkit-clip-path", "inset(0 0 0 0)"));
  var stickyOk = window.CSS && CSS.supports && CSS.supports("overflow-x", "clip") && CSS.supports("position", "sticky");
  if (reduce || !clipOk || !stickyOk) return;

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

    // 1. look closer at the tube, the intro steps aside
    var z = lerp(1, ZOOM_MAX, ease(seg(p, .04, .3)));
    st.setProperty("--zoom", z.toFixed(4));
    st.setProperty("--hint", (1 - seg(p, .01, .07)).toFixed(3));
    var io = 1 - seg(p, .1, .22);
    st.setProperty("--introo", io.toFixed(3));
    st.setProperty("--introy", (-(1 - io) * 30).toFixed(1) + "px");

    // 2. the label peels off (corner lifts), 3. it flies up and flattens into the report header
    var peel = seg(p, .2, .36), fly = ease(seg(p, .33, .56));
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
    labIn.style.setProperty("--labtxt", seg(p, .46, .56).toFixed(3));
    st.setProperty("--dim", (seg(p, .3, .56) * .62).toFixed(3));

    // 4. the report unfolds down from the header, rows arrive one by one
    var unfold = ease(seg(p, .56, .72));
    var showCard = p >= .555;
    st.setProperty("--cardv", showCard ? "visible" : "hidden");
    label.style.visibility = showCard ? "hidden" : "visible";
    var open = G.headH + (G.cardH - G.headH) * unfold;
    st.setProperty("--clipb", Math.max(0, G.cardH - open).toFixed(1) + "px");
    card.style.clipPath = card.style.webkitClipPath = "inset(0 0 " + Math.max(0, G.cardH - open).toFixed(1) + "px 0 round 16px)";
    crease.style.setProperty("--crease", open.toFixed(1) + "px");
    crease.style.setProperty("--creaseo", (showCard ? Math.sin(unfold * Math.PI) : 0).toFixed(3));
    rows.forEach(function (r, i) {
      var k = out(seg(p, .6 + i * .045, .67 + i * .045));
      r.style.setProperty("--k", k.toFixed(3));
    });
    var c = out(seg(p, .8, .88));
    st.setProperty("--ctao", c.toFixed(3));
    st.setProperty("--ctav", c > .02 ? "visible" : "hidden");
    st.setProperty("--p", p.toFixed(4));

    if (p > .88 && !done) { done = true; if (typeof gtag === "function") gtag("event", "t2r_report_unfolded", { event_category: "engagement" }); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function onResize() { G = null; last = -1; measure(); onScroll(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  measure();
  frame();
})();
