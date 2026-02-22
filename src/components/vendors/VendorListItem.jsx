import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Building2, Package, ShoppingCart, Star } from "lucide-react";

export default function VendorListItem({ vendor, hasIssue, showIssue, metrics, userRole }) {
  const isOpsOrAdmin = ["ops_staff", "admin", "super_admin"].includes(userRole);
  const isFinance = userRole === "finance";
  const showMetrics = isOpsOrAdmin || isFinance;

  return (
    <Link
      to={createPageUrl(`Vendors?view=detail&id=${vendor.id}`)}
      className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center"
    >
      {/* Vendor Name */}
      <div className="col-span-3 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-slate-400" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-900 truncate">{vendor.name}</div>
        </div>
      </div>
      
      {/* Category */}
      <div className="col-span-2 text-xs text-slate-500 truncate">
        {vendor.categories?.length > 0 ? vendor.categories[0] : "—"}
      </div>

      {/* Port */}
      <div className="col-span-2 text-xs text-slate-500 truncate">
        {vendor.port || "—"}
      </div>

      {/* Status */}
      <div className="col-span-2 flex items-center gap-2">
        <StatusBadge status={vendor.status || "active"} />
        {showIssue && hasIssue && (
          <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" title="Has issues" />
        )}
      </div>

      {/* Metrics (Role-based) */}
      {showMetrics && (
        <div className="col-span-2 flex items-center gap-3">
          {isOpsOrAdmin && (
            <>
              <div className="flex items-center gap-1 text-xs text-slate-500" title="Active Products">
                <Package className="w-3 h-3" />
                <span>{metrics.activeProducts}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500" title="Active Orders">
                <ShoppingCart className="w-3 h-3" />
                <span>{metrics.activeOrders}</span>
              </div>
            </>
          )}
          {isFinance && (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="col-span-1 flex items-center justify-end gap-1">
        {vendor.rating ? (
          <>
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-slate-700">{vendor.rating.toFixed(1)}</span>
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>
    </Link>
  );
}