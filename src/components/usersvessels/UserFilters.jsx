import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const ROLES = ["admin", "user", "vendor", "ops_staff", "ops_admin"];

export default function UserFilters({ filters, onFilterChange }) {
  const hasActiveFilters = filters.role !== "all" || filters.status !== "all" || filters.search;

  const clearFilters = () => {
    onFilterChange({ role: "all", status: "all", search: "" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-8 h-9 text-sm"
        />
      </div>

      <Select value={filters.role} onValueChange={(v) => onFilterChange({ ...filters, role: v })}>
        <SelectTrigger className="w-40 h-9 text-sm">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {ROLES.map(r => (
            <SelectItem key={r} value={r}>
              {r.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => onFilterChange({ ...filters, status: v })}>
        <SelectTrigger className="w-36 h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3 text-slate-500">
          <X className="w-3.5 h-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}