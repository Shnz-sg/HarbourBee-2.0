import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageHeader from "../components/shared/PageHeader";
import NotificationGroup from "../components/notifications/NotificationGroup";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationsEmptyState from "../components/notifications/NotificationsEmptyState";
import SkeletonRows from "../components/shared/SkeletonRows";
import { Button } from "@/components/ui/button";
import { Filter, CheckCheck } from "lucide-react";

export default function Notifications() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  
  const [filters, setFilters] = useState({
    priority: "all",
    type: "all",
    readStatus: "all",
    objectType: "all",
    objectId: ""
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Server-side notification fetching via backend function
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["notifications", filters, user?.id, cursor],
    queryFn: async () => {
      const params = new URLSearchParams({
        priority: filters.priority,
        type: filters.type,
        readStatus: filters.readStatus,
        objectType: filters.objectType,
        ...(filters.objectId && { objectId: filters.objectId }),
        ...(cursor && { cursor }),
        limit: '25'
      });

      const response = await base44.functions.invoke('getNotifications', {
        queryParams: params.toString()
      });

      return response.data;
    },
    enabled: !!user,
  });

  // Update accumulated notifications when new data arrives
  useEffect(() => {
    if (data?.notifications) {
      if (cursor) {
        // Append to existing
        setAllNotifications(prev => [...prev, ...data.notifications]);
      } else {
        // Replace with fresh data
        setAllNotifications(data.notifications);
      }
    }
  }, [data]);

  // Reset cursor when filters change
  useEffect(() => {
    setCursor(null);
    setAllNotifications([]);
  }, [filters]);

  const notifications = allNotifications;

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(unreadNotifications.map(n => 
        base44.entities.Notification.update(n.id, { is_read: true })
      ));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // Group by computed priority (already server-filtered and sorted)
  const groupedNotifications = {
    critical: notifications.filter(n => n.computed_priority === "critical"),
    important: notifications.filter(n => n.computed_priority === "important"),
    informational: notifications.filter(n => n.computed_priority === "informational")
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }

    // Navigate to related page
    if (notification.object_type && notification.object_id) {
      const pageMap = {
        order: "OrderDetail",
        pool: "PoolDetail",
        delivery: "DeliveryDetail",
        vendor_order: "VendorOrderDetail"
      };
      const pageName = pageMap[notification.object_type];
      if (pageName) {
        navigate(createPageUrl(`${pageName}?id=${notification.object_id}`));
      }
    }
  };

  const loadMore = () => {
    if (data?.hasMore && data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasActiveFilters = filters.priority !== "all" || filters.type !== "all" || filters.readStatus !== "all" || filters.objectType !== "all" || filters.objectId;
  const allRead = notifications.length > 0 && unreadCount === 0;

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Your recent updates">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllRead.mutate()}
              className="h-8 text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>
      </PageHeader>

      {isLoading ? (
        <SkeletonRows rows={8} cols={3} />
      ) : (
        <>
          <NotificationFilters filters={filters} onFilterChange={setFilters} />

          {notifications.length === 0 ? (
            <NotificationsEmptyState hasFilters={hasActiveFilters} allRead={allRead} />
          ) : (
            <>
              <div className="space-y-0">
                {groupedNotifications.critical.length > 0 && (
                  <NotificationGroup
                    priority="critical"
                    notifications={groupedNotifications.critical}
                    defaultExpanded={true}
                    onNotificationClick={handleNotificationClick}
                  />
                )}
                {groupedNotifications.important.length > 0 && (
                  <NotificationGroup
                    priority="important"
                    notifications={groupedNotifications.important}
                    defaultExpanded={true}
                    onNotificationClick={handleNotificationClick}
                  />
                )}
                {groupedNotifications.informational.length > 0 && (
                  <NotificationGroup
                    priority="informational"
                    notifications={groupedNotifications.informational}
                    defaultExpanded={false}
                    onNotificationClick={handleNotificationClick}
                  />
                )}
              </div>

              {/* Load More Button */}
              {data?.hasMore && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isFetching}
                    className="w-full sm:w-auto"
                  >
                    {isFetching ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}