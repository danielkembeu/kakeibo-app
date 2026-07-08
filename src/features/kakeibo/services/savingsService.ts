import type {
  BudgetKpis,
  SavingsContribution,
  SavingsGoal,
} from "@/features/kakeibo/lib/types"

export interface ConfirmedProgress {
  cumulative: number
  percent: number
  reached: boolean
}

// The general savings objective (page "Épargne") is decided first — what's
// left for project-specific monthly contributions is the disponible *after*
// that objective, minus whatever other active projects already claim. This
// is the source of truth used when defining/editing a project's monthly
// amount on the "Projets" page.
export function computeAvailableForProjects(
  kpis: BudgetKpis,
  savingsObjectivePercent: number,
  monthKey: string,
  goals: SavingsGoal[],
  excludeGoalId?: string
): number {
  const objectiveAmount = kpis.revenu * savingsObjectivePercent
  const afterObjective = Math.max(0, kpis.disponible - objectiveAmount)
  const committed = goals
    .filter(
      (goal) => goal.startMonthKey <= monthKey && goal.id !== excludeGoalId
    )
    .reduce((sum, goal) => sum + goal.monthlyContribution, 0)

  return Math.max(0, afterObjective - committed)
}

export function computeConfirmedProgress(
  goal: SavingsGoal,
  contributions: SavingsContribution[]
): ConfirmedProgress {
  const cumulative = contributions
    .filter((contribution) => contribution.goalId === goal.id)
    .reduce((sum, contribution) => sum + contribution.amount, 0)

  return {
    cumulative,
    percent:
      goal.targetAmount > 0
        ? Math.min(100, Math.round((cumulative / goal.targetAmount) * 100))
        : 0,
    reached: cumulative >= goal.targetAmount,
  }
}
