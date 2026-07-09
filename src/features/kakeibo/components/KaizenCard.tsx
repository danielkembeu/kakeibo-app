import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/features/shared/components/ui/form";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";
import { useKaizenNote } from "@/features/kakeibo/hooks/useKaizenNote";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { shiftMonthKey } from "@/features/kakeibo/lib/monthKey";
import {
  kaizenFormSchema,
  type KaizenFormValues,
} from "@/features/kakeibo/lib/schemas";
import { buildKaizenSynthesis } from "@/features/kakeibo/services/recommendationEngine";

interface KaizenCardProps {
  monthKey: string;
}

function formatDelta(delta: number) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatAmount(delta)}`;
}

export function KaizenCard({ monthKey }: Readonly<KaizenCardProps>) {
  const previousMonthKey = shiftMonthKey(monthKey, -1);

  const { kpis } = useKpis(monthKey);
  const { kpis: previousKpis, isLoading: isPreviousLoading } =
    useKpis(previousMonthKey);
  const { goals } = useSavingsGoals();
  const { categories } = useCategories();
  const { note: previousNote } = useKaizenNote(previousMonthKey);
  const { note, saveKaizenNote, isSaving, isLoading: isNoteLoading } =
    useKaizenNote(monthKey);

  const synthesis = buildKaizenSynthesis(
    monthKey,
    kpis,
    isPreviousLoading ? null : previousKpis,
    goals,
    categories,
  );

  const form = useForm<KaizenFormValues>({
    resolver: zodResolver(kaizenFormSchema),
    values: { promise: note?.promise ?? "" },
  });

  // Defaults to display mode once a promise already exists for this month,
  // edit mode otherwise — re-evaluated whenever the month changes or a save
  // just completed (note goes from null to set), without overriding a
  // manual "Modifier" click in between.
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!isNoteLoading) setIsEditing(!note);
  }, [monthKey, isNoteLoading, note]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kaizen — comment s'améliorer ce mois-ci ?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {synthesis.comparison && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>
              Revenu vs mois dernier :{" "}
              {formatDelta(synthesis.comparison.revenuDelta)}
            </li>
            <li>
              Dépenses vs mois dernier :{" "}
              {formatDelta(synthesis.comparison.depensesDelta)}
            </li>
            <li>
              Disponible vs mois dernier :{" "}
              {formatDelta(synthesis.comparison.disponibleDelta)}
            </li>
          </ul>
        )}

        {previousNote?.promise && (
          <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
            Le mois dernier vous aviez promis : « {previousNote.promise} »
          </p>
        )}

        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                saveKaizenNote(values.promise),
              )}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="promise"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Comment puis-je m'améliorer le mois prochain ?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer ma promesse"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-2">
            <p className="rounded-md border p-3 text-sm">{note?.promise}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
