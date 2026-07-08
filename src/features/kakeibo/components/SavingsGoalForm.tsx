import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { NumberInput } from "@/features/kakeibo/components/NumberInput";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import {
  savingsGoalFormSchema,
  type SavingsGoalFormValues,
} from "@/features/kakeibo/lib/schemas";
import { computeAvailableForProjects } from "@/features/kakeibo/services/savingsService";
import type { SavingsGoal } from "@/features/kakeibo/lib/types";

interface SavingsGoalFormProps {
  goal?: SavingsGoal;
}

export function SavingsGoalForm({ goal }: SavingsGoalFormProps) {
  const { goals, saveGoal, deleteGoal } = useSavingsGoals();
  const { settings } = useAppSettings();
  const { kpis } = useKpis(getCurrentMonthKey());

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: {
      label: goal?.label ?? "",
      targetAmount: goal?.targetAmount ?? 0,
      monthlyContribution: goal?.monthlyContribution ?? 0,
      startMonthKey: goal?.startMonthKey ?? getCurrentMonthKey(),
    },
  });

  const monthlyContribution = form.watch("monthlyContribution");
  const available = computeAvailableForProjects(
    kpis,
    settings?.savingsObjectivePercent ?? 0,
    getCurrentMonthKey(),
    goals,
    goal?.id,
  );
  const exceedsAvailable = monthlyContribution > available;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          saveGoal({ id: goal?.id, ...values }),
        )}
        className="flex flex-wrap items-end gap-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectif</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Vélo VTT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant cible</FormLabel>
              <FormControl>
                <NumberInput field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground my-4">
            Somme actuellement disponible pour ce mois:{" "}
            <span className="font-medium dark:text-white">
              {formatAmount(available)}
            </span>
          </p>

          <FormField
            control={form.control}
            name="monthlyContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Épargne mensuelle</FormLabel>
                <FormControl>
                  <NumberInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {exceedsAvailable && (
            <p className="text-xs text-destructive">
              Ce montant dépasse ce qu'il vous reste une fois l'objectif
              d'épargne et vos autres projets pris en compte.
            </p>
          )}
        </div>
        <FormField
          control={form.control}
          name="startMonthKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actif à partir de</FormLabel>
              <FormControl>
                <Input type="month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {goal ? "Mettre à jour" : "Ajouter l'objectif"}
        </Button>
        {goal && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => deleteGoal(goal.id)}
          >
            Supprimer
          </Button>
        )}
      </form>
    </Form>
  );
}
