import React from "react";
import { Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsEmptyState({ hasFilters, userRole }) {
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);

  if (hasFilters) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
        <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No products match your filters</h3>
        <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (isOpsOrAdmin) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No products yet</h3>
        <p className="text-slate-500 mb-4">Start building your catalog by adding products</p>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Add First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
      <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-700 mb-2">No products available</h3>
      <p className="text-slate-500">Products will appear here once added by operations</p>
    </div>
  );
}