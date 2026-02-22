import React from "react";
import { DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinanceEmptyState({ hasFilters, userRole }) {
  const isNormalUser = userRole === 'user';

  if (hasFilters) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No matching payments
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          No financial records match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  if (isNormalUser) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No payment history
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          You haven't made any orders yet. Start by browsing products and placing an order.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
      <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        No financial data
      </h3>
      <p className="text-sm text-slate-500">
        No orders or payments have been recorded yet.
      </p>
    </div>
  );
}