import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../components/shared/StatusBadge";
import ObjectLink from "../components/shared/ObjectLink";
import SkeletonRows from "../components/shared/SkeletonRows";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function PoolDetail() {
  const params = new URLSearchParams(window.location.search);
  const poolId = params.get("id");

  const { data: pools = [], isLoading } = useQuery({
    queryKey: ["pool-detail", poolId],
    queryFn: () => base44.entities.Pool.filter({ id: poolId }),
    enabled: !!poolId,
  });

  const pool = pools[0];

  if (isLoading) return <div className="p-6"><SkeletonRows rows={4} cols={3} /></div>;
  if (!pool) return <div className="p-6 text-slate-500">Pool not found.</div>;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to={createPageUrl("Pools")} className="hover:text-sky-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Pools
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">{pool.pool_id}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <h1 className="text-lg font-semibold text-slate-900">{pool.pool_id}</h1>
          <StatusBadge status={pool.status} />
        </div>
        <p className="text-sm text-slate-500">{pool.port} · Target: {pool.target_date ? format(new Date(pool.target_date), "MMM d, yyyy") : "—"}</p>
        {pool.total_value && <p className="text-sm font-medium text-slate-700 mt-2">Total: ${pool.total_value.toLocaleString()}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Orders in Pool ({pool.order_ids?.length || 0})</h2>
          {pool.order_ids?.length > 0 ? (
            <div className="space-y-2">
              {pool.order_ids.map(oid => (
                <div key={oid}><ObjectLink type="order" id={oid} label={oid} /></div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No orders linked</p>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Delivery</h2>
          {pool.delivery_id ? (
            <ObjectLink type="delivery" id={pool.delivery_id} label={pool.delivery_id} />
          ) : (
            <p className="text-sm text-slate-400">No delivery assigned</p>
          )}
          {pool.notes && (
            <div className="mt-4">
              <h3 className="text-xs text-slate-500 mb-1">Notes</h3>
              <p className="text-sm text-slate-600">{pool.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}