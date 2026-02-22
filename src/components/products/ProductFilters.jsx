import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

export default function ProductFilters({ filters, onFilterChange, categories, vendors, userRole }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "all",
      vendor: "all",
      availability: "all",
      status: userRole === "user" ? "active" : "all",
      poolEligible: "all",
      handlingFlags: []
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== "all" || 
    filters.vendor !== "all" ||
    filters.availability !== "all" || 
    (userRole !== "user" && filters.status !== "all") ||
    filters.poolEligible !== "all" ||
    filters.handlingFlags.length > 0;

  const isCrew = userRole === "user";
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);

  return (
    <Card className="p-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search products by name, ID, or tags..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {categories && categories.length > 0 && (
          <Select value={filters.category} onValueChange={(val) => handleFilterChange("category", val)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-slate-600 hover:text-slate-900 h-7 px-2"
      >
        {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
        Advanced Filters
      </Button>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
          {vendors && vendors.length > 0 && (
            <Select value={filters.vendor} onValueChange={(val) => handleFilterChange("vendor", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.availability} onValueChange={(val) => handleFilterChange("availability", val)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {isOpsOrAdmin && (
            <Select value={filters.status} onValueChange={(val) => handleFilterChange("status", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={filters.poolEligible} onValueChange={(val) => handleFilterChange("poolEligible", val)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Pool Eligible" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="yes">Pool Eligible Only</SelectItem>
              <SelectItem value="no">Non-Poolable Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}