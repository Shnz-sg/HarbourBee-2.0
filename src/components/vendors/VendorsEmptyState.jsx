import React from "react";
import { Store, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorsEmptyState({ hasFilters, userRole }) {
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  if (hasFilters) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
        <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No vendors match your filters</h3>
        <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (isOpsAdmin) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
        <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No vendors yet</h3>
        <p className="text-slate-500 mb-4">Start onboarding vendors to build your supply network</p>
        <Button>
          <Store className="w-4 h-4 mr-2" />
          Add First Vendor
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
      <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-700 mb-2">No vendors available</h3>
      <p className="text-slate-500">Vendors will appear here once onboarded by operations</p>
    </div>
  );
}