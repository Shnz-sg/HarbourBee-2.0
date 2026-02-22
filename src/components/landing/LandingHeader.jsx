import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

export default function LandingHeader({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#150C0C] border-b border-[#EACEAA]/8">
        <div className="mx-auto px-12 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/Landing" className="text-[#F5EBDD] text-[23px] font-semibold tracking-tight hover:opacity-80 transition-opacity">
            HarbourBee
          </Link>

          {/* Center Nav - Desktop Only */}
          <nav className="hidden md:flex items-center gap-10">
            <Link 
              to={createPageUrl("Shop")} 
              className="text-[14px] text-[#EACEAA] tracking-[0.5px] hover:text-[#D39858] transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/categories" 
              className="text-[14px] text-[#EACEAA] tracking-[0.5px] hover:text-[#D39858] transition-colors"
            >
              Categories
            </Link>
            <a 
              href="#about" 
              className="text-[14px] text-[#EACEAA] tracking-[0.5px] hover:text-[#D39858] transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Utility */}
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[#EACEAA] hover:text-[#D39858] transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            
            <Link to={createPageUrl("Cart")} className="relative text-[#EACEAA] hover:text-[#D39858] transition-colors">
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D39858] text-[#150C0C] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link 
              to={createPageUrl("AppEntry")} 
              className="hidden md:block text-[14px] text-[#EACEAA] tracking-[0.5px] hover:text-[#D39858] transition-colors"
            >
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[#EACEAA] hover:text-[#D39858] transition-colors"
            >
              <Menu className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#150C0C] md:hidden">
          <div className="h-[64px] flex items-center justify-between px-6">
            <Link 
              to="/Landing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EBDD] text-[20px] font-semibold hover:opacity-80 transition-opacity"
            >
              HarbourBee
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#EACEAA] hover:text-[#D39858] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col items-center justify-center gap-10 pt-20">
            <Link 
              to={createPageUrl("Shop")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[22px] text-[#EACEAA] tracking-wide hover:text-[#D39858] transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[22px] text-[#EACEAA] tracking-wide hover:text-[#D39858] transition-colors"
            >
              Categories
            </Link>
            <a 
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[22px] text-[#EACEAA] tracking-wide hover:text-[#D39858] transition-colors"
            >
              About
            </a>
            <Link 
              to={createPageUrl("AppEntry")}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[22px] text-[#EACEAA] tracking-wide hover:text-[#D39858] transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}