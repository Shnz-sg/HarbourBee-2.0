import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Layers, Users, Clock, TrendingDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PoolProgressCard({ pool, vessel }) {
  const progress = Math.min((pool.order_count / 3) * 100, 100);
  const ordersToFree = Math.max(0, 3 - pool.order_count);
  const isFree = pool.order_count >= 3;

  return (
    <div className="bg-white border-2 border-sky-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Pool</h2>
            <p className="text-sm text-slate-600">{pool.pool_id}</p>
          </div>
        </div>
        <Link to={createPageUrl("PoolDetail") + `?id=${pool.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-slate-600 font-medium">Progress to Free Delivery</span>
            <span className="font-semibold text-slate-900">{pool.order_count} / 3 vessels</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${isFree ? "bg-green-500" : "bg-sky-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">To Free Delivery</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {isFree ? "Achieved!" : `${ordersToFree} more`}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">Participants</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{pool.order_count}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">Status</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{pool.status}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">Port</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{pool.port}</p>
          </div>
        </div>

        {isFree ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <span className="font-medium">Free delivery achieved!</span> Any provisional delivery fees will be refunded automatically when the pool closes.
            </p>
          </div>
        ) : (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <p className="text-sm text-sky-900">
              <span className="font-medium">{ordersToFree} more vessel{ordersToFree !== 1 ? 's' : ''} needed</span> for free delivery. Your order is already in this pool and will be delivered together.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}