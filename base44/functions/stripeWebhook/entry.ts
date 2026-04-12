import Stripe from 'npm:stripe@14';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const PROGRAMME_BODY = `Dear Carnival Supporter,

Thank you for purchasing the Ringwood Carnival 2024 Official Programme!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RINGWOOD CARNIVAL 2024 — OFFICIAL PROGRAMME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WELCOME FROM THE CHAIR
Welcome to the Ringwood Carnival 2024! We are delighted to welcome you to what promises to be our biggest and best carnival yet.

PROCESSION ORDER
1. Ringwood Town Band
2. Ringwood School Float
3. Ringwood Lions Club
4. New Forest Dance Academy
5. Ringwood Rotary Club
6. St John Ambulance
7. Ringwood Scout Group
8. Community Champions Float
9. Carnival Queen Float
10. Ringwood Carnival Committee

EVENTS SCHEDULE
10:00 — Craft & Artisan Market opens (Market Place)
11:00 — Live music begins (Main Stage)
12:00 — Food stalls open
14:00 — Afternoon Procession departs
16:30 — Best Float judging & awards
18:00 — Evening entertainment begins
19:15 — Evening Procession departs
21:30 — Fireworks finale

SPONSORS & SUPPORTERS
A huge thank you to all our sponsors and supporters who make this event possible.

Thank you for being part of the Ringwood Carnival family!

With warm wishes,
The Ringwood Carnival Committee
`;

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email || session.customer_details?.email;

    if (email) {
      try {
        const base44 = createClientFromRequest(req);

        // Record the purchase
        await base44.asServiceRole.entities.ProgrammePurchase.create({
          email,
          name: session.customer_details?.name || '',
        });

        // Send the programme email
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: 'Ringwood Carnival 2024 — Your Official Programme',
          body: PROGRAMME_BODY,
        });

        console.log('Programme sent to:', email);
      } catch (err) {
        console.error('Failed to send programme:', err.message);
      }
    }
  }

  return Response.json({ received: true });
});