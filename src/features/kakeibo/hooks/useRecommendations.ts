import { useMemo } from "react"

import { useKpis } from "@/features/kakeibo/hooks/useKpis"
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals"
import { buildRecommendations } from "@/features/kakeibo/services/recommendationEngine"

export function useRecommendations(monthKey: string) {
  const { kpis, isLoading: isKpisLoading } = useKpis(monthKey)
  const { goals, isLoading: isGoalsLoading } = useSavingsGoals()

  const recommendations = useMemo(
    () => buildRecommendations(monthKey, kpis, goals),
    [monthKey, kpis, goals]
  )

  return { recommendations, isLoading: isKpisLoading || isGoalsLoading }
}
