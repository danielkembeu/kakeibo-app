import { useNavigate } from "react-router-dom";

import { Button } from "@/features/shared/components/ui/button";
import { OnboardingProgress } from "@/features/kakeibo/components/Onboarding/OnboardingProgress";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget";
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations";

export function RecapStep() {
  const step = useOnboardingUiStore((state) => state.step);
  const goToPreviousStep = useOnboardingUiStore(
    (state) => state.goToPreviousStep,
  );
  const navigate = useNavigate();

  const { answers } = useOnboardingAnswers();
  const { categories } = useCategories();
  const { saveSettings } = useAppSettings();
  const { saveBudget } = useMonthlyBudget(getCurrentMonthKey());
  const { saveGoal } = useSavingsGoals();

  const isRecurring = answers.mode !== "oneoff";

  const handleStart = async () => {
    await saveBudget({
      ...createEmptyBudget(getCurrentMonthKey(), categories, isRecurring),
      revenu: answers.startingAmount ?? 0,
    });

    if (answers.initialGoalLabel && answers.initialGoalAmount) {
      await saveGoal({
        label: answers.initialGoalLabel,
        targetAmount: answers.initialGoalAmount,
        monthlyContribution: Math.round(answers.initialGoalAmount / 6),
        startMonthKey: getCurrentMonthKey(),
      });
    }

    await saveSettings({
      onboardingCompleted: true,
      firstName: answers.firstName,
      defaultBudgetMode: isRecurring ? "recurring" : "oneoff",
    });

    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 sm:mx-auto sm:max-w-md sm:justify-center">
      <OnboardingProgress step={step} />

      <div className="space-y-2">
        <h1 className="text-xl font-bold">
          {answers.firstName
            ? `Prêt(e), ${answers.firstName} ?`
            : "C'est prêt !"}
        </h1>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Mode : {isRecurring ? "Salarié (récurrent)" : "Ponctuel"}</li>
          <li>
            Montant de départ : {formatAmount(answers.startingAmount ?? 0)}
          </li>
          {answers.initialGoalLabel && (
            <li>
              Objectif : {answers.initialGoalLabel} (
              {formatAmount(answers.initialGoalAmount ?? 0)})
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="ghost" onClick={goToPreviousStep}>
          Précédent
        </Button>
        <Button type="button" onClick={handleStart}>
          Commencer
        </Button>
      </div>
    </div>
  );
}