import React from "react";

export default function OrderItemsList({ items, showVendor = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Order Items</h2>
        <p className="text-sm text-slate-500">No items in this order</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-4">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Order Items</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-slate-900 mb-1">
                  {item.product_name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Qty: {item.quantity} {item.unit || "units"}</span>
                  <span className="text-slate-300">•</span>
                  <span>{formatCurrency(item.unit_price)} per {item.unit || "unit"}</span>
                  {showVendor && item.vendor_name && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>Vendor: {item.vendor_name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-slate-900">
                {formatCurrency(item.total)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}