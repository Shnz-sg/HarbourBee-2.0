import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

export default function DeliveryFilters({ filters, onFilterChange, vessels, anchorages, vendors, userRole }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: "all",
      search: "",
      vessel: "all",
      anchorage: "all",
      vendor: "all",
      attentionLevel: "all",
      slaStatus: "all",
      date_from: "",
      date_to: ""
    });
  };

  const hasActiveFilters = 
    filters.status !== "all" || 
    filters.search || 
    filters.vessel !== "all" || 
    filters.anchorage !== "all" ||
    filters.vendor !== "all" || 
    filters.attentionLevel !== "all" ||
    filters.slaStatus !== "all" ||
    filters.date_from || 
    filters.date_to;

  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);

  return (
    <Card className="p-4 mt-4">
      {/* Search + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by Delivery ID, Vessel, or Anchorage..."
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="at_anchorage">At Anchorage</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isOpsOrAdmin && (
        <>
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
              {vessels && vessels.length > 0 && (
                <Select value={filters.vessel} onValueChange={(val) => handleFilterChange("vessel", val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vessels</SelectItem>
                    {vessels.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {anchorages && anchorages.length > 0 && (
                <Select value={filters.anchorage} onValueChange={(val) => handleFilterChange("anchorage", val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Anchorage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Anchorages</SelectItem>
                    {anchorages.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {vendors && vendors.length > 0 && (
                <Select value={filters.vendor} onValueChange={(val) => handleFilterChange("vendor", val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={filters.attentionLevel} onValueChange={(val) => handleFilterChange("attentionLevel", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Attention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attention</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.slaStatus} onValueChange={(val) => handleFilterChange("slaStatus", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="SLA Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SLA</SelectItem>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="breach">Breach</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange("date_from", e.target.value)}
                className="h-9"
                placeholder="From Date"
              />

              <Input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange("date_to", e.target.value)}
                className="h-9"
                placeholder="To Date"
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}