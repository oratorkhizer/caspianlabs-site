// Caspian Diagnostic Centre — sitemap served via function so headers are always correct.
// Repo path: /api/sitemap.js  →  GET https://www.caspianlabs.in/sitemap.xml (rewritten in vercel.json)
//
// Why a function and not a static file: the static sitemap.xml was reaching browsers as
// garbled/compressed bytes (content-encoding mishandling at the edge). Serving it from a
// function guarantees Content-Type: application/xml; charset=utf-8 with no double compression.
//
// NOTE: keep PACKAGE_SLUGS / TEST_SLUGS in sync with the catalog in api/page.js.

const PAGES = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0" },
  { path: "/home-sample-collection-hyderabad", changefreq: "monthly", priority: "0.8" },
  { path: "/blog",              changefreq: "weekly",  priority: "0.7" },
  { path: "/about.html",        changefreq: "monthly", priority: "0.6" },
  { path: "/pricing.html",      changefreq: "monthly", priority: "0.7" },
  { path: "/contact.html",      changefreq: "monthly", priority: "0.6" },
  { path: "/terms.html",        changefreq: "yearly",  priority: "0.3" },
  { path: "/privacy.html",      changefreq: "yearly",  priority: "0.3" },
  { path: "/refund.html",       changefreq: "yearly",  priority: "0.3" },
  { path: "/cancellation.html", changefreq: "yearly",  priority: "0.3" },
  { path: "/shipping.html",     changefreq: "yearly",  priority: "0.3" },
];

const PACKAGE_SLUGS = [
  "full-body-checkup-hyderabad",
  "essential-health-checkup-hyderabad",
  "comprehensive-diabetes-screening-hyderabad",
  "thyroid-profile-test-hyderabad",
  "metabolic-wellness-inbody-hyderabad",
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
];

export default function handler(req, res) {
  const base = "https://www.caspianlabs.in";
  const lastmod = new Date().toISOString().slice(0, 10);
  const all = [
    ...PAGES,
    ...PACKAGE_SLUGS.map((s) => ({ path: "/packages/" + s, changefreq: "monthly", priority: "0.8" })),
    ...TEST_SLUGS.map((s) => ({ path: "/tests/" + s, changefreq: "monthly", priority: "0.7" })),
    ...BLOG_SLUGS.map((s) => ({ path: "/blog/" + s, changefreq: "monthly", priority: "0.6" })),
  ];
  const urls = all.map(
    (p) =>
      `  <url>\n    <loc>${base}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
