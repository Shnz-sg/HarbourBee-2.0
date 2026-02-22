import React from "react";
import { Package, Layers, Truck, FileText, AlertCircle, Info, DollarSign } from "lucide-react";
import ObjectLink from "../shared/ObjectLink";

export default function NotificationItem({ notification, onClick }) {
  const isUnread = !notification.is_read;

  const typeIcons = {
    order: Package,
    pool: Layers,
    delivery: Truck,
    vendor_order: FileText,
    system: AlertCircle,
    finance: DollarSign
  };

  const Icon = typeIcons[notification.object_type] || Info;

  const typeColors = {
    order: "text-sky-600 bg-sky-50",
    pool: "text-purple-600 bg-purple-50",
    delivery: "text-green-600 bg-green-50",
    vendor_order: "text-orange-600 bg-orange-50",
    system: "text-slate-600 bg-slate-100",
    finance: "text-emerald-600 bg-emerald-50"
  };

  const colorClass = typeColors[notification.object_type] || "text-slate-500 bg-slate-50";

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors ${
        isUnread ? "bg-sky-50/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className={`text-sm ${isUnread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {timeSince(notification.created_date)}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {notification.message}
          </p>

          <div className="flex items-center gap-2">
            {notification.object_type && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
                {notification.object_type.replace("_", " ")}
              </span>
            )}
            {notification.object_id && notification.object_type && (
              <ObjectLink 
                type={notification.object_type} 
                id={notification.object_id} 
                className="text-xs text-sky-600 hover:underline"
              />
            )}
          </div>
        </div>

        {/* Unread indicator */}
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 mt-1.5" />
        )}
      </div>
    </button>
  );
}