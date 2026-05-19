import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { email, name } = await req.json();

  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }

  // Check if already purchased
  const existing = await base44.asServiceRole.entities.ProgrammePurchase.filter({ email });

  if (existing.length === 0) {
    // Record the purchase
    await base44.asServiceRole.entities.ProgrammePurchase.create({ email, name: name || '' });
  }

  // Ping Discord
  const webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `🎟️ New programme purchase: **${name || 'Unknown'}** — \`${email}\`` }),
    });
  }


});