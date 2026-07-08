import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog"
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers"
import {
  ONBOARDING_STEP_INDEX_FOR_FIELD,
  type RequiredSettingsField,
} from "@/features/kakeibo/lib/onboardingCompleteness"
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey"
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore"
import { setOnboardingResumeContext } from "@/features/kakeibo/lib/onboardingResume"
import type { AppSettings } from "@/features/kakeibo/lib/types"

interface OnboardingResumePromptProps {
  settings: AppSettings
  missingFields: RequiredSettingsField[]
  currentPath: string
}

export function OnboardingResumePrompt({
  settings,
  missingFields,
  currentPath,
}: OnboardingResumePromptProps) {
  const navigate = useNavigate()
  const { saveAnswers } = useOnboardingAnswers()
  const { budget } = useMonthlyBudget(getCurrentMonthKey())
  const resumeAt = useOnboardingUiStore((state) => state.resumeAt)
  const [isContinuing, setIsContinuing] = useState(false)

  const handleContinue = async () => {
    setIsContinuing(true)

    setOnboardingResumeContext({ returnTo: currentPath })

    // Seed the onboarding draft from what we already know, so the user
    // only has to answer the fields that are actually missing — nothing
    // already on file gets asked again or lost.
    await saveAnswers({
      firstName: settings.firstName,
      mode: settings.defaultBudgetMode,
      startingAmount: budget.revenu,
      savingsObjectivePercent: settings.savingsObjectivePercent,
    })

    const firstMissingStep = Math.min(
      ...missingFields.map((field) => ONBOARDING_STEP_INDEX_FOR_FIELD[field])
    )
    resumeAt(firstMissingStep)

    navigate("/onboarding")
  }

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quelques informations à compléter</AlertDialogTitle>
          <AlertDialogDescription>
            Kakeibo a évolué depuis votre dernière visite et a besoin de
            quelques préférences supplémentaires pour bien fonctionner.
            Toutes vos données existantes sont conservées — il ne manque que
            ces quelques informations, puis vous retrouverez exactement où
            vous en étiez.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue} disabled={isContinuing}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
