import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function FilteredEmptyState({ onReset }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Filter className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm text-slate-600 mb-4">
        No items match your current filters
      </p>
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}