import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/features/shared/components/ui/button"
import { Form } from "@/features/shared/components/ui/form"
import { CategoryItemsFieldArray } from "@/features/kakeibo/components/BudgetEntryForm/CategoryItemsFieldArray"
import { RevenueField } from "@/features/kakeibo/components/BudgetEntryForm/RevenueField"
import { useSubmitBudget } from "@/features/kakeibo/hooks/useSubmitBudget"
import { KAKEIBO_CATEGORIES } from "@/features/kakeibo/lib/constants"
import {
  budgetFormSchema,
  type BudgetFormValues,
} from "@/features/kakeibo/lib/schemas"

interface BudgetEntryFormProps {
  monthKey: string
}

export function BudgetEntryForm({ monthKey }: BudgetEntryFormProps) {
  const { budget, submit, isSaving } = useSubmitBudget(monthKey)

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    values: { revenu: budget.revenu, items: budget.items },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => submit(values))}
        className="space-y-4"
      >
        <RevenueField control={form.control} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {KAKEIBO_CATEGORIES.map((category) => (
            <CategoryItemsFieldArray
              key={category.id}
              control={form.control}
              category={category}
            />
          ))}
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer le budget"}
        </Button>
      </form>
    </Form>
  )
}
