import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertTriangle, Store, Calendar, Package } from "lucide-react";
import { format } from "date-fns";

export default function VendorOrdersCards({ orders, userRole }) {
  const isVendor = userRole === "vendor";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      awaiting_acknowledgement: "bg-amber-100 text-amber-700",
      acknowledged: "bg-blue-100 text-blue-700",
      preparing: "bg-purple-100 text-purple-700",
      partially_ready: "bg-cyan-100 text-cyan-700",
      ready: "bg-emerald-100 text-emerald-700",
      picked_up: "bg-green-100 text-green-700",
      completed: "bg-slate-100 text-slate-600",
      delayed: "bg-rose-100 text-rose-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-600",
      quality_rejected: "bg-orange-100 text-orange-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getAttentionBadge = (order) => {
    if (order.attentionLevel === "critical") {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>Critical</span>
        </div>
      );
    }
    if (order.attentionLevel === "warning") {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>Warning</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map(order => (
        <Link key={order.id} to={createPageUrl("VendorOrderDetail") + `?id=${order.id}`}>
          <Card className="p-4 hover:shadow-md transition-shadow h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-900">{order.vendor_order_id}</span>
              </div>
              {getAttentionBadge(order)}
            </div>

            <div className="mb-3">
              <Badge className={getStatusColor(order.status)} variant="secondary">
                {order.status.replace(/_/g, " ")}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              {!isVendor && order.vendor_name && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Store className="w-3.5 h-3.5" />
                  <span className="font-medium">{order.vendor_name}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-600">
                <Package className="w-3.5 h-3.5" />
                <span className="text-xs">
                  Items: {order.items?.reduce((sum, i) => sum + (i.quantity_ready || 0), 0)}/
                  {order.items?.reduce((sum, i) => sum + (i.quantity_ordered || 0), 0)}
                </span>
              </div>

              {order.expected_ready_date && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">Ready: {format(new Date(order.expected_ready_date), "MMM d, HH:mm")}</span>
                </div>
              )}

              {!isVendor && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-xs">SLA</span>
                  <span className={`text-xs font-medium ${
                    order.slaStatus === "breached" ? "text-rose-600" : 
                    order.slaStatus === "at_risk" ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {order.slaStatus === "breached" ? "Breach" : order.slaStatus === "at_risk" ? "At Risk" : "On Track"}
                  </span>
                </div>
              )}

              {isOpsAdmin && order.subtotal && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Value</span>
                  <span className="text-slate-900 font-semibold">
                    ${order.subtotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}