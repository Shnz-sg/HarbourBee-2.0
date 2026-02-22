import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function OrderListItem({ order, userRole = "user", compact = false }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = isOpsAdmin || isSuperAdmin;

  const isUrgent = order.priority === "urgent";
  const isCritical = order.priority === "critical";
  const isDisputed = order.status === "disputed";
  const hasPaymentIssue = order.payment_status === "unpaid" && ["in_delivery", "delivered"].includes(order.status);

  const showAlert = isUrgent || isCritical || isDisputed || hasPaymentIssue;

  const itemCount = Array.isArray(order.items) ? order.items.length : 0;

  return (
    <Link
      to={createPageUrl(`OrderDetail?id=${order.id}`)}
      className={`grid gap-2 px-4 hover:bg-slate-50 transition-colors items-center ${
        isCritical ? "bg-red-50/40" : isUrgent ? "bg-amber-50/40" : isDisputed ? "bg-rose-50/30" : ""
      } ${compact ? "py-2" : "py-3"}`}
      style={{
        gridTemplateColumns: userRole === "user" 
          ? "2fr 1.5fr 1.5fr 1fr 1fr 1fr" 
          : isOpsStaff
          ? "1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr"
          : isAdmin
          ? "1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          : "2fr 1.5fr 1.5fr 1fr 1fr 1fr"
      }}
    >
      {/* Order ID */}
      <div className="flex items-center gap-2">
        {showAlert && (
          isCritical ? <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> :
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        )}
        <span className="text-sm font-medium text-sky-600 truncate">{order.order_id || "—"}</span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items Count */}
      <div className="text-sm text-slate-600">{itemCount} items</div>

      {/* Ops-Level Fields */}
      {(isOpsStaff || isAdmin) && (
        <>
          <div className="text-sm text-slate-700 truncate">{order.vessel_name || "—"}</div>
          <div className="text-sm text-slate-500 truncate">{order.port || "—"}</div>
          <div className="text-xs text-slate-400">
            {order.eta ? format(new Date(order.eta), "MMM d") : "—"}
          </div>
          <div>
            {order.priority === "critical" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                Critical
              </span>
            )}
            {order.priority === "urgent" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                Urgent
              </span>
            )}
            {(!order.priority || order.priority === "normal") && (
              <span className="text-xs text-slate-400">Normal</span>
            )}
          </div>
          <div>
            {order.payment_status === "paid" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                Paid
              </span>
            )}
            {order.payment_status === "unpaid" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                Unpaid
              </span>
            )}
            {order.payment_status === "partial" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                Partial
              </span>
            )}
            {order.payment_status === "refunded" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                Refunded
              </span>
            )}
            {!order.payment_status && <span className="text-xs text-slate-400">—</span>}
          </div>
        </>
      )}

      {/* Admin-Level Fields */}
      {isAdmin && (
        <>
          <div className="text-xs text-slate-400 truncate">{order.pool_id || "—"}</div>
          <div className="text-sm font-medium text-slate-700">
            {order.total_amount ? `$${order.total_amount.toLocaleString()}` : "—"}
          </div>
        </>
      )}

      {/* Last Updated */}
      <div className="text-xs text-slate-400">
        {order.updated_date 
          ? format(new Date(order.updated_date), "MMM d, h:mma") 
          : order.created_date 
          ? format(new Date(order.created_date), "MMM d") 
          : "—"}
      </div>
    </Link>
  );
}