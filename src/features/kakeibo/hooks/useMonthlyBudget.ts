import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import type { MonthlyBudget } from "@/features/kakeibo/lib/types"

export function budgetQueryKey(monthKey: string) {
  return ["kakeibo", "budget", monthKey] as const
}

export function useMonthlyBudget(monthKey: string) {
  const queryClient = useQueryClient()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  const query = useQuery({
    queryKey: budgetQueryKey(monthKey),
    queryFn: async () => {
      const budget = await localStorageBudgetRepository.getMonth(monthKey)
      return budget ?? createEmptyBudget(monthKey, categories)
    },
    enabled: !isCategoriesLoading,
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
    budget: query.data ?? createEmptyBudget(monthKey, categories),
    isLoading: query.isLoading || isCategoriesLoading,
    saveBudget: saveBudget.mutateAsync,
    isSaving: saveBudget.isPending,
  }
}
