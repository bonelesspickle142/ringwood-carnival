import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pdfUrl = Deno.env.get('PROGRAMME_PDF_URL');

  // Record the claim
  await base44.asServiceRole.entities.ProgrammeClaim.create({
    email: normalizedEmail,
    used: true,
  });

  // Send email with PDF link
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: normalizedEmail,
    subject: 'Your Ringwood Carnival 2026 Official Programme 🎉',
    body: `<p>Hi there,</p>
<p>Thank you so much for supporting Ringwood Carnival 2026!</p>
<p>Here is your official digital programme:</p>
<p style="margin: 24px 0;"><a href="${pdfUrl}" style="display:inline-block;background:#e53e3e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">📖 Download Your Programme</a></p>
<p>We hope you enjoy it, and we look forward to seeing you at the carnival!</p>
<p>Warm regards,<br/>The Ringwood Carnival Team</p>`,
  });

  // Notify Discord
  const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_URL');
  if (discordWebhook) {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `📖 Programme claimed by: **${normalizedEmail}**` }),
    });
  }

  return Response.json({
    success: true,
    pdf_url: pdfUrl,
  });
});