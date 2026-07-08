import { useState } from "react"

import { cn } from "@/features/shared/lib/utils"
import { OnboardingStepShell } from "@/features/kakeibo/components/Onboarding/OnboardingStepShell"
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"
import { withViewTransition } from "@/features/shared/lib/viewTransition"
import type { BudgetMode } from "@/features/kakeibo/lib/types"

const OPTIONS: { value: BudgetMode; label: string; description: string }[] = [
  {
    value: "recurring",
    label: "Salarié",
    description: "Revenu régulier, budget suivi mois après mois.",
  },
  {
    value: "oneoff",
    label: "Ponctuel",
    description: "Une somme reçue, à répartir tout de suite.",
  },
]

export function ModeStep() {
  const { answers, saveAnswers } = useOnboardingAnswers()
  const goToNextStep = useOnboardingUiStore((state) => state.goToNextStep)
  const [mode, setMode] = useState<BudgetMode | undefined>(answers.mode)

  const handleNext = async () => {
    if (!mode) return
    await saveAnswers({ mode })
    withViewTransition(goToNextStep)
  }

  return (
    <OnboardingStepShell
      title="Comment gérez-vous votre argent ?"
      onNext={handleNext}
      nextDisabled={!mode}
    >
      <div className="grid gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              mode === option.value
                ? "border-primary bg-accent"
                : "border-border"
            )}
          >
            <p className="font-medium">{option.label}</p>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </OnboardingStepShell>
  )
}
