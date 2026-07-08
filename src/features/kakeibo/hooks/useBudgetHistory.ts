import { useMemo } from "react"

import { useRecurringBudgetMonths } from "@/features/kakeibo/hooks/useRecurringBudgetMonths"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import { computeKpis } from "@/features/kakeibo/services/budgetCalculations"

export function useBudgetHistory() {
  const { data, isLoading: isBudgetsLoading } = useRecurringBudgetMonths()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const history = useMemo(
    () =>
      (data ?? [])
        .map((budget) => ({ budget, kpis: computeKpis(budget, categories) }))
        .reverse(),
    [data, categories]
  )

  return { history, isLoading: isBudgetsLoading || isCategoriesLoading }
}
