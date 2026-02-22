import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PageHeader from "../components/shared/PageHeader";
import ExceptionPriorityBand from "../components/exceptions/ExceptionPriorityBand";
import ExceptionFilters from "../components/exceptions/ExceptionFilters";
import ExceptionsEmptyState from "../components/exceptions/ExceptionsEmptyState";
import SkeletonRows from "../components/shared/SkeletonRows";
import { Button } from "@/components/ui/button";
import { Download, Grid, List } from "lucide-react";

export default function Exceptions() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState({
    severity: "all",
    status: "all",
    type: "all",
    assignee: "all",
    objectType: "all",
    objectId: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Set default filters based on role
      if (u.role === "ops_staff") {
        // Ops Staff: Critical + High, Open + Acknowledged
        setFilters(prev => ({ ...prev, status: "open" }));
      } else if (u.role === "ops_admin" || u.role === "admin") {
        // Ops Admin: All open, include in progress
        setFilters(prev => ({ ...prev, status: "open" }));
      } else if (u.role === "finance") {
        // Finance: Financial exceptions only
        setFilters(prev => ({ ...prev, type: "finance", status: "open" }));
      }
    }).catch(() => {});
  }, []);

  // Build server-side query filter
  const buildQueryFilter = () => {
    const filter = {};
    
    // Vessel-aware security: filter by vessel IMO for crew/ops staff
    if ((user?.role === "crew" || user?.role === "ops_staff") && user?.vessel_imo) {
      filter.vessel_imo = user.vessel_imo;
    }
    
    // Vendor-specific filtering
    if (user?.role?.includes("vendor") && user?.vendor_id) {
      filter.vendor_id = user.vendor_id;
    }
    
    // Severity filter
    if (filters.severity !== "all") {
      filter.severity = filters.severity;
    }
    
    // Status filter
    if (filters.status !== "all") {
      filter.status = filters.status;
    }
    
    // Object type filter
    if (filters.type !== "all") {
      filter.object_type = filters.type;
    }
    
    // Contextual object filtering
    if (filters.objectType !== "all" && filters.objectType) {
      filter.object_type = filters.objectType;
    }
    if (filters.objectId) {
      filter.object_id = filters.objectId;
    }
    
    // Assignee filter
    if (filters.assignee === "unassigned") {
      filter.assigned_to = null;
    } else if (filters.assignee === "me" && user?.email) {
      filter.assigned_to = user.email;
    }
    
    // Date range filtering (detected_at)
    // Note: Base44 SDK doesn't support date range queries directly yet
    // This will be applied client-side as fallback until backend supports it
    
    return filter;
  };

  const { data: exceptions = [], isLoading, refetch } = useQuery({
    queryKey: ["exceptions", filters, user?.id],
    queryFn: async () => {
      const filter = buildQueryFilter();
      
      // Server-side sorting based on role
      let sortField = "-detected_at"; // Default: newest first
      
      if (user?.role === "ops_staff") {
        // Ops staff: priority DESC, detected_at DESC
        sortField = "-severity";
      } else if (user?.role === "ops_admin" || user?.role === "admin") {
        // Ops admin: priority DESC, age DESC (oldest open items first)
        sortField = "-severity";
      }
      
      const results = await base44.entities.Exception.filter(
        filter,
        sortField,
        100
      );
      
      // Apply client-side date filtering if needed
      let filtered = results;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter(e => new Date(e.detected_at || e.created_date) >= fromDate);
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter(e => new Date(e.detected_at || e.created_date) <= toDate);
      }
      
      // Secondary sort: open items first, then by age
      return filtered.sort((a, b) => {
        // Priority by severity
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aSev = severityOrder[a.severity] || 0;
        const bSev = severityOrder[b.severity] || 0;
        if (aSev !== bSev) return bSev - aSev;
        
        // Open items first
        if (a.status === "open" && b.status !== "open") return -1;
        if (a.status !== "open" && b.status === "open") return 1;
        
        // Then by age (oldest first for open items)
        return new Date(a.detected_at || a.created_date) - new Date(b.detected_at || b.created_date);
      });
    },
    enabled: !!user,
  });

  const userRole = user?.role || "user";
  const isOpsAdmin = ["admin", "super_admin", "ops_admin"].includes(userRole);

  const getSubtitle = () => {
    if (userRole === "ops_staff") return "🔴 Red = Money or Vessel Risk • 🟠 Orange = Operational Risk • 🟡 Yellow = Process Risk";
    if (isOpsAdmin) return "Platform integrity validator and operational control";
    if (userRole === "super_admin") return "Ship's alarm panel - real-time system integrity";
    if (userRole === "finance") return "Financial exceptions and reconciliation issues";
    return "System exceptions overview";
  };

  // Group by severity (already server-filtered and sorted)
  const groupedExceptions = {
    critical: exceptions.filter(e => e.severity === "critical"),
    high: exceptions.filter(e => e.severity === "high"),
    medium: exceptions.filter(e => e.severity === "medium"),
    low: exceptions.filter(e => e.severity === "low")
  };

  const handleExceptionClick = (exception) => {
    // Navigate to exception detail page
    navigate(createPageUrl(`ExceptionDetail?id=${exception.exception_id}`));
  };

  const handleExport = () => {
    window.alert("Export exceptions data - would trigger download");
  };

  const hasActiveFilters = filters.severity !== "all" || filters.status !== "all" || filters.type !== "all" || 
    filters.assignee !== "all" || filters.objectType !== "all" || filters.objectId || filters.dateFrom || filters.dateTo;
  const lastUpdated = new Date().toLocaleString("en-US", { 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  return (
    <div>
      <PageHeader title="Exceptions" subtitle={getSubtitle()}>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-2 rounded-r-none border-r border-slate-200"
            >
              <List className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("compact")}
              className="h-7 px-2 rounded-l-none"
            >
              <Grid className="w-3.5 h-3.5" />
            </Button>
          </div>

          {isOpsAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="h-7 text-xs"
            >
              <Download className="w-3 h-3 mr-1.5" />
              Export
            </Button>
          )}
        </div>
      </PageHeader>

      {isLoading ? (
        <SkeletonRows rows={6} cols={4} />
      ) : (
        <>
          <ExceptionFilters 
            filters={filters} 
            onFilterChange={setFilters}
            showAdvanced={isOpsAdmin}
          />

          {exceptions.length === 0 ? (
            <ExceptionsEmptyState hasFilters={hasActiveFilters} />
          ) : (
            <>
              <div className="space-y-0">
                <ExceptionPriorityBand
                  priority="critical"
                  exceptions={groupedExceptions.critical}
                  defaultExpanded={true}
                  onExceptionClick={handleExceptionClick}
                  viewMode={viewMode}
                />
                <ExceptionPriorityBand
                  priority="high"
                  exceptions={groupedExceptions.high}
                  defaultExpanded={true}
                  onExceptionClick={handleExceptionClick}
                  viewMode={viewMode}
                />
                <ExceptionPriorityBand
                  priority="medium"
                  exceptions={groupedExceptions.medium}
                  defaultExpanded={false}
                  onExceptionClick={handleExceptionClick}
                  viewMode={viewMode}
                />
                <ExceptionPriorityBand
                  priority="low"
                  exceptions={groupedExceptions.low}
                  defaultExpanded={false}
                  onExceptionClick={handleExceptionClick}
                  viewMode={viewMode}
                />
              </div>

              {isOpsAdmin && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400">
                    Last updated {lastUpdated} • Showing {exceptions.length} exceptions
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}