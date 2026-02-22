import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Package, AlertCircle, AlertTriangle, Calendar, Anchor, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function OrderCard({ order, userRole = "user" }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = isOpsAdmin || isSuperAdmin;

  const isUrgent = order.priority === "urgent";
  const isCritical = order.priority === "critical";
  const isDisputed = order.status === "disputed";
  const hasPaymentIssue = order.payment_status === "unpaid" && ["in_delivery", "delivered"].includes(order.status);

  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  
  return (
    <Link
      to={createPageUrl(`OrderDetail?id=${order.id}`)}
      className={`block bg-white border rounded-lg p-4 hover:shadow-md transition-all ${
        isCritical ? "border-red-300 bg-red-50/30" : 
        isUrgent ? "border-amber-300 bg-amber-50/30" : 
        isDisputed ? "border-rose-300 bg-rose-50/30" : 
        "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-sky-600">{order.order_id}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2">
        {/* Core Info — All Roles */}
        <div className="text-sm text-slate-600">{itemCount} items</div>
        
        {/* Ops-Level Info */}
        {(isOpsStaff || isAdmin) && (
          <>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Anchor className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.vessel_name || "—"}</span>
            </div>

            {order.port && (
              <div className="text-xs text-slate-500">{order.port}</div>
            )}

            {order.eta && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>ETA {format(new Date(order.eta), "MMM d")}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {order.priority === "critical" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                  <AlertTriangle className="w-3 h-3" />
                  Critical
                </span>
              )}
              {order.priority === "urgent" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                  <AlertCircle className="w-3 h-3" />
                  Urgent
                </span>
              )}
            </div>

            {order.payment_status && (
              <div className="text-xs">
                {order.payment_status === "paid" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                    ✓ Paid
                  </span>
                )}
                {order.payment_status === "unpaid" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Unpaid
                  </span>
                )}
                {order.payment_status === "partial" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                    Partial
                  </span>
                )}
              </div>
            )}
          </>
        )}

        {/* Admin-Level Info */}
        {isAdmin && order.pool_id && (
          <div className="text-xs text-slate-400">Pool: {order.pool_id}</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        {isAdmin && order.total_amount ? (
          <span className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            {order.total_amount.toLocaleString()}
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {order.created_by || "—"}
          </span>
        )}
        {order.updated_date && (
          <span className="text-xs text-slate-400">
            {format(new Date(order.updated_date), "MMM d, h:mma")}
          </span>
        )}
      </div>
    </Link>
  );
}