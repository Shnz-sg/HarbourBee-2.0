import React from "react";
import { Package, Layers, Truck, FileText, AlertTriangle, Clock } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

export default function ExceptionItem({ exception, onClick, viewMode = "list" }) {
  const typeIcons = {
    order: Package,
    pool: Layers,
    delivery: Truck,
    vendor_order: FileText,
    system: AlertTriangle
  };

  const Icon = typeIcons[exception.object_type] || AlertTriangle;

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const ageInHours = Math.floor((new Date() - new Date(exception.detected_at || exception.created_date)) / (1000 * 60 * 60));
  const isStale = ageInHours > 24;
  const isCritical = ageInHours > 48 && exception.severity === 'critical';

  if (viewMode === "compact") {
    return (
      <button
        onClick={onClick}
        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-start gap-2 mb-2">
          <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <h3 className="text-sm font-medium text-slate-900 flex-1 leading-snug">{exception.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={exception.status} />
          {exception.object_type && (
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
              {exception.object_type.replace("_", " ")}
            </span>
          )}
          <span className="text-xs text-slate-400">{timeSince(exception.created_date)}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-medium text-slate-900 leading-snug">
              {exception.title}
            </h3>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {timeSince(exception.created_date)}
            </span>
          </div>

          {exception.description && (
            <p className="text-xs text-slate-600 mb-2 leading-relaxed line-clamp-2">
              {exception.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={exception.status} />
            
            {exception.object_type && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
                {exception.object_type.replace("_", " ")}
              </span>
            )}

            {exception.object_id && (
              <span className="text-xs text-slate-500">
                ID: {exception.object_id}
              </span>
            )}

            {isStale && (
              <div className={`flex items-center gap-1 text-xs ${isCritical ? 'text-red-600 font-semibold' : 'text-amber-600'}`}>
                <Clock className="w-3 h-3" />
                <span>Open {ageInHours}h</span>
              </div>
            )}

            {exception.assigned_to && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                {exception.assigned_to.split('@')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}