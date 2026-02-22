import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Layers, Clock, AlertCircle, CheckCircle2, AlertTriangle, Ship, Package } from "lucide-react";
import { format, differenceInHours, differenceInDays, isPast } from "date-fns";

export default function PoolCard({ pool, userRole = "user" }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = isOpsAdmin || isSuperAdmin;
  const targetDate = pool.target_date ? new Date(pool.target_date) : null;
  const hoursDiff = targetDate ? differenceInHours(targetDate, new Date()) : null;
  const daysDiff = targetDate ? differenceInDays(targetDate, new Date()) : null;
  const isPastTarget = targetDate ? isPast(targetDate) : false;

  // Attention level logic
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
    
    if (isPastTarget) return "Cutoff passed";
    if (hoursDiff < 1) return "< 1h remaining";
    if (hoursDiff < 24) return `${hoursDiff}h remaining`;
    return `${daysDiff}d remaining`;
  };

  const timeRemaining = getTimeRemaining();
  const progress = pool.order_count ? Math.min((pool.order_count / 5) * 100, 100) : 0;

  // Attention badge for ops
  const getAttentionBadge = () => {
    if (!isOpsStaff && !isAdmin) return null;
    
    if (isCritical) {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>Requires Action</span>
        </div>
      );
    }
    
    if (isWarning) {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>Closing Soon</span>
        </div>
      );
    }
    
    return null;
  };

  const borderClass = isCritical 
    ? "border-l-4 border-l-red-500 border-red-200 bg-red-50/30" 
    : isWarning
    ? "border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/30"
    : "border-slate-200";

  return (
    <Link
      to={createPageUrl(`PoolDetail?id=${pool.id}`)}
      className={`block bg-white border rounded-lg p-4 hover:shadow-md transition-all ${borderClass}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-sky-600">{pool.pool_id}</span>
        </div>
        <StatusBadge status={pool.status} />
      </div>

      {/* Attention Badge (Ops) */}
      {getAttentionBadge() && (
        <div className="mb-3">
          {getAttentionBadge()}
        </div>
      )}

      {/* Port & Date */}
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-900">{pool.port || "—"}</p>
        {targetDate && (
          <p className="text-xs text-slate-500 mt-0.5">
            Target: {format(targetDate, "MMM d, yyyy HH:mm")}
          </p>
        )}
      </div>

      {/* Progress Bar - Hero Element */}
      {pool.status === "open" && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Pool progress</span>
            <span className="font-medium">{pool.order_count || 0} orders</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all rounded-full ${
                progress >= 100 ? "bg-emerald-500" :
                progress >= 60 ? "bg-sky-500" : "bg-amber-400"
              }`}
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>
        </div>
      )}

      {/* Admin-Level Metadata */}
      {isAdmin && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Value</span>
            <span className="font-semibold text-slate-900">
              ${(pool.total_value || 0).toLocaleString()}
            </span>
          </div>
          {pool.created_date && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Created</span>
              <span className="text-slate-600">
                {format(new Date(pool.created_date), "MMM d, h:mma")}
              </span>
            </div>
          )}
          {pool.created_by && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Created By</span>
              <span className="text-slate-600 truncate max-w-[150px]">{pool.created_by}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3 text-xs">
          {pool.status === "open" && timeRemaining && (
            <div className={`flex items-center gap-1 ${
              isPastTarget ? "text-red-600 font-semibold" :
              isWarning ? "text-amber-600 font-medium" : 
              "text-slate-500"
            }`}>
              <Clock className="w-3 h-3" />
              <span>{timeRemaining}</span>
            </div>
          )}
          {pool.status === "delivered" && (
            <div className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </div>
          )}
          {(pool.status === "cancelled" || pool.status === "failed") && (
            <div className="flex items-center gap-1 text-slate-500">
              <AlertCircle className="w-3 h-3" />
              <span>{(isOpsStaff || isAdmin) ? "Failed" : "Did not proceed"}</span>
            </div>
          )}
        </div>
        {!isAdmin && pool.total_value && (
          <span className="text-sm font-medium text-slate-700">
            ${pool.total_value.toLocaleString()}
          </span>
        )}
      </div>
    </Link>
  );
}