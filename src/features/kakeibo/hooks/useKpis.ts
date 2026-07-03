import { useMemo } from "react"

import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import { computeKpis } from "@/features/kakeibo/services/budgetCalculations"

export function useKpis(monthKey: string) {
  const { budget, isLoading } = useMonthlyBudget(monthKey)
  const kpis = useMemo(() => computeKpis(budget), [budget])

  return { kpis, isLoading }
}
