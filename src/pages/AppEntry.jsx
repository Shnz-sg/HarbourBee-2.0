import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function AppEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    const resolveRoute = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        
        if (!isAuth) {
          base44.auth.redirectToLogin();
          return;
        }

        const user = await base44.auth.me();

        // Check onboarding status
        if (!user.onboarding_completed) {
          if (!user.onboarding_step || user.onboarding_step === "role_selection") {
            navigate(createPageUrl("OnboardingRole"));
          } else if (user.onboarding_step === "vessel_association") {
            navigate(createPageUrl("OnboardingVessel"));
          } else if (user.onboarding_step === "confirmation") {
            navigate(createPageUrl("OnboardingConfirm"));
          }
          return;
        }

        // Route based on role
        if (user.role === "crew") {
          navigate(createPageUrl("Shop"));
        } else if (user.role === "vendor") {
          navigate("/admin/vendororders");
        } else if (["ops_admin", "admin"].includes(user.role)) {
          navigate("/admin/dashboard");
        } else {
          navigate(createPageUrl("Shop"));
        }
      } catch (error) {
        console.error('Route resolution failed:', error);
        navigate(createPageUrl("Landing"));
      }
    };

    resolveRoute();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D39858] mx-auto"></div>
      </div>
    </div>
  );
}