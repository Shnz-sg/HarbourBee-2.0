import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardRecentOrders({ orders, loading }) {
  if (loading) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Recent Orders
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Recent Orders
        </h3>
        <p className="text-xs text-slate-500">No active orders for this vessel.</p>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-100 text-blue-700",
      confirmed: "bg-emerald-100 text-emerald-700",
      pooled: "bg-purple-100 text-purple-700",
      in_delivery: "bg-amber-100 text-amber-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card className="p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
        <Package className="w-4 h-4" />
        Recent Orders
      </h3>
      <div className="space-y-2">
        {orders.map(order => (
          <Link
            key={order.id}
            to={createPageUrl("OrderDetail") + `?id=${order.id}`}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{order.order_id}</p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(order.created_date), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)} variant="secondary">
                {order.status.replace('_', ' ')}
              </Badge>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}