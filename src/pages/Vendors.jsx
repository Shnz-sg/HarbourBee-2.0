import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import VendorsList from "../components/vendors/VendorsList";
import VendorFilters from "../components/vendors/VendorFilters";
import VendorsEmptyState from "../components/vendors/VendorsEmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Vendors() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "active",
    category: "all",
    port: "all",
    complianceStatus: "all",
    rating: "all"
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: vendors = [], isLoading, refetch } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => base44.entities.Vendor.list('-updated_date', 500),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);
  const isFinanceOrSuperAdmin = ["finance", "super_admin"].includes(userRole);

  // Role-based visibility
  const visibleVendors = vendors.filter(v => {
    if (userRole === "user") return false; // Crew has zero access
    return true;
  });

  // Apply filters
  const filteredVendors = visibleVendors.filter(v => {
    const matchesSearch = !filters.search || 
      v.legal_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.trading_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      v.vendor_id?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === "all" || v.status === filters.status;
    
    const matchesCategory = filters.category === "all" || 
      v.categories?.includes(filters.category);
    
    const matchesPort = filters.port === "all" || 
      v.primary_port === filters.port || 
      v.port_coverage?.includes(filters.port);
    
    const matchesCompliance = filters.complianceStatus === "all" || 
      v.compliance_status === filters.complianceStatus;
    
    const matchesRating = filters.rating === "all" || 
      (filters.rating === "high" && v.rating >= 4) ||
      (filters.rating === "medium" && v.rating >= 2.5 && v.rating < 4) ||
      (filters.rating === "low" && v.rating < 2.5);

    return matchesSearch && matchesStatus && matchesCategory && 
           matchesPort && matchesCompliance && matchesRating;
  });

  // Sort: Active first, then by rating, then by name
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
    return (a.legal_name || "").localeCompare(b.legal_name || "");
  });

  // Pagination
  const totalPages = Math.ceil(sortedVendors.length / itemsPerPage);
  const paginatedVendors = sortedVendors.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const hasActiveFilters = 
    filters.search || 
    filters.status !== "active" || 
    filters.category !== "all" ||
    filters.port !== "all" ||
    filters.complianceStatus !== "all" ||
    filters.rating !== "all";

  const handleExport = () => {
    const csv = [
      ["Vendor ID", "Legal Name", "Status", "Port", "Rating", "Orders Completed", "SLA Breaches", "Compliance"],
      ...sortedVendors.map(v => [
        v.vendor_id,
        v.legal_name,
        v.status,
        v.primary_port || "",
        v.rating || "—",
        v.total_orders_completed || 0,
        v.sla_breach_count || 0,
        v.compliance_status || "—"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user || userRole === "user") {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Access restricted to operations and admin users.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Vendors" 
        subtitle="Vendor governance and performance management"
        onRefresh={refetch}
      >
        <div className="flex items-center gap-2">
          {["ops_admin", "super_admin"].includes(userRole) && (
            <>
              <Button size="sm" className="h-8">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Vendor
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <VendorFilters
        filters={filters}
        onFilterChange={setFilters}
        vendors={vendors}
        userRole={userRole}
      />

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sortedVendors.length === 0 ? (
          <VendorsEmptyState hasFilters={hasActiveFilters} userRole={userRole} />
        ) : (
          <>
            <VendorsList 
              vendors={paginatedVendors} 
              userRole={userRole}
              isFinanceOrSuperAdmin={isFinanceOrSuperAdmin}
            />
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