import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

  // Create the spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { title: 'RWC APP Staff Logins' },
      sheets: [{ properties: { title: 'Sheet1' } }],
    }),
  });
  const sheet = await createRes.json();
  const spreadsheetId = sheet.spreadsheetId;

  // Add header row
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C1?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['Name', 'Username', 'Password']] }),
    }
  );

  return Response.json({ spreadsheetId, url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` });
});