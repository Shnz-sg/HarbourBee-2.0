import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Ship, User } from "lucide-react";

export default function OnboardingConfirm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vessel, setVessel] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      
      if (u.onboarding_completed) {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      
      if (u.onboarding_step !== "confirmation") {
        if (!u.onboarding_step || u.onboarding_step === "role_selection") {
          navigate(createPageUrl("OnboardingRole"));
        } else if (u.onboarding_step === "vessel_association") {
          navigate(createPageUrl("OnboardingVessel"));
        }
        return;
      }

      // Fetch vessel details
      if (u.vessel_id) {
        const vessels = await base44.entities.Vessel.filter({ id: u.vessel_id });
        if (vessels.length > 0) {
          setVessel(vessels[0]);
        }
      }
    }).catch(() => navigate(createPageUrl("Landing")));
  }, [navigate]);

  const getRoleLabel = (role) => {
    const labels = {
      crew: "Crew / Vessel User",
      vendor: "Vendor",
      ops_admin: "Operations / Admin",
      admin: "Administrator",
      super_admin: "Super Administrator"
    };
    return labels[role] || role;
  };

  const handleComplete = async () => {
    if (!acknowledged) return;

    setIsSubmitting(true);
    try {
      await base44.auth.updateMe({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      // Route to appropriate dashboard based on role
      navigate(createPageUrl("Dashboard"));
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setIsSubmitting(false);
    }
  };

  if (!user || !vessel) {
    return null;
  }

  return (
    <OnboardingLayout step={3} totalSteps={3}>
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Almost Ready</h1>
          <p className="text-slate-600">
            Review your setup before accessing the platform
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Your Role
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ship className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Your Vessel
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {vessel.name}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  IMO {user.vessel_imo}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-5 mb-6">
          <p className="text-sm font-medium text-sky-900 mb-2">What this enables:</p>
          <ul className="text-sm text-sky-800 space-y-1">
            <li>• Order supplies tied to your vessel</li>
            <li>• Join delivery pools for your destination port</li>
            <li>• Receive automatic refunds when pools reach free delivery</li>
            <li>• Track deliveries to your vessel location</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={acknowledged}
              onCheckedChange={setAcknowledged}
              className="mt-0.5"
            />
            <span className="text-sm text-amber-900 leading-relaxed">
              I confirm that my orders and pooling activity will be tied to this vessel. 
              I understand that vessel association can only be changed by Operations staff.
            </span>
          </label>
        </div>

        <Button
          onClick={handleComplete}
          disabled={!acknowledged || isSubmitting}
          className="w-full h-12 bg-sky-600 hover:bg-sky-700"
        >
          {isSubmitting ? "Setting up your account..." : "Complete Setup & Enter Platform"}
        </Button>
      </div>
    </OnboardingLayout>
  );
}