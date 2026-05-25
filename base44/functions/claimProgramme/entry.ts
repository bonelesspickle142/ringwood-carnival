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

  // Notify Discord
  const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_URL');
  if (discordWebhook) {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '📖 Programme Claimed "<@231755982101807104>"' ,
          description: `**Email:** ${normalizedEmail}`,
          color: 0x3B5BDB,
          timestamp: new Date().toISOString(),
        }]
      }),
    });
  }

  return Response.json({
    success: true,
    pdf_url: pdfUrl,
  });
});