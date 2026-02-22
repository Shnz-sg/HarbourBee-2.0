import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationGroup({ priority, notifications, defaultExpanded = false, onNotificationClick }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const priorityStyles = {
    critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
    important: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    informational: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" }
  };

  const style = priorityStyles[priority] || priorityStyles.informational;

  return (
    <div className={`border ${style.border} rounded-lg overflow-hidden mb-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-5 py-3.5 flex items-center justify-between hover:opacity-80 transition-opacity ${style.bg}`}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
          <span className={`text-sm font-semibold capitalize ${style.text}`}>
            {priority}
          </span>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 bg-white rounded-full text-slate-600 font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">{notifications.length} total</span>
      </button>

      {isExpanded && (
        <div className="bg-white divide-y divide-slate-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => onNotificationClick(notification)}
            />
          ))}
        </div>
      )}
    </div>
  );
}