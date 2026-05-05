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

    await ensureSheet(accessToken, spreadsheetId, 'Sign Out', [
      'Timestamp', 'Name', 'Role', 'Radio ID', 'Earpiece', 'Spare Battery', 'Signature', 'Signature Data'
    ]);

    await appendRow(accessToken, spreadsheetId, 'Sign Out', [
      timestamp, name, role, radioId,
      hasEarpiece ? 'Yes' : 'No',
      hasSpareBattery ? 'Yes' : 'No',
      signature ? '[Signed]' : '[No signature]',
      signature || ''
    ]);

    return Response.json({ success: true });
  }

  if (action === 'sign_in') {
    const { radioId, hasDamage, damageNotes, earpieceReturned, batteryReturned, signature, name, role } = body;

    await ensureSheet(accessToken, spreadsheetId, 'Sign In', [
      'Timestamp', 'Name', 'Role', 'Radio ID', 'Damage?', 'Damage Notes', 'Earpiece Returned', 'Battery Returned', 'Signature', 'Signature Data'
    ]);

    await appendRow(accessToken, spreadsheetId, 'Sign In', [
      timestamp, name || '', role || '', radioId,
      hasDamage ? 'Yes' : 'No',
      damageNotes || '',
      earpieceReturned ? 'Yes' : 'No',
      batteryReturned ? 'Yes' : 'No',
      signature ? '[Signed]' : '[No signature]',
      signature || ''
    ]);

    return Response.json({ success: true });
  }

  if (action === 'get_logs') {
    const { sheet } = body; // 'Sign Out' or 'Sign In'

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheet)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    const rows = data.values || [];
    if (rows.length <= 1) return Response.json({ logs: [] });

    const headers = rows[0];
    const logs = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ''; });
      return obj;
    });

    return Response.json({ logs: logs.reverse() });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});

async function ensureSheet(accessToken, spreadsheetId, sheetName, headers) {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const meta = await metaRes.json();
  const exists = meta.sheets?.some(s => s.properties.title === sheetName);

  if (!exists) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] })
      }
    );
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
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:A:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] })
    }
  );
}