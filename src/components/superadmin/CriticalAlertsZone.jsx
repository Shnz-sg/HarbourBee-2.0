import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const SEVERITY_STYLES = {
  critical: "bg-rose-50 border-rose-300",
  high: "bg-orange-50 border-orange-300",
  medium: "bg-amber-50 border-amber-300"
};

export default function CriticalAlertsZone({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-6 py-4 mx-6 mt-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-900">All systems operating normally</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900">Critical Alerts</h2>
        <p className="text-xs text-slate-500">Requires immediate attention</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.slice(0, 5).map(alert => (
          <Link
            key={alert.id}
            to={createPageUrl(`Exceptions`)}
            className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium}`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                alert.severity === "critical" ? "text-rose-600" :
                alert.severity === "high" ? "text-orange-600" : "text-amber-600"
              }`} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{alert.title}</h3>
                <p className="text-xs text-slate-600 mt-1 uppercase tracking-wide">{alert.object_type || "System"}</p>
                <p className="text-xs text-slate-500 mt-1.5">
                  {alert.created_date ? format(new Date(alert.created_date), "HH:mm · MMM d") : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-medium text-slate-700">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}