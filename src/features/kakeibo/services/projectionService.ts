import {
  createEmptyBudget,
  computeKpis,
} from "@/features/kakeibo/services/budgetCalculations"
import {
  getYearEndMonthKey,
  shiftMonthKey,
} from "@/features/kakeibo/lib/monthKey"
import type {
  GoalProgress,
  MonthlyBudget,
  Roadmap,
  RoadmapMonth,
  SavingsGoal,
} from "@/features/kakeibo/lib/types"

const MAX_PROJECTED_MONTHS = 600

interface BuildRoadmapParams {
  currentMonthKey: string
  explicitBudgets: MonthlyBudget[]
  goals: SavingsGoal[]
}

function advanceGoalsProgress(
  goals: SavingsGoal[],
  monthKey: string,
  cumulativeByGoal: Map<string, number>,
  reachedByGoal: Map<string, boolean>
) {
  const goalsReachedThisMonth: { goalId: string; label: string }[] = []

  const goalProgress: GoalProgress[] = goals.map((goal) => {
    const alreadyReached = reachedByGoal.get(goal.id) ?? false
    const isActive = !alreadyReached && goal.startMonthKey <= monthKey

    if (isActive) {
      const next =
        (cumulativeByGoal.get(goal.id) ?? 0) + goal.monthlyContribution
      cumulativeByGoal.set(goal.id, next)

      if (next >= goal.targetAmount) {
        reachedByGoal.set(goal.id, true)
        goalsReachedThisMonth.push({ goalId: goal.id, label: goal.label })
      }
    }

    return {
      goalId: goal.id,
      cumulativeSavings: cumulativeByGoal.get(goal.id) ?? 0,
      reached: reachedByGoal.get(goal.id) ?? false,
    }
  })

  return { goalProgress, goalsReachedThisMonth }
}

export function buildRoadmap({
  currentMonthKey,
  explicitBudgets,
  goals,
}: BuildRoadmapParams): Roadmap {
  const explicitByMonth = new Map(
    explicitBudgets.map((budget) => [budget.monthKey, budget])
  )

  const lastKnownBeforeStart = explicitBudgets
    .filter((budget) => budget.monthKey <= currentMonthKey)
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .at(-1)

  let lastKnownBudget: MonthlyBudget | null = lastKnownBeforeStart ?? null

  const yearEndMonthKey = getYearEndMonthKey(currentMonthKey)
  const months: RoadmapMonth[] = []
  const cumulativeByGoal = new Map<string, number>(
    goals.map((goal) => [goal.id, 0])
  )
  const reachedByGoal = new Map<string, boolean>(
    goals.map((goal) => [goal.id, false])
  )
  let monthKey = currentMonthKey

  for (let i = 0; i < MAX_PROJECTED_MONTHS; i += 1) {
    const explicit = explicitByMonth.get(monthKey)
    if (explicit) lastKnownBudget = explicit

    const budgetForMonth: MonthlyBudget = lastKnownBudget
      ? { ...lastKnownBudget, monthKey }
      : createEmptyBudget(monthKey)
    const kpis = computeKpis(budgetForMonth)

    const { goalProgress, goalsReachedThisMonth } = advanceGoalsProgress(
      goals,
      monthKey,
      cumulativeByGoal,
      reachedByGoal
    )

    months.push({
      monthKey,
      revenu: kpis.revenu,
      totalDepenses: kpis.totalDepenses,
      disponible: kpis.disponible,
      isExplicit: Boolean(explicit),
      goalProgress,
      totalCumulativeSavings: goalProgress.reduce(
        (sum, progress) => sum + progress.cumulativeSavings,
        0
      ),
      goalsReachedThisMonth,
    })

    const pastYearEnd = monthKey >= yearEndMonthKey
    const anyGoalPending = goals.some(
      (goal) => !(reachedByGoal.get(goal.id) ?? false)
    )
    if (pastYearEnd && !anyGoalPending) break

    monthKey = shiftMonthKey(monthKey, 1)
  }

  return { months, goals }
}
