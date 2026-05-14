# SaaS Schedulr — Full API Integration Roadmap

This document lists **every external API** that will eventually be integrated into SaaS Schedulr, derived from a full sweep of the frontend pages (including hardcoded/mock views), backend Supabase migrations, and the stubbed Edge Functions. Each entry points to the concrete place in the codebase that will consume it so wiring can be prioritized.

Legend: **[Paid]** has a metered cost, **[Free tier]** has a usable free plan, **[Free]** fully free / open.

---

## 1. Core Platform — Supabase

Already in use for DB + Auth. Remaining surface area to wire:

| API | Purpose | Touchpoint |
|---|---|---|
| Supabase Auth (email + password) | Sign-in / sign-up | [SignIn.tsx](frontend/src/app/pages/SignIn.tsx), [SignUp.tsx](frontend/src/app/pages/SignUp.tsx) |
| Supabase Auth — Google OAuth | Social login | SignIn / SignUp "Continue with Google" |
| Supabase Auth — Apple OAuth | Social login | SignIn / SignUp "Continue with Apple" |
| Supabase Auth — GitHub OAuth | Social login (optional dev angle) | SignIn / SignUp |
| Supabase Storage — `avatars` bucket | Profile picture upload | [Settings.tsx](frontend/src/app/pages/Settings.tsx) Camera/Upload photo button, [0003_storage_buckets.sql](backend/supabase/migrations/0003_storage_buckets.sql) |
| Supabase Storage — `event-assets` bucket | Per-event assets (cover image, logo) | [EventEditor.tsx](frontend/src/app/pages/EventEditor.tsx) |
| Supabase Realtime | Live booking feed, admin dashboards | [Bookings.tsx](frontend/src/app/pages/Bookings.tsx), [AdminPanel.tsx](frontend/src/app/pages/AdminPanel.tsx) |
| Supabase Edge Functions | Server-side webhooks, cron, 3rd-party proxies | [backend/supabase/functions/](backend/supabase/functions/) |
| Supabase Admin API (service role) | User impersonation, bulk ops | AdminPanel "Impersonate user" |

**[Free tier]** — covered by the Supabase free plan during dev.

---

## 2. Email — Transactional

Secret `RESEND_API_KEY` already reserved in [backend/.env.example](backend/.env.example).

| API | Purpose | Touchpoint |
|---|---|---|
| **Resend** **[Free tier]** | Booking confirmation, cancellation, reschedule, reminder, daily summary | [send-booking-email/index.ts](backend/supabase/functions/send-booking-email/index.ts), [send-reminder/index.ts](backend/supabase/functions/send-reminder/index.ts) |
| Mailgun / SendGrid / Postmark (alt) **[Free tier]** | Fallback provider or SMTP relay | AdminPanel SMTP config card |
| Custom SMTP | Self-hosted email for enterprise tenants | AdminPanel → SMTP settings form |

Template set needed: `booking_confirmed`, `booking_cancelled`, `booking_rescheduled`, `reminder_24h`, `reminder_1h`, `daily_summary`, `follow_up`, `invite_member`, `password_reset`.

---

## 3. SMS — Reminders

Explicit note in [Reminders.tsx](frontend/src/app/pages/Reminders.tsx): *"SMS REQUIRES TWILIO. Connect Twilio in Integrations to activate SMS reminders."*

| API | Purpose | Touchpoint |
|---|---|---|
| **Twilio Programmable SMS** **[Paid]** | 1h-before SMS reminders | Reminders channel = `sms` (per [0001_init_schema.sql](backend/supabase/migrations/0001_init_schema.sql)) |
| MessageBird / Vonage (alt) **[Paid]** | Regional fallback | Integrations page |
| Twilio Verify **[Paid]** | Optional phone-number verification at booking | BookingPage form |

---

## 4. Calendar Sync

Secrets `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` already reserved. Stub function exists at [google-calendar-sync/index.ts](backend/supabase/functions/google-calendar-sync/index.ts).

