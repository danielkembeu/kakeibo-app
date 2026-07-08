import { useState } from "react"

import { Input } from "@/features/shared/components/ui/input"
import { OnboardingStepShell } from "@/features/kakeibo/components/Onboarding/OnboardingStepShell"
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"
import { withViewTransition } from "@/features/shared/lib/viewTransition"

export function RevenuStep() {
  const { answers, saveAnswers } = useOnboardingAnswers()
  const goToNextStep = useOnboardingUiStore((state) => state.goToNextStep)
  const [startingAmount, setStartingAmount] = useState(
    answers.startingAmount ?? 0
  )

  const isOneoff = answers.mode === "oneoff"

  const handleNext = async () => {
    await saveAnswers({ startingAmount })
    withViewTransition(goToNextStep)
  }

  return (
    <OnboardingStepShell
      title={isOneoff ? "Quel est le montant reçu ?" : "Quel est votre revenu mensuel ?"}
      description="Ça pré-remplira votre premier budget — vous pourrez l'ajuster ensuite."
      onNext={handleNext}
      nextDisabled={startingAmount <= 0}
    >
      <Input
        autoFocus
        type="number"
        placeholder="Montant"
        value={startingAmount}
        onChange={(e) => setStartingAmount(e.target.valueAsNumber || 0)}
      />
    </OnboardingStepShell>
  )
}
