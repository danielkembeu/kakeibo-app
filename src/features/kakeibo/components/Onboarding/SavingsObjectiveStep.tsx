import { useState } from "react"

import { cn } from "@/features/shared/lib/utils"
import { OnboardingStepShell } from "@/features/kakeibo/components/Onboarding/OnboardingStepShell"
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"
import { withViewTransition } from "@/features/shared/lib/viewTransition"
import { SAVINGS_OBJECTIVE_TIERS } from "@/features/kakeibo/lib/constants"
import { formatAmount } from "@/features/kakeibo/lib/format"

const DEFAULT_TIER_INDEX = 1 // "Équilibré" — preselected so the step isn't a hard blocker

export function SavingsObjectiveStep() {
  const { answers, saveAnswers } = useOnboardingAnswers()
  const goToNextStep = useOnboardingUiStore((state) => state.goToNextStep)

  const mode = answers.mode ?? "recurring"
  const baseAmount = answers.startingAmount ?? 0
  const tiers = SAVINGS_OBJECTIVE_TIERS[mode]

  const [percent, setPercent] = useState(
    answers.savingsObjectivePercent ?? tiers[DEFAULT_TIER_INDEX].percent
  )

  const handleNext = async () => {
    await saveAnswers({ savingsObjectivePercent: percent })
    withViewTransition(goToNextStep)
  }

  return (
    <OnboardingStepShell
      title="Combien voulez-vous épargner ?"
      description={
        mode === "oneoff"
          ? "Une part de cette somme, mise de côté dès maintenant."
          : "Une part de votre revenu, mise de côté chaque mois."
      }
      onNext={handleNext}
    >
      <div className="grid gap-2">
        {tiers.map((tier) => (
          <button
            key={tier.label}
            type="button"
            onClick={() => setPercent(tier.percent)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              percent === tier.percent
                ? "border-primary bg-accent"
                : "border-border"
            )}
          >
            <p className="font-medium">
              {tier.label} — {Math.round(tier.percent * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {formatAmount(baseAmount * tier.percent)}
            </p>
          </button>
        ))}
      </div>
    </OnboardingStepShell>
  )
}
