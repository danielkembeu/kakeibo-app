export type BudgetCategoryId = "survie" | "engagement" | "desirs" | "imprevus"

export interface BudgetItem {
  id: string
  name: string
  amount: number
}

export type BudgetItemsByCategory = Record<BudgetCategoryId, BudgetItem[]>

export interface MonthlyBudget {
  monthKey: string
  revenu: number
  items: BudgetItemsByCategory
}

export interface SavingsGoal {
  id: string
  label: string
  targetAmount: number
  monthlyContribution: number
  startMonthKey: string
}

export interface CategoryDefinition {
  id: BudgetCategoryId
  emoji: string
  label: string
  color: string
  recommendedRatio: number
}

export interface CategoryTotal {
  id: BudgetCategoryId
  total: number
  ratio: number
  overRecommended: boolean
}

export interface BudgetKpis {
  revenu: number
  totalDepenses: number
  disponible: number
  isDeficit: boolean
  depensesRatio: number
  categoryTotals: CategoryTotal[]
}

export type RecommendationLevel = "info" | "warning" | "success"

export interface Recommendation {
  level: RecommendationLevel
  message: string
}

export interface GoalProgress {
  goalId: string
  cumulativeSavings: number
  reached: boolean
}

export interface RoadmapMonth {
  monthKey: string
  revenu: number
  totalDepenses: number
  disponible: number
  isExplicit: boolean
  goalProgress: GoalProgress[]
  totalCumulativeSavings: number
  goalsReachedThisMonth: { goalId: string; label: string }[]
}

export interface Roadmap {
  months: RoadmapMonth[]
  goals: SavingsGoal[]
}
