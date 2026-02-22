import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Truck, Clock, Anchor, MapPin, AlertCircle, Package, FileText } from "lucide-react";
import { format, isPast, isToday, formatDistanceToNow } from "date-fns";

export default function DeliveryCard({ delivery, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";

  const attentionLevel = delivery.attentionLevel || "healthy";
  const isCritical = attentionLevel === "critical";
  const isWarning = attentionLevel === "warning";
  const isDueToday = delivery.scheduled_date && isToday(new Date(delivery.scheduled_date));

  // Progress stages for Normal Users
  const stages = ["scheduled", "preparing", "dispatched", "delivered"];
  const currentStageIndex = stages.indexOf(delivery.status) !== -1 ? stages.indexOf(delivery.status) : 0;
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <Link
      to={createPageUrl(`DeliveryDetail?id=${delivery.id}`)}
      className={`block bg-white border rounded-lg p-4 hover:shadow-md transition-all ${
        isCritical ? "border-red-300 bg-red-50/30" : 
        isWarning ? "border-amber-300 bg-amber-50/30" :
        isDueToday ? "border-sky-300 bg-sky-50/20" :
        "border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-sky-600">{delivery.delivery_id}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isCritical && (
            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">🔴 Critical</span>
          )}
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && isWarning && (
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">🟠 Warning</span>
          )}
          <StatusBadge status={delivery.status} />
        </div>
      </div>

      {/* Vessel & Location */}
      <div className="space-y-1.5 mb-3">
        {delivery.vessel_name && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Anchor className="w-3.5 h-3.5 text-slate-400" />
            <span>{delivery.vessel_name}</span>
          </div>
        )}
        {delivery.port && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{delivery.port}</span>
          </div>
        )}
      </div>

      {/* ETA / Scheduled Delivery Window */}
      {delivery.scheduled_date && (
        <div className={`rounded-md p-2.5 mb-3 ${
          isCritical ? "bg-red-100" :
          isWarning ? "bg-amber-100" :
          isDueToday ? "bg-sky-100" : "bg-slate-50"
        }`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-3.5 h-3.5 ${
              isCritical ? "text-red-600" :
              isWarning ? "text-amber-600" :
              isDueToday ? "text-sky-600" : "text-slate-500"
            }`} />
            <div>
              <p className={`text-xs font-medium ${
                isCritical ? "text-red-900" :
                isWarning ? "text-amber-900" :
                isDueToday ? "text-sky-900" : "text-slate-600"
              }`}>
                {delivery.status === "delivered" ? "Delivered" : isDueToday ? "Due Today" : "Scheduled"}
              </p>
              <p className={`text-sm font-semibold ${
                isCritical ? "text-red-700" :
                isWarning ? "text-amber-700" :
                isDueToday ? "text-sky-700" : "text-slate-700"
              }`}>
                {format(new Date(delivery.scheduled_date), "MMM d, HH:mm")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar - Normal Users Only */}
      {!isOpsStaff && !isOpsAdmin && !isSuperAdmin && (
        <div className="mb-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 capitalize">{delivery.status.replace(/_/g, " ")}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-500">
            <Package className="w-3 h-3" />
            <span>{delivery.order_count || 0} orders</span>
          </div>
          <div className="text-slate-500 capitalize">
            {delivery.delivery_method || "Launch"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && delivery.carrier_name && (
            <span className="text-slate-600 font-medium">{delivery.carrier_name}</span>
          )}
          {(isOpsAdmin || isSuperAdmin) && delivery.delivery_fee && (
            <span className="text-sm font-semibold text-slate-700">
              ${delivery.delivery_fee.toFixed(0)}
            </span>
          )}
        </div>
      </div>

      {/* Last Updated */}
      {delivery.updated_date && (
        <p className="text-[10px] text-slate-400 mt-2">
          Updated {formatDistanceToNow(new Date(delivery.updated_date), { addSuffix: true })}
        </p>
      )}
    </Link>
  );
}