import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Truck, MapPin, Calendar, ExternalLink } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

export default function DeliveryInformation({ order, delivery }) {
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">Delivery Information</h2>
        {delivery && (
          <Link
            to={createPageUrl(`DeliveryDetail?id=${delivery.id}`)}
            className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
          >
            View delivery
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {delivery ? (
          <>
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-1">Delivery Status</p>
                <StatusBadge status={delivery.status} />
              </div>
            </div>

            {delivery.scheduled_date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Scheduled Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(delivery.scheduled_date)}</p>
                </div>
              </div>
            )}

            {order.port && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Port / Anchorage</p>
                  <p className="text-sm font-medium text-slate-900">{order.port}</p>
                </div>
              </div>
            )}

            {delivery.delivery_method && (
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Delivery Method</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {delivery.delivery_method.replace("_", " ")}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <p className="text-sm text-slate-500">
              {["draft", "submitted", "confirmed"].includes(order.status)
                ? "Delivery details will be available once the order is pooled and scheduled."
                : "No delivery information available for this order."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}