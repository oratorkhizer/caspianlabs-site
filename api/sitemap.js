// Caspian Diagnostic Centre — sitemap served via function so headers are always correct.
// Repo path: /api/sitemap.js  →  GET https://www.caspianlabs.in/sitemap.xml (rewritten in vercel.json)
//
// Why a function and not a static file: the static sitemap.xml was reaching browsers as
// garbled/compressed bytes (content-encoding mishandling at the edge). Serving it from a
// function guarantees Content-Type: application/xml; charset=utf-8 with no double compression.

const PAGES = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0" },
  { path: "/about.html",        changefreq: "monthly", priority: "0.6" },
  { path: "/pricing.html",      changefreq: "monthly", priority: "0.7" },
  { path: "/contact.html",      changefreq: "monthly", priority: "0.6" },
  { path: "/terms.html",        changefreq: "yearly",  priority: "0.3" },
  { path: "/privacy.html",      changefreq: "yearly",  priority: "0.3" },
  { path: "/refund.html",       changefreq: "yearly",  priority: "0.3" },
  { path: "/cancellation.html", changefreq: "yearly",  priority: "0.3" },
  { path: "/shipping.html",     changefreq: "yearly",  priority: "0.3" },
];

export default function handler(req, res) {
  const base = "https://www.caspianlabs.in";
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${base}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
