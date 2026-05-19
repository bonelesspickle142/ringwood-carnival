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

  const apiKey = Deno.env.get('JUSTGIVING_API_KEY');
  const pageShortName = Deno.env.get('JUSTGIVING_PAGE_SHORT_NAME');
  const pdfUrl = Deno.env.get('PROGRAMME_PDF_URL');

  // Fetch donations using x-api-key header (preferred approach per JustGiving docs)
  const jgRes = await fetch(
    `https://api.justgiving.com/v1/fundraising/pages/${pageShortName}/donations`,
    {
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey,
      }
    }
  );

  if (!jgRes.ok) {
    const errText = await jgRes.text();
    console.error('JustGiving API error:', jgRes.status, errText);
    return Response.json({ error: `JustGiving API returned ${jgRes.status}. Please check your API key and page name.` });
  }

  const jgData = await jgRes.json();
  console.log('JustGiving response keys:', Object.keys(jgData));
  const donations = jgData.donations || [];
  console.log('Total donations fetched:', donations.length);

  // Log first donation structure to understand email field name
  if (donations.length > 0) {
    console.log('Sample donation keys:', Object.keys(donations[0]));
  }

  // Match donor email — JustGiving exposes email when authenticated as page owner
  const match = donations.find((d) => {
    const donorEmail = (d.donorLocalIdentifier || d.email || d.donorEmailAddress || '').toLowerCase();
    return donorEmail === normalizedEmail;
  });

  if (!match) {
    return Response.json({
      error: 'No donation found for this email address. Please ensure you used the same email when donating on JustGiving, and that your donation has been processed.',
      donations_checked: donations.length,
    });
  }

  // Mark as used in database
  await base44.asServiceRole.entities.ProgrammeClaim.create({
    email: normalizedEmail,
    used: true,
    donor_name: match.donorDisplayName || '',
  });

  // Send email with PDF link via Base44 built-in SendEmail
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: normalizedEmail,
    subject: 'Your Ringwood Carnival 2026 Official Programme 🎉',
    body: `<p>Hi ${match.donorDisplayName || 'there'},</p>
<p>Thank you so much for your generous donation to Ringwood Carnival 2026!</p>
<p>As promised, here is your official digital programme:</p>
<p style="margin: 24px 0;"><a href="${pdfUrl}" style="display:inline-block;background:#e53e3e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">📖 Download Your Programme</a></p>
<p>We hope you enjoy it, and we look forward to seeing you at the carnival!</p>
<p>Warm regards,<br/>The Ringwood Carnival Team</p>`,
  });

  return Response.json({
    success: true,
    donor_name: match.donorDisplayName || '',
    pdf_url: pdfUrl,
  });
});