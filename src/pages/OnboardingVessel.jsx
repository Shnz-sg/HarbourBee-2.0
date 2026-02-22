import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ship, AlertCircle, Info, ArrowLeft } from "lucide-react";

export default function OnboardingVessel() {
  const navigate = useNavigate();
  const [imo, setImo] = useState("");
  const [vessel, setVessel] = useState(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u.onboarding_completed) {
        navigate(createPageUrl("Dashboard"));
      } else if (u.onboarding_step !== "vessel_association") {
        navigate(createPageUrl("OnboardingRole"));
      }
    }).catch(() => navigate(createPageUrl("Landing")));
  }, [navigate]);

  const handleCheckIMO = async () => {
    if (!imo) {
      setError("Please enter an IMO number");
      return;
    }

    // Basic IMO format validation
    if (!/^\d{7}$/.test(imo)) {
      setError("IMO number must be exactly 7 digits");
      return;
    }

    setError("");
    setIsChecking(true);

    try {
      // Check if vessel exists
      const vessels = await base44.entities.Vessel.filter({ imo_number: imo });
      
      if (vessels.length > 0) {
        setVessel(vessels[0]);
      } else {
        // Create new vessel record (pending verification)
        const newVessel = await base44.entities.Vessel.create({
          vessel_id: `VSL-${imo}`,
          imo_number: imo,
          name: "Pending Verification",
          status: "active"
        });
        setVessel(newVessel);
      }
    } catch (err) {
      setError("Unable to validate IMO. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleContinue = async () => {
    if (!vessel) return;

    setIsSubmitting(true);
    try {
      await base44.auth.updateMe({
        vessel_imo: imo,
        vessel_id: vessel.id,
        onboarding_step: "confirmation"
      });

      navigate(createPageUrl("OnboardingConfirm"));
    } catch (err) {
      setError("Failed to associate vessel. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(createPageUrl("OnboardingRole"));
  };

  return (
    <OnboardingLayout step={2} totalSteps={3}>
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-8 h-8 text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Associate Your Vessel</h1>
          <p className="text-slate-600 leading-relaxed">
            Enter your vessel's IMO number to enable ordering and pooling
          </p>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-sky-900 leading-relaxed">
              <p className="font-medium mb-1">Why is this required?</p>
              <ul className="space-y-1 text-sky-800">
                <li>• Orders are tied to your vessel for delivery</li>
                <li>• Pooling is based on vessel location and ETA</li>
                <li>• Your vessel name is not shared publicly</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!vessel ? (
          <div className="space-y-5">
            <div>
              <Label htmlFor="imo" className="text-sm font-medium text-slate-700">
                IMO Number
              </Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="imo"
                  value={imo}
                  onChange={(e) => setImo(e.target.value.replace(/\D/g, "").slice(0, 7))}
                  placeholder="1234567"
                  maxLength={7}
                  className="h-11 text-base"
                  disabled={isChecking}
                />
                <Button
                  onClick={handleCheckIMO}
                  disabled={!imo || isChecking}
                  variant="outline"
                  className="h-11 px-6"
                >
                  {isChecking ? "Checking..." : "Verify"}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Enter the 7-digit IMO number found on your vessel's documentation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-4">
                <Ship className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">Vessel Found</p>
                  <p className="text-sm text-green-800">IMO {imo}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Vessel Name</span>
                  <span className="text-sm font-medium text-slate-900">
                    {vessel.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                <span className="font-medium">Confirm this is correct.</span> Your orders and pooling 
                will be tied to this vessel. This can only be changed by Operations staff.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setVessel(null)}
                variant="outline"
                className="flex-1 h-11"
              >
                Change IMO
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="flex-1 h-11 bg-sky-600 hover:bg-sky-700"
              >
                {isSubmitting ? "Confirming..." : "Confirm & Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}