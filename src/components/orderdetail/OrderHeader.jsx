import React from "react";
import StatusBadge from "../shared/StatusBadge";
import { Ship } from "lucide-react";

export default function OrderHeader({ order }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Order {order.order_id}
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>Placed {formatDate(order.created_date)}</span>
            {order.requested_by && (
              <span className="text-slate-400">•</span>
            )}
            {order.requested_by && (
              <span>By {order.requested_by}</span>
            )}
          </div>
          {order.vessel_name && (
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-700">
              <Ship className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{order.vessel_name}</span>
              {order.vessel_id && (
                <span className="text-slate-400">• IMO {order.vessel_id}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={order.status} />
          {order.priority && order.priority !== "normal" && (
            <div className="mt-2">
              <StatusBadge status={order.priority} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}