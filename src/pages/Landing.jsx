import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import HeroSection from "../components/landing/HeroSection";
import CategoryGrid from "../components/landing/CategoryGrid";
import FeaturedProducts from "../components/landing/FeaturedProducts";
import BrandStatement from "../components/landing/BrandStatement";
import TrustSection from "../components/landing/TrustSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Just check if authenticated to show/hide UI elements
    base44.auth.isAuthenticated().then((isAuth) => {
      setIsChecking(false);
    }).catch(() => {
      setIsChecking(false);
    });

    // Load cart count
    const savedCart = localStorage.getItem("harbourbee_cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    }
  }, []);

  if (isChecking) {
    return null;
  }

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStatement />
      <TrustSection />
      <LandingFooter />
    </>
  );
}