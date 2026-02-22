import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, AlertCircle, ArrowRight } from "lucide-react";

export default function DashboardFinancialSnapshot({ data }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Financial Snapshot
        </h3>
        <Link to={createPageUrl("Finance")} className="text-xs text-sky-600 hover:underline flex items-center gap-1">
          View Finance <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-700">Month-to-Date Revenue</p>
              <p className="text-sm font-semibold text-emerald-900">
                ${(data.revenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs text-amber-700">Pending Settlements</p>
              <p className="text-sm font-semibold text-amber-900">
                ${(data.pendingSettlement || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-600" />
            <div>
              <p className="text-xs text-slate-600">Unpaid Orders</p>
              <p className="text-sm font-semibold text-slate-900">{data.unpaidOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}