import type { AppSettings } from "@/features/kakeibo/lib/types"

// Fields onboarding must have filled in for the app to work correctly.
// When a future update adds one, list it here and give it a step index
// below — an already-onboarded user missing it gets routed back to fill
// in just that step, not the whole flow.
export const REQUIRED_SETTINGS_FIELDS = [
  "firstName",
  "defaultBudgetMode",
  "savingsObjectivePercent",
] as const

export type RequiredSettingsField = (typeof REQUIRED_SETTINGS_FIELDS)[number]

export const ONBOARDING_STEP_INDEX_FOR_FIELD: Record<
  RequiredSettingsField,
  number
> = {
  firstName: 0,
  defaultBudgetMode: 1,
  savingsObjectivePercent: 3,
}

export function getMissingSettingsFields(
  settings: AppSettings
): RequiredSettingsField[] {
  return REQUIRED_SETTINGS_FIELDS.filter((field) => {
    const value = settings[field]
    return value === undefined || value === ""
  })
}
