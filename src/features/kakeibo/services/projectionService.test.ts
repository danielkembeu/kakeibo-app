import { describe, expect, it } from "vitest"

import { buildRoadmap } from "@/features/kakeibo/services/projectionService"
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations"
import { TEST_CATEGORIES } from "@/features/kakeibo/lib/testFixtures"
import type { MonthlyBudget, SavingsGoal } from "@/features/kakeibo/lib/types"

function budgetFor(monthKey: string, revenu: number): MonthlyBudget {
  return { ...createEmptyBudget(monthKey, TEST_CATEGORIES), revenu }
}

describe("buildRoadmap", () => {
  it("projects through the end of the year when there are no goals", () => {
    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [budgetFor("2026-10", 100000)],
      goals: [],
      categories: TEST_CATEGORIES,
    })

    expect(roadmap.months.map((m) => m.monthKey)).toEqual([
      "2026-10",
      "2026-11",
      "2026-12",
    ])
  })

  it("reconducts the last known explicit budget for future months without data", () => {
    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [budgetFor("2026-10", 100000)],
      goals: [],
      categories: TEST_CATEGORIES,
    })

    const november = roadmap.months.find((m) => m.monthKey === "2026-11")
    expect(november?.revenu).toBe(100000)
    expect(november?.isExplicit).toBe(false)
  })

  it("marks a month explicit when the user entered data for it", () => {
    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [
        budgetFor("2026-10", 100000),
        budgetFor("2026-11", 150000),
      ],
      goals: [],
      categories: TEST_CATEGORIES,
    })

    const november = roadmap.months.find((m) => m.monthKey === "2026-11")
    expect(november?.revenu).toBe(150000)
    expect(november?.isExplicit).toBe(true)
  })

  it("extends the projection past year-end until a savings goal is reached", () => {
    const goal: SavingsGoal = {
      id: "g1",
      label: "Vélo",
      targetAmount: 500000,
      monthlyContribution: 100000,
      startMonthKey: "2026-10",
    }

    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [budgetFor("2026-10", 200000)],
      goals: [goal],
      categories: TEST_CATEGORIES,
    })

    expect(roadmap.months.at(-1)?.monthKey).toBe("2027-02")
    expect(roadmap.months.at(-1)?.goalProgress[0]).toMatchObject({
      goalId: "g1",
      cumulativeSavings: 500000,
      reached: true,
    })
    const reachedMonth = roadmap.months.find((m) =>
      m.goalsReachedThisMonth.some((g) => g.goalId === "g1")
    )
    expect(reachedMonth?.monthKey).toBe("2027-02")
  })

  it("does not extend past year-end once every goal is already reached", () => {
    const goal: SavingsGoal = {
      id: "g1",
      label: "Vélo",
      targetAmount: 100000,
      monthlyContribution: 100000,
      startMonthKey: "2026-10",
    }

    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [budgetFor("2026-10", 200000)],
      goals: [goal],
      categories: TEST_CATEGORIES,
    })

    expect(roadmap.months.at(-1)?.monthKey).toBe("2026-12")
  })

  it("tracks multiple goals independently, each from its own start month", () => {
    const bike: SavingsGoal = {
      id: "bike",
      label: "Vélo",
      targetAmount: 200000,
      monthlyContribution: 100000,
      startMonthKey: "2026-10",
    }
    const car: SavingsGoal = {
      id: "car",
      label: "Voiture",
      targetAmount: 300000,
      monthlyContribution: 100000,
      startMonthKey: "2026-12",
    }

    const roadmap = buildRoadmap({
      currentMonthKey: "2026-10",
      explicitBudgets: [budgetFor("2026-10", 500000)],
      goals: [bike, car],
      categories: TEST_CATEGORIES,
    })

    const november = roadmap.months.find((m) => m.monthKey === "2026-11")
    expect(
      november?.goalProgress.find((g) => g.goalId === "bike")
        ?.cumulativeSavings
    ).toBe(200000)
    expect(
      november?.goalProgress.find((g) => g.goalId === "car")
        ?.cumulativeSavings
    ).toBe(0)

    expect(roadmap.months.at(-1)?.monthKey).toBe("2027-02")
  })
})
