import {
  readJson,
  removeKey,
  writeJson,
} from "@/features/shared/lib/storage/localStorageClient"

const ONBOARDING_RESUME_STORAGE_KEY = "kakeibo:v1:onboarding-resume"

export interface OnboardingResumeContext {
  // Where to send the user back to once the missing fields are filled in —
  // so an interrupted visit resumes exactly where it left off, not at "/".
  returnTo: string
}

export function getOnboardingResumeContext(): OnboardingResumeContext | null {
  return readJson<OnboardingResumeContext>(ONBOARDING_RESUME_STORAGE_KEY)
}

export function setOnboardingResumeContext(
  context: OnboardingResumeContext
): void {
  writeJson(ONBOARDING_RESUME_STORAGE_KEY, context)
}

export function clearOnboardingResumeContext(): void {
  removeKey(ONBOARDING_RESUME_STORAGE_KEY)
}
