import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Layers, Users, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PoolSnapshot({ pool }) {
  if (!pool) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">No Active Pool</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
            Place an order to join or create a delivery pool. When 3+ vessels join the same pool, 
            delivery becomes free for everyone.
          </p>
          <Link to={createPageUrl("Products")}>
            <Button variant="outline" size="sm">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min((pool.order_count / 3) * 100, 100);
  const ordersToFree = Math.max(0, 3 - pool.order_count);
  const isFree = pool.order_count >= 3;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-semibold text-slate-900">Active Pool</h3>
        </div>
        <Link to={createPageUrl("PoolDetail") + `?id=${pool.id}`}>
          <Button variant="ghost" size="sm" className="text-sky-600 h-8">
            View Details
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Pool Progress</span>
            <span className="font-medium text-slate-900">
              {pool.order_count} / 3 orders
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isFree ? "bg-green-500" : "bg-sky-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">To Free Delivery</span>
            </div>
            <p className="text-base font-semibold text-slate-900">
              {isFree ? "Achieved!" : `${ordersToFree} more`}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Vessels</span>
            </div>
            <p className="text-base font-semibold text-slate-900">{pool.order_count}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Status</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{pool.status}</p>
          </div>
        </div>

        {isFree && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-900">
              <span className="font-medium">Free delivery unlocked.</span> Any provisional fees will be refunded automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}