import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import type { OnboardingAnswers } from "@/features/kakeibo/lib/types"

const ANSWERS_QUERY_KEY = ["kakeibo", "onboarding-answers"] as const

export function useOnboardingAnswers() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ANSWERS_QUERY_KEY,
    queryFn: () => localStorageBudgetRepository.getOnboardingAnswers(),
  })

  const saveAnswers = useMutation({
    mutationFn: (patch: Partial<OnboardingAnswers>) =>
      localStorageBudgetRepository.saveOnboardingAnswers(patch),
    onSuccess: (answers) => {
      queryClient.setQueryData(ANSWERS_QUERY_KEY, answers)
    },
    // Fires on every onboarding screen's "Suivant" — a toast here would just
    // be noise, not feedback the user asked for.
    meta: { silent: true },
  })

  return {
    answers: query.data ?? {},
    isLoading: query.isLoading,
    saveAnswers: saveAnswers.mutateAsync,
  }
}
