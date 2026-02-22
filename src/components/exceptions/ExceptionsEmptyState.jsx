import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ExceptionsEmptyState({ hasFilters = false }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-medium text-slate-700 mb-1">No exceptions match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your filter criteria</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">All clear</h3>
      <p className="text-sm text-slate-500">No exceptions requiring attention at this time</p>
    </div>
  );
}