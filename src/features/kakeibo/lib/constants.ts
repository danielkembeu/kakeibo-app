import type { CategoryDefinition } from "@/features/kakeibo/lib/types"

export const KAKEIBO_CATEGORIES: CategoryDefinition[] = [
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

export const BUDGETS_STORAGE_KEY = "kakeibo:v1:budgets"
export const GOALS_STORAGE_KEY = "kakeibo:v1:goals"
