import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [events, photos, purchases] = await Promise.all([
      base44.asServiceRole.entities.Event.list('created_date', 200),
      base44.asServiceRole.entities.CarnivalPhoto.list('created_date', 200),
      base44.asServiceRole.entities.ProgrammePurchase.list('created_date', 200),
    ]);

    const approvedPhotos = photos.filter(p => p.is_approved);
    const pendingPhotos = photos.filter(p => !p.is_approved);

    // Photos submitted per day (last 7 days)
    const now = new Date();
    const photosByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      photosByDay[key] = 0;
    }
    for (const p of photos) {
      const d = new Date(p.created_date);
      const diff = Math.floor((now - d) / 86400000);
      if (diff <= 6) {
        const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        if (photosByDay[key] !== undefined) photosByDay[key]++;
      }
    }

    return Response.json({
      events_count: events.length,
      photos_total: photos.length,
      photos_approved: approvedPhotos.length,
      photos_pending: pendingPhotos.length,
      programme_purchases: purchases.length,
      photos_by_day: photosByDay,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});