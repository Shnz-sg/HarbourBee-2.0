import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersCards from "../components/orders/OrdersCards";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersEmptyState from "../components/orders/OrdersEmptyState";
import OrdersQuickTabs from "../components/orders/OrdersQuickTabs";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Download, Plus } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table | cards
  const [quickTab, setQuickTab] = useState("all"); // all | active | delivered | cancelled
  const [filters, setFilters] = useState({ 
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
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      // Set default view mode based on role
      if (u.role === "user") {
        setViewMode("cards");
      } else {
        setViewMode("table");
      }
      
      // Redirect vendors to Vendor Orders
      if (u.role === "vendor") {
        navigate(createPageUrl("VendorOrders"));
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

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["orders", lastUpdated],
    queryFn: async () => {
      if (user?.role === "user") {
        // Crew: only their vessel's orders (exclude drafts created by others)
        return base44.entities.Order.filter({
          $or: [
            { created_by: user.email },
            { vessel_id: user.vessel_id, status: { $ne: "draft" } }
          ]
        });
      }
      // Ops/Admin: all orders
      return base44.entities.Order.list("-updated_date", 500);
    },
    enabled: !!user
  });

  const { data: vessels = [] } = useQuery({
    queryKey: ["vessels-filter"],
    queryFn: () => base44.entities.Vessel.list("name", 100),
    enabled: !!user && ["ops_staff", "ops_admin", "super_admin"].includes(user?.role)
  });

  const { data: pools = [] } = useQuery({
    queryKey: ["pools-filter"],
    queryFn: () => base44.entities.Pool.list(),
    enabled: !!user && ["ops_staff", "ops_admin", "super_admin"].includes(user?.role)
  });

  const userRole = user?.role || "user";
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = ["ops_admin", "admin"].includes(userRole);
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = isOpsAdmin || isSuperAdmin;

  // Quick tab filter
  const getQuickTabFilter = () => {
    if (quickTab === "active") {
      return ["submitted", "confirmed", "pooled", "in_delivery"];
    } else if (quickTab === "delivered") {
      return ["delivered"];
    } else if (quickTab === "cancelled") {
      return ["cancelled"];
    }
    return null; // all
  };

  // Apply filters
  const filtered = orders.filter(o => {
    // Quick tab filter
    const quickTabStatuses = getQuickTabFilter();
    if (quickTabStatuses && !quickTabStatuses.includes(o.status)) return false;

    const matchesStatus = filters.status === "all" || o.status === filters.status;
    const matchesVessel = filters.vessel === "all" || o.vessel_name === filters.vessel;
    const matchesPort = filters.port === "all" || o.port === filters.port;
    const matchesPayment = filters.payment_status === "all" || o.payment_status === filters.payment_status;
    const matchesPriority = filters.priority === "all" || o.priority === filters.priority;
    const matchesPool = filters.pool === "all" || 
      (filters.pool === "pooled" && o.pool_id) || 
      (filters.pool === "individual" && !o.pool_id);
    const matchesDelivery = filters.delivery_state === "all" || o.delivery_id;
    
    const matchesSearch = !filters.search || 
      o.order_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
      o.vessel_name?.toLowerCase().includes(filters.search.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.date_from) {
      matchesDateRange = matchesDateRange && new Date(o.created_date) >= new Date(filters.date_from);
    }
    if (filters.date_to) {
      matchesDateRange = matchesDateRange && new Date(o.created_date) <= new Date(filters.date_to);
    }
    
    return matchesStatus && matchesVessel && matchesPort && matchesPayment && 
           matchesPriority && matchesPool && matchesDelivery && matchesSearch && matchesDateRange;
  });

  // Role-based sorting
  const getSortedOrders = () => {
    const sorted = [...filtered];
    
    if (userRole === "user") {
      // Crew: Newest first
      return sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (isOpsStaff) {
      // Ops Staff: Risk priority → ETA → Newest
      const priorityWeight = { critical: 3, urgent: 2, normal: 1 };
      return sorted.sort((a, b) => {
        const priorityDiff = (priorityWeight[b.priority || "normal"] || 1) - (priorityWeight[a.priority || "normal"] || 1);
        if (priorityDiff !== 0) return priorityDiff;
        
        // ETA sort (soonest first)
        if (a.eta && b.eta) {
          const etaDiff = new Date(a.eta) - new Date(b.eta);
          if (etaDiff !== 0) return etaDiff;
        }
        
        return new Date(b.created_date) - new Date(a.created_date);
      });
    } else if (isOpsAdmin || isSuperAdmin) {
      // Admin: Status cluster → Last Updated
      const statusOrder = {
        disputed: 0,
        in_delivery: 1,
        pooled: 2,
        confirmed: 3,
        submitted: 4,
        delivered: 5,
        cancelled: 6,
        draft: 7
      };
      return sorted.sort((a, b) => {
        const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date);
      });
    }
    
    return sorted;
  };

  const sortedOrders = getSortedOrders();
  
  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getSubtitle = () => {
    if (userRole === "user") return "My Vessel's Orders";
    if (isOpsStaff) return "Operations View";
    return "All Orders";
  };

  const vesselNames = [...new Set(vessels.map(v => v.name).filter(Boolean))];
  const ports = [...new Set(orders.map(o => o.port).filter(Boolean))];
  const poolIds = [...new Set(pools.map(p => p.pool_id).filter(Boolean))];
  
  const hasActiveFilters = filters.status !== "all" || filters.vessel !== "all" || filters.port !== "all" || 
    filters.payment_status !== "all" || filters.priority !== "all" || filters.pool !== "all" || 
    filters.delivery_state !== "all" || filters.date_from || filters.date_to || filters.search;

  const handleRefresh = () => {
    setLastUpdated(new Date());
    refetch();
  };

  const handleExport = async () => {
    // Export filtered orders to CSV
    const csv = [
      ["Order ID", "Status", "Vessel", "Port", "ETA", "Items", "Total", "Priority", "Payment", "Created", "Updated"],
      ...sortedOrders.map(o => [
        o.order_id,
        o.status,
        o.vessel_name || "",
        o.port || "",
        o.eta || "",
        o.items?.length || 0,
        o.total_amount || 0,
        o.priority || "normal",
        o.payment_status || "",
        o.created_date,
        o.updated_date || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Orders" subtitle={getSubtitle()} onRefresh={handleRefresh}>
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

          {/* Create Order Button */}
          <Button asChild size="sm" className="h-8">
            <a href={createPageUrl("Products")}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Order
            </a>
          </Button>

          {/* Export (Admin Only) */}
          {isAdmin && (
            <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Last Updated (Ops/Admin only) */}
      {(isOpsStaff || isAdmin) && (
        <p className="text-xs text-slate-400 mb-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Quick Tabs */}
      <OrdersQuickTabs activeTab={quickTab} onTabChange={setQuickTab} userRole={userRole} />

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFilterChange={setFilters}
        vessels={vesselNames}
        ports={ports}
        poolIds={poolIds}
        userRole={userRole}
      />

      {/* Orders List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <OrdersEmptyState userRole={userRole} hasFilters={hasActiveFilters} quickTab={quickTab} />
        ) : viewMode === "cards" ? (
          <>
            <OrdersCards orders={paginatedOrders} userRole={userRole} />
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
            <OrdersTable orders={paginatedOrders} userRole={userRole} />
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