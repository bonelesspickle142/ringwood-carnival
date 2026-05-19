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

  // Send the programme email
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: email,
    subject: 'Ringwood Carnival 2024 — Your Programme',
    body: `Dear ${name || 'Carnival Supporter'},\n\nThank you for purchasing the Ringwood Carnival 2024 Official Programme!\n\nYou can view your programme at any time in the Ringwood Carnival app under the Donate & Support section.\n\nWe hope you enjoy the carnival!\n\nWith thanks,\nThe Ringwood Carnival Committee`
  });

  return Response.json({ success: true });
});