import React from "react";
import { Ship, AlertCircle, CheckCircle } from "lucide-react";

export default function VesselContextHeader({ vessel, user, hasAttention = false }) {
  const roleLabels = {
    crew: "Crew",
    vendor: "Vendor", 
    ops_admin: "Operations",
    admin: "Admin"
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ship className="w-5 h-5 text-sky-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {vessel?.name || "Loading..."}
              </h1>
              <p className="text-xs text-slate-500">
                IMO {user?.vessel_imo || "—"} · {roleLabels[user?.role] || "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {hasAttention ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-900">Attention Required</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-900">Normal</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}