| API | Purpose | Touchpoint |
|---|---|---|
| **Google Calendar API** **[Free]** | Two-way sync, busy lookup, insert/update events | Integrations "Google Calendar", google-calendar-sync Edge Function |
| **Microsoft Graph (Outlook Calendar)** **[Free]** | Outlook / Microsoft 365 sync | Integrations "Outlook Calendar" |
| **Apple iCloud CalDAV** **[Free]** | iCloud two-way sync (app-specific password) | Integrations "Apple iCal" |
| ICS generation (in-house, no external API) **[Free]** | `Add to Apple Calendar` download, email .ics attachments | [BookingPage.tsx](frontend/src/app/pages/BookingPage.tsx) "Add to Apple Calendar" button |
| Google Calendar deep-link URL scheme **[Free]** | `Add to Google Calendar` one-click | BookingPage "Add to Google Calendar" button |

---

## 5. Video Conferencing

`event_types.location_kind` includes `google_meet` and `zoom` per migration `0001`.

| API | Purpose | Touchpoint |
|---|---|---|
| **Google Meet** (via Calendar `conferenceData`) **[Free]** | Auto-generate Meet link when creating event | [EventEditor.tsx](frontend/src/app/pages/EventEditor.tsx) LOCATIONS → `google_meet` |
| **Zoom API + OAuth** **[Free tier]** | Create meeting, generate join URL, update/cancel | EventEditor → `zoom`; Integrations "Zoom" card |
| Microsoft Teams (via Graph) **[Free]** | Enterprise alternative | Future Integrations entry |
| Whereby Embedded / Daily.co (alt) **[Free tier]** | Embeddable video rooms for white-label | Future premium feature |

---

## 6. Payments

Secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` already reserved. Stub at [stripe-webhook/index.ts](backend/supabase/functions/stripe-webhook/index.ts).

| API | Purpose | Touchpoint |
|---|---|---|
| **Stripe Checkout** **[Paid]** | Paid event types (require-pay-to-book), Pro/Business plan upgrade | [Pricing.tsx](frontend/src/app/pages/Pricing.tsx), EventEditor "require payment" toggle |
| **Stripe Subscriptions** **[Paid]** | Recurring tenant billing | `subscriptions` table, AdminPanel subscriptions tab |
| **Stripe Webhooks** **[Paid]** | `checkout.session.completed`, `customer.subscription.updated`, invoice events | stripe-webhook Edge Function |
| **Stripe Refunds API** **[Paid]** | "Refund last payment" admin action | [AdminPanel.tsx](frontend/src/app/pages/AdminPanel.tsx) |
| **Stripe Billing Portal** **[Paid]** | Self-serve card update / invoice history | Settings → Billing tab |
| **Stripe Tax** **[Paid]** | Auto tax on paid bookings | EventEditor price config |
| PayPal Orders API **[Paid]** | Alt. payment method | Integrations "PayPal" card |

---

## 7. CRM / Productivity Integrations

From the 13-card [Integrations.tsx](frontend/src/app/pages/Integrations.tsx) hardcoded list:

| API | Purpose | Touchpoint |
|---|---|---|
| **Slack Web API + Incoming Webhooks** **[Free]** | Post booking notifications to channel | Integrations "Slack" |
| **Notion API** **[Free]** | Log bookings / attendees to a Notion DB | Integrations "Notion" |
| **HubSpot CRM API** **[Free tier]** | Create contact/deal on booking | Integrations "HubSpot CRM" |
| **Mailchimp Marketing API** **[Free tier]** | Add bookers to audience list | Integrations "Mailchimp" |
| **Zapier** (via webhook triggers) **[Free tier]** | No-code automations | Integrations "Zapier" |
| Generic **Outbound Webhooks** (in-house) **[Free]** | Fire arbitrary webhooks on event (booking created, cancelled, etc.) | Integrations "Webhooks" + AdminPanel webhook tester |
| Salesforce (future) **[Paid]** | Enterprise CRM | Future Integrations entry |
| ActiveCampaign (future) **[Paid]** | Marketing automation | Future Integrations entry |

---

## 8. Maps & Location

`location_kind = 'in_person'` produces an address field that is shown on the confirmation view.

| API | Purpose | Touchpoint |
|---|---|---|
| **Google Maps — Places Autocomplete** **[Free tier]** | Address typeahead in EventEditor | EventEditor `in_person` location input |
| **Google Maps — Embed / Deep-link** **[Free]** | "Open in Maps" link on booking confirmation | [BookingPage.tsx](frontend/src/app/pages/BookingPage.tsx) in_person detail |
| Mapbox Geocoding (alt) **[Free tier]** | Alternate provider | Config setting |
| Apple Maps deep-link (`maps.apple.com?q=...`) **[Free]** | iOS native map open | BookingPage confirmation |

---

## 9. Timezone, Holidays & Availability Helpers

| API | Purpose | Touchpoint |
|---|---|---|
| **ipapi.co** / **ipinfo.io** **[Free tier]** | Auto-detect booker timezone | [BookingPage.tsx](frontend/src/app/pages/BookingPage.tsx) timezone picker default |
| **nager.date** **[Free]** | Public holidays per country (auto-block) | [Availability.tsx](frontend/src/app/pages/Availability.tsx) blocked dates |
| **WorldTimeAPI** **[Free]** | Canonical timezone list | Settings / Availability timezone dropdown |
| Intl.DateTimeFormat + tz data (browser) **[Free]** | Primary timezone rendering | App-wide |

---

## 10. Anti-abuse / Security

| API | Purpose | Touchpoint |
|---|---|---|
| **hCaptcha** **[Free]** / **reCAPTCHA v3** **[Free]** | Public booking spam protection | [BookingPage.tsx](frontend/src/app/pages/BookingPage.tsx) submit |
| **HaveIBeenPwned Passwords** **[Free]** | Breached-password check on SignUp | [SignUp.tsx](frontend/src/app/pages/SignUp.tsx) |
| **Cloudflare Turnstile** (alt) **[Free]** | CAPTCHA alternative | BookingPage |

---

## 11. Observability & Analytics

| API | Purpose | Touchpoint |
|---|---|---|
| **Sentry** **[Free tier]** | Frontend + Edge Function error tracking | `main.tsx` init |
| **PostHog** **[Free tier]** | Product analytics, funnel (landing → signup → first-booking) | Landing, SignUp, Dashboard |
| **Plausible** (alt) **[Paid, self-host Free]** | Privacy-friendly page analytics | Landing public pages |
| **LogRocket** (alt) **[Free tier]** | Session replay for bug triage | Optional |
| **UptimeRobot / Better Stack** **[Free tier]** | Status page / uptime | Public status page |

Separate from the in-app [Analytics.tsx](frontend/src/app/pages/Analytics.tsx) (booking metrics from our own DB).

---

## 12. Widget / Embed / Sharing

Dashboard shows an embed snippet: `<script src="https://schedulr.io/embed.js">`.

| API | Purpose | Touchpoint |
|---|---|---|
| Self-hosted `embed.js` **[Free]** | Inline booking widget for customer sites | [Dashboard.tsx](frontend/src/app/pages/Dashboard.tsx) embed snippet |
| **QR Server API** / `qrcode.react` **[Free]** | QR code for booking link | Share modal on EventList / Dashboard |
| **Bitly** / **TinyURL** **[Free tier]** | Short links for SMS reminders & share sheet | Reminders / Share modal |
| `navigator.share` (Web Share API) **[Free]** | Native share sheet on mobile | Share button |
| **OpenGraph** image generator (e.g., Vercel OG, Bannerbear **[Free tier]**) | Rich link previews for booking pages | BookingPage `<head>` meta |

---

## 13. File Export / Import

| API | Purpose | Touchpoint |
|---|---|---|
| CSV generation (in-house) **[Free]** | Settings "Export data", Bookings export, Admin email-log export | [Settings.tsx](frontend/src/app/pages/Settings.tsx), [Bookings.tsx](frontend/src/app/pages/Bookings.tsx), AdminPanel |
| **jsPDF** / `@react-pdf/renderer` **[Free]** | Invoice PDF, booking receipt | Stripe-paid booking confirmation |
| ICS file generation (in-house) **[Free]** | Attach `.ics` to confirmation email & "Add to Apple Calendar" | BookingPage, send-booking-email |
| **Cloudinary** (alt to Supabase Storage) **[Free tier]** | Image CDN + transformations for avatars / event covers | Settings avatar upload, EventEditor cover |

---

## 14. Admin Tooling

From [AdminPanel.tsx](frontend/src/app/pages/AdminPanel.tsx):

| API | Purpose |
|---|---|
| Supabase Admin API — `auth.admin.*` | Impersonate user, disable user, reset password |
| SMTP test endpoint (Edge Function) | "Send test email" button |
| Webhook tester (Edge Function) | Fire a canned payload at a configured endpoint |
| Maintenance mode flag (app_settings table) | Toggle global read-only banner |
| Stripe refund / cancel-subscription | Billing admin actions |
| CSV/JSON export of tenants, usage, email logs | Audit / compliance |

---

## 15. Public Marketing Pages

[Landing.tsx](frontend/src/app/pages/Landing.tsx), [BlogPage.tsx](frontend/src/app/pages/BlogPage.tsx), [FeaturesPage.tsx](frontend/src/app/pages/FeaturesPage.tsx), [PublicIntegrations.tsx](frontend/src/app/pages/PublicIntegrations.tsx) currently use mock content.

| API | Purpose |
|---|---|
| Headless CMS (**Sanity** / **Contentful** / **Hygraph**) **[Free tier]** | Blog posts, changelog, integration list |
| **Formspree** / in-house Edge Function **[Free tier]** | Contact / demo-request form |
| **Calendly-style availability probe** (self) | Let prospects book a demo on Landing |
| **ConvertKit** / Mailchimp **[Free tier]** | Newsletter signup on Blog / Landing |

---

## 16. Future / Nice-to-Have (longer horizon)

| API | Purpose |
|---|---|
| **OpenAI API** **[Paid]** | AI scheduling assistant, auto-draft follow-up emails, smart descriptions |
| **Whisper / AssemblyAI** **[Paid]** | Auto-transcribe recorded meetings |
| **DocuSign** **[Paid]** | Contract sign-on-booking for legal / consulting events |
| **Intercom** / **Crisp** **[Free tier]** | Live chat support widget |
| **Stripe Identity** **[Paid]** | KYC for paid-plan sellers |
| **Algolia** / Meilisearch **[Free tier]** | Search across bookings / contacts in admin |

---

## Quick reference — secrets still to add

Already in [backend/.env.example](backend/.env.example): `SUPABASE_*`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

Not yet present, add when wiring:

```
# Video
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=

