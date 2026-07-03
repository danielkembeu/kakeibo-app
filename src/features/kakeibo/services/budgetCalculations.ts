import { KAKEIBO_CATEGORIES } from "@/features/kakeibo/lib/constants"
import { toPercent } from "@/features/kakeibo/lib/format"
import type {
  BudgetKpis,
  CategoryTotal,
  MonthlyBudget,
} from "@/features/kakeibo/lib/types"

export function computeCategoryTotals(budget: MonthlyBudget): CategoryTotal[] {
  return KAKEIBO_CATEGORIES.map((category) => {
    const items = budget.items[category.id] ?? []
    const total = items.reduce((sum, item) => sum + item.amount, 0)
    const ratio = budget.revenu > 0 ? total / budget.revenu : 0

    return {
      id: category.id,
      total,
      ratio,
      overRecommended: ratio > category.recommendedRatio,
    }
  })
}

export function computeKpis(budget: MonthlyBudget): BudgetKpis {
  const categoryTotals = computeCategoryTotals(budget)
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

export function createEmptyBudget(monthKey: string): MonthlyBudget {
  return {
    monthKey,
    revenu: 0,
    items: {
      survie: [],
      engagement: [],
      desirs: [],
      imprevus: [],
    },
  }
}
