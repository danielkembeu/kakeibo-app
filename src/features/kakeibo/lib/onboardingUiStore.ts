import { create } from "zustand"

export const ONBOARDING_STEP_COUNT = 5

interface OnboardingUiState {
  hasStarted: boolean
  step: number
  start: () => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  setStep: (step: number) => void
  // Used when resuming after an app update — jumps straight past the
  // welcome screen to the specific step that needs answering.
  resumeAt: (step: number) => void
}

export const useOnboardingUiStore = create<OnboardingUiState>((set) => ({
  hasStarted: false,
  step: 0,
  start: () => set({ hasStarted: true }),
  goToNextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, ONBOARDING_STEP_COUNT - 1),
    })),
  goToPreviousStep: () =>
    set((state) => ({ step: Math.max(state.step - 1, 0) })),
  setStep: (step) => set({ step }),
  resumeAt: (step) => set({ hasStarted: true, step }),
}))
