import { useQuery } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"

export function useRecurringBudgetMonths() {
  return useQuery({
    queryKey: ["kakeibo", "months", "recurring"],
    queryFn: async () => {
      const months = await localStorageBudgetRepository.listMonths()
      return months.filter((month) => month.isRecurring)
    },
  })
}
