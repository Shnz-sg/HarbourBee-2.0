import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export default function FilterPanel({ filters, onFilterChange, onReset, activeFilters = 0 }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-slate-600">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
      </div>

      {filters.map((filter, index) => (
        <Select
          key={index}
          value={filter.value}
          onValueChange={(value) => onFilterChange(filter.key, value)}
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {activeFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 text-slate-600 hover:text-slate-900"
        >
          <X className="w-3 h-3 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}