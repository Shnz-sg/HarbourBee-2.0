import React from "react";
import { Button } from "@/components/ui/button";
import { Truck, Filter, Plus } from "lucide-react";

export default function DeliveriesEmptyState({ hasFilters, quickTab }) {
  if (hasFilters) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No deliveries match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (quickTab === "today") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No deliveries scheduled for today</h3>
        <p className="text-sm text-slate-500">All clear for today</p>
      </div>
    );
  } else if (quickTab === "active") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No active deliveries</h3>
        <p className="text-sm text-slate-500">All deliveries are completed or scheduled for later</p>
      </div>
    );
  } else if (quickTab === "completed") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No completed deliveries</h3>
        <p className="text-sm text-slate-500">Completed deliveries will appear here</p>
      </div>
    );
  } else if (quickTab === "issues") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No delivery issues</h3>
        <p className="text-sm text-slate-500">All deliveries are running smoothly</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
      <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">No deliveries</h3>
      <p className="text-sm text-slate-500">Deliveries will appear here once created</p>
    </div>
  );
}