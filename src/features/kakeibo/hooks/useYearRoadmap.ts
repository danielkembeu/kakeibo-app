import { useMemo } from "react"

import { useBudgetMonths } from "@/features/kakeibo/hooks/useBudgetMonths"
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals"
import { buildRoadmap } from "@/features/kakeibo/services/projectionService"
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey"

export function useYearRoadmap() {
  const { data: explicitBudgets, isLoading: isBudgetsLoading } =
    useBudgetMonths()
  const { goals, isLoading: isGoalsLoading } = useSavingsGoals()

  const roadmap = useMemo(
    () =>
      buildRoadmap({
        currentMonthKey: getCurrentMonthKey(),
        explicitBudgets: explicitBudgets ?? [],
        goals,
      }),
    [explicitBudgets, goals]
  )

  return { roadmap, isLoading: isBudgetsLoading || isGoalsLoading }
}
