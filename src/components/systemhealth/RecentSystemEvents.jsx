import React from "react";
import { Info, AlertCircle, AlertTriangle } from "lucide-react";

export default function RecentSystemEvents({ events }) {
  const severityConfig = {
    info: { icon: Info, color: "text-slate-500", bg: "bg-slate-50" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-6">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Recent System Events</h2>
        <p className="text-xs text-slate-500 mt-1">Notable platform activity and changes</p>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-500">No recent system events</p>
          </div>
        ) : (
          events.map((event, index) => {
            const config = severityConfig[event.severity] || severityConfig.info;
            const Icon = config.icon;

            return (
              <div key={index} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{event.description}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{formatTime(event.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}