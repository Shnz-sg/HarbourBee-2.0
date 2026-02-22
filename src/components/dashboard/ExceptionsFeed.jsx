import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { AlertTriangle } from "lucide-react";

export default function ExceptionsFeed({ exceptions }) {
  const open = exceptions.filter(e => ["open", "investigating"].includes(e.status)).slice(0, 5);

  if (open.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium">No open exceptions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Open Exceptions</h2>
          <Link to={createPageUrl("Exceptions")} className="text-xs text-sky-600 hover:underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {open.map(ex => (
          <div key={ex.id} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-900 truncate">{ex.title}</span>
              <StatusBadge status={ex.severity} />
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ex.description || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}