import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardPoolSnapshot({ pool, loading }) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="space-y-3">
          <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-2 w-full bg-slate-100 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!pool) {
    return (
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-900 mb-1">No Active Pool</h3>
            <p className="text-xs text-slate-500 mb-3">
              There is no active pool for this vessel's port at the moment. Orders are fulfilled individually.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to={createPageUrl("Products")}>Browse Products</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const orderCount = pool.order_count || pool.order_ids?.length || 0;
  const threshold = 5;
  const progress = Math.min((orderCount / threshold) * 100, 100);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-medium text-slate-900">Active Pool: {pool.pool_id}</h3>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 -mt-1">
          <Link to={createPageUrl("PoolDetail") + `?id=${pool.id}`}>
            View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600">Progress to threshold</span>
          <span className="font-medium text-slate-900">{orderCount} / {threshold} orders</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Port</p>
            <p className="text-sm font-medium text-slate-900">{pool.port || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p className="text-sm font-medium text-emerald-600 capitalize">{pool.status}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Value</p>
            <p className="text-sm font-medium text-slate-900">
              ${(pool.total_value || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}