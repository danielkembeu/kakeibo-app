import type { CategoryDefinition } from "@/features/kakeibo/lib/types"

export const TEST_CATEGORIES: CategoryDefinition[] = [
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
