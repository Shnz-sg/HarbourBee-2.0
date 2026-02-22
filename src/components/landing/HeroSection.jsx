import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#150C0C] pt-[160px] pb-[160px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698a9fc775e6187535b96526/841b41135_1.png"
          alt="Maritime operations"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-[#150C0C]/70"></div>
      </div>
      
      <div className="relative max-w-[1600px] mx-auto px-8 lg:px-12">
        <div className="max-w-[700px]">
          <h1 className="text-[56px] lg:text-[64px] font-bold text-[#EACEAA] leading-[1.05] mb-6">For the Seafarers.

          </h1>
          <p className="text-[20px] text-[#EACEAA] opacity-85 leading-relaxed max-w-[520px] mb-10">
            By those who've stood watch. Delivered directly to your vessel in Singapore waters.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl("Products")}
              className="inline-flex items-center gap-2 bg-[#D39858] text-[#150C0C] px-8 py-4 rounded-lg font-semibold text-[18px] hover:bg-[#EACEAA] transition-colors">

              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={createPageUrl("Dashboard")}
              className="inline-flex items-center gap-2 border-2 border-[#D39858] text-[#D39858] px-8 py-4 rounded-lg font-semibold text-[18px] hover:bg-[#D39858] hover:text-[#150C0C] transition-colors">

              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>);

}