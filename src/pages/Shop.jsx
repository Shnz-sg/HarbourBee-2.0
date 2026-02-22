import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import ShopControlsBar from "@/components/shop/ShopControlsBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";

const PRODUCTS_PER_PAGE = 24;

export default function Shop() {
  const [filters, setFilters] = useState({
    categories: [],
    availability: [],
    priceRange: [0, 1000],
    delivery: []
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products", filters, sortBy, debouncedSearch, page],
    queryFn: async () => {
      // Build filter query
      const query = { status: "active" };

      // Category filter
      if (filters.categories.length > 0) {
        query.category_name = { $in: filters.categories };
      }

      // Availability filter
      if (filters.availability.length > 0) {
        query.availability_status = { $in: filters.availability };
      }

      // Price range filter
      if (filters.priceRange) {
        query.unit_price = {
          $gte: filters.priceRange[0],
          $lte: filters.priceRange[1]
        };
      }

      // Search filter
      if (debouncedSearch) {
        query.$or = [
          { name: { $regex: debouncedSearch, $options: "i" } },
          { category_name: { $regex: debouncedSearch, $options: "i" } },
          { tags: { $in: [new RegExp(debouncedSearch, "i")] } }
        ];
      }

      // Determine sort
      let sortField = "-created_date"; // Default newest
      switch (sortBy) {
        case "price_asc":
          sortField = "unit_price";
          break;
        case "price_desc":
          sortField = "-unit_price";
          break;
        case "newest":
          sortField = "-created_date";
          break;
        case "relevance":
        default:
          sortField = debouncedSearch ? undefined : "-created_date";
          break;
      }

      // Fetch with pagination
      const limit = PRODUCTS_PER_PAGE;
      const skip = (page - 1) * limit;

      const fetchedProducts = await base44.entities.Product.filter(
        query,
        sortField,
        limit + 1, // Fetch one extra to check if there are more
        skip
      );

      return fetchedProducts;
    },
  });

  // Update accumulated products when new data arrives
  useEffect(() => {
    if (products.length > 0) {
      if (page === 1) {
        setAllProducts(products.slice(0, PRODUCTS_PER_PAGE));
      } else {
        setAllProducts(prev => [...prev, ...products.slice(0, PRODUCTS_PER_PAGE)]);
      }
    } else if (page === 1) {
      setAllProducts([]);
    }
  }, [products, page]);

  const hasMore = products.length > PRODUCTS_PER_PAGE;
  const displayedProducts = allProducts;

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      availability: [],
      priceRange: [0, 1000],
      delivery: []
    });
    setSearchQuery("");
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <ShopControlsBar
        productCount={displayedProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setMobileFiltersOpen(true)}
                variant="outline"
                className="w-full border-[#150C0C]/30 text-[#150C0C] hover:bg-[#150C0C] hover:text-[#F5EBDD]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(filters.categories.length + filters.availability.length + filters.delivery.length) > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[#D39858] text-[#150C0C] text-xs rounded-full font-semibold">
                    {filters.categories.length + filters.availability.length + filters.delivery.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={displayedProducts}
              loading={isLoading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
          isMobile
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </>
  );
}