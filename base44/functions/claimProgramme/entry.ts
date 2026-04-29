import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if this email has already claimed a programme
  const existing = await base44.asServiceRole.entities.ProgrammeClaim.filter({ email: normalizedEmail });
  if (existing && existing.length > 0) {
    return Response.json({ error: 'This email has already been used to claim a programme.' }, { status: 409 });
  }

  // Fetch donations from JustGiving API
  const apiKey = Deno.env.get('JUSTGIVING_API_KEY');
  const pageShortName = Deno.env.get('JUSTGIVING_PAGE_SHORT_NAME');
  const pdfUrl = Deno.env.get('PROGRAMME_PDF_URL');

  const jgRes = await fetch(
    `https://api.justgiving.com/${apiKey}/v1/fundraising/pages/${pageShortName}/donations`,
    { headers: { 'Accept': 'application/json' } }
  );

  if (!jgRes.ok) {
    return Response.json({ error: 'Could not reach JustGiving. Please try again shortly.' }, { status: 502 });
  }

  const jgData = await jgRes.json();
  const donations = jgData.donations || [];

  // Match donor email (case-insensitive)
  const match = donations.find(
    (d) => d.donorLocalIdentifier?.toLowerCase() === normalizedEmail ||
           d.email?.toLowerCase() === normalizedEmail ||
           d.thirdPartyReference?.toLowerCase() === normalizedEmail
  );

  if (!match) {
    return Response.json({ error: 'No donation found for this email address. Please ensure you used the same email when donating on JustGiving.' }, { status: 404 });
  }

  // Mark as used in database
  await base44.asServiceRole.entities.ProgrammeClaim.create({
    email: normalizedEmail,
    used: true,
    donor_name: match.donorDisplayName || '',
  });

  // Send email with PDF via Base44 built-in SendEmail
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: normalizedEmail,
    subject: 'Your Ringwood Carnival 2026 Official Programme 🎉',
    body: `<p>Hi ${match.donorDisplayName || 'there'},</p>
<p>Thank you so much for your generous donation to Ringwood Carnival 2026!</p>
<p>As promised, here is your official digital programme:</p>
<p><a href="${pdfUrl}" style="display:inline-block;background:#e53e3e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">📖 Download Your Programme</a></p>
<p>We hope you enjoy it, and we look forward to seeing you at the carnival!</p>
<p>Warm regards,<br/>The Ringwood Carnival Team</p>`,
  });

  return Response.json({
    success: true,
    donor_name: match.donorDisplayName || '',
    pdf_url: pdfUrl,
  });
});