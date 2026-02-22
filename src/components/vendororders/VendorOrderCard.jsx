import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import ObjectLink from "../shared/ObjectLink";
import { Package, Clock, Anchor, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function VendorOrderCard({ vendorOrder, userRole, attentionLevel }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";

  const isCritical = attentionLevel === "critical";
  const isWarning = attentionLevel === "warning";

  const itemCount = vendorOrder.items?.length || 0;
  const itemsFulfilled = vendorOrder.items?.reduce((acc, item) => 
    acc + (item.fulfilled_quantity || 0), 0) || 0;
  const itemsTotal = vendorOrder.items?.reduce((acc, item) => 
    acc + (item.quantity || 0), 0) || 0;

  const fulfilmentStatus = itemsFulfilled === itemsTotal 
    ? "complete" 
    : itemsFulfilled > 0 
    ? "partial" 
    : "pending";

  // Progress stages
  const stages = ["pending", "acknowledged", "preparing", "ready", "shipped"];
  const currentStageIndex = stages.indexOf(vendorOrder.status) !== -1 
    ? stages.indexOf(vendorOrder.status) 
    : 0;
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <Link
      to={createPageUrl(`VendorOrderDetail?id=${vendorOrder.id}`)}
      className={`block bg-white border rounded-lg p-4 hover:shadow-md transition-all ${
        isCritical ? "border-red-300 bg-red-50/30" : 
        isWarning ? "border-amber-300 bg-amber-50/30" :
        "border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-sky-600">{vendorOrder.vendor_order_id}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isCritical && (
            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">🔴 Critical</span>
          )}
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isWarning && (
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">🟠 Warning</span>
          )}
          <StatusBadge status={vendorOrder.status} />
        </div>
      </div>

      {/* Product Summary */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
        </div>
        {vendorOrder.items && vendorOrder.items.length > 0 && (
          <p className="text-xs text-slate-500 truncate ml-5">
            {vendorOrder.items.slice(0, 2).map(i => i.product_name).join(", ")}
            {vendorOrder.items.length > 2 && ` +${vendorOrder.items.length - 2}`}
          </p>
        )}
      </div>

      {/* Vessel & Related Order */}
      {vendorOrder.order_id && (
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Anchor className="w-3 h-3 text-slate-400" />
            <span>Linked to Order</span>
          </div>
          <div className="ml-5">
            <ObjectLink type="order" id={vendorOrder.order_id} label={vendorOrder.order_id} />
          </div>
        </div>
      )}

      {/* Expected Ready Date */}
      {vendorOrder.expected_ready_date && (
        <div className={`rounded-md p-2.5 mb-3 ${
          isCritical ? "bg-red-100" :
          isWarning ? "bg-amber-100" : "bg-slate-50"
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-3.5 h-3.5 ${
              isCritical ? "text-red-600" :
              isWarning ? "text-amber-600" : "text-slate-500"
            }`} />
            <div>
              <p className={`text-xs font-medium ${
                isCritical ? "text-red-900" :
                isWarning ? "text-amber-900" : "text-slate-600"
              }`}>
                Expected Ready
              </p>
              <p className={`text-sm font-semibold ${
                isCritical ? "text-red-700" :
                isWarning ? "text-amber-700" : "text-slate-700"
              }`}>
                {format(new Date(vendorOrder.expected_ready_date), "MMM d, HH:mm")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar - Normal Users */}
      {!isOpsStaff && !isOpsAdmin && !isSuperAdmin && (
        <div className="mb-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 capitalize">
            {vendorOrder.status.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-600">{vendorOrder.vendor_name || "Vendor"}</span>
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
            <span className={`font-medium ${
              fulfilmentStatus === "complete" ? "text-emerald-600" :
              fulfilmentStatus === "partial" ? "text-amber-600" :
              "text-slate-500"
            }`}>
              {itemsFulfilled}/{itemsTotal} ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(isOpsAdmin || isSuperAdmin) && vendorOrder.subtotal && (
            <span className="text-sm font-semibold text-slate-700">
              ${vendorOrder.subtotal.toFixed(0)}
            </span>
          )}
          {isSuperAdmin && (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Last Updated */}
      {vendorOrder.updated_date && (
        <p className="text-[10px] text-slate-400 mt-2">
          Updated {formatDistanceToNow(new Date(vendorOrder.updated_date), { addSuffix: true })}
        </p>
      )}
    </Link>
  );
}