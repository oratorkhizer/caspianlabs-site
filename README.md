# caspianlabs-site

Caspian Diagnostic Centre — official marketing website, served at caspianlabs.in via Vercel.

## Bot protection
The booking form (`/api/pay` create step and `/api/book`) and the WhatsApp opt-in (central `subscribe` edge function) send a Cloudflare Turnstile token (`assets/turnstile.js`, group site key), the fill time `ms` and the honeypot `website`. Server checks are in `api/_bot.js`; Turnstile is enforced only when the Vercel env var `TURNSTILE_SECRET_KEY` is set. Payment confirm and recover calls are never checked.
