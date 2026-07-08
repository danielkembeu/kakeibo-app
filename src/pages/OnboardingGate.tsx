import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings"

export function OnboardingGate() {
  const { settings, isLoading } = useAppSettings()
  const location = useLocation()
  const isOnboardingRoute = location.pathname === "/onboarding"

  if (isLoading || !settings) return null

  if (!settings.onboardingCompleted && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />
  }

  if (settings.onboardingCompleted && isOnboardingRoute) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
