import React from "react";

export default function PaymentSummary({ order }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };

  const subtotal = order.subtotal || 0;
  const provisionalFee = order.delivery_fee_provisional || 0;
  const finalFee = order.delivery_fee_final;
  const totalPaid = order.total_amount || (subtotal + provisionalFee);
  const refunds = order.refund_amount || 0;
  const netAmount = totalPaid - refunds;
  const isPoolClosed = finalFee !== undefined && finalFee !== null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Payment Summary</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Items</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {isPoolClosed ? "Delivery (final)" : "Delivery (provisional)"}
          </span>
          <span className="font-medium text-slate-900">
            {formatCurrency(isPoolClosed ? finalFee : provisionalFee)}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Amount paid</span>
            <span className="font-medium text-slate-900">{formatCurrency(totalPaid)}</span>
          </div>
        </div>

        {refunds > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Refunds</span>
              <span className="font-medium text-green-700">−{formatCurrency(refunds)}</span>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Net amount</span>
                <span className="text-base font-bold text-slate-900">{formatCurrency(netAmount)}</span>
              </div>
            </div>
          </>
        )}

        {refunds === 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Final amount</span>
              <span className="text-base font-bold text-slate-900">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}