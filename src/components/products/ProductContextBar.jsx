import React from "react";
import { Ship, Layers, Info } from "lucide-react";

export default function ProductContextBar({ vessel, poolStatus, poolId }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-900">
                {vessel?.name || "Loading..."}
              </span>
              <span className="text-xs text-slate-500">
                IMO {vessel?.imo_number}
              </span>
            </div>
            
            <div className="h-4 w-px bg-slate-300" />
            
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {poolStatus === "active" ? "Pool Active" : "No Active Pool"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>Pooled offshore delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}