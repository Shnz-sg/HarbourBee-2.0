import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { AlertCircle, Clock, Anchor } from "lucide-react";
import { format, differenceInHours } from "date-fns";

export default function VendorOrderListItem({ vendorOrder, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";

  const attentionLevel = vendorOrder.attentionLevel || "healthy";
  const isCritical = attentionLevel === "critical";
  const isWarning = attentionLevel === "warning";

  const itemsSummary = vendorOrder.items?.length > 0 
    ? vendorOrder.items.slice(0, 1).map(i => i.product_name).join(", ")
    : "—";

  const readyDate = vendorOrder.expected_ready_date ? new Date(vendorOrder.expected_ready_date) : null;

  const itemsTotal = vendorOrder.items?.reduce((acc, i) => acc + (i.quantity || 0), 0) || 0;
  const itemsFulfilled = vendorOrder.items?.reduce((acc, i) => acc + (i.fulfilled_quantity || 0), 0) || 0;

  const rowClasses = isCritical 
    ? "bg-red-50/40" 
    : isWarning 
    ? "bg-amber-50/40" 
    : "";

  const gridCols = !isOpsStaff && !isOpsAdmin && !isSuperAdmin 
    ? "grid-cols-6" 
    : isOpsStaff 
    ? "grid-cols-8" 
    : isOpsAdmin 
    ? "grid-cols-9" 
    : "grid-cols-10";

  return (
    <Link
      to={createPageUrl(`VendorOrderDetail?id=${vendorOrder.id}`)}
      className={`grid ${gridCols} gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center ${rowClasses}`}
    >
      {/* VO ID */}
      <div className="flex items-center gap-1.5">
        {isCritical && <span className="text-xs">🔴</span>}
        {isWarning && <span className="text-xs">🟠</span>}
        <span className="text-sm font-medium text-sky-600 truncate">{vendorOrder.vendor_order_id}</span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={vendorOrder.status} />
      </div>

      {/* Products */}
      <div className="text-xs text-slate-700 truncate">{itemsSummary}</div>

      {/* Vendor */}
      <div className="text-xs text-slate-600 truncate">{vendorOrder.vendor_name || "—"}</div>

      {/* Vessel */}
      <div className="flex items-center gap-1">
        <Anchor className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-600 truncate">
          {vendorOrder.order_id ? "Linked" : "—"}
        </span>
      </div>

      {/* Ready By */}
      <div>
        {readyDate ? (
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3 h-3 flex-shrink-0 ${
              isCritical ? "text-red-500" : 
              isWarning ? "text-amber-500" : "text-slate-400"
            }`} />
            <span className={`text-xs ${
              isCritical ? "font-medium text-red-700" :
              isWarning ? "font-medium text-amber-700" : "text-slate-600"
            }`}>
              {format(readyDate, "MMM d, HH:mm")}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>

      {/* Progress (Ops Staff+) */}
      {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
        <div className="text-xs text-slate-600">
          {itemsFulfilled}/{itemsTotal}
        </div>
      )}

      {/* SLA (Ops Staff+) */}
      {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
        <div>
          {vendorOrder.slaStatus === "breached" && (
            <span className="text-xs font-medium text-red-700">Breached</span>
          )}
          {vendorOrder.slaStatus === "at_risk" && (
            <span className="text-xs font-medium text-amber-700">At Risk</span>
          )}
          {vendorOrder.slaStatus === "on_track" && (
            <span className="text-xs text-emerald-600">On Track</span>
          )}
          {vendorOrder.slaStatus === "unknown" && (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      )}

      {/* Cost (Ops Admin+) */}
      {(isOpsAdmin || isSuperAdmin) && (
        <div className="text-sm font-medium text-slate-700">
          {vendorOrder.subtotal ? `$${vendorOrder.subtotal.toFixed(0)}` : "—"}
        </div>
      )}

      {/* Margin (Super Admin) */}
      {isSuperAdmin && (
        <div className="text-xs text-slate-600">—</div>
      )}
    </Link>
  );
}