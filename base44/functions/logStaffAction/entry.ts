import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const DOC_ID = '1g4_n0taH6arjU9pdVR2OmwG48vld_-C7iMfr2FqkS_A';

Deno.serve(async (req) => {
  try {
    const { name, action } = await req.json();

    if (!name || !action) {
      return Response.json({ error: 'Missing name or action' }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const logLine = `[${timestamp}] ${name}: ${action}`;

    console.log('Staff log:', logLine);

    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledocs');

    // First, get the document to find the end index
    const docRes = await fetch(`https://docs.googleapis.com/v1/documents/${DOC_ID}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const doc = await docRes.json();
    const endIndex = doc.body.content.at(-1).endIndex - 1;

    // Append the log line as a new paragraph
    const batchRes = await fetch(`https://docs.googleapis.com/v1/documents/${DOC_ID}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: endIndex },
              text: logLine + '\n',
            },
          },
        ],
      }),
    });

    if (!batchRes.ok) {
      const err = await batchRes.text();
      console.error('Google Docs API error:', err);
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ ok: true, logLine });
  } catch (error) {
    console.error('Log error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});