# Calendar
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
APPLE_CALDAV_APP_PASSWORD=

# SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Maps
GOOGLE_MAPS_API_KEY=

# CRM / productivity
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
NOTION_CLIENT_ID=
NOTION_CLIENT_SECRET=
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
MAILCHIMP_CLIENT_ID=
MAILCHIMP_CLIENT_SECRET=
ZAPIER_WEBHOOK_SECRET=

# Payments (alt)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Anti-abuse
HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET=
# or
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET=

# Observability
SENTRY_DSN=
POSTHOG_KEY=
POSTHOG_HOST=

# Email (alt)
MAILGUN_API_KEY=
SENDGRID_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## Wiring order (suggested)

1. **Supabase Storage avatars** → unblocks Settings profile-pic upload (cheapest win).
2. **Resend** → unblocks booking-confirmation and reminder emails (every other feature assumes these work).
3. **Google Calendar + Meet** → unblocks the flagship "auto-generate link + don't double-book" value prop.
4. **Stripe Checkout + Webhooks** → unblocks paid plans and paid event types.
5. **Zoom OAuth** → parity with Meet for non-Google users.
6. **Twilio SMS** → completes the Reminders feature.
7. **Outlook / iCloud calendar** → enterprise parity.
8. **hCaptcha + ipapi.co** → harden public booking page.
9. **Slack / Zapier / Webhooks** → unlock the long tail of CRM integrations.
10. **Sentry + PostHog** → observability before scale.
