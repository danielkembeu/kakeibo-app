import { useMemo } from "react"

import { useBudgetMonths } from "@/features/kakeibo/hooks/useBudgetMonths"
import { computeKpis } from "@/features/kakeibo/services/budgetCalculations"

export function useBudgetHistory() {
  const { data, isLoading } = useBudgetMonths()

  const history = useMemo(
    () =>
      (data ?? [])
        .map((budget) => ({ budget, kpis: computeKpis(budget) }))
        .reverse(),
    [data]
  )

  return { history, isLoading }
}
