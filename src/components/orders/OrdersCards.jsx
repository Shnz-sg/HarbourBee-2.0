import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle, Layers, Calendar } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function OrdersCards({ orders, userRole }) {
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map(order => (
        <Link key={order.id} to={createPageUrl("OrderDetail") + `?id=${order.id}`}>
          <Card className="p-4 hover:shadow-md transition-shadow h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-900">{order.order_id}</span>
              </div>
              {order.status === "disputed" && (
                <AlertCircle className="w-4 h-4 text-rose-500" title="Has exception" />
              )}
            </div>

            {/* Status & Priority */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getStatusColor(order.status)} variant="secondary">
                {order.status.replace("_", " ")}
              </Badge>
              {(isOps || isAdmin) && order.priority && order.priority !== "normal" && (
                <Badge className={getPriorityColor(order.priority)} variant="secondary">
                  {order.priority}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Items</span>
                <span className="text-slate-900 font-medium">{order.items?.length || 0}</span>
              </div>

              {(isOps || isAdmin) && order.vessel_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Vessel</span>
                  <span className="text-slate-900 truncate max-w-[150px]">{order.vessel_name}</span>
                </div>
              )}

              {(isOps || isAdmin) && order.port && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Port</span>
                  <span className="text-slate-900">{order.port}</span>
                </div>
              )}

              {order.eta && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">ETA: {format(new Date(order.eta), "MMM d, yyyy")}</span>
                </div>
              )}

              {order.pool_id && (
                <div className="flex items-center gap-1.5 text-purple-600">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{order.pool_id}</span>
                </div>
              )}

              {isAdmin && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Total</span>
                  <span className="text-slate-900 font-semibold">
                    ${(order.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Updated {formatDistanceToNow(new Date(order.updated_date || order.created_date), { addSuffix: true })}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}