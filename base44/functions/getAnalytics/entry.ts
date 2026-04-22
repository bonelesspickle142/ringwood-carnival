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

    // Photos submitted per hour (last 6 hours)
    const now = new Date();
    const photosByHour = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(d.getHours() - i, 0, 0, 0);
      const key = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
      photosByHour[key] = 0;
    }
    for (const p of photos) {
      const d = new Date(p.created_date);
      const diffMs = now - d;
      if (diffMs <= 6 * 60 * 60 * 1000) {
        // Round down to the hour slot
        const slotDate = new Date(d);
        slotDate.setMinutes(0, 0, 0);
        const key = slotDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
        if (photosByHour[key] !== undefined) photosByHour[key]++;
      }
    }

    return Response.json({
      events_count: events.length,
      photos_total: photos.length,
      photos_approved: approvedPhotos.length,
      photos_pending: pendingPhotos.length,
      programme_purchases: purchases.length,
      photos_by_hour: photosByHour,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});