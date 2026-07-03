import { useQuery } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"

export function useBudgetMonths() {
  return useQuery({
    queryKey: ["kakeibo", "months"],
    queryFn: () => localStorageBudgetRepository.listMonths(),
  })
}
