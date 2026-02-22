import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, Zap } from "lucide-react";

export default function PerformanceIndicators({ metrics }) {
  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus
  };

  const trendColor = {
    up: "text-red-600",
    down: "text-green-600",
    stable: "text-slate-500"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Response Health</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900">{metrics.responseHealth}</span>
          <span className="text-sm text-slate-500">Good</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Error Trend</span>
        </div>
        <div className="flex items-baseline gap-2">
          {React.createElement(trendIcon[metrics.errorTrend] || Minus, {
            className: `w-5 h-5 ${trendColor[metrics.errorTrend] || "text-slate-500"}`
          })}
          <span className="text-sm text-slate-600 capitalize">{metrics.errorTrend}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Processing Backlog</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900">{metrics.backlog}</span>
          <span className="text-sm text-slate-500">items</span>
        </div>
      </div>
    </div>
  );
}