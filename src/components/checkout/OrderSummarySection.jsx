import React from "react";

export default function OrderSummarySection({ items }) {
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">
                {item.quantity} × ${item.unit_price.toFixed(2)}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              ${(item.unit_price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Subtotal</span>
          <span className="text-lg font-bold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}