import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function DashboardActiveDeliveries({ deliveries, loading }) {
  if (loading) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Active Deliveries
        </h3>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (deliveries.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Active Deliveries
        </h3>
        <p className="text-xs text-slate-500">No deliveries currently in transit.</p>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-700",
      dispatched: "bg-purple-100 text-purple-700",
      in_transit: "bg-amber-100 text-amber-700",
      at_anchorage: "bg-orange-100 text-orange-700"
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card className="p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
        <Truck className="w-4 h-4" />
        Active Deliveries
      </h3>
      <div className="space-y-2">
        {deliveries.map(delivery => (
          <Link
            key={delivery.id}
            to={createPageUrl("DeliveryDetail") + `?id=${delivery.id}`}
            className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-slate-900">{delivery.delivery_id}</p>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge className={getStatusColor(delivery.status)} variant="secondary">
                {delivery.status.replace('_', ' ')}
              </Badge>
              <span className="text-slate-500 capitalize">{delivery.delivery_method || 'launch'}</span>
            </div>
            {delivery.scheduled_date && (
              <p className="text-xs text-slate-500 mt-1">
                ETA: {format(new Date(delivery.scheduled_date), 'MMM d, HH:mm')}
              </p>
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}