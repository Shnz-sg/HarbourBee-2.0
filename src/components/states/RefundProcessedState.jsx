import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export default function RefundProcessedState({ 
  amount,
  reason = "Pool delivery fee adjustment",
  orderId
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <DollarSign className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">Refund Processed</h2>
      <p className="text-3xl font-bold text-green-600 mb-4">${amount.toFixed(2)}</p>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {reason}
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium text-slate-900 mb-2">When you'll see it:</p>
        <p className="text-sm text-slate-600">
          The refund will appear on your payment method within 5-7 business days. 
          The exact timing depends on your bank's processing schedule.
        </p>
      </div>

      {orderId && (
        <Link to={createPageUrl("OrderDetail") + `?id=${orderId}`}>
          <Button variant="outline" className="w-full">
            View Order Details
          </Button>
        </Link>
      )}
    </div>
  );
}