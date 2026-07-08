import { createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/pages/AppLayout"
import BudgetPage from "@/pages/BudgetPage"
import HistoryPage from "@/pages/HistoryPage"
import { OnboardingGate } from "@/pages/OnboardingGate"
import OnboardingPage from "@/features/kakeibo/components/Onboarding/OnboardingPage"
import ProfilePage from "@/pages/ProfilePage"
import ProjetsPage from "@/pages/ProjetsPage"
import RoadmapPage from "@/pages/RoadmapPage"

export const router = createBrowserRouter([
  {
    element: <OnboardingGate />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <BudgetPage /> },
          { path: "/roadmap", element: <RoadmapPage /> },
          { path: "/projets", element: <ProjetsPage /> },
          { path: "/historique", element: <HistoryPage /> },
          { path: "/profil", element: <ProfilePage /> },
        ],
      },
    ],
  },
])
