// Google Calendar OAuth + sync. Two-way sync: push confirmed bookings,
// pull busy times to block availability. Wire when the feature is built.

import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const action = url.searchParams.get("action"); // "authorize" | "callback" | "sync"

  // TODO: implement each action.
  console.log("google-calendar-sync invoked", { action });

  return new Response(JSON.stringify({ ok: true, action }), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});
