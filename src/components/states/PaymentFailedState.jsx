import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertCircle } from "lucide-react";

export default function PaymentFailedState({ 
  onRetry,
  onChangeMethod,
  onCancel
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-8 h-8 text-red-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">Payment Not Completed</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Your payment was not processed. No charge has been made to your account.
      </p>

      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 text-left">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-sky-900">
            You can try again or use a different payment method. Your order details are saved.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {onRetry && (
          <Button onClick={onRetry} className="w-full bg-sky-600 hover:bg-sky-700">
            Try Again
          </Button>
        )}
        {onChangeMethod && (
          <Button onClick={onChangeMethod} variant="outline" className="w-full">
            Use Different Method
          </Button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-slate-600 hover:text-slate-900 mt-2"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}