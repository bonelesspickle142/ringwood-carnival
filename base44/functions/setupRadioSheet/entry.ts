import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

  // Create a new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { title: 'RWC Radio Sign In/Out Log' },
      sheets: [
        {
          properties: { title: 'Sign Out', sheetId: 0 },
          data: [{ rowData: [{ values: [
            'Timestamp', 'Name', 'Role', 'Radio ID', 'Earpiece Taken', 'Spare Battery Taken', 'Signature'
          ].map(v => ({ userEnteredValue: { stringValue: v }, userEnteredFormat: { textFormat: { bold: true } } })) }] }]
        },
        {
          properties: { title: 'Sign In', sheetId: 1 },
          data: [{ rowData: [{ values: [
            'Timestamp', 'Radio ID', 'Damage?', 'Damage Notes', 'Earpiece Returned', 'Battery Returned', 'Signature'
          ].map(v => ({ userEnteredValue: { stringValue: v }, userEnteredFormat: { textFormat: { bold: true } } })) }] }]
        }
      ]
    })
  });

  const sheet = await createRes.json();
  const spreadsheetId = sheet.spreadsheetId;
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return Response.json({ spreadsheetId, url });
});