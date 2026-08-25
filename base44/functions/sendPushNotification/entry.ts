import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, content } = await req.json();
    if (!title || !content) {
      return Response.json({ error: 'Missing title or content' }, { status: 400 });
    }

    const users = await base44.asServiceRole.entities.User.list('-created_date', 1000);

    let sent = 0;
    let failed = 0;
    for (const u of users) {
      try {
        await base44.asServiceRole.integrations.Core.SendPushNotification({
          user_id: u.id,
          title,
          content,
        });
        sent++;
      } catch (e) {
        failed++;
      }
    }

    return Response.json({ ok: true, sent, failed, total: users.length });
  } catch (error) {
    console.error('sendPushNotification error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});