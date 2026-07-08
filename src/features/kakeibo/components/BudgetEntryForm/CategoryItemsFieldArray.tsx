import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldArrayPath,
} from "react-hook-form";

import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { NumberInput } from "@/features/kakeibo/components/NumberInput";
import { formatAmount } from "@/features/kakeibo/lib/format";
import type { BudgetFormValues } from "@/features/kakeibo/lib/schemas";
import type {
  BudgetItemComputed,
  CategoryDefinition,
} from "@/features/kakeibo/lib/types";

interface CategoryItemsFieldArrayProps {
  control: Control<BudgetFormValues>;
  category: CategoryDefinition;
}

interface BudgetItemRowProps {
  control: Control<BudgetFormValues>;
  category: CategoryDefinition;
  index: number;
  onRemove: () => void;
}

function BudgetItemRow({
  control,
  category,
  index,
  onRemove,
}: Readonly<BudgetItemRowProps>) {
  // Dynamic, category-keyed path into a non-array field — cast the escape
  // hatch to this single line rather than loosening the component's typing.
  const computed = useWatch({
    control: control as Control<any>,
    name: `items.${category.id}.${index}.computed`,
  }) as BudgetItemComputed | undefined;
  const computedTotal =
    computed && typeof computed === "object"
      ? (computed.quantity ?? 0) * (computed.unitAmount ?? 0)
      : 0;

  const nameField = (
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
  );

  const removeButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onRemove}
      aria-label="Supprimer le poste"
    >
      <Trash2 />
    </Button>
  );

  if (!computed) {
    return (
      <div className="flex items-start gap-1.5">
        {nameField}

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

        {removeButton}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 rounded-lg border p-2">
      <div className="flex items-start gap-1.5">
        {nameField}
        {removeButton}
      </div>

      <div className="flex items-center gap-1.5">
        <FormField
          control={control}
          name={`items.${category.id}.${index}.computed.quantity`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <NumberInput field={field} placeholder="Qté" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <span className="mt-1.5 text-muted-foreground">×</span>

        <FormField
          control={control}
          name={`items.${category.id}.${index}.computed.unitAmount`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <NumberInput field={field} placeholder="Prix unit." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="mt-1.5 shrink-0 text-right font-mono text-xs text-muted-foreground">
          = {formatAmount(computedTotal)}
        </span>
      </div>
    </div>
  );
}

export function CategoryItemsFieldArray({
  control,
  category,
}: Readonly<CategoryItemsFieldArrayProps>) {
  const { fields, append, remove } = useFieldArray({
    control,
    // category.id is now user-defined data, not a literal from a closed
    // union, so RHF can't statically narrow this path.
    name: `items.${category.id}` as FieldArrayPath<BudgetFormValues>,
  });

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {category.emoji} {category.label}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {fields.map((field, index) => (
          <BudgetItemRow
            key={field.id}
            control={control}
            category={category}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}

        <div className="flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ id: nanoid(), name: "", amount: 0 })}
          >
            <Plus /> Ajouter un poste
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                id: nanoid(),
                name: "",
                amount: 0,
                computed: { unitAmount: 0, quantity: 1, defaultQuantity: 1 },
              })
            }
          >
            <Plus /> Poste calculé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
