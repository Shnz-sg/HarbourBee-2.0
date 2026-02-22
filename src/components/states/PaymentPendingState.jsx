import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function PaymentPendingState({ orderId }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-amber-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">Payment Pending</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Your payment is being verified by your bank. This usually completes within a few minutes.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium text-slate-900 mb-2">What happens next:</p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Your order will update automatically once verified</li>
          <li>• You'll receive an email confirmation</li>
          <li>• No action is required from you</li>
        </ul>
      </div>

      <Link to={orderId ? createPageUrl("OrderDetail") + `?id=${orderId}` : createPageUrl("Orders")}>
        <Button variant="outline" className="w-full">
          View Order Status
        </Button>
      </Link>
    </div>
  );
}