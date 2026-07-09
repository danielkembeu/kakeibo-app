import { useMemo } from "react"

import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import { useRecurringBudgetMonths } from "@/features/kakeibo/hooks/useRecurringBudgetMonths"
import {
  getCurrentMonthKey,
  getYearStartMonthKey,
} from "@/features/kakeibo/lib/monthKey"
import { buildRoadmap } from "@/features/kakeibo/services/projectionService"

// Same projection engine as useYearRoadmap (used on /projets), but started
// from January instead of "now" — reconstitutes the known past of the
// current year and carries the last known budget forward to December, so
// the cumulative savings chart on /roadmap always spans the full year.
// No goals here: this is about the general savings objective, not named
// projects, so `buildRoadmap` stops exactly at year-end.
export function useYearToDateRoadmap() {
  const { data: explicitBudgets, isLoading: isBudgetsLoading } =
    useRecurringBudgetMonths()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const roadmap = useMemo(
    () =>
      buildRoadmap({
        currentMonthKey: getYearStartMonthKey(getCurrentMonthKey()),
        explicitBudgets: explicitBudgets ?? [],
        goals: [],
        categories,
      }),
    [explicitBudgets, categories]
  )

  return {
    roadmap,
    isLoading: isBudgetsLoading || isCategoriesLoading,
  }
}
