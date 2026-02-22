import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Activity, CheckCircle2, AlertCircle } from "lucide-react";

export default function SystemHealthCard({ health }) {
  const isHealthy = health.overall === "healthy";

  return (
    <div className="px-6 mt-8 mb-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">System Health & Governance</h2>
      </div>
      <Link
        to={createPageUrl("SystemHealth")}
        className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-slate-400" />
            <div>
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className={`text-sm font-medium ${isHealthy ? "text-emerald-700" : "text-amber-700"}`}>
                  {isHealthy ? "All Systems Healthy" : "Review Required"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Platform status, audit & configuration</p>
            </div>
          </div>
          <span className="text-xs text-slate-400">View →</span>
        </div>
        {health.warnings > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <span className="text-xs text-amber-600">{health.warnings} configuration warning{health.warnings > 1 ? "s" : ""}</span>
          </div>
        )}
      </Link>
    </div>
  );
}