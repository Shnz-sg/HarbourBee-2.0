import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Layers, CheckCircle, Users, Clock } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

export default function PoolingInfoPanel({ order, pool }) {
  if (!order.pool_id || !pool) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPoolStatusMessage = () => {
    if (pool.status === "delivered") {
      return "Pool delivery completed";
    }
    if (pool.status === "locked" || pool.status === "in_delivery") {
      if (pool.order_count >= 3) {
        return "Free delivery achieved";
      }
      return "Shared delivery fee applied";
    }
    return "Pool is still accepting orders";
  };

  const isFreeDelivery = pool.order_count >= 3 && ["locked", "in_delivery", "delivered"].includes(pool.status);
  const isPoolClosed = ["locked", "in_delivery", "delivered"].includes(pool.status);

  return (
    <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
          <Layers className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Pooled Delivery
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This order was part of a group pool. Delivery fees are automatically reconciled after pool cut-off. 
            <span className="font-medium"> No action is required from you.</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-sky-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <Link 
            to={createPageUrl(`PoolDetail?id=${pool.id}`)}
            className="text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            Pool {pool.pool_id}
          </Link>
          <StatusBadge status={pool.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Participants</p>
              <p className="text-sm font-medium text-slate-900">{pool.order_count || 0} orders</p>
            </div>
          </div>
          
          {pool.target_date && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Target Date</p>
                <p className="text-sm font-medium text-slate-900">{formatDate(pool.target_date)}</p>
              </div>
            </div>
          )}

          {isPoolClosed && (
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${isFreeDelivery ? "text-green-600" : "text-amber-600"}`} />
              <div>
                <p className="text-xs text-slate-500">Outcome</p>
                <p className={`text-sm font-medium ${isFreeDelivery ? "text-green-700" : "text-amber-700"}`}>
                  {isFreeDelivery ? "Free Delivery" : "Shared Fee"}
                </p>
              </div>
            </div>
          )}
        </div>

        {isPoolClosed && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              <span className="font-medium">{getPoolStatusMessage()}</span>
              {isFreeDelivery && " — Original delivery fee has been refunded to your account."}
            </p>
          </div>
        )}

        {!isPoolClosed && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-sky-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min((pool.order_count / 3) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600">
                {pool.order_count}/3
              </span>
            </div>
            <p className="text-xs text-slate-500">
              3 or more orders required for free delivery
            </p>
          </div>
        )}
      </div>
    </div>
  );
}