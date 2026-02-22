import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Truck, Anchor, Ship } from "lucide-react";
import { format, isPast } from "date-fns";

export default function DeliveriesTable({ deliveries, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-slate-100 text-slate-700",
      preparing: "bg-blue-100 text-blue-700",
      dispatched: "bg-purple-100 text-purple-700",
      in_transit: "bg-amber-100 text-amber-700",
      at_anchorage: "bg-cyan-100 text-cyan-700",
      delivered: "bg-green-100 text-green-700",
      delayed: "bg-rose-100 text-rose-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-600"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getAttentionBadge = (delivery) => {
    if (delivery.attentionLevel === "critical") {
      return <AlertTriangle className="w-4 h-4 text-rose-500" title="Critical attention" />;
    }
    if (delivery.attentionLevel === "warning") {
      return <Clock className="w-4 h-4 text-amber-500" title="Warning" />;
    }
    return null;
  };

  const getSLAIndicator = (delivery) => {
    if (!delivery.sla_target_time) return "—";
    const isPastSLA = isPast(new Date(delivery.sla_target_time));
    
    if (delivery.status === "delivered") {
      if (delivery.sla_variance_minutes <= 0) {
        return <span className="text-green-600 font-medium text-xs">On Time</span>;
      } else {
        return <span className="text-amber-600 font-medium text-xs">Late</span>;
      }
    }
    
    if (isPastSLA) {
      return <span className="text-rose-600 font-medium text-xs">Breach</span>;
    }
    
    return <span className="text-emerald-600 text-xs">On Track</span>;
  };

  // Column configuration
  const getGridColumns = () => {
    if (isOpsStaff) {
      return "1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.5fr";
    } else if (isOpsAdmin) {
      return "1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.5fr";
    }
    return "1.5fr 1fr 1fr 1fr 1fr 0.5fr";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: getGridColumns() }}
      >
        <div>Delivery ID</div>
        <div>Status</div>
        <div>Vessel</div>
        <div>Anchorage</div>
        <div>Scheduled</div>
        {(isOpsStaff || isOpsAdmin) && <div>SLA</div>}
        {isOpsAdmin && <div>Vendor</div>}
        {isOpsAdmin && <div>Fee</div>}
        <div>Alert</div>
        <div></div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {deliveries.map(delivery => (
          <Link
            key={delivery.id}
            to={createPageUrl("DeliveryDetail") + `?id=${delivery.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm items-center"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {/* Delivery ID */}
            <div className="font-medium text-sky-600 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              {delivery.delivery_id}
            </div>

            {/* Status */}
            <div>
              <Badge className={getStatusColor(delivery.status)} variant="secondary">
                {delivery.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Vessel */}
            <div className="text-slate-900 font-medium flex items-center gap-1">
              <Ship className="w-3 h-3 text-slate-400" />
              {delivery.vessel_name || "—"}
            </div>

            {/* Anchorage */}
            <div className="text-slate-600 flex items-center gap-1">
              <Anchor className="w-3 h-3 text-slate-400" />
              {delivery.anchorage || delivery.port || "—"}
            </div>

            {/* Scheduled */}
            <div className="text-slate-600 text-xs">
              {delivery.scheduled_date ? format(new Date(delivery.scheduled_date), "MMM d, HH:mm") : "—"}
            </div>

            {/* SLA (Ops/Admin) */}
            {(isOpsStaff || isOpsAdmin) && (
              <div>{getSLAIndicator(delivery)}</div>
            )}

            {/* Vendor (Admin) */}
            {isOpsAdmin && (
              <div className="text-slate-600 text-xs">{delivery.vendor_name || "—"}</div>
            )}

            {/* Fee (Admin) */}
            {isOpsAdmin && (
              <div className="text-slate-900 font-medium">
                ${(delivery.delivery_fee || 0).toLocaleString()}
              </div>
            )}

            {/* Attention Badge */}
            <div>{getAttentionBadge(delivery)}</div>

            {/* Arrow */}
            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}