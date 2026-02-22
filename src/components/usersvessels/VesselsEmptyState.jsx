import React from "react";
import { Anchor, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VesselsEmptyState({ userRole, hasFilters, onAddVessel }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Anchor className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">No vessels match your filters</p>
      </div>
    );
  }

  // Super admin - can add vessels
  if (userRole === "super_admin" && onAddVessel) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Anchor className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-base font-medium text-slate-700 mb-2">No vessels found</h3>
        <p className="text-sm text-slate-500 mb-4">Add your first vessel to get started</p>
        <Button size="sm" onClick={onAddVessel} className="bg-sky-600 hover:bg-sky-700">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Vessel
        </Button>
      </div>
    );
  }

  // Default neutral empty state
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Anchor className="w-10 h-10 text-slate-300 mb-3" />
      <p className="text-sm text-slate-600">No vessels found</p>
    </div>
  );
}