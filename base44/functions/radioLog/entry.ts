import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { action } = body;

  const spreadsheetId = Deno.env.get('RADIO_LOG_SHEET_ID');

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

  const now = new Date();
  const timestamp = now.toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  if (action === 'sign_out') {
    const { name, role, radioId, hasEarpiece, hasSpareBattery, signature } = body;

    const sigValue = signature ? await uploadSignature(base44, signature) : '[No signature]';

    await ensureSheet(accessToken, spreadsheetId, 'Sign Out', [
      'Timestamp', 'Name', 'Role', 'Radio ID', 'Earpiece', 'Spare Battery', 'Signature'
    ]);

    await appendRow(accessToken, spreadsheetId, 'Sign Out', [
      timestamp, name, role, radioId,
      hasEarpiece ? 'Yes' : 'No',
      hasSpareBattery ? 'Yes' : 'No',
      sigValue
    ]);

    return Response.json({ success: true });
  }

  if (action === 'sign_in') {
    const { radioId, hasDamage, damageNotes, earpieceReturned, batteryReturned, signature } = body;

    const sigValue = signature ? await uploadSignature(base44, signature) : '[No signature]';

    await ensureSheet(accessToken, spreadsheetId, 'Sign In', [
      'Timestamp', 'Radio ID', 'Damage?', 'Damage Notes', 'Earpiece Returned', 'Battery Returned', 'Signature'
    ]);

    await appendRow(accessToken, spreadsheetId, 'Sign In', [
      timestamp, radioId,
      hasDamage ? 'Yes' : 'No',
      damageNotes || '',
      earpieceReturned ? 'Yes' : 'No',
      batteryReturned ? 'Yes' : 'No',
      sigValue
    ]);

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});

async function ensureSheet(accessToken, spreadsheetId, sheetName, headers) {
  // Get existing sheets
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const meta = await metaRes.json();
  const exists = meta.sheets?.some(s => s.properties.title === sheetName);

  if (!exists) {
    // Create sheet
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] })
      }
    );
    // Add headers
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [headers] })
      }
    );
  }
}

async function appendRow(accessToken, spreadsheetId, sheetName, values) {
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:A:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] })
    }
  );
}

async function uploadSignature(base44, dataUrl) {
  // Convert base64 data URL to binary
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const blob = new Blob([binary], { type: 'image/png' });

  const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file: blob });
  // Return an =IMAGE() formula so Google Sheets renders it as a picture
  return `=IMAGE("${file_url}")`;
}