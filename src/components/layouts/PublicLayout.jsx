import React, { useState, useEffect } from "react";
import LandingHeader from "@/components/landing/LandingHeader";

export default function PublicLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem("harbourBeeCart") || "[]");
    setCartCount(cart.length);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("harbourBeeCart") || "[]");
      setCartCount(updatedCart.length);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EBDD]">
      <LandingHeader cartCount={cartCount} />
      <main>{children}</main>
      <footer className="bg-[#150C0C] text-[#EACEAA] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm tracking-wide">© 2026 HarbourBee. Maritime Supply Platform.</p>
        </div>
      </footer>
    </div>
  );
}