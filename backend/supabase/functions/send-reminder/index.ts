// Scheduled function — runs periodically to send reminders for upcoming bookings.
// Configure via Supabase Scheduled Triggers (cron) in the dashboard.

import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = supabaseAdmin();

  // Find bookings that start within the next 30 minutes and haven't been reminded yet.
  const from = new Date();
  const to = new Date(from.getTime() + 30 * 60_000);

  const { data: bookings, error } = await admin
    .from("bookings")
    .select("id, invitee_email, invitee_name, starts_at, event_types(title)")
    .gte("starts_at", from.toISOString())
    .lte("starts_at", to.toISOString())
    .eq("status", "confirmed");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  // TODO: wire Resend / Twilio. For now we just log.
  console.log(`Would send ${bookings?.length ?? 0} reminders`);

  return new Response(JSON.stringify({ ok: true, count: bookings?.length ?? 0 }), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});
