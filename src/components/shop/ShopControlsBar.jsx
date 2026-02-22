import React from "react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShopControlsBar({ 
  productCount, 
  sortBy, 
  onSortChange, 
  searchQuery, 
  onSearchChange 
}) {
  return (
    <div className="sticky top-[72px] z-40 bg-[#F5EBDD] border-b border-[#150C0C]/10 pb-4">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Title + Sort Row */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div>
            <h1 className="text-[28px] font-semibold text-[#150C0C] tracking-tight mb-1">
              All Vessel Supplies
            </h1>
            <p className="text-[13px] text-[#150C0C]/60 tracking-wide">
              Showing {productCount} {productCount === 1 ? 'product' : 'products'}
            </p>
          </div>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px] bg-white border-[#150C0C]/20 text-[#150C0C] text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#150C0C]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name, category, or tags..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#150C0C]/20 rounded-lg text-[14px] text-[#150C0C] placeholder:text-[#150C0C]/40 focus:outline-none focus:ring-2 focus:ring-[#D39858] focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}