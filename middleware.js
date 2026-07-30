// Edge middleware bridge: serves the uploaded homepage file "index (1).html"
// until it is renamed to index.html. The URL constructor handles the
// space/parens encoding that vercel.json rewrites cannot express.
// Currently limited to the /index-new test route; / and /index.html are added
// after the test route is verified.

export const config = { matcher: ["/index-new"] };

export default function middleware(request) {
  const target = new URL("/index (1).html", request.url);
  return new Response(null, {
    headers: { "x-middleware-rewrite": target.toString() },
  });
}
