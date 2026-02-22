import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function OnboardingGuard({ children }) {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        
        if (!isAuth) {
          navigate(createPageUrl("AppEntry"));
          return;
        }

        const user = await base44.auth.me();

        if (!user.onboarding_completed) {
          navigate(createPageUrl("AppEntry"));
          return;
        }

        setIsReady(true);
      } catch (error) {
        console.error('Access check failed:', error);
        navigate(createPageUrl("AppEntry"));
      }
    };

    checkAccess();
  }, [navigate]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}