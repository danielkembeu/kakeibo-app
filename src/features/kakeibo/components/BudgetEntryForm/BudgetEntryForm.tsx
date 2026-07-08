import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/features/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/features/shared/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select"
import { CategoryItemsFieldArray } from "@/features/kakeibo/components/BudgetEntryForm/CategoryItemsFieldArray"
import { RevenueField } from "@/features/kakeibo/components/BudgetEntryForm/RevenueField"
import { useSubmitBudget } from "@/features/kakeibo/hooks/useSubmitBudget"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"
import {
  budgetFormSchema,
  type BudgetFormValues,
} from "@/features/kakeibo/lib/schemas"

interface BudgetEntryFormProps {
  monthKey: string
  onSaved?: () => void
}

export function BudgetEntryForm({ monthKey, onSaved }: BudgetEntryFormProps) {
  const { budget, submit, isSaving } = useSubmitBudget(monthKey)
  const { categories } = useCategories()

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    values: {
      revenu: budget.revenu,
      items: budget.items,
      isRecurring: budget.isRecurring,
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await submit(values)
          onSaved?.()
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode</FormLabel>
              <Select
                value={field.value ? "recurring" : "oneoff"}
                onValueChange={(value) => field.onChange(value === "recurring")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="recurring">Salarié (récurrent)</SelectItem>
                  <SelectItem value="oneoff">Ponctuel</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <RevenueField control={form.control} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
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
