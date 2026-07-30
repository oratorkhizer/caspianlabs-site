// Edge middleware bridge: serves the uploaded homepage file "index (1).html"
// at / and /index.html until it is renamed to index.html in the repo.
// Self-healing: if the uploaded file no longer exists (i.e. the rename has
// happened), the middleware falls through to normal routing, so the swap is
// zero-downtime in every state. Delete this file after the rename lands.

export const config = { matcher: ["/", "/index.html", "/index-new"] };

export default async function middleware(request) {
  const target = new URL("/index (1).html", request.url);
  try {
    const head = await fetch(target, { method: "HEAD" });
    if (head.ok) {
      return new Response(null, {
        headers: { "x-middleware-rewrite": target.toString() },
      });
    }
  } catch (e) {
    // network hiccup — fall through to normal routing
  }
  return; // no rewrite: serve whatever the filesystem has
}
