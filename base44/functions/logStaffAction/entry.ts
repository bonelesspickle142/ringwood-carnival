import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const { name, action } = await req.json();

    if (!name || !action) {
      return Response.json({ error: 'Missing name or action' }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const logLine = `[${timestamp}] ${name}: ${action}\n`;

    console.log('Staff log:', logLine.trim());

    // Append to the remote log file
    const res = await fetch('https://charleymurphy.xyz/carnival_app_logs.txt', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: logLine,
    });

    // If POST isn't supported, fall back silently — log is still captured in function logs above
    return Response.json({ ok: true, logLine });
  } catch (error) {
    console.error('Log error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});