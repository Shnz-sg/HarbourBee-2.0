import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock, User } from "lucide-react";

export default function AuditHistoryPanel({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity History</h3>
        <p className="text-sm text-slate-500 text-center py-6">
          No activity recorded yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity History</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative pl-6 pb-4 last:pb-0 border-l-2 border-slate-200 last:border-transparent"
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-300" />
            
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-sm text-slate-900 font-medium">
                {event.action}
              </p>
              <span className="text-xs text-slate-500 flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
              </span>
            </div>

            {event.actor && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                <User className="w-3 h-3" />
                <span>{event.actor}</span>
              </div>
            )}

            {event.details && (
              <p className="text-xs text-slate-600">{event.details}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}