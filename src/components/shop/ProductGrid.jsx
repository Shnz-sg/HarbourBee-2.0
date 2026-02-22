import React from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function ProductGrid({ 
  products, 
  loading, 
  hasMore, 
  onLoadMore 
}) {
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border border-[#150C0C]/10 animate-pulse">
            <div className="aspect-square bg-[#F5EBDD]/30" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-[#150C0C]/10 rounded w-1/3" />
              <div className="h-4 bg-[#150C0C]/10 rounded w-4/5" />
              <div className="h-3 bg-[#150C0C]/10 rounded w-full" />
              <div className="h-3 bg-[#150C0C]/10 rounded w-2/3" />
              <div className="h-6 bg-[#150C0C]/10 rounded w-1/3" />
              <div className="h-9 bg-[#150C0C]/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#150C0C]/5 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-[#150C0C]/30" />
        </div>
        <h3 className="text-[20px] font-semibold text-[#150C0C] mb-2">
          No matching products found
        </h3>
        <p className="text-[14px] text-[#150C0C]/60 mb-6 max-w-md">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-[#150C0C] text-[#F5EBDD] hover:bg-[#D39858] hover:text-[#150C0C] transition-colors px-12 py-6 text-[14px] font-medium"
          >
            {loading ? "Loading..." : "Load More Products"}
          </Button>
        </div>
      )}
    </div>
  );
}