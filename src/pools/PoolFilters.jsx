import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

export default function PoolFilters({ filters, onFilterChange, ports, userRole }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: "all",
      search: "",
      port: "all",
      attentionLevel: "all",
      lockStatus: "all",
      deliveryAssigned: "all",
      date_from: "",
      date_to: ""
    });
  };

  const hasActiveFilters = 
    filters.status !== "all" || 
    filters.search || 
    filters.port !== "all" || 
    filters.attentionLevel !== "all" ||
    filters.lockStatus !== "all" || 
    filters.deliveryAssigned !== "all" ||
    filters.date_from || 
    filters.date_to;

  return (
    <Card className="p-4 mt-4">
      {/* Search + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by Pool ID or Port..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
            <SelectItem value="in_delivery">In Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
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
            {ports && ports.length > 0 && (
              <Select value={filters.port} onValueChange={(val) => handleFilterChange("port", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Port" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ports</SelectItem>
                  {ports.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
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

            <Select value={filters.lockStatus} onValueChange={(val) => handleFilterChange("lockStatus", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Lock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.deliveryAssigned} onValueChange={(val) => handleFilterChange("deliveryAssigned", val)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
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
    </Card>
  );
}