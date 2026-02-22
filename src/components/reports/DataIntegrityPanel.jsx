import React from "react";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

export default function DataIntegrityPanel({ snapshots }) {
  // Calculate integrity metrics
  const totalSnapshots = snapshots.length;
  const recentSnapshots = snapshots.filter(s => {
    const date = new Date(s.generated_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length;

  const balancedSnapshots = snapshots.filter(s => 
    s.stripe_reconciliation_status === 'balanced'
  ).length;

  const reconciliationRate = totalSnapshots > 0 
    ? ((balancedSnapshots / totalSnapshots) * 100).toFixed(1) 
    : 0;

  const isHealthy = reconciliationRate >= 95;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Data Integrity Status</h3>
        {isHealthy ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{reconciliationRate}%</p>
          <p className="text-xs text-slate-500 mt-1">Reconciliation Rate</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{recentSnapshots}</p>
          <p className="text-xs text-slate-500 mt-1">Reports This Week</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{totalSnapshots}</p>
          <p className="text-xs text-slate-500 mt-1">Total Snapshots</p>
        </div>
      </div>

      {!isHealthy && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Reconciliation rate below target. Review financial exceptions.
          </p>
        </div>
      )}
    </div>
  );
}