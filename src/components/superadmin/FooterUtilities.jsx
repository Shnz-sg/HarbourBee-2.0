import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function FooterUtilities({ lastRefreshed }) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Reports")} className="hover:text-sky-600">Reports</Link>
          <Link to={createPageUrl("Settings")} className="hover:text-sky-600">Settings</Link>
          <Link to={createPageUrl("SystemHealth")} className="hover:text-sky-600">System Health</Link>
        </div>
        <div className="flex items-center gap-4">
          <span>Last refreshed: {format(lastRefreshed, "HH:mm:ss")}</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium uppercase">Production</span>
        </div>
      </div>
    </div>
  );
}