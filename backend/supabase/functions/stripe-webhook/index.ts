// Stripe webhook handler. Wire once billing is introduced.
// Verifies the signature, updates subscription state in the DB.

import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const sig = req.headers.get("stripe-signature");
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!sig || !secret) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  const body = await req.text();

  // TODO: verify signature with Stripe SDK (import via esm.sh) and handle
  // events: checkout.session.completed, customer.subscription.updated, etc.
  console.log("Received Stripe webhook", { bodyLength: body.length });

  return new Response("ok", { headers: corsHeaders });
});
