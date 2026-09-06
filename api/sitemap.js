// Caspian Diagnostic Centre — sitemap served via function so headers are always correct.
// Repo path: /api/sitemap.js  →  GET https://www.caspianlabs.in/sitemap.xml (rewritten in vercel.json)
//
// Why a function and not a static file: the static sitemap.xml was reaching browsers as
// garbled/compressed bytes (content-encoding mishandling at the edge). Serving it from a
// function guarantees Content-Type: application/xml; charset=utf-8 with no double compression.
//
// NOTE: keep PACKAGE_SLUGS / TEST_SLUGS in sync with the catalog in api/page.js.
// lastmod: bump the relevant date constant when the content of that group actually changes.
// (Google ignores lastmod that is always "today"; a truthful date helps recrawl prioritisation.)

const LASTMOD_LANDING = "2026-09-03"; // tests/packages/hub/home-collection pages (api/page.js)
const LASTMOD_HOMEPAGE = "2026-09-03"; // index.html
const LASTMOD_BLOG = "2026-07-31";     // api/blog.js articles
const LASTMOD_STATIC = "2026-07-31";   // about/pricing/contact/legal html files

const PAGES = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0", lastmod: LASTMOD_HOMEPAGE },
  { path: "/tests",             changefreq: "weekly",  priority: "0.9", lastmod: LASTMOD_LANDING },
  { path: "/packages",          changefreq: "weekly",  priority: "0.9", lastmod: LASTMOD_LANDING },
  { path: "/home-sample-collection-hyderabad", changefreq: "monthly", priority: "0.9", lastmod: LASTMOD_LANDING },
  { path: "/blog",              changefreq: "weekly",  priority: "0.7", lastmod: LASTMOD_BLOG },
  { path: "/about.html",        changefreq: "monthly", priority: "0.6", lastmod: LASTMOD_STATIC },
  { path: "/pricing.html",      changefreq: "monthly", priority: "0.7", lastmod: LASTMOD_STATIC },
  { path: "/contact.html",      changefreq: "monthly", priority: "0.6", lastmod: LASTMOD_STATIC },
  { path: "/terms.html",        changefreq: "yearly",  priority: "0.3", lastmod: LASTMOD_STATIC },
  { path: "/privacy.html",      changefreq: "yearly",  priority: "0.3", lastmod: LASTMOD_STATIC },
  { path: "/refund.html",       changefreq: "yearly",  priority: "0.3", lastmod: LASTMOD_STATIC },
  { path: "/cancellation.html", changefreq: "yearly",  priority: "0.3", lastmod: LASTMOD_STATIC },
  { path: "/shipping.html",     changefreq: "yearly",  priority: "0.3", lastmod: LASTMOD_STATIC },
];

const PACKAGE_SLUGS = [
  "full-body-checkup-hyderabad",
  "essential-health-checkup-hyderabad",
  "comprehensive-diabetes-screening-hyderabad",
  "thyroid-profile-test-hyderabad",
  "metabolic-wellness",
  "womens-health-checkup-hyderabad",
  "senior-citizen-health-checkup-hyderabad",
  "heart-health-checkup-hyderabad",
  "premium-health-checkup-men-hyderabad",
  "haj-umrah-fitness-package-hyderabad",
];

// keep in sync with ARTICLES in api/blog.js
const BLOG_SLUGS = [
  "what-does-hba1c-mean",
  "fasting-before-blood-test",
];

const TEST_SLUGS = [
  "hba1c-test-hyderabad",
  "blood-sugar-test-hyderabad",
  "cbc-test-hyderabad",
  "tsh-test-hyderabad",
  "lipid-profile-test-hyderabad",
  "liver-function-test-hyderabad",
  "kidney-function-test-hyderabad",
  "vitamin-d-test-hyderabad",
  "vitamin-b12-test-hyderabad",
  "urine-routine-test-hyderabad",
  "crp-test-hyderabad",
  "esr-test-hyderabad",
  "serum-creatinine-test-hyderabad",
  "uric-acid-test-hyderabad",
  "blood-urea-test-hyderabad",
  "ferritin-test-hyderabad",
  "blood-group-test-hyderabad",
  "beta-hcg-test-hyderabad",
  "psa-test-hyderabad",
  "dengue-test-hyderabad",
  "malaria-test-hyderabad",
  "typhoid-widal-test-hyderabad",
  "electrolytes-test-hyderabad",
  "calcium-test-hyderabad",
  "chest-x-ray-hyderabad",
  "body-composition",
];

export default function handler(req, res) {
  const base = "https://www.caspianlabs.in";
  const all = [
    ...PAGES,
    ...PACKAGE_SLUGS.map((s) => ({ path: "/packages/" + s, changefreq: "monthly", priority: "0.8", lastmod: LASTMOD_LANDING })),
    ...TEST_SLUGS.map((s) => ({ path: "/tests/" + s, changefreq: "monthly", priority: "0.7", lastmod: LASTMOD_LANDING })),
    ...BLOG_SLUGS.map((s) => ({ path: "/blog/" + s, changefreq: "monthly", priority: "0.6", lastmod: LASTMOD_BLOG })),
  ];
  const urls = all.map(
    (p) =>
      `  <url>\n    <loc>${base}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
