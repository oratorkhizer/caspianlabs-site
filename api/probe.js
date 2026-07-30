// TEMPORARY self-diagnostic endpoint — verifies this site's own responses
// (headers, encoding, redirects) during the Phase-1 rollout. GET-only,
// allowlisted to caspianlabs.in hosts. Delete after sign-off.

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const target = String(req.query.url || "");
  const find = String(req.query.find || "");
  if (!/^https?:\/\/(www\.)?caspianlabs\.in(\/|$)/.test(target)) {
    return res.status(400).send(JSON.stringify({ error: "url must be on caspianlabs.in" }));
  }
  try {
    const r = await fetch(target, { redirect: "manual", headers: { "user-agent": "caspian-verify/1.0", accept: "*/*" } });
    const buf = Buffer.from(await r.arrayBuffer());
    const headers = {};
    r.headers.forEach((v, k) => { headers[k] = v; });
    const out = {
      status: r.status,
      location: r.headers.get("location"),
      bytes: buf.length,
      first16hex: buf.slice(0, 16).toString("hex"),
      contentType: r.headers.get("content-type"),
      contentEncoding: r.headers.get("content-encoding"),
      preview: buf.slice(0, 500).toString("utf-8"),
    };
    if (find) {
      const idx = buf.toString("utf-8").indexOf(find);
      out.findQuery = find;
      out.found = idx >= 0;
      out.foundAt = idx;
    }
    return res.status(200).send(JSON.stringify(out, null, 1));
  } catch (e) {
    return res.status(200).send(JSON.stringify({ error: String(e) }));
  }
}
