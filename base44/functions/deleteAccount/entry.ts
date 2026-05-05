import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete user's entity data
  await Promise.all([
    base44.asServiceRole.entities.Vote.filter({ created_by: user.email }).then(votes =>
      Promise.all(votes.map(v => base44.asServiceRole.entities.Vote.delete(v.id)))
    ),
    base44.asServiceRole.entities.CarnivalPhoto.filter({ created_by: user.email }).then(photos =>
      Promise.all(photos.map(p => base44.asServiceRole.entities.CarnivalPhoto.delete(p.id)))
    ),
  ]);

  // Delete the user record itself
  await base44.asServiceRole.entities.User.delete(user.id);

  return Response.json({ success: true });
});