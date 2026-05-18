import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, id, data } = await req.json();

    if (action === 'create') {
      const created = await base44.asServiceRole.entities.Event.create(data);
      return Response.json(created);
    } else if (action === 'update') {
      const updated = await base44.asServiceRole.entities.Event.update(id, data);
      return Response.json(updated);
    } else if (action === 'delete') {
      await base44.asServiceRole.entities.Event.delete(id);
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});