import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

export default function VendorFilters({ filters, onFilterChange, vendors, userRole }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      status: "active",
      category: "all",
      port: "all",
      complianceStatus: "all",
      rating: "all"
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status !== "active" || 
    filters.category !== "all" ||
    filters.port !== "all" ||
    filters.complianceStatus !== "all" ||
    filters.rating !== "all";

  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  // Extract unique values
  const uniqueCategories = [...new Set(vendors.flatMap(v => v.categories || []))];
  const uniquePorts = [...new Set(vendors.map(v => v.primary_port).filter(Boolean))];

  return (
    <Card className="p-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search vendors by name or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Select value={filters.status} onValueChange={(val) => handleFilterChange("status", val)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            {isOpsAdmin && (
              <>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

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
          {uniqueCategories.length > 0 && (
            <Select value={filters.category} onValueChange={(val) => handleFilterChange("category", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {uniquePorts.length > 0 && (
            <Select value={filters.port} onValueChange={(val) => handleFilterChange("port", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Port" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ports</SelectItem>
                {uniquePorts.map(port => (
                  <SelectItem key={port} value={port}>{port}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isOpsAdmin && (
            <Select value={filters.complianceStatus} onValueChange={(val) => handleFilterChange("complianceStatus", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compliance</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={filters.rating} onValueChange={(val) => handleFilterChange("rating", val)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="high">High (4+)</SelectItem>
              <SelectItem value="medium">Medium (2.5-4)</SelectItem>
              <SelectItem value="low">Low (&lt;2.5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}