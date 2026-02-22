import React from "react";
import { Bell, CheckCircle } from "lucide-react";

export default function NotificationsEmptyState({ hasFilters, allRead = false }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Bell className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-medium text-slate-700 mb-1">No notifications match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your filter criteria</p>
      </div>
    );
  }

  if (allRead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        <h3 className="text-base font-medium text-slate-700 mb-1">All caught up</h3>
        <p className="text-sm text-slate-500">You've read all your notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Bell className="w-12 h-12 text-slate-300 mb-3" />
      <h3 className="text-base font-medium text-slate-700 mb-1">No notifications yet</h3>
      <p className="text-sm text-slate-500">You'll see updates here when there's activity</p>
    </div>
  );
}