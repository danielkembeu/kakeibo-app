import { useMemo } from "react"

import { useKpis } from "@/features/kakeibo/hooks/useKpis"
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import { buildRecommendations } from "@/features/kakeibo/services/recommendationEngine"

export function useRecommendations(monthKey: string) {
  const { kpis, isLoading: isKpisLoading } = useKpis(monthKey)
  const { goals, isLoading: isGoalsLoading } = useSavingsGoals()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const recommendations = useMemo(
    () => buildRecommendations(monthKey, kpis, goals, categories),
    [monthKey, kpis, goals, categories]
  )

  return {
    recommendations,
    isLoading: isKpisLoading || isGoalsLoading || isCategoriesLoading,
  }
}
