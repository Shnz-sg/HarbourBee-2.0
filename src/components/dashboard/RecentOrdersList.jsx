import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { format } from "date-fns";

export default function RecentOrdersList({ orders }) {
  const recent = orders.slice(0, 8);

  if (recent.length === 0) return <EmptyState message="No recent orders" />;

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
          <Link to={createPageUrl("Orders")} className="text-xs text-sky-600 hover:underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {recent.map(order => (
          <Link
            key={order.id}
            to={createPageUrl(`OrderDetail?id=${order.id}`)}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{order.order_id}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.vessel_name} · {order.port || "—"}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-sm font-medium text-slate-700">
                {order.total_amount ? `$${order.total_amount.toLocaleString()}` : "—"}
              </p>
              <p className="text-xs text-slate-400">
                {order.created_date ? format(new Date(order.created_date), "MMM d") : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}