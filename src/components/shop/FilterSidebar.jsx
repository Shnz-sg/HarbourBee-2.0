import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";



const AVAILABILITY = [
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Pre-Order", value: "pre_order" }
];

const DELIVERY_WINDOW = [
  { label: "Same Day", value: "same_day" },
  { label: "Next Day", value: "next_day" },
  { label: "Scheduled", value: "scheduled" }
];

function FilterGroup({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#150C0C]/10 pb-5 mb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3 text-[15px] font-medium text-[#150C0C] hover:text-[#D39858] transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  hideCategories = false,
  isMobile = false,
  onClose 
}) {
  const handleCategoryToggle = (category) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleAvailabilityToggle = (value) => {
    const current = filters.availability || [];
    const updated = current.includes(value)
      ? current.filter(a => a !== value)
      : [...current, value];
    onFilterChange({ ...filters, availability: updated });
  };

  const handleDeliveryToggle = (value) => {
    const current = filters.delivery || [];
    const updated = current.includes(value)
      ? current.filter(d => d !== value)
      : [...current, value];
    onFilterChange({ ...filters, delivery: updated });
  };

  const handlePriceChange = (value) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const content = (
    <div className="space-y-1">
      {/* Category Filter - Hidden on category collection pages */}
      {!hideCategories && (
        <FilterGroup title="Category">
          <p className="text-xs text-slate-500 italic">Category filtering available in shop</p>
        </FilterGroup>
      )}

      {/* Availability Filter */}
      <FilterGroup title="Availability">
        {AVAILABILITY.map((item) => (
          <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={(filters.availability || []).includes(item.value)}
              onCheckedChange={() => handleAvailabilityToggle(item.value)}
              className="border-[#150C0C]/30"
            />
            <span className="text-[13px] text-[#150C0C]/80 group-hover:text-[#150C0C] transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Price Range Filter */}
      <FilterGroup title="Price Range">
        <div className="px-1">
          <Slider
            value={filters.priceRange || [0, 1000]}
            onValueChange={handlePriceChange}
            max={1000}
            step={10}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-[12px] text-[#150C0C]/60">
            <span>${filters.priceRange?.[0] || 0}</span>
            <span>${filters.priceRange?.[1] || 1000}</span>
          </div>
        </div>
      </FilterGroup>

      {/* Delivery Window Filter */}
      <FilterGroup title="Delivery Window">
        {DELIVERY_WINDOW.map((item) => (
          <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={(filters.delivery || []).includes(item.value)}
              onCheckedChange={() => handleDeliveryToggle(item.value)}
              className="border-[#150C0C]/30"
            />
            <span className="text-[13px] text-[#150C0C]/80 group-hover:text-[#150C0C] transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Clear Filters */}
      <Button
        onClick={onClearFilters}
        variant="outline"
        className="w-full text-[#150C0C] border-[#150C0C]/30 hover:bg-[#150C0C] hover:text-[#F5EBDD] transition-colors"
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#150C0C]/50 lg:hidden">
        <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#F5EBDD] shadow-2xl overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#F5EBDD] border-b border-[#150C0C]/10 p-4 flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#150C0C]">Filters</h2>
            <button onClick={onClose} className="text-[#150C0C] hover:text-[#D39858] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[260px] flex-shrink-0 pr-8">
      <div className="sticky top-[220px]">{content}</div>
    </aside>
  );
}