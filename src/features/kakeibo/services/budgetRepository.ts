import { nanoid } from "nanoid"

import {
  readJson,
  writeJson,
} from "@/features/shared/lib/storage/localStorageClient"
import {
  BUDGETS_STORAGE_KEY,
  GOALS_STORAGE_KEY,
} from "@/features/kakeibo/lib/constants"
import type { MonthlyBudget, SavingsGoal } from "@/features/kakeibo/lib/types"

type BudgetsByMonth = Record<string, MonthlyBudget>

export interface BudgetRepository {
  getMonth(monthKey: string): Promise<MonthlyBudget | null>
  saveMonth(budget: MonthlyBudget): Promise<MonthlyBudget>
  listMonths(): Promise<MonthlyBudget[]>
  listGoals(): Promise<SavingsGoal[]>
  saveGoal(goal: Omit<SavingsGoal, "id"> & { id?: string }): Promise<SavingsGoal>
  deleteGoal(id: string): Promise<void>
}

function readBudgets(): BudgetsByMonth {
  return readJson<BudgetsByMonth>(BUDGETS_STORAGE_KEY) ?? {}
}

function readGoals(): SavingsGoal[] {
  return readJson<SavingsGoal[]>(GOALS_STORAGE_KEY) ?? []
}

export const localStorageBudgetRepository: BudgetRepository = {
  async getMonth(monthKey) {
    const budgets = readBudgets()
    return budgets[monthKey] ?? null
  },

  async saveMonth(budget) {
    const budgets = readBudgets()
    budgets[budget.monthKey] = budget
    writeJson(BUDGETS_STORAGE_KEY, budgets)
    return budget
  },

  async listMonths() {
    const budgets = readBudgets()
    return Object.values(budgets).sort((a, b) =>
      a.monthKey.localeCompare(b.monthKey)
    )
  },

  async listGoals() {
    return readGoals().sort((a, b) =>
      a.startMonthKey.localeCompare(b.startMonthKey)
    )
  },

  async saveGoal(goal) {
    const goals = readGoals()
    const saved: SavingsGoal = { ...goal, id: goal.id ?? nanoid() }
    const index = goals.findIndex((existing) => existing.id === saved.id)

    if (index >= 0) {
      goals[index] = saved
    } else {
      goals.push(saved)
    }

    writeJson(GOALS_STORAGE_KEY, goals)
    return saved
  },

  async deleteGoal(id) {
    const goals = readGoals().filter((goal) => goal.id !== id)
    writeJson(GOALS_STORAGE_KEY, goals)
  },
}
