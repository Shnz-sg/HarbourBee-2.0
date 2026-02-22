import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LandingFooter() {
  return (
    <footer className="bg-[#150C0C] pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[20px] font-bold text-[#EACEAA] mb-3">HarbourBee</h3>
            <p className="text-[14px] text-[#EACEAA]/70 max-w-[320px]">
              Smarter supply pooling for vessels at anchorage
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to={createPageUrl("Products")} className="text-[#EACEAA]/70 hover:text-[#EACEAA] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Help")} className="text-[#EACEAA]/70 hover:text-[#EACEAA] transition-colors">
                    Help
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to={createPageUrl("Products")} className="text-[#EACEAA]/70 hover:text-[#EACEAA] transition-colors">
                    Browse products
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Cart")} className="text-[#EACEAA]/70 hover:text-[#EACEAA] transition-colors">
                    View cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EACEAA]/10 pt-6">
          <p className="text-xs text-[#EACEAA]/50 text-center">
            &copy; {new Date().getFullYear()} HarbourBee. Built for vessels at anchorage.
          </p>
        </div>
      </div>
    </footer>
  );
}