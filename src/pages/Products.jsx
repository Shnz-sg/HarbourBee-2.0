import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import ProductsGrid from "../components/products/ProductsGrid";
import ProductsList from "../components/products/ProductsList";
import ProductFilters from "../components/products/ProductFilters";
import ProductsEmptyState from "../components/products/ProductsEmptyState";
import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid, Plus, Download } from "lucide-react";

export default function Products() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    vendor: "all",
    availability: "all",
    status: "active",
    poolEligible: "all",
    handlingFlags: []
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-updated_date', 500),
    enabled: !!user
  });

  const { data: offers = [], isLoading: loadingOffers } = useQuery({
    queryKey: ['vendorOffers'],
    queryFn: () => base44.entities.VendorOffer.list('-updated_date', 1000),
    enabled: !!user
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ status: 'active' }, 'sort_order', 100),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isVendor = userRole === "vendor";
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);
  const isCrew = userRole === "user";

  // Filter products based on role
  const visibleProducts = products.filter(p => {
    if (isCrew) {
      return p.status === "active";
    }
    return true;
  });

  // Compute best offer for each product and attach category name
  const productsWithOffers = visibleProducts.map(product => {
    const productOffers = offers.filter(o => 
      o.product_id === product.id && 
      o.is_active && 
      !o.suspended_by_ops &&
      o.availability_status !== "discontinued"
    );

    const bestOffer = productOffers.length > 0 
      ? productOffers.reduce((best, current) => 
          current.unit_price < best.unit_price ? current : best
        )
      : null;

    const availableOffers = productOffers.filter(o => o.availability_status === "in_stock");
    const hasStock = availableOffers.length > 0;

    const category = categories.find(c => c.id === product.category_id);

    return {
      ...product,
      category_name: category?.name || "Uncategorized",
      offers: productOffers,
      bestOffer,
      hasStock,
      priceFrom: bestOffer?.unit_price,
      availabilityStatus: hasStock ? "in_stock" : 
        productOffers.some(o => o.availability_status === "temp_unavailable") ? "temp_unavailable" : 
        "out_of_stock"
    };
  });

  // Apply filters
  const filteredProducts = productsWithOffers.filter(p => {
    const matchesSearch = !filters.search || 
      p.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.product_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesCategory = filters.category === "all" || p.category_id === filters.category;
    
    const matchesVendor = filters.vendor === "all" || 
      p.offers?.some(o => o.vendor_id === filters.vendor);
    
    const matchesAvailability = filters.availability === "all" || 
      (filters.availability === "in_stock" && p.hasStock) ||
      (filters.availability === "out_of_stock" && !p.hasStock);
    
    const matchesStatus = filters.status === "all" || p.status === filters.status;
    
    const matchesPoolEligible = filters.poolEligible === "all" || 
      (filters.poolEligible === "yes" && p.pool_eligible) ||
      (filters.poolEligible === "no" && !p.pool_eligible);
    
    const matchesHandlingFlags = filters.handlingFlags.length === 0 || 
      filters.handlingFlags.some(flag => p.handling_flags?.includes(flag));

    return matchesSearch && matchesCategory && matchesVendor && 
           matchesAvailability && matchesStatus && matchesPoolEligible && matchesHandlingFlags;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Prioritize in-stock items for crew
    if (isCrew) {
      if (a.hasStock && !b.hasStock) return -1;
      if (!a.hasStock && b.hasStock) return 1;
    }
    // Then by name
    return (a.name || "").localeCompare(b.name || "");
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const vendors = [...new Set(offers.map(o => ({ id: o.vendor_id, name: o.vendor_name })))];

  const hasActiveFilters = 
    filters.search || 
    filters.category !== "all" || 
    filters.vendor !== "all" ||
    filters.availability !== "all" || 
    filters.status !== "active" ||
    filters.poolEligible !== "all" ||
    filters.handlingFlags.length > 0;

  const handleExport = () => {
    const csv = [
      ["Product ID", "Name", "Category", "Status", "Pool Eligible", "Best Price", "Offers Count", "In Stock"],
      ...sortedProducts.map(p => [
        p.product_id,
        p.name,
        p.category_name || "",
        p.status,
        p.pool_eligible ? "Yes" : "No",
        p.priceFrom ? `$${p.priceFrom}` : "—",
        p.offers?.length || 0,
        p.hasStock ? "Yes" : "No"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  const isLoading = loadingProducts || loadingOffers;

  return (
    <div>
      <PageHeader 
        title="Products" 
        subtitle={isCrew ? "Browse and order marine supplies" : "Product catalog management"}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`h-7 px-2 ${viewMode === "grid" ? "bg-slate-100" : ""}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`h-7 px-2 ${viewMode === "list" ? "bg-slate-100" : ""}`}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </Button>
          </div>

          {isOpsOrAdmin && (
            <>
              <Button size="sm" className="h-8">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Product
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        vendors={vendors}
        userRole={userRole}
      />

      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <ProductsEmptyState hasFilters={hasActiveFilters} userRole={userRole} />
        ) : viewMode === "grid" ? (
          <>
            <ProductsGrid products={paginatedProducts} userRole={userRole} />
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
            <ProductsList products={paginatedProducts} userRole={userRole} />
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