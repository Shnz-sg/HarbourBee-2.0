import React from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CompletedPoolsList({ pools }) {
  if (!pools || pools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {pools.map((pool) => {
        const successful = pool.order_count >= 3;
        
        return (
          <div
            key={pool.id}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {successful ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-slate-400" />
                  )}
                  <p className="font-medium text-slate-900">
                    {pool.port || "Pool"} — Pool closed
                  </p>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {formatDistanceToNow(new Date(pool.created_date), { addSuffix: true })}
                </p>
                <p className="text-sm text-slate-700">
                  {successful 
                    ? "Delivery fee finalised • Any excess refunded automatically"
                    : "Delivery fee applied as shown"}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {successful ? (
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-medium text-emerald-900">
                    Free
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                    Shared
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}