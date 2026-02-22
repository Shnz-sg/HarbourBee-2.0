import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

export default function OrderFilters({ filters, onFilterChange, vessels, ports, poolIds, userRole }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: "all",
      vessel: "all",
      port: "all",
      payment_status: "all",
      priority: "all",
      pool: "all",
      delivery_state: "all",
      date_from: "",
      date_to: "",
      search: ""
    });
  };

  const hasActiveFilters = 
    filters.status !== "all" || 
    filters.vessel !== "all" || 
    filters.port !== "all" || 
    filters.payment_status !== "all" ||
    filters.priority !== "all" ||
    filters.pool !== "all" ||
    filters.delivery_state !== "all" ||
    filters.date_from || 
    filters.date_to || 
    filters.search;

  return (
    <Card className="p-4 mt-4">
      {/* Search + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by Order ID or Vessel..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pooled">Pooled</SelectItem>
            <SelectItem value="in_delivery">In Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters (Ops/Admin only) */}
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

              <Select value={filters.priority} onValueChange={(val) => handleFilterChange("priority", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.payment_status} onValueChange={(val) => handleFilterChange("payment_status", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.pool} onValueChange={(val) => handleFilterChange("pool", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pooled">Pooled</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.delivery_state} onValueChange={(val) => handleFilterChange("delivery_state", val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Delivery</SelectItem>
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
      )}
    </Card>
  );
}