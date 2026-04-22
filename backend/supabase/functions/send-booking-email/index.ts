// Triggered by a Supabase DB webhook on INSERT into public.bookings.
// Sends a confirmation email to the invitee and a notification to the owner.
//
// Deploy: `supabase functions deploy send-booking-email`
// Local:  `supabase functions serve send-booking-email --env-file .env.local`

import { z } from "https://esm.sh/zod@3.24.1";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const RESEND_URL = "https://api.resend.com/emails";

async function sendResendEmail(args: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
}

const PayloadSchema = z.object({
  type: z.literal("INSERT"),
  table: z.literal("bookings"),
  record: z.object({
    id: z.string().uuid(),
    event_type_id: z.string().uuid(),
    owner_id: z.string().uuid(),
    invitee_name: z.string(),
    invitee_email: z.string().email(),
    starts_at: z.string(),
    ends_at: z.string(),
  }),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const payload = PayloadSchema.parse(body);

    const admin = supabaseAdmin();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFromEmail =
      Deno.env.get("RESEND_FROM_EMAIL") ?? "Schedulr <onboarding@resend.dev>";

    // Fetch event + owner profile for the email template.
    const { data: event, error: eventError } = await admin
      .from("event_types")
      .select(
        "title, duration_min, profiles(full_name, username, email_on_new_booking)",
      )
      .eq("id", payload.record.event_type_id)
      .single();
    if (eventError) throw eventError;

    const ownerProfile = Array.isArray(event?.profiles)
      ? event?.profiles[0]
      : event?.profiles;
    const notifyOwner = ownerProfile?.email_on_new_booking !== false;
    const hostName =
      ownerProfile?.full_name || ownerProfile?.username || "your host";
    const startLabel = new Date(payload.record.starts_at).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );

    const { data: ownerUserData, error: ownerUserError } =
      await admin.auth.admin.getUserById(payload.record.owner_id);
    if (ownerUserError) {
      console.warn("Could not load owner auth user", ownerUserError);
    }
    const ownerEmail = ownerUserData?.user?.email ?? null;

    if (!resendApiKey) {
      console.log("RESEND_API_KEY missing; skipping transactional emails", {
        booking_id: payload.record.id,
      });
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    await sendResendEmail({
      apiKey: resendApiKey,
      from: resendFromEmail,
      to: payload.record.invitee_email,
      subject: `Booking confirmed: ${event?.title ?? "Session"}`,
      html: `
        <p>Hi ${payload.record.invitee_name},</p>
        <p>Your booking is confirmed.</p>
        <p><strong>Event:</strong> ${event?.title ?? "Session"}</p>
        <p><strong>When:</strong> ${startLabel}</p>
        <p><strong>Host:</strong> ${hostName}</p>
      `,
    });

    console.log("Sent invitee booking email", {
      to: payload.record.invitee_email,
      event: event?.title,
      starts_at: payload.record.starts_at,
    });

    if (notifyOwner && ownerEmail) {
      await sendResendEmail({
        apiKey: resendApiKey,
        from: resendFromEmail,
        to: ownerEmail,
        subject: `New booking: ${event?.title ?? "Session"}`,
        html: `
          <p>You have a new booking.</p>
          <p><strong>Event:</strong> ${event?.title ?? "Session"}</p>
          <p><strong>Invitee:</strong> ${payload.record.invitee_name} (${payload.record.invitee_email})</p>
          <p><strong>When:</strong> ${startLabel}</p>
        `,
      });
      console.log("Sent owner notification email", {
        owner_id: payload.record.owner_id,
        to: ownerEmail,
        event: event?.title,
        starts_at: payload.record.starts_at,
      });
    } else if (notifyOwner && !ownerEmail) {
      console.warn("Owner notification enabled but owner email is missing", {
        owner_id: payload.record.owner_id,
      });
    } else {
      console.log(
        "Skipping owner notification email (disabled by preference)",
        {
          owner_id: payload.record.owner_id,
        },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
