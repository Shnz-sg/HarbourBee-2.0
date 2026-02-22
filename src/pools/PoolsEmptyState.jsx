import React from "react";
import { Button } from "@/components/ui/button";
import { Layers, Filter, Plus } from "lucide-react";

export default function PoolsEmptyState({ hasFilters, quickTab }) {
  if (hasFilters) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No pools match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (quickTab === "active") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No active pools</h3>
        <p className="text-sm text-slate-500 mb-4">Create a new pool to start grouping orders</p>
        <Button>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Pool
        </Button>
      </div>
    );
  } else if (quickTab === "in_delivery") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No pools in delivery</h3>
        <p className="text-sm text-slate-500">Pools will appear here once delivery starts</p>
      </div>
    );
  } else if (quickTab === "completed") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No completed pools</h3>
        <p className="text-sm text-slate-500">Completed pools will appear here</p>
      </div>
    );
  } else if (quickTab === "cancelled") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No cancelled pools</h3>
        <p className="text-sm text-slate-500">No pools have been cancelled</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
      <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">No pools require attention</h3>
      <p className="text-sm text-slate-500">All pools are running smoothly</p>
    </div>
  );
}