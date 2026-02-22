import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import DeliveriesTable from "../components/deliveries/DeliveriesTable";
import DeliveriesCards from "../components/deliveries/DeliveriesCards";
import DeliveryFilters from "../components/deliveries/DeliveryFilters";
import DeliveriesEmptyState from "../components/deliveries/DeliveriesEmptyState";
import DeliveryQuickTabs from "../components/deliveries/DeliveryQuickTabs";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Plus, Download } from "lucide-react";
import { differenceInMinutes, isPast } from "date-fns";

export default function Deliveries() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [quickTab, setQuickTab] = useState("today");
  const [filters, setFilters] = useState({
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
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Auto-refresh logic
  useEffect(() => {
    if (!user) return;
    const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(user.role);
    const refreshInterval = isOpsOrAdmin ? 30000 : 120000; // 30s for ops, 2min for users
    
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  const { data: deliveries = [], isLoading, refetch } = useQuery({
    queryKey: ['deliveries', lastUpdated],
    queryFn: () => base44.entities.Delivery.list('-updated_date', 200),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);
  const isNormalUser = userRole === "user";

  // Compute attention level
  const getAttentionLevel = (delivery) => {
    if (!delivery.sla_target_time) return "healthy";
    
    const minutesDiff = differenceInMinutes(new Date(delivery.sla_target_time), new Date());
    const isPastSLA = isPast(new Date(delivery.sla_target_time));

    // Critical
    if (delivery.status === "failed") return "critical";
    if (delivery.status === "delayed") return "critical";
    if (["dispatched", "in_transit", "at_anchorage"].includes(delivery.status) && isPastSLA) return "critical";
    if (delivery.exception_flag_count > 0) return "critical";

    // Warning
    if (["dispatched", "in_transit"].includes(delivery.status) && minutesDiff <= 60 && minutesDiff > 0) return "warning";
    if (delivery.status === "scheduled" && minutesDiff <= 120 && minutesDiff > 0) return "warning";

    return "healthy";
  };

  // Quick tab filter
  const getQuickTabFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (quickTab === "today") {
      return (d) => {
        const scheduledDate = new Date(d.scheduled_date);
        return scheduledDate >= today && scheduledDate < tomorrow;
      };
    } else if (quickTab === "active") {
      return (d) => ["scheduled", "preparing", "dispatched", "in_transit", "at_anchorage"].includes(d.status);
    } else if (quickTab === "completed") {
      return (d) => d.status === "delivered";
    } else if (quickTab === "issues") {
      return (d) => ["delayed", "failed"].includes(d.status);
    }
    return () => true;
  };

  // Filter deliveries
  const filteredDeliveries = deliveries
    .map(d => ({ ...d, attentionLevel: getAttentionLevel(d) }))
    .filter(delivery => {
      // Quick tab filter
      const quickFilter = getQuickTabFilter();
      if (!quickFilter(delivery)) return false;

      const matchesStatus = filters.status === "all" || delivery.status === filters.status;
      const matchesSearch = !filters.search ||
        delivery.delivery_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.vessel_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.anchorage?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesVessel = filters.vessel === "all" || delivery.vessel_name === filters.vessel;
      const matchesAnchorage = filters.anchorage === "all" || delivery.anchorage === filters.anchorage;
      const matchesVendor = filters.vendor === "all" || delivery.vendor_name === filters.vendor;
      const matchesAttention = filters.attentionLevel === "all" || delivery.attentionLevel === filters.attentionLevel;
      
      // SLA status filter
      let matchesSLA = true;
      if (filters.slaStatus !== "all" && delivery.sla_target_time) {
        const isPastSLA = isPast(new Date(delivery.sla_target_time));
        if (filters.slaStatus === "breach" && !isPastSLA) matchesSLA = false;
        if (filters.slaStatus === "on_track" && isPastSLA) matchesSLA = false;
      }

      // Date range filter
      let matchesDateRange = true;
      if (filters.date_from) {
        matchesDateRange = matchesDateRange && new Date(delivery.scheduled_date) >= new Date(filters.date_from);
      }
      if (filters.date_to) {
        matchesDateRange = matchesDateRange && new Date(delivery.scheduled_date) <= new Date(filters.date_to);
      }

      return matchesStatus && matchesSearch && matchesVessel && matchesAnchorage && 
             matchesVendor && matchesAttention && matchesSLA && matchesDateRange;
    });

  // Sort deliveries
  const getSortedDeliveries = () => {
    const sorted = [...filteredDeliveries];
    const attentionOrder = { critical: 0, warning: 1, healthy: 2 };

    if (isOpsStaff) {
      // Ops Staff: Critical Attention → SLA Target Time
      return sorted.sort((a, b) => {
        const attentionDiff = attentionOrder[a.attentionLevel] - attentionOrder[b.attentionLevel];
        if (attentionDiff !== 0) return attentionDiff;
        if (a.sla_target_time && b.sla_target_time) {
          return new Date(a.sla_target_time) - new Date(b.sla_target_time);
        }
        return 0;
      });
    } else if (isOpsAdmin) {
      // Admin: Status cluster (active first) → SLA
      const statusOrder = { 
        dispatched: 0, in_transit: 1, at_anchorage: 2, 
        preparing: 3, scheduled: 4, delayed: 5, delivered: 6, failed: 7, cancelled: 8 
      };
      return sorted.sort((a, b) => {
        const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        if (statusDiff !== 0) return statusDiff;
        if (a.sla_target_time && b.sla_target_time) {
          return new Date(a.sla_target_time) - new Date(b.sla_target_time);
        }
        return 0;
      });
    } else {
      // Normal User: Scheduled date ascending
      return sorted.sort((a, b) => {
        if (a.scheduled_date && b.scheduled_date) {
          return new Date(a.scheduled_date) - new Date(b.scheduled_date);
        }
        return 0;
      });
    }
  };

  const sortedDeliveries = getSortedDeliveries();

  // Pagination
  const totalPages = Math.ceil(sortedDeliveries.length / itemsPerPage);
  const paginatedDeliveries = sortedDeliveries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const vessels = [...new Set(deliveries.map(d => d.vessel_name).filter(Boolean))];
  const anchorages = [...new Set(deliveries.map(d => d.anchorage).filter(Boolean))];
  const vendors = [...new Set(deliveries.map(d => d.vendor_name).filter(Boolean))];

  // Summary stats
  const todayCount = deliveries.filter(d => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduledDate = new Date(d.scheduled_date);
    return scheduledDate >= today && scheduledDate < tomorrow;
  }).length;

  const activeCount = deliveries.filter(d => 
    ["scheduled", "preparing", "dispatched", "in_transit", "at_anchorage"].includes(d.status)
  ).length;

  const completedCount = deliveries.filter(d => d.status === "delivered").length;
  const issuesCount = deliveries.filter(d => ["delayed", "failed"].includes(d.status)).length;

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

  const handleRefresh = () => {
    setLastUpdated(new Date());
    refetch();
  };

  const handleExport = async () => {
    const csv = [
      ["Delivery ID", "Status", "Vessel", "Anchorage", "Scheduled", "SLA Target", "Vendor", "Method", "Fee"],
      ...sortedDeliveries.map(d => [
        d.delivery_id,
        d.status,
        d.vessel_name || "",
        d.anchorage || "",
        d.scheduled_date || "",
        d.sla_target_time || "",
        d.vendor_name || "",
        d.delivery_method || "",
        d.delivery_fee || 0
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deliveries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Deliveries" subtitle="Logistics execution layer" onRefresh={handleRefresh}>
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

          {/* Create Delivery (Admin Only) */}
          {isOpsAdmin && (
            <Button size="sm" className="h-8">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Delivery
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
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Today</p>
          <p className="text-xl font-semibold text-slate-900">{todayCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Active</p>
          <p className="text-xl font-semibold text-slate-900">{activeCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-xl font-semibold text-slate-900">{completedCount}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          <p className="text-xs text-rose-600">Issues</p>
          <p className="text-xl font-semibold text-rose-700">{issuesCount}</p>
        </div>
      </div>

      {/* Quick Tabs */}
      <DeliveryQuickTabs activeTab={quickTab} onTabChange={setQuickTab} />

      {/* Filters */}
      <DeliveryFilters
        filters={filters}
        onFilterChange={setFilters}
        vessels={vessels}
        anchorages={anchorages}
        vendors={vendors}
        userRole={userRole}
      />

      {/* Deliveries List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : sortedDeliveries.length === 0 ? (
          <DeliveriesEmptyState hasFilters={hasActiveFilters} quickTab={quickTab} />
        ) : viewMode === "cards" ? (
          <>
            <DeliveriesCards deliveries={paginatedDeliveries} userRole={userRole} />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <DeliveriesTable deliveries={paginatedDeliveries} userRole={userRole} />
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
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