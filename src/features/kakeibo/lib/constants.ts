import type {
  BudgetMode,
  CategoryDefinition,
  SavingsObjectiveTier,
} from "@/features/kakeibo/lib/types"

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: "survie",
    emoji: "🍚",
    label: "Survie",
    color: "#DC2626",
    recommendedRatio: 0.55,
  },
  {
    id: "engagement",
    emoji: "🌿",
    label: "Engagement",
    color: "#7C3AED",
    recommendedRatio: 0.1,
  },
  {
    id: "desirs",
    emoji: "🛍",
    label: "Désirs",
    color: "#D97706",
    recommendedRatio: 0.25,
  },
  {
    id: "imprevus",
    emoji: "🌱",
    label: "Imprévus",
    color: "#059669",
    recommendedRatio: 0.1,
  },
]

// Suggested during onboarding, based on the mode-appropriate base amount
// (monthly revenu for a recurring budget, the lump sum for a one-off one).
// Always overridable afterwards — same "just a ratio" treatment as a
// category's recommendedRatio, edited from the Profile page.
export const SAVINGS_OBJECTIVE_TIERS: Record<BudgetMode, SavingsObjectiveTier[]> = {
  recurring: [
    { label: "Prudent", percent: 0.05 },
    { label: "Équilibré", percent: 0.1 },
    { label: "Ambitieux", percent: 0.2 },
  ],
  oneoff: [
    { label: "Prudent", percent: 0.1 },
    { label: "Équilibré", percent: 0.2 },
    { label: "Ambitieux", percent: 0.3 },
  ],
}

export const BUDGETS_STORAGE_KEY = "kakeibo:v1:budgets"
export const GOALS_STORAGE_KEY = "kakeibo:v1:goals"
export const CATEGORIES_STORAGE_KEY = "kakeibo:v1:categories"
export const SAVINGS_CONTRIBUTIONS_STORAGE_KEY = "kakeibo:v1:contributions"
export const KAIZEN_STORAGE_KEY = "kakeibo:v1:kaizen"
export const SETTINGS_STORAGE_KEY = "kakeibo:v1:settings"
export const ONBOARDING_ANSWERS_STORAGE_KEY = "kakeibo:v1:onboarding-answers"
