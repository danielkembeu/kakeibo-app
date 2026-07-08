import { useMemo } from "react"

import { useRecurringBudgetMonths } from "@/features/kakeibo/hooks/useRecurringBudgetMonths"
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import { buildRoadmap } from "@/features/kakeibo/services/projectionService"
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey"

export function useYearRoadmap() {
  const { data: explicitBudgets, isLoading: isBudgetsLoading } =
    useRecurringBudgetMonths()
  const { goals, isLoading: isGoalsLoading } = useSavingsGoals()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const roadmap = useMemo(
    () =>
      buildRoadmap({
        currentMonthKey: getCurrentMonthKey(),
        explicitBudgets: explicitBudgets ?? [],
        goals,
        categories,
      }),
    [explicitBudgets, goals, categories]
  )

  return {
    roadmap,
    isLoading: isBudgetsLoading || isGoalsLoading || isCategoriesLoading,
  }
}
