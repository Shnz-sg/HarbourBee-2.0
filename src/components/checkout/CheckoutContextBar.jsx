import React from "react";
import { Ship, Layers, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CheckoutContextBar({ vessel, pool }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ship className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">
              {vessel?.name}
            </span>
            <span className="text-xs text-slate-500">
              IMO {vessel?.imo_number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {pool ? "Pool Active" : "No Active Pool"}
              </span>
            </div>
            
            {pool && pool.target_date && (
              <>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Closes {formatDistanceToNow(new Date(pool.target_date), { addSuffix: true })}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}