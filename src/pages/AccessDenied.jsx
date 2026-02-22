import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason") || "access_restricted";

  const reasons = {
    access_restricted: {
      title: "Access Restricted",
      message: "Your account does not have permission to access this area of the platform."
    },
    role_mismatch: {
      title: "Role Mismatch",
      message: "Your current role does not allow access to this feature. Contact your administrator if you believe this is incorrect."
    },
    vessel_blocked: {
      title: "Vessel Restricted",
      message: "The vessel associated with your account has been restricted from placing orders. Please contact support for assistance."
    },
    pending_approval: {
      title: "Pending Approval",
      message: "Your account is awaiting administrative approval. You will receive an email notification once your access has been granted."
    },
    policy_enforcement: {
      title: "Policy Restriction",
      message: "Your access has been restricted due to policy enforcement. Contact support for more information."
    }
  };

  const currentReason = reasons[reason] || reasons.access_restricted;

  return (
    <OnboardingLayout>
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {currentReason.title}
        </h1>

        <p className="text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
          {currentReason.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Landing"))}
            className="h-11"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => navigate(createPageUrl("Contact"))}
            className="h-11 bg-sky-600 hover:bg-sky-700"
          >
            Contact Support
          </Button>
        </div>

        {reason === "pending_approval" && (
          <p className="text-xs text-slate-500 mt-6">
            You can safely close this window. We'll notify you once your access is approved.
          </p>
        )}
      </div>
    </OnboardingLayout>
  );
}