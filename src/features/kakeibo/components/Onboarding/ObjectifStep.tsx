import { useState } from "react";

import { Input } from "@/features/shared/components/ui/input";
import { OnboardingStepShell } from "@/features/kakeibo/components/Onboarding/OnboardingStepShell";
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers";
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore";
import { withViewTransition } from "@/features/shared/lib/viewTransition";

export function ObjectifStep() {
  const { answers, saveAnswers } = useOnboardingAnswers();
  const goToNextStep = useOnboardingUiStore((state) => state.goToNextStep);
  const [label, setLabel] = useState(answers.initialGoalLabel ?? "");
  const [amount, setAmount] = useState(answers.initialGoalAmount ?? 0);

  const handleNext = async () => {
    await saveAnswers({
      initialGoalLabel: label.trim() || undefined,
      initialGoalAmount: amount > 0 ? amount : undefined,
    });
    withViewTransition(goToNextStep);
  };

  const handleSkip = async () => {
    await saveAnswers({
      initialGoalLabel: undefined,
      initialGoalAmount: undefined,
    });
    withViewTransition(goToNextStep);
  };

  return (
    <OnboardingStepShell
      title="Un projet en tête ?"
      description="Facultatif — vous pourrez en définir un plus tard."
      onNext={handleNext}
      onSkip={handleSkip}
    >
      <div className="space-y-2">
        <Input
          autoFocus
          placeholder="Ex: Vélo VTT"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Montant cible"
          value={amount}
          onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
        />
      </div>
    </OnboardingStepShell>
  );
}