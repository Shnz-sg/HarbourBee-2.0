import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Layers } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function OrdersTable({ orders, userRole }) {
  const isOps = ["ops_staff", "ops_admin"].includes(userRole);
  const isAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-slate-100 text-slate-700",
      submitted: "bg-blue-100 text-blue-700",
      confirmed: "bg-emerald-100 text-emerald-700",
      pooled: "bg-purple-100 text-purple-700",
      in_delivery: "bg-amber-100 text-amber-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-slate-200 text-slate-600",
      disputed: "bg-rose-100 text-rose-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      normal: "bg-slate-100 text-slate-600",
      urgent: "bg-amber-100 text-amber-700",
      critical: "bg-rose-100 text-rose-700"
    };
    return colors[priority] || colors.normal;
  };

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: "bg-rose-100 text-rose-700",
      partial: "bg-amber-100 text-amber-700",
      paid: "bg-emerald-100 text-emerald-700",
      refunded: "bg-slate-100 text-slate-600"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  // Column configuration based on role
  const getGridColumns = () => {
    if (userRole === "user") {
      return "2fr 1.5fr 1fr 1.5fr 1fr 0.5fr";
    } else if (isOps) {
      return "1.5fr 1.2fr 0.8fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr";
    } else if (isAdmin) {
      return "1.3fr 1fr 0.7fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr 0.5fr";
    }
    return "2fr 1.5fr 1fr 1.5fr 1fr 0.5fr";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: getGridColumns() }}
      >
        <div>Order ID</div>
        <div>Status</div>
        <div>Items</div>
        {(isOps || isAdmin) && <div>Vessel</div>}
        {(isOps || isAdmin) && <div>Port</div>}
        {(isOps || isAdmin) && <div>ETA</div>}
        {(isOps || isAdmin) && <div>Priority</div>}
        {(isOps || isAdmin) && <div>Payment</div>}
        {isAdmin && <div>Pool</div>}
        {isAdmin && <div>Amount</div>}
        <div>Updated</div>
        <div></div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {orders.map(order => (
          <Link
            key={order.id}
            to={createPageUrl("OrderDetail") + `?id=${order.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm items-center"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {/* Order ID */}
            <div className="font-medium text-slate-900 flex items-center gap-1.5">
              {order.order_id}
              {/* Exception indicator */}
              {order.status === "disputed" && (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" title="Has exception" />
              )}
            </div>

            {/* Status */}
            <div>
              <Badge className={getStatusColor(order.status)} variant="secondary">
                {order.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Items Count */}
            <div className="text-slate-600">{order.items?.length || 0} items</div>

            {/* Vessel (Ops/Admin) */}
            {(isOps || isAdmin) && (
              <div className="text-slate-600 truncate">{order.vessel_name || "—"}</div>
            )}

            {/* Port (Ops/Admin) */}
            {(isOps || isAdmin) && (
              <div className="text-slate-600 truncate">{order.port || "—"}</div>
            )}

            {/* ETA (Ops/Admin) */}
            {(isOps || isAdmin) && (
              <div className="text-slate-600 text-xs">
                {order.eta ? format(new Date(order.eta), "MMM d") : "—"}
              </div>
            )}

            {/* Priority (Ops/Admin) */}
            {(isOps || isAdmin) && (
              <div>
                <Badge className={getPriorityColor(order.priority || "normal")} variant="secondary">
                  {order.priority || "normal"}
                </Badge>
              </div>
            )}

            {/* Payment (Ops/Admin) */}
            {(isOps || isAdmin) && (
              <div>
                <Badge className={getPaymentColor(order.payment_status)} variant="secondary">
                  {order.payment_status || "unpaid"}
                </Badge>
              </div>
            )}

            {/* Pool (Admin) */}
            {isAdmin && (
              <div className="text-slate-600 text-xs flex items-center gap-1">
                {order.pool_id ? (
                  <>
                    <Layers className="w-3 h-3 text-purple-600" />
                    <span className="truncate">{order.pool_id}</span>
                  </>
                ) : (
                  "—"
                )}
              </div>
            )}

            {/* Amount (Admin) */}
            {isAdmin && (
              <div className="text-slate-900 font-medium">
                ${(order.total_amount || 0).toLocaleString()}
              </div>
            )}

            {/* Updated */}
            <div className="text-slate-500 text-xs">
              {formatDistanceToNow(new Date(order.updated_date || order.created_date), { addSuffix: true })}
            </div>

            {/* Arrow indicator (mobile will show this) */}
            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}