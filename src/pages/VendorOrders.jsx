import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import VendorOrdersTable from "../components/vendororders/VendorOrdersTable";
import VendorOrdersCards from "../components/vendororders/VendorOrdersCards";
import VendorOrderFilters from "../components/vendororders/VendorOrderFilters";
import VendorOrdersEmptyState from "../components/vendororders/VendorOrdersEmptyState";
import VendorOrderQuickTabs from "../components/vendororders/VendorOrderQuickTabs";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Plus, Download } from "lucide-react";
import { differenceInMinutes, differenceInHours, isPast } from "date-fns";

export default function VendorOrders() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [quickTab, setQuickTab] = useState("awaiting_ack");
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    vendor: "all",
    port: "all",
    slaStatus: "all",
    attentionLevel: "all",
    date_from: "",
    date_to: ""
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Auto-refresh for ops (60s)
  useEffect(() => {
    if (!user) return;
    const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(user.role);
    if (isOpsOrAdmin) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const { data: vendorOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['vendorOrders', lastUpdated],
    queryFn: () => base44.entities.VendorOrder.list('-updated_date', 200),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isVendor = userRole === "vendor";
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  // Compute attention level & SLA status
  const computeMetrics = (vo) => {
    let attentionLevel = "healthy";
    let slaStatus = "on_track";

    // Acknowledgement SLA
    if (vo.status === "awaiting_acknowledgement" && vo.acknowledgement_deadline) {
      const minToDeadline = differenceInMinutes(new Date(vo.acknowledgement_deadline), new Date());
      if (isPast(new Date(vo.acknowledgement_deadline))) {
        attentionLevel = "critical";
        slaStatus = "breached";
      } else if (minToDeadline <= 30) {
        attentionLevel = "warning";
        slaStatus = "at_risk";
      }
    }

    // Fulfillment SLA
    if (["acknowledged", "preparing", "partially_ready"].includes(vo.status) && vo.expected_ready_date) {
      const hoursToReady = differenceInHours(new Date(vo.expected_ready_date), new Date());
      if (isPast(new Date(vo.expected_ready_date))) {
        attentionLevel = "critical";
        slaStatus = "breached";
      } else if (hoursToReady <= 2) {
        attentionLevel = "warning";
        slaStatus = "at_risk";
      }
    }

    // Status-based attention
    if (["delayed", "failed", "quality_rejected"].includes(vo.status)) {
      attentionLevel = "critical";
      slaStatus = "breached";
    }

    if (vo.exception_flag) {
      attentionLevel = "critical";
    }

    return { ...vo, attentionLevel, slaStatus };
  };

  // Filter vendor orders (vendors see only their orders)
  const baseFilteredOrders = vendorOrders
    .map(computeMetrics)
    .filter(vo => {
      if (isVendor && user.vendor_id) {
        return vo.vendor_id === user.vendor_id;
      }
      return true;
    });

  // Quick tab filter
  const getQuickTabFilter = () => {
    if (isVendor) {
      if (quickTab === "new") return ["awaiting_acknowledgement"];
      if (quickTab === "in_progress") return ["acknowledged", "preparing", "partially_ready", "delayed"];
      if (quickTab === "completed") return ["ready", "picked_up", "completed"];
    } else {
      if (quickTab === "awaiting_ack") return ["awaiting_acknowledgement"];
      if (quickTab === "preparing") return ["acknowledged", "preparing", "partially_ready"];
      if (quickTab === "ready") return ["ready"];
      if (quickTab === "completed") return ["picked_up", "completed"];
      if (quickTab === "issues") return ["delayed", "failed", "quality_rejected"];
    }
    return null;
  };

  // Apply filters
  const filteredOrders = baseFilteredOrders.filter(vo => {
    const quickTabStatuses = getQuickTabFilter();
    if (quickTabStatuses && !quickTabStatuses.includes(vo.status)) return false;

    const matchesStatus = filters.status === "all" || vo.status === filters.status;
    const matchesSearch = !filters.search ||
      vo.vendor_order_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
      vo.vendor_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      vo.order_id?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesVendor = filters.vendor === "all" || vo.vendor_name === filters.vendor;
    const matchesPort = filters.port === "all" || vo.port === filters.port;
    const matchesSLA = filters.slaStatus === "all" || vo.slaStatus === filters.slaStatus;
    const matchesAttention = filters.attentionLevel === "all" || vo.attentionLevel === filters.attentionLevel;

    let matchesDateRange = true;
    if (filters.date_from) {
      matchesDateRange = matchesDateRange && new Date(vo.expected_ready_date) >= new Date(filters.date_from);
    }
    if (filters.date_to) {
      matchesDateRange = matchesDateRange && new Date(vo.expected_ready_date) <= new Date(filters.date_to);
    }

    return matchesStatus && matchesSearch && matchesVendor && matchesPort && 
           matchesSLA && matchesAttention && matchesDateRange;
  });

  // Sort
  const getSortedOrders = () => {
    const sorted = [...filteredOrders];
    const attentionOrder = { critical: 0, warning: 1, healthy: 2 };

    if (isOpsStaff || isOpsAdmin) {
      return sorted.sort((a, b) => {
        const attentionDiff = attentionOrder[a.attentionLevel] - attentionOrder[b.attentionLevel];
        if (attentionDiff !== 0) return attentionDiff;
        if (a.expected_ready_date && b.expected_ready_date) {
          return new Date(a.expected_ready_date) - new Date(b.expected_ready_date);
        }
        return 0;
      });
    } else {
      return sorted.sort((a, b) => {
        if (a.expected_ready_date && b.expected_ready_date) {
          return new Date(a.expected_ready_date) - new Date(b.expected_ready_date);
        }
        return 0;
      });
    }
  };

  const sortedOrders = getSortedOrders();

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const vendors = [...new Set(baseFilteredOrders.map(vo => vo.vendor_name).filter(Boolean))];
  const ports = [...new Set(baseFilteredOrders.map(vo => vo.port).filter(Boolean))];

  // Summary stats
  const awaitingAckCount = baseFilteredOrders.filter(vo => vo.status === "awaiting_acknowledgement").length;
  const preparingCount = baseFilteredOrders.filter(vo => ["acknowledged", "preparing", "partially_ready"].includes(vo.status)).length;
  const readyCount = baseFilteredOrders.filter(vo => vo.status === "ready").length;
  const issuesCount = baseFilteredOrders.filter(vo => ["delayed", "failed", "quality_rejected"].includes(vo.status)).length;

  const hasActiveFilters = 
    filters.status !== "all" || 
    filters.search || 
    filters.vendor !== "all" || 
    filters.port !== "all" ||
    filters.slaStatus !== "all" || 
    filters.attentionLevel !== "all" ||
    filters.date_from || 
    filters.date_to;

  const handleRefresh = () => {
    setLastUpdated(new Date());
    refetch();
  };

  const handleExport = async () => {
    const csv = [
      ["VO ID", "Status", "Vendor", "Order ID", "Port", "Expected Ready", "SLA Status", "Items Ready", "Total"],
      ...sortedOrders.map(vo => [
        vo.vendor_order_id,
        vo.status,
        vo.vendor_name || "",
        vo.order_id || "",
        vo.port || "",
        vo.expected_ready_date || "",
        vo.slaStatus || "",
        `${vo.items?.reduce((sum, i) => sum + (i.quantity_ready || 0), 0)}/${vo.items?.reduce((sum, i) => sum + (i.quantity_ordered || 0), 0)}`,
        vo.subtotal || 0
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader 
        title="Vendor Orders" 
        subtitle={isVendor ? "Your orders" : "Vendor accountability & logistics coordination"}
        onRefresh={handleRefresh}
      >
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("table")}
              className={`h-7 px-2 ${viewMode === "table" ? "bg-slate-100" : ""}`}
              title="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("cards")}
              className={`h-7 px-2 ${viewMode === "cards" ? "bg-slate-100" : ""}`}
              title="Cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Create (Admin Only) */}
          {isOpsAdmin && (
            <Button size="sm" className="h-8">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create
            </Button>
          )}

          {/* Export (Admin Only) */}
          {isOpsAdmin && (
            <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Last Updated */}
      <p className="text-xs text-slate-400 mb-2">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-600">Awaiting Ack</p>
          <p className="text-xl font-semibold text-amber-700">{awaitingAckCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Preparing</p>
          <p className="text-xl font-semibold text-slate-900">{preparingCount}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <p className="text-xs text-emerald-600">Ready</p>
          <p className="text-xl font-semibold text-emerald-700">{readyCount}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          <p className="text-xs text-rose-600">Issues</p>
          <p className="text-xl font-semibold text-rose-700">{issuesCount}</p>
        </div>
      </div>

      {/* Quick Tabs */}
      <VendorOrderQuickTabs activeTab={quickTab} onTabChange={setQuickTab} userRole={userRole} />

      {/* Filters */}
      <VendorOrderFilters
        filters={filters}
        onFilterChange={setFilters}
        vendors={vendors}
        ports={ports}
        userRole={userRole}
      />

      {/* List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <VendorOrdersEmptyState hasFilters={hasActiveFilters} quickTab={quickTab} userRole={userRole} />
        ) : viewMode === "cards" ? (
          <>
            <VendorOrdersCards orders={paginatedOrders} userRole={userRole} />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <VendorOrdersTable orders={paginatedOrders} userRole={userRole} />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}