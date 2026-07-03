import { createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/pages/AppLayout"
import BudgetPage from "@/pages/BudgetPage"
import HistoryPage from "@/pages/HistoryPage"
import RoadmapPage from "@/pages/RoadmapPage"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <BudgetPage /> },
      { path: "/roadmap", element: <RoadmapPage /> },
      { path: "/historique", element: <HistoryPage /> },
    ],
  },
])
