import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow";
import { SavingsGoalForm } from "@/features/kakeibo/components/SavingsGoalForm";
import { SavingsGoalRow } from "@/features/kakeibo/components/SavingsGoalRow";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";

export function SavingsGoalList() {
  const { goals, isLoading } = useSavingsGoals();

  if (isLoading) return null;

  return (
    <div className="space-y-2">
      {goals.map((goal) => (
        <SavingsGoalRow key={goal.id} goal={goal} />
      ))}

      <CollapsibleRow label="+ Ajouter un objectif d'épargne">
        <SavingsGoalForm />
      </CollapsibleRow>
    </div>
  );
}
