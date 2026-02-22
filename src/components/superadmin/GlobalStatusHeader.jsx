import React, { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GlobalStatusHeader({ platformStatus, criticalCount, notificationCount, user }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusColors = {
    normal: "bg-emerald-500",
    degraded: "bg-amber-500",
    critical: "bg-rose-500"
  };

  return (
    <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-white font-semibold text-sm tracking-tight">HarbourBee</div>
            <div className="text-slate-400 text-xs">Super Admin</div>
          </div>
        </div>

        {/* Center - Status Pills */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${statusColors[platformStatus] || statusColors.normal}`} />
            <span className="text-xs text-slate-200 font-medium capitalize">{platformStatus || "Normal"}</span>
          </div>

          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-900/30 rounded-full border border-rose-700">
              <span className="text-xs text-rose-200 font-medium">{criticalCount} Critical</span>
            </div>
          )}

          <div className="px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
            <span className="text-xs text-slate-300 font-mono">
              {currentTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" · "}
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-400" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-rose-500 border-0">
                {notificationCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-3 h-3 text-slate-300" />
            </div>
            <span className="text-xs text-slate-300">{user?.full_name || "Admin"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}