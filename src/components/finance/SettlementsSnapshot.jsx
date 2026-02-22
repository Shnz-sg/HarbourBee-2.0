import React from "react";
import StatusBadge from "../shared/StatusBadge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettlementsSnapshot({ userRole }) {
  const isVendor = userRole?.includes("vendor");

  // Mock data - would come from API
  const settlements = isVendor ? [
    { id: "1", date: "2026-02-13", amount: 8200, status: "pending", recipient: "Your Account" },
    { id: "2", date: "2026-02-08", amount: 5800, status: "completed", recipient: "Your Account" },
    { id: "3", date: "2026-02-01", amount: 10500, status: "completed", recipient: "Your Account" },
  ] : [
    { id: "1", date: "2026-02-13", amount: 24500, status: "pending", recipient: "Maritime Supplies Co" },
    { id: "2", date: "2026-02-13", amount: 18300, status: "pending", recipient: "Provision Partners Ltd" },
    { id: "3", date: "2026-02-12", amount: 12800, status: "completed", recipient: "Safety Equipment Inc" },
    { id: "4", date: "2026-02-11", amount: 8500, status: "delayed", recipient: "Engine Parts Depot" },
    { id: "5", date: "2026-02-10", amount: 15200, status: "completed", recipient: "Deck Supplies Ltd" },
  ];

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    if (status === "delayed") return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
    return <Clock className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-6">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">
          {isVendor ? "Your Payouts" : "Settlements & Payouts"}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isVendor ? "Payment schedule and history" : "Recent and upcoming payment flows"}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {settlements.map(settlement => (
          <div key={settlement.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(settlement.status)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{settlement.recipient}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(settlement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  ${settlement.amount.toLocaleString()}
                </p>
                <div className="w-20">
                  <StatusBadge status={settlement.status} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}