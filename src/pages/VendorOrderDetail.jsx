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

export default function VendorOrderDetail() {
  const params = new URLSearchParams(window.location.search);
  const voId = params.get("id");

  const { data: vos = [], isLoading } = useQuery({
    queryKey: ["vo-detail", voId],
    queryFn: () => base44.entities.VendorOrder.filter({ id: voId }),
    enabled: !!voId,
  });

  const vo = vos[0];

  if (isLoading) return <div className="p-6"><SkeletonRows rows={4} cols={3} /></div>;
  if (!vo) return <div className="p-6 text-slate-500">Vendor order not found.</div>;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to={createPageUrl("VendorOrders")} className="hover:text-sky-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Vendor Orders
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">{vo.vendor_order_id}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <h1 className="text-lg font-semibold text-slate-900">{vo.vendor_order_id}</h1>
          <StatusBadge status={vo.status} />
        </div>
        <p className="text-sm text-slate-500">
          {vo.vendor_name} · Expected: {vo.expected_ready_date ? format(new Date(vo.expected_ready_date), "MMM d, yyyy") : "—"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Items</h2>
          </div>
          {vo.items?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {vo.items.map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.product_name || item.product_id}</p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} {item.unit || ""} × ${item.unit_price?.toFixed(2) || "0.00"}
                      {item.fulfilled_quantity != null && (
                        <span className="ml-2 text-emerald-600">Fulfilled: {item.fulfilled_quantity}</span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">${item.total?.toFixed(2) || "0.00"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">No items</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">{vo.subtotal ? `$${vo.subtotal.toFixed(2)}` : "—"}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Related</h2>
            {vo.order_id ? (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Order</span>
                <ObjectLink type="order" id={vo.order_id} label={vo.order_id} />
              </div>
            ) : (
              <p className="text-xs text-slate-400">No linked order</p>
            )}
          </div>

          {vo.notes && (
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">Notes</h2>
              <p className="text-sm text-slate-600">{vo.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}