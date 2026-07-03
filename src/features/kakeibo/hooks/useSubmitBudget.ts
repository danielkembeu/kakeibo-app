import { nanoid } from "nanoid"

import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import type { BudgetFormValues } from "@/features/kakeibo/lib/schemas"
import type { BudgetItem, MonthlyBudget } from "@/features/kakeibo/lib/types"

function withIds(items: BudgetItem[]): BudgetItem[] {
  return items.map((item) => ({ ...item, id: item.id || nanoid() }))
}

export function useSubmitBudget(monthKey: string) {
  const { budget, saveBudget, isSaving, isLoading } = useMonthlyBudget(monthKey)

  const submit = (values: BudgetFormValues) => {
    const updated: MonthlyBudget = {
      monthKey,
      revenu: values.revenu,
      items: {
        survie: withIds(values.items.survie),
        engagement: withIds(values.items.engagement),
        desirs: withIds(values.items.desirs),
        imprevus: withIds(values.items.imprevus),
      },
    }
    return saveBudget(updated)
  }

  return { budget, submit, isSaving, isLoading }
}
