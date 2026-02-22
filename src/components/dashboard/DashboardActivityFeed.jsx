import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Activity, Package, Truck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardActivityFeed({ orders, deliveries, user, loading }) {
  if (loading) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Recent Activity
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  // Combine orders and deliveries into activity feed
  const activities = [
    ...orders.slice(0, 3).map(o => ({
      type: 'order',
      id: o.id,
      label: `Order ${o.order_id}`,
      action: o.status === 'submitted' ? 'created' : 'updated',
      timestamp: o.updated_date || o.created_date,
      link: createPageUrl("OrderDetail") + `?id=${o.id}`,
      user: user.role !== 'user' ? o.created_by : null
    })),
    ...deliveries.slice(0, 2).map(d => ({
      type: 'delivery',
      id: d.id,
      label: `Delivery ${d.delivery_id}`,
      action: d.status === 'dispatched' ? 'dispatched' : d.status === 'in_transit' ? 'in transit' : d.status,
      timestamp: d.updated_date || d.created_date,
      link: createPageUrl("DeliveryDetail") + `?id=${d.id}`,
      user: null
    }))
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  if (activities.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Recent Activity
        </h3>
        <p className="text-xs text-slate-500">No recent activity.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Recent Activity
      </h3>
      <div className="space-y-2">
        {activities.map((activity, i) => {
          const Icon = activity.type === 'order' ? Package : Truck;
          return (
            <Link
              key={i}
              to={activity.link}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{activity.label}</span> {activity.action}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}