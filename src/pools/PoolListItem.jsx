import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Clock, AlertCircle, AlertTriangle } from "lucide-react";
import { format, differenceInHours, isPast } from "date-fns";

export default function PoolListItem({ pool, userRole = "user" }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = isOpsAdmin || isSuperAdmin;
  const targetDate = pool.target_date ? new Date(pool.target_date) : null;
  const hoursDiff = targetDate ? differenceInHours(targetDate, new Date()) : null;
  const isPastTarget = targetDate ? isPast(targetDate) : false;
  
  // Attention level
  const isCritical = 
    pool.status === "cancelled" || 
    pool.status === "failed" ||
    (pool.status === "open" && isPastTarget) ||
    (pool.status === "locked" && !pool.delivery_id);

  const isWarning = 
    !isCritical && 
    pool.status === "open" && 
    hoursDiff <= 24 && 
    hoursDiff > 0;
  
  const getTimeRemaining = () => {
    if (!targetDate || pool.status !== "open") return null;
    if (isPastTarget) return "Overdue";
    if (hoursDiff < 1) return "< 1h";
    if (hoursDiff < 24) return `${hoursDiff}h left`;
    return null;
  };

  const timeRemaining = getTimeRemaining();
  const progress = pool.order_count ? Math.min((pool.order_count / 5) * 100, 100) : 0;

  const rowClass = isCritical 
    ? "border-l-4 border-l-red-500 bg-red-50/20" 
    : isWarning
    ? "border-l-4 border-l-amber-500 bg-amber-50/30"
    : "";

  return (
    <Link
      to={createPageUrl(`PoolDetail?id=${pool.id}`)}
      className={`grid gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center ${rowClass} ${
        !isOpsStaff && !isAdmin ? "grid-cols-5" : 
        isOpsStaff ? "grid-cols-6" : 
        "grid-cols-7"
      }`}
    >
      {/* Pool ID with attention indicators for Ops */}
      <div className="flex items-center gap-2">
        {(isOpsStaff || isAdmin) && isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
        {(isOpsStaff || isAdmin) && isWarning && <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
        {!isOpsStaff && !isAdmin && isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
        {!isOpsStaff && !isAdmin && isWarning && <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
        <span className="text-sm font-medium text-sky-600 truncate">{pool.pool_id}</span>
      </div>
      
      {/* Port */}
      <div className="text-sm text-slate-700 truncate">{pool.port || "—"}</div>
      
      {/* Status */}
      <div>
        <StatusBadge status={pool.status} />
      </div>

      {/* Progress / Participants (All Roles) */}
      <div>
        {pool.status === "open" || pool.status === "locked" ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-sky-400" : "bg-amber-400"}`}
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 w-6 text-right">{pool.order_count || 0}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-500">
            {pool.order_count || 0}
          </span>
        )}
      </div>

      {/* Target Date (All Roles) */}
      <div>
        {timeRemaining && (
          <div className={`flex items-center gap-1 text-xs ${
            isPastTarget ? "text-red-600 font-semibold" :
            isWarning ? "text-amber-600 font-medium" : 
            "text-slate-500"
          }`}>
            <Clock className="w-3 h-3" />
            <span>{timeRemaining}</span>
          </div>
        )}
        {!timeRemaining && targetDate && (
          <span className="text-xs text-slate-400">
            {format(targetDate, "MMM d")}
          </span>
        )}
      </div>

      {/* Ops-Level: Vendor Status */}
      {(isOpsStaff || isAdmin) && (
        <div className="text-xs text-slate-600">
          {pool.delivery_id ? "✓ Assigned" : "Pending"}
        </div>
      )}

      {/* Admin-Level: Value */}
      {isAdmin && (
        <div className="text-xs font-medium text-slate-900 text-right">
          ${(pool.total_value || 0).toLocaleString()}
        </div>
      )}
    </Link>
  );
}