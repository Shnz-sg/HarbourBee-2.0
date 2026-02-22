import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, AlertTriangle, Ship, Anchor, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DeliveriesCards({ deliveries, userRole }) {
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-slate-100 text-slate-700",
      preparing: "bg-blue-100 text-blue-700",
      dispatched: "bg-purple-100 text-purple-700",
      in_transit: "bg-amber-100 text-amber-700",
      at_anchorage: "bg-cyan-100 text-cyan-700",
      delivered: "bg-green-100 text-green-700",
      delayed: "bg-rose-100 text-rose-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-slate-200 text-slate-600"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getAttentionBadge = (delivery) => {
    if (delivery.attentionLevel === "critical") {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>Critical</span>
        </div>
      );
    }

    if (delivery.attentionLevel === "warning") {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>Warning</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deliveries.map(delivery => (
        <Link key={delivery.id} to={createPageUrl("DeliveryDetail") + `?id=${delivery.id}`}>
          <Card className="p-4 hover:shadow-md transition-shadow h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-900">{delivery.delivery_id}</span>
              </div>
              {getAttentionBadge(delivery)}
            </div>

            {/* Status */}
            <div className="mb-3">
              <Badge className={getStatusColor(delivery.status)} variant="secondary">
                {delivery.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              {delivery.vessel_name && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Ship className="w-3.5 h-3.5" />
                  <span className="font-medium">{delivery.vessel_name}</span>
                </div>
              )}

              {(delivery.anchorage || delivery.port) && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>{delivery.anchorage || delivery.port}</span>
                </div>
              )}

              {delivery.scheduled_date && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">{format(new Date(delivery.scheduled_date), "MMM d, HH:mm")}</span>
                </div>
              )}

              {isOpsAdmin && delivery.vendor_name && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Vendor</span>
                  <span className="text-slate-900 font-medium text-xs">{delivery.vendor_name}</span>
                </div>
              )}

              {isOpsAdmin && delivery.delivery_fee && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee</span>
                  <span className="text-slate-900 font-semibold">
                    ${(delivery.delivery_fee || 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}