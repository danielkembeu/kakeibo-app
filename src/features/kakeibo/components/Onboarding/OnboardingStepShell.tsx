import type { ReactNode } from "react"

import { Button } from "@/features/shared/components/ui/button"
import { OnboardingProgress } from "@/features/kakeibo/components/Onboarding/OnboardingProgress"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"

interface OnboardingStepShellProps {
  title: string
  description?: string
  children: ReactNode
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  onSkip?: () => void
}

export function OnboardingStepShell({
  title,
  description,
  children,
  onNext,
  nextLabel = "Suivant",
  nextDisabled,
  onSkip,
}: OnboardingStepShellProps) {
  const step = useOnboardingUiStore((state) => state.step)
  const goToPreviousStep = useOnboardingUiStore(
    (state) => state.goToPreviousStep
  )

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 sm:mx-auto sm:max-w-md sm:justify-center">
      <OnboardingProgress step={step} />

      <div className="flex-1 space-y-2 sm:flex-none">
        <h1 className="text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="pt-4">{children}</div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={goToPreviousStep}
          disabled={step === 0}
        >
          Précédent
        </Button>
        <div className="flex items-center gap-2">
          {onSkip && (
            <Button type="button" variant="ghost" onClick={onSkip}>
              Passer
            </Button>
          )}
          <Button type="button" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
