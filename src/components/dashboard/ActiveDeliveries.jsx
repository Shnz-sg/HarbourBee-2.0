import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { Truck } from "lucide-react";
import { format } from "date-fns";

export default function ActiveDeliveries({ deliveries }) {
  const active = deliveries.filter(d => !["delivered", "cancelled", "failed"].includes(d.status)).slice(0, 6);

  if (active.length === 0) return <EmptyState message="No active deliveries" icon={Truck} />;

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Active Deliveries</h2>
          <Link to={createPageUrl("Deliveries")} className="text-xs text-sky-600 hover:underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {active.map(d => (
          <Link
            key={d.id}
            to={createPageUrl(`DeliveryDetail?id=${d.id}`)}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{d.delivery_id}</span>
                <StatusBadge status={d.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {d.vessel_name || "—"} · {d.delivery_method || "launch"}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-xs text-slate-400">
                {d.scheduled_date ? format(new Date(d.scheduled_date), "MMM d, HH:mm") : "—"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}