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

export default function DeliveryDetail() {
  const params = new URLSearchParams(window.location.search);
  const deliveryId = params.get("id");

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["delivery-detail", deliveryId],
    queryFn: () => base44.entities.Delivery.filter({ id: deliveryId }),
    enabled: !!deliveryId,
  });

  const del = deliveries[0];

  if (isLoading) return <div className="p-6"><SkeletonRows rows={4} cols={3} /></div>;
  if (!del) return <div className="p-6 text-slate-500">Delivery not found.</div>;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to={createPageUrl("Deliveries")} className="hover:text-sky-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Deliveries
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">{del.delivery_id}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <h1 className="text-lg font-semibold text-slate-900">{del.delivery_id}</h1>
          <StatusBadge status={del.status} />
        </div>
        <p className="text-sm text-slate-500">
          {del.vessel_name || "—"} · {del.port || "—"} · {del.delivery_method || "launch"}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Timeline</h2>
          <div className="space-y-3">
            <TimelineRow label="Scheduled" value={del.scheduled_date} />
            <TimelineRow label="Dispatched" value={del.dispatched_at} />
            <TimelineRow label="Delivered" value={del.delivered_at} />
          </div>
          {del.delivery_fee && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="font-medium text-slate-900">${del.delivery_fee.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Related</h2>
          <div className="space-y-2">
            {del.pool_id && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Pool</span>
                <ObjectLink type="pool" id={del.pool_id} label={del.pool_id} />
              </div>
            )}
            {del.order_ids?.length > 0 && (
              <div>
                <span className="text-xs text-slate-500">Orders ({del.order_ids.length})</span>
                <div className="mt-1 space-y-1">
                  {del.order_ids.map(oid => (
                    <div key={oid}><ObjectLink type="order" id={oid} label={oid} /></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {del.carrier_name && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Carrier</span>
              <p className="text-sm text-slate-700 mt-0.5">{del.carrier_name}</p>
            </div>
          )}
          {del.notes && (
            <div className="mt-3">
              <span className="text-xs text-slate-500">Notes</span>
              <p className="text-sm text-slate-600 mt-0.5">{del.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700">
        {value ? format(new Date(value), "MMM d, yyyy HH:mm") : "—"}
      </span>
    </div>
  );
}