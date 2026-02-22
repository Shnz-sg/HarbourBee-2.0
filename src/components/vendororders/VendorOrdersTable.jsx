import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, FileText, Store } from "lucide-react";
import { format } from "date-fns";

export default function VendorOrdersTable({ orders, userRole }) {
  const isVendor = userRole === "vendor";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      awaiting_acknowledgement: "bg-amber-100 text-amber-700",
      acknowledged: "bg-blue-100 text-blue-700",
      preparing: "bg-purple-100 text-purple-700",
      partially_ready: "bg-cyan-100 text-cyan-700",
      ready: "bg-emerald-100 text-emerald-700",
      picked_up: "bg-green-100 text-green-700",
      completed: "bg-slate-100 text-slate-600",
      delayed: "bg-rose-100 text-rose-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-600",
      quality_rejected: "bg-orange-100 text-orange-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getAttentionBadge = (order) => {
    if (order.attentionLevel === "critical") {
      return <AlertTriangle className="w-4 h-4 text-rose-500" title="Critical" />;
    }
    if (order.attentionLevel === "warning") {
      return <Clock className="w-4 h-4 text-amber-500" title="Warning" />;
    }
    return null;
  };

  const getSLABadge = (order) => {
    if (order.slaStatus === "breached") {
      return <span className="text-rose-600 font-medium text-xs">Breach</span>;
    }
    if (order.slaStatus === "at_risk") {
      return <span className="text-amber-600 font-medium text-xs">At Risk</span>;
    }
    return <span className="text-emerald-600 text-xs">On Track</span>;
  };

  const getGridColumns = () => {
    if (isVendor) {
      return "1.5fr 1fr 1fr 1fr 0.8fr 0.5fr";
    } else if (isOpsAdmin) {
      return "1.5fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.5fr";
    } else {
      return "1.5fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.5fr";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: getGridColumns() }}
      >
        <div>VO ID</div>
        <div>Status</div>
        {!isVendor && <div>Vendor</div>}
        <div>Order ID</div>
        <div>Expected Ready</div>
        {!isVendor && <div>SLA</div>}
        <div>Items</div>
        {isOpsAdmin && <div>Value</div>}
        <div>Alert</div>
        <div></div>
      </div>

      <div className="divide-y divide-slate-100">
        {orders.map(order => (
          <Link
            key={order.id}
            to={createPageUrl("VendorOrderDetail") + `?id=${order.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm items-center"
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            <div className="font-medium text-sky-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {order.vendor_order_id}
            </div>

            <div>
              <Badge className={getStatusColor(order.status)} variant="secondary">
                {order.status.replace(/_/g, " ")}
              </Badge>
            </div>

            {!isVendor && (
              <div className="text-slate-900 font-medium flex items-center gap-1">
                <Store className="w-3 h-3 text-slate-400" />
                {order.vendor_name}
              </div>
            )}

            <div className="text-slate-600 text-xs font-mono">{order.order_id}</div>

            <div className="text-slate-600 text-xs">
              {order.expected_ready_date ? format(new Date(order.expected_ready_date), "MMM d, HH:mm") : "—"}
            </div>

            {!isVendor && <div>{getSLABadge(order)}</div>}

            <div className="text-slate-600 text-xs">
              {order.items?.reduce((sum, i) => sum + (i.quantity_ready || 0), 0)}/
              {order.items?.reduce((sum, i) => sum + (i.quantity_ordered || 0), 0)}
            </div>

            {isOpsAdmin && (
              <div className="text-slate-900 font-medium">
                ${(order.subtotal || 0).toLocaleString()}
              </div>
            )}

            <div>{getAttentionBadge(order)}</div>

            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}