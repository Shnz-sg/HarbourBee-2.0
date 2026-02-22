import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);
    
    const {
      priority,
      type,
      readStatus,
      objectType,
      objectId,
      vesselIMO,
      vendorId,
      limit = '25',
      cursor
    } = params;

    // Build server-side filter with security
    const filter = {};

    // Vessel-aware security: filter by vessel IMO for crew
    if (user.role === 'crew') {
      // Get user's vessel assignment
      const assignments = await base44.entities.UserVesselAssignment.filter({
        user_id: user.id,
        unassigned_at: null
      });
      if (assignments.length > 0) {
        filter.vessel_imo = assignments[0].vessel_imo;
      }
    }

    // Vendor-specific filtering
    if (user.role === 'vendor') {
      // Get vendor ID from user metadata or vendor assignment
      if (user.vendor_id) {
        filter.vendor_id = user.vendor_id;
      }
    }

    // Override vessel filter if explicitly passed (ops/admin only)
    if (vesselIMO && ['ops_admin', 'finance', 'super_admin'].includes(user.role)) {
      filter.vessel_imo = vesselIMO;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      filter.computed_priority = priority;
    }

    // Object type filter
    if (type && type !== 'all') {
      filter.object_type = type;
    }

    // Read status filter
    if (readStatus === 'unread') {
      filter.is_read = false;
    } else if (readStatus === 'read') {
      filter.is_read = true;
    }

    // Contextual object filtering
    if (objectType && objectType !== 'all') {
      filter.object_type = objectType;
    }
    if (objectId) {
      filter.object_id = objectId;
    }

    // Exclude archived notifications
    filter.archived_at = null;

    // Fetch notifications sorted by priority_weight DESC
    const limitNum = parseInt(limit) || 25;
    let notifications = await base44.entities.Notification.filter(
      filter,
      '-priority_weight',
      limitNum + 1 // Fetch one extra to determine if there are more
    );

    // Apply cursor-based pagination
    if (cursor) {
      const cursorIndex = notifications.findIndex(n => n.id === cursor);
      if (cursorIndex !== -1) {
        notifications = notifications.slice(cursorIndex + 1);
      }
    }

    const hasMore = notifications.length > limitNum;
    if (hasMore) {
      notifications = notifications.slice(0, limitNum);
    }

    // Secondary sort: unread first, then by created_date DESC
    notifications.sort((a, b) => {
      if (a.priority_weight !== b.priority_weight) {
        return b.priority_weight - a.priority_weight;
      }
      if (a.is_read !== b.is_read) {
        return a.is_read ? 1 : -1;
      }
      return new Date(b.created_date) - new Date(a.created_date);
    });

    const nextCursor = hasMore ? notifications[notifications.length - 1]?.id : null;

    return Response.json({
      notifications,
      nextCursor,
      hasMore
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});