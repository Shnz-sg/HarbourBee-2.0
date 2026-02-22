import React, { useState } from "react";
import { CreditCard, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StripeHealthSnapshot({ userRole, dateRange, stripeConnected = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock Stripe data - will be replaced with actual API calls when Stripe is connected
  const stripeData = {
    availableBalance: 125400,
    pendingBalance: 18200,
    totalCharges: 487250,
    totalRefunds: 12400,
    payoutsSent: 14,
    disputesOpen: 0
  };

  if (!stripeConnected) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Stripe Reconciliation
              <span className="text-xs text-slate-400 font-normal">(Processor View)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Stripe integration not yet active. Connect Stripe to enable reconciliation and diagnostics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50/30 border border-purple-200/50 rounded-lg mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Stripe Reconciliation Snapshot
              <span className="text-xs text-purple-600 font-normal">(Processor View)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Diagnostic view for validation and dispute tracking
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-4">
          <div className="border-t border-purple-200/50 pt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Stripe Balance */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Available Balance
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  ${stripeData.availableBalance.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Stripe account</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Pending Balance
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  ${stripeData.pendingBalance.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Clearing</p>
              </div>

              {/* Charges */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Total Charges
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  ${stripeData.totalCharges.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">{dateRange || "Last 30 days"}</p>
              </div>

              {/* Refunds */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Total Refunds
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  ${stripeData.totalRefunds.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">{dateRange || "Last 30 days"}</p>
              </div>

              {/* Payouts */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Payouts Sent
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {stripeData.payoutsSent}
                </p>
                <p className="text-xs text-slate-400 mt-1">This period</p>
              </div>

              {/* Disputes */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Open Disputes
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-slate-900">
                    {stripeData.disputesOpen}
                  </p>
                  {stripeData.disputesOpen === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {stripeData.disputesOpen === 0 ? "All clear" : "Requires review"}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50/50 rounded-lg border border-purple-200/30">
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-purple-700">Note:</strong> This data is sourced directly from Stripe for reconciliation and debugging. 
                For authoritative financial reporting, always refer to the Platform Financial View above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}