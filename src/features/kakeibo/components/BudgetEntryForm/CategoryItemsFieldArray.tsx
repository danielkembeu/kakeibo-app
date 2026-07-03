import { Plus, Trash2 } from "lucide-react"
import { nanoid } from "nanoid"
import { useFieldArray, type Control } from "react-hook-form"

import { Button } from "@/features/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/form"
import { Input } from "@/features/shared/components/ui/input"
import { NumberInput } from "@/features/kakeibo/components/NumberInput"
import type { BudgetFormValues } from "@/features/kakeibo/lib/schemas"
import type { CategoryDefinition } from "@/features/kakeibo/lib/types"

interface CategoryItemsFieldArrayProps {
  control: Control<BudgetFormValues>
  category: CategoryDefinition
}

export function CategoryItemsFieldArray({
  control,
  category,
}: CategoryItemsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${category.id}`,
  })

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {category.emoji} {category.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-1.5">
            <FormField
              control={control}
              name={`items.${category.id}.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`items.${category.id}.${index}.amount`}
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormControl>
                    <NumberInput field={field} placeholder="Montant" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Supprimer le poste"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ id: nanoid(), name: "", amount: 0 })}
        >
          <Plus /> Ajouter un poste
        </Button>
      </CardContent>
    </Card>
  )
}
