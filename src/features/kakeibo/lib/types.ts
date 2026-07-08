export type BudgetCategoryId = string

export interface BudgetItemComputed {
  unitAmount: number
  quantity: number
  defaultQuantity: number
}

export interface BudgetItem {
  id: string
  name: string
  // Always the effective total. For a computed item this is kept in sync
  // with quantity * unitAmount at save time — every reader can trust
  // `amount` without knowing whether the item is computed.
  amount: number
  computed?: BudgetItemComputed
}

export type BudgetItemsByCategory = Record<BudgetCategoryId, BudgetItem[]>

export interface MonthlyBudget {
  monthKey: string
  revenu: number
  items: BudgetItemsByCategory
  isRecurring: boolean
}

export interface SavingsGoal {
  id: string
  label: string
  targetAmount: number
  monthlyContribution: number
  startMonthKey: string
}

export interface SavingsContribution {
  id: string
  goalId: string
  monthKey: string
  amount: number
  confirmedAt: string
}

export interface KaizenNote {
  monthKey: string
  promise: string
  createdAt: string
}

export interface KaizenComparison {
  revenuDelta: number
  depensesDelta: number
  disponibleDelta: number
}

export interface KaizenSynthesis {
  recommendations: Recommendation[]
  comparison: KaizenComparison | null
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

export type BudgetMode = "recurring" | "oneoff"

export interface AppSettings {
  onboardingCompleted: boolean
  firstName?: string
  defaultBudgetMode: BudgetMode
  // Ratio (0-1) of revenu the user wants to set aside — configurable like a
  // category's recommendedRatio, editable anytime from the Profile page.
  savingsObjectivePercent?: number
}

export interface OnboardingAnswers {
  firstName?: string
  mode?: BudgetMode
  startingAmount?: number
  savingsObjectivePercent?: number
}

export interface SavingsObjectiveTier {
  label: string
  percent: number
}
