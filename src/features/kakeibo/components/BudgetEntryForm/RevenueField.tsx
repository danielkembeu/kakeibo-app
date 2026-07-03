import type { Control } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form"
import { NumberInput } from "@/features/kakeibo/components/NumberInput"
import type { BudgetFormValues } from "@/features/kakeibo/lib/schemas"

interface RevenueFieldProps {
  control: Control<BudgetFormValues>
}

export function RevenueField({ control }: RevenueFieldProps) {
  return (
    <FormField
      control={control}
      name="revenu"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Revenu mensuel</FormLabel>
          <FormControl>
            <NumberInput field={field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
