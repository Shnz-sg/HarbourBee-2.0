import React from "react";
import { DollarSign, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function DeliveryFeeTimeline({ order, pool, isPooled }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };

  const isFreeDelivery = pool && pool.order_count >= 3 && ["locked", "in_delivery", "delivered"].includes(pool.status);
  const isPoolClosed = pool && ["locked", "in_delivery", "delivered"].includes(pool.status);
  
  const provisionalFee = order.delivery_fee_provisional || 0;
  const finalFee = order.delivery_fee_final || provisionalFee;
  const refundAmount = order.refund_amount || 0;

  if (!isPooled) {
    // Non-pooled orders: simple display
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Delivery Fee</h2>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-slate-600">Delivery charge</span>
          <span className="text-sm font-medium text-slate-900">{formatCurrency(finalFee)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-4">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Delivery Fee Breakdown</h2>
        <p className="text-xs text-slate-500 mt-1">Before and after pool closure</p>
      </div>
      
      <div className="px-6 py-5 space-y-6">
        {/* Step 1: Provisional Fee */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-slate-900">Provisional Fee Paid at Checkout</h3>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(provisionalFee)}</span>
            </div>
            <p className="text-xs text-slate-500">This amount may reduce or be refunded after pool closes</p>
          </div>
        </div>

        {/* Connector */}
        {isPoolClosed && (
          <div className="pl-3 border-l-2 border-dashed border-slate-200 h-4" />
        )}

        {/* Step 2: Pool Outcome (only if pool is closed) */}
        {isPoolClosed && (
          <div className="relative pl-8">
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
              isFreeDelivery ? "bg-green-100" : "bg-amber-100"
            }`}>
              <Users className={`w-3.5 h-3.5 ${isFreeDelivery ? "text-green-600" : "text-amber-600"}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">Pool Outcome</h3>
              <p className={`text-xs font-medium ${isFreeDelivery ? "text-green-700" : "text-slate-700"}`}>
                {isFreeDelivery 
                  ? "Pool reached free delivery threshold" 
                  : `Pool closed with ${pool.order_count} participant${pool.order_count !== 1 ? 's' : ''}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isFreeDelivery ? "3+ vessels joined before cut-off" : "Free delivery requires 3+ vessels"}
              </p>
            </div>
          </div>
        )}

        {/* Connector */}
        {isPoolClosed && (
          <div className="pl-3 border-l-2 border-dashed border-slate-200 h-4" />
        )}

        {/* Step 3: Final Fee */}
        {isPoolClosed && (
          <div className="relative pl-8">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-slate-900">Final Delivery Fee</h3>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(finalFee)}</span>
              </div>
              <p className="text-xs text-slate-500">
                {isFreeDelivery ? "Pool delivery at no charge" : `Shared across ${pool.order_count} orders`}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Refund Status */}
        {isPoolClosed && refundAmount > 0 && (
          <>
            <div className="pl-3 border-l-2 border-dashed border-slate-200 h-4" />
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-green-600 rotate-180" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-slate-900">Refund Issued</h3>
                  <span className="text-sm font-semibold text-green-700">{formatCurrency(refundAmount)}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Status: <span className="font-medium text-green-700">Processed</span> • 
                  Reason: {isFreeDelivery ? "Pool free delivery" : "Pool delivery reconciliation"}
                </p>
              </div>
            </div>
          </>
        )}

        {isPoolClosed && refundAmount === 0 && !isFreeDelivery && (
          <>
            <div className="pl-3 border-l-2 border-dashed border-slate-200 h-4" />
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">Refund Status</h3>
                <p className="text-xs text-slate-500">No refund required</p>
              </div>
            </div>
          </>
        )}

        {/* Pool still open message */}
        {!isPoolClosed && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <p className="text-xs text-sky-900 leading-relaxed">
              <span className="font-medium">Pool is still open.</span> The final delivery fee will be calculated when the pool closes. If the free delivery threshold is reached, your provisional fee will be refunded automatically. No action required from you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}