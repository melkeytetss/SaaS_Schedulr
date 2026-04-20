// Triggered by a Supabase DB webhook on INSERT into public.bookings.
// Sends a confirmation email to the invitee and a notification to the owner.
//
// Deploy: `supabase functions deploy send-booking-email`
// Local:  `supabase functions serve send-booking-email --env-file .env.local`

import { z } from "https://esm.sh/zod@3.24.1";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const payload = PayloadSchema.parse(body);

    const admin = supabaseAdmin();

    // Fetch event + owner profile for the email template.
    const { data: event } = await admin
      .from("event_types")
      .select("title, duration_min, profiles(full_name, username)")
      .eq("id", payload.record.event_type_id)
      .single();

    // TODO: wire Resend/SMTP. For now we just log.
    console.log("Sending booking email", {
      to: payload.record.invitee_email,
      event: event?.title,
      starts_at: payload.record.starts_at,
    });

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
