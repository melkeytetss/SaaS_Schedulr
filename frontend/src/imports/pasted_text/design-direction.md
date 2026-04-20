DESIGN DIRECTION
Design a premium scheduling SaaS called "Schedulr" — a white-label booking platform for coaches, freelancers, consultants, and teams. Think: the lovechild of Linear and Stripe's dashboard. Refined, editorial, slightly dark, deeply professional. Not a bubbly startup, not enterprise grey — it's the tool that serious independent professionals actually want to be seen using.
Aesthetic: Refined dark mode with surgical precision. Deep charcoal backgrounds (#0F0F11), warm off-white text (#F4F2EE), sharp coral/amber accent (#E8593C or #EF9F27 — pick one and commit). Geometric, structured, minimal chrome. Monospaced type for data, a sharp display serif for headings. Think editorial meets utility.
Fonts:

Headings: "Freight Display" or "Canela" or "Editorial New" — something with real personality
Body/UI: "DM Mono" or "IBM Plex Mono" for data, "Geist" for interface labels
Never: Inter, Roboto, or any generic system font

Color palette:

Background primary: #0F0F11
Background surface: #161618
Background elevated: #1E1E21
Border subtle: rgba(255,255,255,0.07)
Border strong: rgba(255,255,255,0.14)
Text primary: #F4F2EE
Text secondary: #8A8882
Text muted: #4A4946
Accent (coral): #E8593C
Accent hover: #FF6B47
Accent subtle bg: rgba(232,89,60,0.10)
Success: #2ECC8A
Warning: #F0A429
Info: #4B9EFF


PAGES TO DESIGN

PAGE 1 — MARKETING / LANDING PAGE
Layout: Full-bleed dark. Not a generic hero — make it feel like an artifact, something printed. Think: a large typographic lockup, the product screenshot floating at an angle, a real booking widget previewing in a phone frame.
Sections:
Hero

Large editorial headline: "Your bookings. Your brand. Zero friction." — set in display serif, massive, spanning the full width, slightly oversized like it's bleeding off the page
Subtext: "The scheduling platform for professionals who care how things look."
Two CTAs: "Start free" (filled, coral) and "See it live" (ghost)
Background: Deep charcoal with a subtle noise texture and a single diagonal light gradient beam in the top right — like a spotlight, barely visible
Floating product mockup: A slightly 3D-rotated browser window showing the booking dashboard. Not a flat screenshot — give it depth, a faint shadow, a reflection hint

Social Proof Bar

Monospace text: "Trusted by 2,400+ coaches, consultants, and creators"
Row of small, real-feeling logos (yoga studios, law firms, dev agencies — illustrated flat, not photos)

Feature Grid — 3 columns, each a card with:

Tiny icon (16px, stroke-only, coral)
Short label in mono
One-line description
Features: Calendar sync, Booking widget embed, Timezone auto-detection, Reminder emails, Custom domain, Payment collection, Team scheduling, Round-robin routing, Analytics dashboard, White-label branding, Cancellation flows, No-show protection

Booking Widget Preview Section

Split layout: Left side = short paragraph "Drop it anywhere. A single line of code."
Right side = a stylized browser window embedding a booking widget — show the actual UI of selecting a date and time. Make it look beautiful and real.

Pricing Section (see Page 4 below for detail)
Footer: Minimal, 2-column. Logo + tagline left. Links right. Very small, monospaced.

PAGE 2 — HOST DASHBOARD (Main App — after login)
This is where the host (e.g. a freelance coach) manages everything. It's the central command center.
Layout: Fixed left sidebar (220px) + main content area. Dark, data-dense but breathable.
Left Sidebar:

Top: Workspace name + avatar (e.g. "Marcus Studio") with a subtle dropdown chevron
Nav items with icons: Dashboard, Event Types, Bookings, Availability, Integrations, Reminders, Analytics, Settings
Active state: left accent bar (coral), slightly elevated card feel
Bottom: Plan badge ("Pro"), upgrade CTA (subtle), profile avatar

Main Content — Overview/Dashboard State:
Top bar:

"Good morning, Marcus" — display serif, large
Subtext: "You have 4 bookings today"
Date in monospace, top right

Stats row (4 metric cards, horizontal):

This week's bookings: 12
Conversion rate: 68%
Upcoming today: 4
Revenue this month: $1,840
Each card: dark surface bg, large number in display font, label in mono below, tiny sparkline chart

Upcoming Bookings (main panel, left/center):

List of today's bookings as cards
Each card: Guest name + avatar initials, event type label (pill badge), time in mono, duration, status dot (confirmed = green, pending = amber)
Hover: subtle elevation, reschedule + cancel ghost buttons appear

Quick Actions (right sidebar panel):

"Copy booking link" — one click, coral button
"Embed widget" — shows a small code snippet with copy icon
"Share page" — generates short URL
"Pause availability" — toggle with red state

Recent Activity feed (below bookings):

Timeline-style: small dot + line connector
Entries: "Sarah K. booked 30-min intro call", "James R. cancelled", "New reminder sent to 3 guests"
Monospace timestamps


PAGE 3 — EVENT TYPE EDITOR
Where the host creates a booking page (e.g. "30-min Discovery Call").
Layout: Split — left = form editor, right = live preview (the booking page as a guest would see it)
Left panel — Editor:

Section: Basic info

Event name (text input, large, styled like an inline edit)
Description (textarea)
Duration: segmented control buttons (15min / 30min / 45min / 60min / Custom)
Color picker (8 preset swatches for the event's accent color)


Section: Availability

Days of week toggles (7 pill toggles: Mon–Sun)
Time range picker: "09:00 → 17:00" style inline inputs with a colon separator
Buffer time: "15 min before, 10 min after" — small steppers


Section: Location

Radio group with icons: Google Meet (auto-generate link), Zoom, Phone call, In person, Custom text


Section: Booking page settings

Custom URL slug: schedulr.io/marcus/[discovery-call]
Redirect after booking (toggle + URL input)
Require confirmation before confirmed (toggle)
Max bookings per day (number input)


Section: Questions

List of form fields the guest must fill in
Default: Name, Email
"Add question" — opens a small inline form: label, type (text/select/phone), required toggle
Drag handles to reorder


Save / Publish buttons — sticky bottom bar

Right panel — Live Preview:

Phone frame or browser frame
Shows the actual booking page: event name, host avatar, description, calendar UI (month grid with available dates lit up), time slot list
Updates live as the host edits left side


PAGE 4 — BOOKING PAGE (Guest-facing, public)
This is what a guest sees when they click the host's link. This must look like a premium product page — the kind of thing that makes you trust the person you're booking with.
Layout: Centered card on a subtle background. Not full-dashboard — this is a focused, single-task page.
Header:

Host's avatar (circular, 56px)
Host's name (display serif)
Event type name: "30-min Discovery Call"
Duration pill: "30 min" and location pill: "Google Meet"
Short description

Calendar picker:

Clean month grid — current month
Available dates: slightly lit, coral-tinted on hover, selected = filled coral circle
Unavailable: muted/strikethrough
Navigation arrows for prev/next month

Time slot list (appears after selecting a date):

Vertical list of available times: 09:00, 09:30, 10:00...
Each as a button — ghost border, hover = fills coral, selected = filled solid
Each slot shows duration on the right

Timezone row:

"Showing times in: Asia/Manila (UTC+8)" — with a dropdown to change
Auto-detected on load

Confirm step (after picking time):

Guest name (text input)
Guest email (text input)
Any custom questions the host added
"Confirm booking" — large coral button
"← Back to times" — ghost

Confirmation screen (after submit):

Large checkmark (not emoji — geometric SVG circle with checkmark, coral)
"You're booked." in display serif
Summary: Date, time, duration, location
"Add to Google Calendar" and "Add to Apple Calendar" links
"Cancel or reschedule" — small ghost link below


PAGE 5 — TENANT ADMIN PANEL (Platform Owner / You, the SaaS operator)
This is your internal view — where you (the platform owner) manage all the tenants (hosts using your platform). Think of it like a super-admin Stripe dashboard.
Layout: Same sidebar shell as the host dashboard but with different nav items:

Overview, Tenants, Subscriptions, Usage, Email Logs, System Settings

Overview tab:

Big stats: Total tenants, MRR, Active bookings today, Churn rate
Line chart: MRR growth over 6 months
Bar chart: Daily bookings across all tenants

Tenants Table:

Full-width table with: Avatar + Name, Plan (badge: Free/Pro/Team), Status (dot: Active/Churned/Trial), Bookings this month, MRR contribution, Joined date, Actions (View / Impersonate / Suspend)
Row hover: subtle highlight
Top: search input, filter by plan, sort dropdown

Tenant Detail Drawer (slides in from right on row click):

Tenant avatar + workspace name
Owner email + joined date
Plan badge + billing status
Usage stats: event types created, total bookings all-time, integrations connected
Recent activity log
"Impersonate user" button (coral, with a warning label)
"Upgrade plan" and "Suspend account" — ghost buttons

Email Logs tab:

Table: Recipient, Email type (Confirmation / Reminder / Cancellation), Sent at, Status (Delivered ✓ / Bounced ✗ / Pending ●), Tenant name
Click row = expand raw email content preview

System Settings tab:

Toggle: Maintenance mode
SMTP config (fields for host, port, user, password)
Default reminder timing: 24h / 1h before (number inputs)
Allowed domains for white-label (tag input)
Webhook endpoint (URL input + test button)


PAGE 6 — INTEGRATIONS PAGE (Host-facing)
Layout: Full-width grid of integration cards
Header: "Connect your tools" — display serif, left aligned
Integration cards (3-column grid):
Each card:

Service logo (48px, greyscale until connected)
Service name
One-line description
Status badge: "Connected" (green) or "Not connected" (muted)
Button: "Connect" or "Manage"

Integrations to show:
Google Calendar, Outlook Calendar, Apple iCal, Google Meet, Zoom, Stripe, PayPal, Zapier, Slack (notify on booking), Notion (log bookings), HubSpot CRM, Mailchimp, Webhooks (custom)
Connected integrations: appear in a "Connected" section at the top, styled differently — slight green border tint, logo in color

PAGE 7 — PRICING PAGE
Layout: Centered, generous whitespace
Header: "Simple pricing. No surprises." — display serif
3 pricing cards (horizontal):
Free

$0/month
3 event types
Booking widget embed
Email reminders
1 calendar connection
Schedulr branding on booking page
CTA: "Start free"

Pro — $12/month (featured, coral border accent)

Badge: "Most popular"
Everything in Free, plus:
Unlimited event types
Custom domain
Remove Schedulr branding
Payment collection (Stripe)
Priority email support
Analytics
CTA: "Start Pro"

Team — $49/month

Everything in Pro, plus:
Up to 10 team members
Round-robin scheduling
Collective event types
Admin panel
White-label (full, including emails)
API access
CTA: "Start Team"

Toggle at top: Monthly / Annual (Annual = 2 months free, shown as strikethrough + discounted price)
FAQ accordion below: 5–6 common questions in clean expand/collapse rows

COMPONENT LIBRARY TO INCLUDE
Design these as reusable components in a dedicated Components page:

Navigation sidebar (collapsed + expanded states)
Metric card (with sparkline variant)
Booking card (list item style)
Calendar grid widget (empty, with availability, with selection)
Time slot button (default, hover, selected, disabled)
Plan badge (Free, Pro, Team)
Status dot + label (Confirmed, Pending, Cancelled, No-show)
Integration card (connected, not connected)
Input field (default, focused, error, disabled)
Toggle switch
Segmented control (duration picker)
Modal / drawer overlay
Toast notification (success, error, info)
Empty state card (illustration placeholder + CTA)
Data table row (default, hover, selected)
Avatar (initials fallback, with status ring)


STYLE NOTES FOR FIGMA AI

Use Auto Layout on everything. Every card, every row, every section.
All text on a dark background must pass WCAG AA contrast
Border radius: 8px for inputs/buttons, 12px for cards, 16px for large panels, 2px for badges/pills
Icon style: 16px stroke-only, 1.5px stroke weight, rounded caps
Spacing system: 4px base unit. Common spacings: 4, 8, 12, 16, 24, 32, 48, 64, 96px
Elevation: achieved through background color steps only — no drop shadows. Surface = #161618, Elevated = #1E1E21, Overlay = #242427
Every interactive element must have Default, Hover, Active, Focused, and Disabled variants
The booking page (guest-facing) should optionally also have a light mode version — clean white, same typography, coral accent unchanged
Design for 1440px desktop width. The booking page should also show a 375px mobile frame.


WHAT MAKES THIS UNFORGETTABLE

The monospaced font for data creates a technical, precise feeling — like a Bloomberg terminal meets a design agency
The coral accent is warm but confident — it doesn't scream startup, it says "I know what I'm doing"
The editorial serif for headings gives the whole thing a human, crafted quality
The tenant admin panel looks like something you'd actually pay for — most SaaS admin panels look like they were built in 2014
The booking page (guest-facing) should feel like walking into a well-designed studio — not filling out a government form