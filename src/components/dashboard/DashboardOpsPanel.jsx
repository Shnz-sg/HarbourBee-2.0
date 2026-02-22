import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Layers, AlertTriangle, Truck, ArrowRight } from "lucide-react";

export default function DashboardOpsPanel({ pools, exceptions, deliveries }) {
  const poolsNearingCutoff = pools.filter(p => p.status === 'open').length;
  const criticalExceptions = exceptions.filter(e => e.severity === 'critical').length;
  const inTransit = deliveries.filter(d => d.status === 'in_transit').length;

  return (
    <Card className="p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-3">Operations Overview</h3>
      <div className="space-y-3">
        <Link
          to={createPageUrl("Pools")}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-xs text-slate-500">Pools Nearing Cutoff</p>
              <p className="text-sm font-semibold text-slate-900">{poolsNearingCutoff}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to={createPageUrl("Exceptions")}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <p className="text-xs text-slate-500">Critical Exceptions</p>
              <p className="text-sm font-semibold text-slate-900">{criticalExceptions}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to={createPageUrl("Deliveries")}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs text-slate-500">Deliveries In Transit</p>
              <p className="text-sm font-semibold text-slate-900">{inTransit}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>
    </Card>
  );
}