import { Navigate, Outlet, useLocation } from "react-router-dom";

import { OnboardingResumePrompt } from "@/features/kakeibo/components/Onboarding/OnboardingResumePrompt";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { getMissingSettingsFields } from "@/features/kakeibo/lib/onboardingCompleteness";

export function OnboardingGate() {
  const { settings, isLoading } = useAppSettings();
  const location = useLocation();
  const isOnboardingRoute = location.pathname === "/onboarding";

  if (isLoading || !settings) return null;

  if (!settings.onboardingCompleted) {
    if (!isOnboardingRoute) return <Navigate to="/onboarding" replace />;
    return <Outlet />;
  }

  const missingFields = getMissingSettingsFields(settings);

  // Already onboarded, but a later update added a required field this
  // profile never answered — prompt explicitly, then resume onboarding
  // for just that field, on top of the current page (nothing is lost).
  if (missingFields.length > 0 && !isOnboardingRoute) {
    return (
      <>
        <Outlet />

        <OnboardingResumePrompt
          settings={settings}
          missingFields={missingFields}
          currentPath={location.pathname}
        />
      </>
    );
  }

  if (isOnboardingRoute && missingFields.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
