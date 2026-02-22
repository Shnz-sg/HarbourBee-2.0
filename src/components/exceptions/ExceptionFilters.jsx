import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function ExceptionFilters({ filters, onFilterChange, showAdvanced = false }) {
  const hasActiveFilters = 
    filters.severity !== "all" || 
    filters.status !== "all" || 
    filters.type !== "all" ||
    filters.assignee !== "all" ||
    filters.objectType !== "all" ||
    filters.objectId ||
    filters.dateFrom ||
    filters.dateTo;

  const handleClearFilters = () => {
    onFilterChange({ 
      severity: "all", 
      status: "all", 
      type: "all",
      assignee: "all",
      objectType: "all",
      objectId: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Select 
        value={filters.severity} 
        onValueChange={(value) => onFilterChange({ ...filters, severity: value })}
      >
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.status} 
        onValueChange={(value) => onFilterChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="acknowledged">Acknowledged</SelectItem>
          <SelectItem value="investigating">Investigating</SelectItem>
          <SelectItem value="awaiting_external">Awaiting External</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.type} 
        onValueChange={(value) => onFilterChange({ ...filters, type: value })}
      >
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue placeholder="Object Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="order">Order</SelectItem>
          <SelectItem value="pool">Pool</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="vendor_order">Vendor Order</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      {showAdvanced && (
        <>
          <Select 
            value={filters.assignee} 
            onValueChange={(value) => onFilterChange({ ...filters, assignee: value })}
          >
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="me">Assigned to Me</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            className="h-8 px-2 text-xs border border-slate-200 rounded-md"
            placeholder="From date"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            className="h-8 px-2 text-xs border border-slate-200 rounded-md"
            placeholder="To date"
          />
        </>
      )}

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="h-8 text-xs text-slate-500"
        >
          <X className="w-3 h-3 mr-1" />
          Reset filters
        </Button>
      )}
    </div>
  );
}