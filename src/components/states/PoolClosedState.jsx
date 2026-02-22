import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingDown } from "lucide-react";

export default function PoolClosedState({ 
  poolId,
  orderCount,
  freeDeliveryAchieved,
  refundAmount
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
        freeDeliveryAchieved ? "bg-green-100" : "bg-sky-100"
      }`}>
        {freeDeliveryAchieved ? (
          <CheckCircle className="w-8 h-8 text-green-600" />
        ) : (
          <TrendingDown className="w-8 h-8 text-sky-600" />
        )}
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">Pool Closed</h2>
      
      {freeDeliveryAchieved ? (
        <>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Great news! {orderCount} vessels joined this pool, achieving free delivery for everyone.
          </p>
          {refundAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-green-900">
                <span className="font-medium">Refund processing:</span> ${refundAmount.toFixed(2)} will be returned 
                to your payment method within 5-7 business days.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-slate-600 mb-6 leading-relaxed">
            This pool closed with {orderCount} vessel{orderCount !== 1 ? 's' : ''}. 
            A shared delivery fee has been applied to your order.
          </p>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-sky-900">
              Any difference from your provisional fee will be automatically refunded within 5-7 business days.
            </p>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        {poolId && (
          <Link to={createPageUrl("PoolDetail") + `?id=${poolId}`}>
            <Button className="w-full bg-sky-600 hover:bg-sky-700">
              View Pool Details
            </Button>
          </Link>
        )}
        <Link to={createPageUrl("Orders")}>
          <Button variant="outline" className="w-full">
            View My Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}