import { ModeStep } from "@/features/kakeibo/components/Onboarding/ModeStep"
import { ObjectifStep } from "@/features/kakeibo/components/Onboarding/ObjectifStep"
import { PrenomStep } from "@/features/kakeibo/components/Onboarding/PrenomStep"
import { RecapStep } from "@/features/kakeibo/components/Onboarding/RecapStep"
import { RevenuStep } from "@/features/kakeibo/components/Onboarding/RevenuStep"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"

const STEPS = [PrenomStep, ModeStep, RevenuStep, ObjectifStep, RecapStep]

export default function OnboardingPage() {
  const step = useOnboardingUiStore((state) => state.step)
  const CurrentStep = STEPS[step]

  return <CurrentStep />
}
