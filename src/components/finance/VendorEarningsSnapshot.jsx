import React from "react";
import { Store, TrendingUp, Clock } from "lucide-react";

export default function VendorEarningsSnapshot({ userRole }) {
  const isVendor = userRole?.includes("vendor");
  
  // Don't show this section for vendor admins
  if (isVendor) return null;

  // Mock data - would come from API
  const topVendors = [
    { id: "1", name: "Maritime Supplies Co", earnings: 124500, status: "paid" },
    { id: "2", name: "Provision Partners Ltd", earnings: 98200, status: "pending" },
    { id: "3", name: "Safety Equipment Inc", earnings: 87300, status: "paid" },
    { id: "4", name: "Engine Parts Depot", earnings: 72100, status: "delayed" },
    { id: "5", name: "Deck Supplies Ltd", earnings: 68900, status: "paid" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-6">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Vendor Earnings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Top performers this period</p>
      </div>

      <div className="divide-y divide-slate-100">
        {topVendors.map((vendor, index) => (
          <div key={vendor.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-medium text-slate-400 w-5">#{index + 1}</span>
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{vendor.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-700">
                  ${vendor.earnings.toLocaleString()}
                </p>
                {vendor.status === "pending" && (
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                )}
                {vendor.status === "delayed" && (
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}