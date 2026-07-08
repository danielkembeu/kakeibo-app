import { useMemo } from "react"

import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import { computeKpis } from "@/features/kakeibo/services/budgetCalculations"

export function useKpis(monthKey: string) {
  const { budget, isLoading: isBudgetLoading } = useMonthlyBudget(monthKey)
  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const kpis = useMemo(
    () => computeKpis(budget, categories),
    [budget, categories]
  )

  return { kpis, isLoading: isBudgetLoading || isCategoriesLoading }
}
