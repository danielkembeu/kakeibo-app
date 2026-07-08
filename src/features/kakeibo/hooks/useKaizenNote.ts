import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"

function kaizenQueryKey(monthKey: string) {
  return ["kakeibo", "kaizen", monthKey] as const
}

export function useKaizenNote(monthKey: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: kaizenQueryKey(monthKey),
    queryFn: () => localStorageBudgetRepository.getKaizenNote(monthKey),
  })

  const saveKaizenNote = useMutation({
    mutationFn: (promise: string) =>
      localStorageBudgetRepository.saveKaizenNote(promise, monthKey),
    onSuccess: (note) => {
      queryClient.setQueryData(kaizenQueryKey(note.monthKey), note)
    },
  })

  return {
    note: query.data ?? null,
    isLoading: query.isLoading,
    saveKaizenNote: saveKaizenNote.mutateAsync,
    isSaving: saveKaizenNote.isPending,
  }
}
