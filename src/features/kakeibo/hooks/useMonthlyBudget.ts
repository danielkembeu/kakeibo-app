import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations"
import type { MonthlyBudget } from "@/features/kakeibo/lib/types"

export function budgetQueryKey(monthKey: string) {
  return ["kakeibo", "budget", monthKey] as const
}

export function useMonthlyBudget(monthKey: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: budgetQueryKey(monthKey),
    queryFn: async () => {
      const budget = await localStorageBudgetRepository.getMonth(monthKey)
      return budget ?? createEmptyBudget(monthKey)
    },
  })

  const saveBudget = useMutation({
    mutationFn: (budget: MonthlyBudget) =>
      localStorageBudgetRepository.saveMonth(budget),
    onSuccess: (budget) => {
      queryClient.setQueryData(budgetQueryKey(budget.monthKey), budget)
      queryClient.invalidateQueries({ queryKey: ["kakeibo", "months"] })
    },
  })

  return {
    budget: query.data ?? createEmptyBudget(monthKey),
    isLoading: query.isLoading,
    saveBudget: saveBudget.mutateAsync,
    isSaving: saveBudget.isPending,
  }
}
