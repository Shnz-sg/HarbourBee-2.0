import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const mockProducts = [
  { name: "Heavy-duty rope set", price: 89, image: "🪢" },
  { name: "Emergency flares kit", price: 125, image: "🔦" },
  { name: "Marine-grade cleaner", price: 34, image: "🧴" },
  { name: "Crew meal pack (10kg)", price: 156, image: "🍱" },
  { name: "Navigation tools", price: 210, image: "🧭" },
  { name: "Safety equipment set", price: 340, image: "🦺" },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <h2 className="text-[28px] font-bold text-[#150C0C] mb-10">Popular onboard essentials</h2>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {mockProducts.map((product, index) => (
            <Link
              key={index}
              to={createPageUrl("Products")}
              className="flex-shrink-0 w-[240px] group cursor-pointer"
            >
              <div className="bg-slate-100 rounded-xl h-[240px] flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                <span className="text-6xl">{product.image}</span>
              </div>
              <h3 className="text-[15px] font-medium text-[#150C0C] mb-2">{product.name}</h3>
              <p className="text-[16px] font-semibold text-[#150C0C]">${product.price}</p>
              <button className="mt-3 w-full h-[40px] bg-[#D39858] text-[#150C0C] rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Add to cart
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}