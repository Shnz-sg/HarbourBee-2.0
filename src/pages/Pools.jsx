import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import PoolsTable from "../components/pools/PoolsTable";
import PoolsCards from "../components/pools/PoolsCards";
import PoolFilters from "../components/pools/PoolFilters";
import PoolsEmptyState from "../components/pools/PoolsEmptyState";
import PoolsQuickTabs from "../components/pools/PoolsQuickTabs";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Plus, Download } from "lucide-react";
import { differenceInHours, isPast } from "date-fns";

export default function Pools() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [quickTab, setQuickTab] = useState("active");
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    port: "all",
    attentionLevel: "all",
    lockStatus: "all",
    deliveryAssigned: "all",
    date_from: "",
    date_to: ""
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Redirect crew to Dashboard (they don't see Pools page)
      if (u.role === "user") {
        navigate(createPageUrl("Dashboard"));
      }
    }).catch(() => {});
  }, [navigate]);

  // Auto-refresh for ops/admin (60s)
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

  const { data: pools = [], isLoading, refetch } = useQuery({
    queryKey: ['pools', lastUpdated],
    queryFn: () => base44.entities.Pool.list('-updated_date', 200),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  // Attention level logic
  const getAttentionLevel = (pool) => {
    if (!pool.target_date) return "healthy";
    
    const hoursDiff = differenceInHours(new Date(pool.target_date), new Date());
    const isPastTarget = isPast(new Date(pool.target_date));
    
    // Critical conditions
    if (pool.status === "cancelled") return "critical";
    if (pool.status === "open" && isPastTarget) return "critical";
    if (pool.status === "locked" && !pool.delivery_id) return "critical";
    
    // Warning conditions
    if (pool.status === "open" && hoursDiff <= 24 && hoursDiff > 0) return "warning";
    
    return "healthy";
  };

  // Quick tab filter
  const getQuickTabFilter = () => {
    if (quickTab === "active") {
      return ["open", "locked"];
    } else if (quickTab === "in_delivery") {
      return ["in_delivery"];
    } else if (quickTab === "completed") {
      return ["delivered"];
    } else if (quickTab === "cancelled") {
      return ["cancelled"];
    }
    return null;
  };

  // Filter pools
  const filteredPools = pools
    .map(pool => ({ ...pool, attentionLevel: getAttentionLevel(pool) }))
    .filter(pool => {
      // Quick tab filter
      const quickTabStatuses = getQuickTabFilter();
      if (quickTabStatuses && !quickTabStatuses.includes(pool.status)) return false;

      const matchesStatus = filters.status === "all" || pool.status === filters.status;
      const matchesSearch = !filters.search ||
        pool.pool_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        pool.port?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPort = filters.port === "all" || pool.port === filters.port;
      const matchesAttention = filters.attentionLevel === "all" || pool.attentionLevel === filters.attentionLevel;
      const matchesLockStatus = filters.lockStatus === "all" || pool.status === filters.lockStatus;
      const matchesDelivery = filters.deliveryAssigned === "all" ||
        (filters.deliveryAssigned === "assigned" && pool.delivery_id) ||
        (filters.deliveryAssigned === "unassigned" && !pool.delivery_id);

      // Date range filter
      let matchesDateRange = true;
      if (filters.date_from) {
        matchesDateRange = matchesDateRange && new Date(pool.target_date) >= new Date(filters.date_from);
      }
      if (filters.date_to) {
        matchesDateRange = matchesDateRange && new Date(pool.target_date) <= new Date(filters.date_to);
      }

      return matchesStatus && matchesSearch && matchesPort && matchesAttention && 
             matchesLockStatus && matchesDelivery && matchesDateRange;
    });

  // Sort pools
  const getSortedPools = () => {
    const sorted = [...filteredPools];
    const attentionOrder = { critical: 0, warning: 1, healthy: 2 };

    if (isOpsStaff) {
      // Ops Staff: Critical Attention → Target Date (ascending)
      return sorted.sort((a, b) => {
        const attentionDiff = attentionOrder[a.attentionLevel] - attentionOrder[b.attentionLevel];
        if (attentionDiff !== 0) return attentionDiff;
        if (a.target_date && b.target_date) {
          return new Date(a.target_date) - new Date(b.target_date);
        }
        return 0;
      });
    } else if (isOpsAdmin) {
      // Admin: Status cluster (open → locked → in_delivery) → Target Date
      const statusOrder = { open: 0, locked: 1, in_delivery: 2, delivered: 3, cancelled: 4 };
      return sorted.sort((a, b) => {
        const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        if (statusDiff !== 0) return statusDiff;
        if (a.target_date && b.target_date) {
          return new Date(a.target_date) - new Date(b.target_date);
        }
        return 0;
      });
    }

    return sorted;
  };

  const sortedPools = getSortedPools();

  // Pagination
  const totalPages = Math.ceil(sortedPools.length / itemsPerPage);
  const paginatedPools = sortedPools.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const ports = [...new Set(pools.map(p => p.port).filter(Boolean))];

  // Summary stats
  const openCount = pools.filter(p => p.status === "open").length;
  const lockedCount = pools.filter(p => p.status === "locked").length;
  const inDeliveryCount = pools.filter(p => p.status === "in_delivery").length;
  const cancelledCount = pools.filter(p => p.status === "cancelled").length;

  const hasActiveFilters = 
    filters.status !== "all" || 
    filters.search || 
    filters.port !== "all" || 
    filters.attentionLevel !== "all" ||
    filters.lockStatus !== "all" || 
    filters.deliveryAssigned !== "all" ||
    filters.date_from || 
    filters.date_to;

  const handleRefresh = () => {
    setLastUpdated(new Date());
    refetch();
  };

  const handleExport = async () => {
    // Export filtered pools to CSV
    const csv = [
      ["Pool ID", "Status", "Port", "Target Date", "Orders", "Total Value", "Delivery Assigned"],
      ...sortedPools.map(p => [
        p.pool_id,
        p.status,
        p.port || "",
        p.target_date || "",
        p.order_count || 0,
        p.total_value || 0,
        p.delivery_id ? "Yes" : "No"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pools-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Pools" subtitle="Operational staging area" onRefresh={handleRefresh}>
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

          {/* Create Pool Button */}
          <Button size="sm" className="h-8">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Pool
          </Button>

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
          <p className="text-xs text-slate-500">Open Pools</p>
          <p className="text-xl font-semibold text-slate-900">{openCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Locked</p>
          <p className="text-xl font-semibold text-slate-900">{lockedCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">In Delivery</p>
          <p className="text-xl font-semibold text-slate-900">{inDeliveryCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-xs text-slate-500">Cancelled</p>
          <p className="text-xl font-semibold text-slate-900">{cancelledCount}</p>
        </div>
      </div>

      {/* Quick Tabs */}
      <PoolsQuickTabs activeTab={quickTab} onTabChange={setQuickTab} />

      {/* Filters */}
      <PoolFilters
        filters={filters}
        onFilterChange={setFilters}
        ports={ports}
        userRole={userRole}
      />

      {/* Pools List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : sortedPools.length === 0 ? (
          <PoolsEmptyState hasFilters={hasActiveFilters} quickTab={quickTab} />
        ) : viewMode === "cards" ? (
          <>
            <PoolsCards pools={paginatedPools} userRole={userRole} />
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
            <PoolsTable pools={paginatedPools} userRole={userRole} />
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