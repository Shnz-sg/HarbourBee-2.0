import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Ship, Store, Settings } from "lucide-react";

export default function OnboardingRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user already has a role (already onboarded)
    base44.auth.me().then(user => {
      if (user.role) {
        navigate(createPageUrl("Products"));
        return;
      }
      setIsCheckingAuth(false);
    }).catch(() => navigate(createPageUrl("Landing")));
  }, [navigate]);

  const roles = [
    {
      id: "crew",
      label: "Crew / Vessel User",
      icon: Ship,
      description: "Order supplies for your vessel, join delivery pools, track orders"
    },
    {
      id: "vendor",
      label: "Vendor",
      icon: Store,
      description: "Fulfill orders, manage products, coordinate with operations"
    },
    {
      id: "ops_admin",
      label: "Operations / Admin",
      icon: Settings,
      description: "Manage pools, deliveries, users, and platform operations (requires approval)"
    }
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      // Update user role
      await base44.auth.updateMe({ 
        role: selectedRole,
        onboarding_step: "vessel_association"
      });
      
      // Route to vessel association
      navigate(createPageUrl("OnboardingVessel"));
    } catch (err) {
      console.error("Failed to update role:", err);
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <OnboardingLayout step={1} totalSteps={3}>
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to HarbourBee</h1>
          <p className="text-slate-600">
            First, let's understand how you'll be using the platform
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-sky-600 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-sky-100" : "bg-slate-100"
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? "text-sky-600" : "text-slate-500"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {role.label}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full h-12 bg-sky-600 hover:bg-sky-700"
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </OnboardingLayout>
  );
}