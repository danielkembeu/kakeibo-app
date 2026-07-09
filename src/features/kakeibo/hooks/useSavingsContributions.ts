import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import type { SavingsContribution } from "@/features/kakeibo/lib/types"

const CONTRIBUTIONS_QUERY_KEY = ["kakeibo", "contributions"] as const

export function useSavingsContributions() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: CONTRIBUTIONS_QUERY_KEY,
    queryFn: () => localStorageBudgetRepository.listContributions(),
  })

  const saveContribution = useMutation({
    mutationFn: (
      contribution: Omit<SavingsContribution, "id" | "confirmedAt"> & {
        id?: string
      }
    ) => localStorageBudgetRepository.saveContribution(contribution),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CONTRIBUTIONS_QUERY_KEY }),
    meta: {
      successMessage: "Épargne confirmée.",
      errorMessage: "Échec de la confirmation.",
    },
  })

  return {
    contributions: query.data ?? [],
    isLoading: query.isLoading,
    saveContribution: saveContribution.mutateAsync,
  }
}
