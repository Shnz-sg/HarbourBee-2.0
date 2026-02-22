import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function NotificationFilters({ filters, onFilterChange }) {
  const hasActiveFilters = filters.priority !== "all" || filters.type !== "all" || filters.readStatus !== "all" || filters.objectType !== "all" || filters.objectId;

  const handleClearFilters = () => {
    onFilterChange({ priority: "all", type: "all", readStatus: "all", objectType: "all", objectId: "" });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Select value={filters.priority} onValueChange={(value) => onFilterChange({ ...filters, priority: value })}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="important">Important</SelectItem>
          <SelectItem value="informational">Informational</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => onFilterChange({ ...filters, type: value })}>
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue placeholder="Object Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="order">Order</SelectItem>
          <SelectItem value="pool">Pool</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="vendor_order">Vendor Order</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.readStatus} onValueChange={(value) => onFilterChange({ ...filters, readStatus: value })}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="h-8 text-xs text-slate-500"
        >
          <X className="w-3 h-3 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}