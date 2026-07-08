import { create } from "zustand"

export const ONBOARDING_STEP_COUNT = 5

interface OnboardingUiState {
  step: number
  goToNextStep: () => void
  goToPreviousStep: () => void
}

export const useOnboardingUiStore = create<OnboardingUiState>((set) => ({
  step: 0,
  goToNextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, ONBOARDING_STEP_COUNT - 1),
    })),
  goToPreviousStep: () =>
    set((state) => ({ step: Math.max(state.step - 1, 0) })),
}))
