import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronRight } from "lucide-react";

export default function Categories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const cats = await base44.entities.Category.filter(
        { status: "active" },
        "sort_order",
        100
      );
      return cats;
    },
  });

  return (
    <div className="min-h-screen bg-[#F5EBDD]">
      {/* Header Section */}
      <div className="bg-[#150C0C] text-[#F5EBDD] py-16">
        <div className="max-w-[1600px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-[#F5EBDD]/80 max-w-2xl">
            Browse essential vessel supplies by operational area.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-4xl font-bold">
                        {category.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#150C0C] mb-2 group-hover:text-[#D39858] transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-[#D39858] font-medium">
                    Browse <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}