import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow";
import { SavingsGoalForm } from "@/features/kakeibo/components/SavingsGoalForm";
import { SavingsGoalRow } from "@/features/kakeibo/components/SavingsGoalRow";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import { computeAvailableForProjects } from "@/features/kakeibo/services/savingsService";

export function SavingsGoalList() {
  const { goals, isLoading } = useSavingsGoals();
  const { settings } = useAppSettings();
  const { kpis } = useKpis(getCurrentMonthKey());

  if (isLoading) return null;

  const availableForNewGoal = computeAvailableForProjects(
    kpis,
    settings?.savingsObjectivePercent ?? 0,
    getCurrentMonthKey(),
    goals,
  );

  return (
    <div className="space-y-2">
      {goals.map((goal) => (
        <SavingsGoalRow key={goal.id} goal={goal} />
      ))}

      {availableForNewGoal > 0 ? (
        <CollapsibleRow label="+ Ajouter un objectif d'épargne">
          <SavingsGoalForm />
        </CollapsibleRow>
      ) : (
        <p className="text-xs text-muted-foreground">
          Votre budget de ce mois ne laisse plus de marge pour un nouveau
          projet, une fois l'objectif d'épargne et vos projets existants pris
          en compte.
        </p>
      )}
    </div>
  );
}
