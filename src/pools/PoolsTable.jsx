import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Layers, Truck } from "lucide-react";
import { format, formatDistanceToNow, differenceInHours, isPast } from "date-fns";

export default function PoolsTable({ pools, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
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

    // Critical
    if ((pool.status === "open" && isPastTarget) || (pool.status === "locked" && !pool.delivery_id)) {
      return <AlertTriangle className="w-4 h-4 text-rose-500" title="Critical attention required" />;
    }

    // Warning
    if (pool.status === "open" && hoursDiff <= 24 && hoursDiff > 0) {
      return <Clock className="w-4 h-4 text-amber-500" title="Closing soon" />;
    }

    return null;
  };

  const getCountdown = (pool) => {
    if (!pool.target_date || pool.status !== "open") return null;
    
    const hoursDiff = differenceInHours(new Date(pool.target_date), new Date());
    const isPastTarget = isPast(new Date(pool.target_date));

    if (isPastTarget) return <span className="text-rose-600 font-medium">Overdue</span>;
    if (hoursDiff < 1) return <span className="text-amber-600">{"<1h"}</span>;
    if (hoursDiff < 24) return <span className="text-amber-600">{hoursDiff}h</span>;
    return format(new Date(pool.target_date), "MMM d, HH:mm");
  };

  // Column configuration
  const getGridColumns = () => {
    if (isOpsStaff) {
      return "1.5fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.5fr";
    } else if (isOpsAdmin) {
      return "1.5fr 1fr 1fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.8fr 0.5fr";
    }
    return "1.5fr 1fr 1fr 0.8fr 1fr 0.5fr";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: getGridColumns() }}
      >
        <div>Pool ID</div>
        <div>Status</div>
        <div>Port</div>
        <div>Orders</div>
        <div>Vessels</div>
        <div>Target Date</div>
        {(isOpsStaff || isOpsAdmin) && <div>Delivery</div>}
        {isOpsAdmin && <div>Value</div>}
        <div>Alert</div>
        <div></div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {pools.map(pool => (
          <Link
            key={pool.id}
            to={createPageUrl("PoolDetail") + `?id=${pool.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm items-center"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {/* Pool ID */}
            <div className="font-medium text-sky-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {pool.pool_id}
            </div>

            {/* Status */}
            <div>
              <Badge className={getStatusColor(pool.status)} variant="secondary">
                {pool.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Port */}
            <div className="text-slate-900 font-medium">{pool.port || "—"}</div>

            {/* Orders */}
            <div className="text-slate-600">{pool.order_count || 0}</div>

            {/* Vessels */}
            <div className="text-slate-600">{pool.order_ids?.length || 0}</div>

            {/* Target Date / Countdown */}
            <div className="text-slate-600 text-xs">
              {getCountdown(pool) || (pool.target_date ? format(new Date(pool.target_date), "MMM d, HH:mm") : "—")}
            </div>

            {/* Delivery (Ops/Admin) */}
            {(isOpsStaff || isOpsAdmin) && (
              <div className="text-slate-600 text-xs flex items-center gap-1">
                {pool.delivery_id ? (
                  <>
                    <Truck className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Assigned</span>
                  </>
                ) : (
                  "—"
                )}
              </div>
            )}

            {/* Value (Admin) */}
            {isOpsAdmin && (
              <div className="text-slate-900 font-medium">
                ${(pool.total_value || 0).toLocaleString()}
              </div>
            )}

            {/* Attention Badge */}
            <div>{getAttentionBadge(pool)}</div>

            {/* Arrow */}
            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}