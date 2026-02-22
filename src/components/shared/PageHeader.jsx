import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, subtitle, lastUpdated, onRefresh, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        {lastUpdated && (
          <p className="text-xs text-slate-400 mt-1">
            Last updated {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} className="text-slate-500 h-8 px-2">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}