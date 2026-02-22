import React from "react";
import { Circle, CheckCircle } from "lucide-react";

export default function OrderActivityTimeline({ order, pool, delivery }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const activities = [];

  // Order placed
  if (order.created_date) {
    activities.push({
      label: "Order placed",
      timestamp: order.created_date,
      completed: true
    });
  }

  // Joined pool
  if (order.pool_id && pool) {
    activities.push({
      label: `Joined pool ${pool.pool_id}`,
      timestamp: pool.created_date,
      completed: true
    });
  }

  // Pool closed
  if (pool && ["locked", "in_delivery", "delivered"].includes(pool.status)) {
    activities.push({
      label: "Pool closed",
      timestamp: pool.updated_date,
      completed: true
    });

    // Pool outcome
    const isFreeDelivery = pool.order_count >= 3;
    activities.push({
      label: isFreeDelivery ? "Free delivery confirmed" : "Shared delivery fee applied",
      timestamp: pool.updated_date,
      completed: true
    });
  }

  // Refund issued
  if (order.refund_amount > 0) {
    activities.push({
      label: "Refund issued",
      timestamp: order.updated_date,
      completed: true
    });
  }

  // Delivery completed
  if (delivery && delivery.delivered_at) {
    activities.push({
      label: "Delivery completed",
      timestamp: delivery.delivered_at,
      completed: true
    });
  } else if (order.status === "delivered") {
    activities.push({
      label: "Delivery completed",
      timestamp: order.updated_date,
      completed: true
    });
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Order Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;
          const Icon = activity.completed ? CheckCircle : Circle;

          return (
            <div key={index} className="relative">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Icon className={`w-4 h-4 ${
                    activity.completed ? "text-green-600" : "text-slate-300"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
              {!isLast && (
                <div className="absolute left-2 top-6 bottom-0 w-px bg-slate-200 -mb-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}