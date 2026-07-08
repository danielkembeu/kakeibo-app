import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import type { AppSettings } from "@/features/kakeibo/lib/types"

const SETTINGS_QUERY_KEY = ["kakeibo", "settings"] as const

export function useAppSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => localStorageBudgetRepository.getSettings(),
  })

  const saveSettings = useMutation({
    mutationFn: (patch: Partial<AppSettings>) =>
      localStorageBudgetRepository.saveSettings(patch),
    onSuccess: (settings) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, settings)
    },
  })

  return {
    settings: query.data,
    isLoading: query.isLoading,
    saveSettings: saveSettings.mutateAsync,
  }
}
