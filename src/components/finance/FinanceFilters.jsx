import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const PAYMENT_STATUSES = ["unpaid", "partial", "paid", "refunded"];
const ORDER_STATUSES = ["draft", "submitted", "confirmed", "pooled", "in_delivery", "delivered", "cancelled", "disputed"];
const SETTLEMENT_STATUSES = ["pending", "processing", "completed", "failed"];
const EXCEPTION_SEVERITIES = ["low", "medium", "high", "critical"];

export default function FinanceFilters({ filters, onFilterChange, userRole, orders }) {
  const isNormalUser = userRole === 'user';
  const isOpsStaff = userRole === 'ops_staff';
  const isOpsAdmin = userRole === 'ops_admin' || userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      payment_status: "all",
      order_status: "all",
      date_from: "",
      date_to: "",
      vessel_id: "",
      port: "",
      vendor_id: "",
      settlement_status: "all",
      exception_severity: "all"
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    value && value !== 'all' && value !== ''
  );

  // Extract unique vessels and ports for filtering
  const vessels = [...new Set(orders.map(o => o.vessel_name).filter(Boolean))];
  const ports = [...new Set(orders.map(o => o.port).filter(Boolean))];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search - All Roles */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search order ID, vessel..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Payment Status - All Roles */}
        <Select value={filters.payment_status} onValueChange={(v) => updateFilter('payment_status', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Status</SelectItem>
            {PAYMENT_STATUSES.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Order Status - All Roles */}
        <Select value={filters.order_status} onValueChange={(v) => updateFilter('order_status', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Status</SelectItem>
            {ORDER_STATUSES.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          value={filters.date_from}
          onChange={(e) => updateFilter('date_from', e.target.value)}
          placeholder="From Date"
        />

        {/* Ops Staff and above: Additional filters */}
        {!isNormalUser && (
          <>
            <Select value={filters.vessel_id} onValueChange={(v) => updateFilter('vessel_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Vessel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Vessels</SelectItem>
                {vessels.map(vessel => (
                  <SelectItem key={vessel} value={vessel}>{vessel}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.port} onValueChange={(v) => updateFilter('port', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Port" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Ports</SelectItem>
                {ports.map(port => (
                  <SelectItem key={port} value={port}>{port}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {/* Ops Admin and Super Admin: Settlement filters */}
        {(isOpsAdmin || isSuperAdmin) && (
          <Select value={filters.settlement_status} onValueChange={(v) => updateFilter('settlement_status', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Settlement Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Settlements</SelectItem>
              {SETTLEMENT_STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Super Admin: Exception severity filter */}
        {isSuperAdmin && (
          <Select value={filters.exception_severity} onValueChange={(v) => updateFilter('exception_severity', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Exception Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {EXCEPTION_SEVERITIES.map(severity => (
                <SelectItem key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date To */}
        <Input
          type="date"
          value={filters.date_to}
          onChange={(e) => updateFilter('date_to', e.target.value)}
          placeholder="To Date"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}