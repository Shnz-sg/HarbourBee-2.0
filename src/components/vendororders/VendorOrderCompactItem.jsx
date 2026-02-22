import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { AlertCircle, Clock, Package, Anchor } from "lucide-react";
import { format, differenceInHours } from "date-fns";

export default function VendorOrderCompactItem({ vendorOrder, attentionLevel }) {
  const readyDate = vendorOrder.expected_ready_date ? new Date(vendorOrder.expected_ready_date) : null;
  const hoursUntil = readyDate ? differenceInHours(readyDate, new Date()) : null;

  const itemCount = vendorOrder.items?.length || 0;
  const itemNames = vendorOrder.items?.slice(0, 1).map(i => i.product_name).join(", ") || "Items";

  const borderClass = attentionLevel === "critical" 
    ? "border-l-red-500" 
    : attentionLevel === "warning" 
    ? "border-l-amber-400" 
    : "border-l-slate-200";

  const bgClass = attentionLevel === "critical"
    ? "bg-red-50/30"
    : attentionLevel === "warning"
    ? "bg-amber-50/30"
    : "";

  const isCritical = attentionLevel === "critical";
  const isWarning = attentionLevel === "warning";

  return (
    <Link
      to={createPageUrl(`VendorOrderDetail?id=${vendorOrder.id}`)}
      className={`block border-l-3 px-4 py-3 hover:bg-slate-50 transition-colors ${borderClass} ${bgClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {isCritical && (
              <span className="text-xs">🔴</span>
            )}
            {isWarning && (
              <span className="text-xs">🟠</span>
            )}
            <span className="text-sm font-semibold text-sky-600">{vendorOrder.vendor_order_id}</span>
            <StatusBadge status={vendorOrder.status} className="ml-auto" />
          </div>
          
          <div className="text-xs text-slate-600 mb-2 truncate">{itemNames}</div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            </div>
            {readyDate && (
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${
                  attentionLevel === "critical" ? "text-red-500" : 
                  attentionLevel === "warning" ? "text-amber-500" : ""
                }`} />
                <span className={
                  attentionLevel === "critical" ? "font-medium text-red-700" : 
                  attentionLevel === "warning" ? "font-medium text-amber-700" : ""
                }>
                  {format(readyDate, "MMM d, HH:mm")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}