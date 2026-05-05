import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { action, username, password, name, suUsername, suPassword } = body;

  const validSuUsername = Deno.env.get('SU_USERNAME');
  const validSuPassword = Deno.env.get('SU_PASSWORD');
  const spreadsheetId = Deno.env.get('STAFF_LOGINS_SHEET_ID');

  // SU login check — no auth required
  if (action === 'login') {
    const ok = username === validSuUsername && password === validSuPassword;
    return Response.json({ success: ok });
  }

  // All other actions: verify SU credentials sent with request
  if (suUsername !== validSuUsername || suPassword !== validSuPassword) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

  if (action === 'list') {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    const rows = data.values || [];
    const staff = rows.map(([n, u, p]) => ({ name: n, username: u, password: p }));
    return Response.json({ staff });
  }

  if (action === 'add') {
    // Generate random password if not provided
    const newPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '!';
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:C:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[name, username, newPassword]] }),
      }
    );
    return Response.json({ success: true, password: newPassword });
  }

  if (action === 'delete') {
    const readRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const readData = await readRes.json();
    const rows = readData.values || [];
    const filtered = rows.filter(([, u]) => u !== username);

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C:clear`,
      { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (filtered.length > 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:C?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: filtered }),
        }
      );
    }

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});