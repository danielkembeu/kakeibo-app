import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import type { SavingsGoal } from "@/features/kakeibo/lib/types"

const GOALS_QUERY_KEY = ["kakeibo", "goals"] as const

export function useSavingsGoals() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: () => localStorageBudgetRepository.listGoals(),
  })

  const saveGoal = useMutation({
    mutationFn: (goal: Omit<SavingsGoal, "id"> & { id?: string }) =>
      localStorageBudgetRepository.saveGoal(goal),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
  })

  const deleteGoal = useMutation({
    mutationFn: (id: string) => localStorageBudgetRepository.deleteGoal(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
  })

  return {
    goals: query.data ?? [],
    isLoading: query.isLoading,
    saveGoal: saveGoal.mutateAsync,
    deleteGoal: deleteGoal.mutateAsync,
  }
}
