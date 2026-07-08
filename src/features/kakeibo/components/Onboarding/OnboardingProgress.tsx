import { cn } from "@/features/shared/lib/utils"
import { ONBOARDING_STEP_COUNT } from "@/features/kakeibo/lib/onboardingUiStore"

interface OnboardingProgressProps {
  step: number
}

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={ONBOARDING_STEP_COUNT}
      aria-valuenow={step + 1}
    >
      {Array.from({ length: ONBOARDING_STEP_COUNT }, (_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full bg-muted transition-colors",
            index <= step && "bg-primary"
          )}
        />
      ))}
    </div>
  )
}
