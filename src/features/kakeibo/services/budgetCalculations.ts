import { toPercent } from "@/features/kakeibo/lib/format"
import type {
  BudgetItem,
  BudgetKpis,
  CategoryDefinition,
  CategoryTotal,
  MonthlyBudget,
} from "@/features/kakeibo/lib/types"

export function resolveItemAmount(item: BudgetItem): number {
  return item.computed ? item.computed.quantity * item.computed.unitAmount : item.amount
}

export function computeCategoryTotals(
  budget: MonthlyBudget,
  categories: CategoryDefinition[]
): CategoryTotal[] {
  return categories.map((category) => {
    const items = budget.items[category.id] ?? []
    const total = items.reduce((sum, item) => sum + resolveItemAmount(item), 0)
    const ratio = budget.revenu > 0 ? total / budget.revenu : 0

    // Compare rounded percentage points, not raw floating-point ratios —
    // matches what the user actually sees/edits (e.g. "11%"), and avoids
    // float-precision boundary flicker (11000/100000 vs 11/100).
    return {
      id: category.id,
      total,
      ratio,
      overRecommended: Math.round(ratio * 100) > Math.round(category.recommendedRatio * 100),
    }
  })
}

export function computeKpis(
  budget: MonthlyBudget,
  categories: CategoryDefinition[]
): BudgetKpis {
  const categoryTotals = computeCategoryTotals(budget, categories)
  const totalDepenses = categoryTotals.reduce((sum, c) => sum + c.total, 0)
  const disponible = budget.revenu - totalDepenses

  return {
    revenu: budget.revenu,
    totalDepenses,
    disponible,
    isDeficit: disponible < 0,
    depensesRatio: toPercent(totalDepenses, budget.revenu),
    categoryTotals,
  }
}

export function createEmptyBudget(
  monthKey: string,
  categories: CategoryDefinition[],
  isRecurring = true
): MonthlyBudget {
  return {
    monthKey,
    revenu: 0,
    items: Object.fromEntries(categories.map((category) => [category.id, []])),
    isRecurring,
  }
}
