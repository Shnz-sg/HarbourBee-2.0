import React from "react";

export default function StatsCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-3">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-semibold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}