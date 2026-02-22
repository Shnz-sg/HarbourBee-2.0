import React from "react";
import { Info, Users, TrendingDown, Clock } from "lucide-react";

export default function ProvisionalFeePanel({ pool, participantCount, provisionalFee }) {
  const threshold = 3;
  const isFree = participantCount >= threshold;
  const ordersToFree = Math.max(0, threshold - participantCount);

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Provisional Delivery Fee
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            This amount may reduce or be refunded if your vessel's pool reaches the free-delivery threshold.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Current fee</span>
          <span className="text-2xl font-bold text-slate-900">
            ${provisionalFee.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Calculated: ${(provisionalFee * participantCount).toFixed(2)} base fee ÷ {participantCount} participant{participantCount !== 1 ? 's' : ''}
        </p>
      </div>

      {pool && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-600 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">Participants</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{participantCount}</p>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-600 mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="text-xs">To Free</span>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {isFree ? "Achieved" : ordersToFree}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">Status</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{pool.status}</p>
          </div>
        </div>
      )}

      <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
        <p className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold">What happens next:</span> If {ordersToFree} more vessel{ordersToFree !== 1 ? 's join' : ' joins'} before the pool closes, delivery becomes free and this fee will be automatically refunded.
        </p>
      </div>
    </div>
  );
}