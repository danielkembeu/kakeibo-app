import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository";
import type { CategoryDefinition } from "@/features/kakeibo/lib/types";

const CATEGORIES_QUERY_KEY = ["kakeibo", "categories"] as const;

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => localStorageBudgetRepository.listCategories(),
  });

  const saveCategory = useMutation({
    mutationFn: (category: Omit<CategoryDefinition, "id"> & { id?: string }) =>
      localStorageBudgetRepository.saveCategory(category),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => localStorageBudgetRepository.deleteCategory(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    saveCategory: saveCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
}