import { describe, expect, it } from "vitest"

import {
  computeKpis,
  createEmptyBudget,
} from "@/features/kakeibo/services/budgetCalculations"
import { TEST_CATEGORIES } from "@/features/kakeibo/lib/testFixtures"
import type { MonthlyBudget } from "@/features/kakeibo/lib/types"

function budgetWith(overrides: MonthlyBudget["items"], revenu: number) {
  const base = createEmptyBudget("2026-07", TEST_CATEGORIES)

  return {
    ...base,
    revenu,
    items: { ...base.items, ...overrides },
  }
}

describe("computeKpis", () => {
  it("computes disponible and flags deficit when expenses exceed revenu", () => {
    const budget = budgetWith(
      { survie: [{ id: "1", name: "Loyer", amount: 80000 }] },
      50000
    )

    const kpis = computeKpis(budget, TEST_CATEGORIES)

    expect(kpis.totalDepenses).toBe(80000)
    expect(kpis.disponible).toBe(-30000)
    expect(kpis.isDeficit).toBe(true)
  })

  it("flags a category as over its recommended ratio", () => {
    const budget = budgetWith(
      { desirs: [{ id: "1", name: "Shopping", amount: 40000 }] },
      100000
    )

    const kpis = computeKpis(budget, TEST_CATEGORIES)
    const desirs = kpis.categoryTotals.find((c) => c.id === "desirs")

    expect(desirs?.ratio).toBeCloseTo(0.4)
    expect(desirs?.overRecommended).toBe(true)
  })

  it("does not flag a category within its recommended ratio", () => {
    const budget = budgetWith(
      { desirs: [{ id: "1", name: "Shopping", amount: 10000 }] },
      100000
    )

    const kpis = computeKpis(budget, TEST_CATEGORIES)
    const desirs = kpis.categoryTotals.find((c) => c.id === "desirs")

    expect(desirs?.overRecommended).toBe(false)
  })
})
