import { useState } from "react";

import { Input } from "@/features/shared/components/ui/input";
import { OnboardingStepShell } from "@/features/kakeibo/components/Onboarding/OnboardingStepShell";
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers";
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore";
import { withViewTransition } from "@/features/shared/lib/viewTransition";

export function PrenomStep() {
  const { answers, saveAnswers } = useOnboardingAnswers();
  const goToNextStep = useOnboardingUiStore((state) => state.goToNextStep);
  const [firstName, setFirstName] = useState(answers.firstName ?? "");

  const handleNext = async () => {
    await saveAnswers({ firstName: firstName.trim() });
    withViewTransition(goToNextStep);
  };

  return (
    <OnboardingStepShell
      title="Comment vous appelez-vous ?"
      description="Ça nous permettra de personnaliser votre expérience."
      onNext={handleNext}
      nextDisabled={firstName.trim().length === 0}
    >
      <Input
        autoFocus
        placeholder="Votre prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </OnboardingStepShell>
  );
}