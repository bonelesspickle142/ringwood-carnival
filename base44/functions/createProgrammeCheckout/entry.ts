import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { email, success_url, cancel_url } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          price: 'price_1TLSTDDf48AmOMqImlZyFTJr',
          quantity: 1,
        },
      ],
      success_url: success_url || 'https://app.base44.com',
      cancel_url: cancel_url || 'https://app.base44.com',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});