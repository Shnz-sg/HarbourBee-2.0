import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

export default function DeliveryListItem({ delivery, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";

  const attentionLevel = delivery.attentionLevel || "healthy";
  const isCritical = attentionLevel === "critical";
  const isWarning = attentionLevel === "warning";
  const isDueToday = delivery.scheduled_date && isToday(new Date(delivery.scheduled_date));

  const rowClasses = isCritical 
    ? "bg-red-50/40" 
    : isWarning 
    ? "bg-amber-50/40" 
    : isDueToday 
    ? "bg-sky-50/30" 
    : "";

  const gridCols = !isOpsStaff && !isOpsAdmin && !isSuperAdmin 
    ? "grid-cols-5" 
    : isOpsStaff 
    ? "grid-cols-7" 
    : isOpsAdmin 
    ? "grid-cols-8" 
    : "grid-cols-9";

  return (
    <Link
      to={createPageUrl(`DeliveryDetail?id=${delivery.id}`)}
      className={`grid ${gridCols} gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center ${rowClasses}`}
    >
      {/* Delivery ID */}
      <div className="flex items-center gap-1.5">
        {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isCritical && (
          <span className="text-red-600 text-xs">🔴</span>
        )}
        {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isWarning && (
          <span className="text-amber-600 text-xs">🟠</span>
        )}
        <span className="text-sm font-medium text-sky-600 truncate">{delivery.delivery_id}</span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={delivery.status} />
      </div>

      {/* Vessel */}
      <div className="text-sm text-slate-700 truncate">{delivery.vessel_name || "—"}</div>

      {/* Port */}
      <div className="text-xs text-slate-500 truncate">{delivery.port || "—"}</div>

      {/* ETA */}
      <div>
        {delivery.scheduled_date ? (
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3 h-3 flex-shrink-0 ${
              isCritical ? "text-red-500" : 
              isWarning ? "text-amber-500" : 
              isDueToday ? "text-sky-500" : "text-slate-400"
            }`} />
            <span className={`text-xs ${
              isCritical ? "font-medium text-red-700" :
              isWarning ? "font-medium text-amber-700" :
              isDueToday ? "font-medium text-sky-700" : "text-slate-600"
            }`}>
              {format(new Date(delivery.scheduled_date), "MMM d, HH:mm")}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>

      {/* Orders (Ops Staff+) */}
      {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
        <div className="text-xs text-slate-600">
          {delivery.order_count || 0}
        </div>
      )}

      {/* Vendor/Carrier (Ops Staff+) */}
      {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
        <div className="text-xs text-slate-600 truncate">
          {delivery.carrier_name || "—"}
        </div>
      )}

      {/* Delivery Fee (Ops Admin+) */}
      {(isOpsAdmin || isSuperAdmin) && (
        <div className="text-sm font-medium text-slate-700">
          {delivery.delivery_fee ? `$${delivery.delivery_fee.toFixed(0)}` : "—"}
        </div>
      )}

      {/* Margin (Super Admin only) */}
      {isSuperAdmin && (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span>—</span>
        </div>
      )}
    </Link>
  );
}