import { MutationCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMessage?: string
      errorMessage?: string
      // Opt out of the automatic toast — for high-frequency internal writes
      // (e.g. onboarding draft autosave) where a toast would just be noise.
      silent?: boolean
    }
  }
}

const DEFAULT_SUCCESS_MESSAGE = "Enregistré."
const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue."

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.silent) return
      toast.success(mutation.meta?.successMessage ?? DEFAULT_SUCCESS_MESSAGE)
    },
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.silent) return
      toast.error(mutation.meta?.errorMessage ?? DEFAULT_ERROR_MESSAGE)
    },
  }),
})
