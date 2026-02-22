import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  {
    title: "Provisions",
    subtitle: "Daily crew supplies",
    bgImage: "linear-gradient(rgba(21, 12, 12, 0.3), rgba(21, 12, 12, 0.6)), radial-gradient(circle at 30% 50%, rgba(211, 152, 88, 0.15), transparent)"
  },
  {
    title: "Cabin Essentials",
    subtitle: "Comfort and living needs",
    bgImage: "linear-gradient(rgba(21, 12, 12, 0.3), rgba(21, 12, 12, 0.6)), radial-gradient(circle at 70% 30%, rgba(211, 152, 88, 0.12), transparent)"
  },
  {
    title: "Engine & Deck",
    subtitle: "Operational consumables",
    bgImage: "linear-gradient(rgba(21, 12, 12, 0.3), rgba(21, 12, 12, 0.6)), radial-gradient(circle at 50% 70%, rgba(211, 152, 88, 0.1), transparent)"
  },
  {
    title: "Safety & Consumables",
    subtitle: "Compliance and protection",
    bgImage: "linear-gradient(rgba(21, 12, 12, 0.3), rgba(21, 12, 12, 0.6)), radial-gradient(circle at 40% 60%, rgba(211, 152, 88, 0.13), transparent)"
  }
];

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-[#EACEAA] pt-24 pb-24">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <h2 className="text-[32px] font-bold text-[#150C0C] mb-12">Shop onboard essentials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={createPageUrl("Products")}
              className="relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer"
              style={{ background: cat.bgImage }}
            >
              <div className="absolute inset-0 bg-[#150C0C]/40 group-hover:bg-[#150C0C]/50 transition-colors"></div>
              
              <div className="absolute bottom-8 left-8">
                <h3 className="text-[28px] font-bold text-[#EACEAA] mb-2">{cat.title}</h3>
                <p className="text-[14px] text-[#EACEAA]/80 mb-3">{cat.subtitle}</p>
                <span className="text-[13px] text-[#D39858] group-hover:underline">Shop →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}