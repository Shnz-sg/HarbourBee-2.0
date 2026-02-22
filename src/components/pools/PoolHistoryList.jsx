import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, DollarSign, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PoolHistoryList({ pools }) {
  if (!pools || pools.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Pool History</h3>
        <p className="text-sm text-slate-500 text-center py-6">
          No completed pools yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Pool History</h3>
      <div className="space-y-3">
        {pools.map((pool) => {
          const successful = pool.order_count >= 3;
          
          return (
            <Link
              key={pool.id}
              to={createPageUrl("PoolDetail") + `?id=${pool.id}`}
              className="block border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium text-slate-900 mb-1">{pool.pool_id}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(pool.created_date), { addSuffix: true })}
                    </span>
                    <span>{pool.port}</span>
                  </div>
                </div>
                
                {successful ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-900">Free Delivery</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-900">Shared Fee</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>{pool.order_count} vessel{pool.order_count !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span className="capitalize">{pool.status}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}