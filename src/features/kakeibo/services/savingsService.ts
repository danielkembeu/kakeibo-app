import type { SavingsContribution, SavingsGoal } from "@/features/kakeibo/lib/types"

export interface ConfirmedProgress {
  cumulative: number
  percent: number
  reached: boolean
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
