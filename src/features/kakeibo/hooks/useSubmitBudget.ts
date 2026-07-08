import { nanoid } from "nanoid"

import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import { resolveItemAmount } from "@/features/kakeibo/services/budgetCalculations"
import type { BudgetFormValues } from "@/features/kakeibo/lib/schemas"
import type { BudgetItem, MonthlyBudget } from "@/features/kakeibo/lib/types"

function withIdsAndResolvedAmounts(items: BudgetItem[]): BudgetItem[] {
  return items.map((item) => ({
    ...item,
    id: item.id || nanoid(),
    amount: resolveItemAmount(item),
  }))
}

export function useSubmitBudget(monthKey: string) {
  const { budget, saveBudget, isSaving, isLoading } = useMonthlyBudget(monthKey)

  const submit = (values: BudgetFormValues) => {
    const updated: MonthlyBudget = {
      monthKey,
      revenu: values.revenu,
      isRecurring: values.isRecurring,
      items: Object.fromEntries(
        Object.entries(values.items).map(([categoryId, items]) => [
          categoryId,
          withIdsAndResolvedAmounts(items),
        ])
      ),
    }
    
    return saveBudget(updated)
  }

  return { budget, submit, isSaving, isLoading }
}
