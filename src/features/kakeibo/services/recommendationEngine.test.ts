import { describe, expect, it } from "vitest"

import { buildKaizenSynthesis } from "@/features/kakeibo/services/recommendationEngine"
import { computeKpis, createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations"
import { TEST_CATEGORIES } from "@/features/kakeibo/lib/testFixtures"
import type { MonthlyBudget } from "@/features/kakeibo/lib/types"

function budgetWith(revenu: number, depenses: number): MonthlyBudget {
  const base = createEmptyBudget("2026-07", TEST_CATEGORIES)
  return {
    ...base,
    revenu,
    items: {
      ...base.items,
      survie: depenses > 0 ? [{ id: "1", name: "Dépense", amount: depenses }] : [],
    },
  }
}

describe("buildKaizenSynthesis", () => {
  it("returns a null comparison when there is no previous month", () => {
    const kpis = computeKpis(budgetWith(100000, 50000), TEST_CATEGORIES)

    const synthesis = buildKaizenSynthesis(
      "2026-07",
      kpis,
      null,
      [],
      TEST_CATEGORIES
    )

    expect(synthesis.comparison).toBeNull()
  })

  it("computes deltas against the previous month", () => {
    const kpis = computeKpis(budgetWith(100000, 60000), TEST_CATEGORIES)
    const previousKpis = computeKpis(budgetWith(90000, 50000), TEST_CATEGORIES)

    const synthesis = buildKaizenSynthesis(
      "2026-07",
      kpis,
      previousKpis,
      [],
      TEST_CATEGORIES
    )

    expect(synthesis.comparison).toEqual({
      revenuDelta: 10000,
      depensesDelta: 10000,
      disponibleDelta: 0,
    })
  })

  it("passes recommendations through from buildRecommendations", () => {
    const kpis = computeKpis(budgetWith(50000, 80000), TEST_CATEGORIES)

    const synthesis = buildKaizenSynthesis(
      "2026-07",
      kpis,
      null,
      [],
      TEST_CATEGORIES
    )

    expect(synthesis.recommendations.some((r) => r.level === "warning")).toBe(
      true
    )
  })
})
