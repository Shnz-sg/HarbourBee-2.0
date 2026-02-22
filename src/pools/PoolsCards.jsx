import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Clock, AlertTriangle, Truck, Calendar } from "lucide-react";
import { format, differenceInHours, isPast } from "date-fns";

export default function PoolsCards({ pools, userRole }) {
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-emerald-100 text-emerald-700",
      locked: "bg-purple-100 text-purple-700",
      in_delivery: "bg-amber-100 text-amber-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-slate-200 text-slate-600"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getAttentionBadge = (pool) => {
    if (!pool.target_date) return null;
    
    const hoursDiff = differenceInHours(new Date(pool.target_date), new Date());
    const isPastTarget = isPast(new Date(pool.target_date));

    if ((pool.status === "open" && isPastTarget) || (pool.status === "locked" && !pool.delivery_id)) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>Critical</span>
        </div>
      );
    }

    if (pool.status === "open" && hoursDiff <= 24 && hoursDiff > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>Closing Soon</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pools.map(pool => (
        <Link key={pool.id} to={createPageUrl("PoolDetail") + `?id=${pool.id}`}>
          <Card className="p-4 hover:shadow-md transition-shadow h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-900">{pool.pool_id}</span>
              </div>
              {getAttentionBadge(pool)}
            </div>

            {/* Status */}
            <div className="mb-3">
              <Badge className={getStatusColor(pool.status)} variant="secondary">
                {pool.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Port</span>
                <span className="text-slate-900 font-medium">{pool.port || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Orders</span>
                <span className="text-slate-900 font-medium">{pool.order_count || 0}</span>
              </div>

              {pool.target_date && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">Target: {format(new Date(pool.target_date), "MMM d, HH:mm")}</span>
                </div>
              )}

              {pool.delivery_id && (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Delivery Assigned</span>
                </div>
              )}

              {isOpsAdmin && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Total Value</span>
                  <span className="text-slate-900 font-semibold">
                    ${(pool.total_value || 0).toLocaleString()}
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