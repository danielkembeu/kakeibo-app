import { ModeStep } from "@/features/kakeibo/components/Onboarding/ModeStep"
import { PrenomStep } from "@/features/kakeibo/components/Onboarding/PrenomStep"
import { RecapStep } from "@/features/kakeibo/components/Onboarding/RecapStep"
import { RevenuStep } from "@/features/kakeibo/components/Onboarding/RevenuStep"
import { SavingsObjectiveStep } from "@/features/kakeibo/components/Onboarding/SavingsObjectiveStep"
import { WelcomeStep } from "@/features/kakeibo/components/Onboarding/WelcomeStep"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"

const STEPS = [PrenomStep, ModeStep, RevenuStep, SavingsObjectiveStep, RecapStep]

export default function OnboardingPage() {
  const hasStarted = useOnboardingUiStore((state) => state.hasStarted)
  const step = useOnboardingUiStore((state) => state.step)

  if (!hasStarted) return <WelcomeStep />

  const CurrentStep = STEPS[step]
  return <CurrentStep />
}
