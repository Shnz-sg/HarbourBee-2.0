import React from "react";
import { BarChart3, Lock } from "lucide-react";

export default function ReportsEmptyState({ userRole }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
      <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        No Reports Available
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        You don't have access to any reports. Contact your administrator if you believe this is an error.
      </p>
    </div>
  );
}