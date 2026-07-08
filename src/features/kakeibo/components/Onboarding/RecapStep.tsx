import { useNavigate } from "react-router-dom";

import { Button } from "@/features/shared/components/ui/button";
import { OnboardingProgress } from "@/features/kakeibo/components/Onboarding/OnboardingProgress";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget";
import { useOnboardingAnswers } from "@/features/kakeibo/hooks/useOnboardingAnswers";
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore";
import {
  clearOnboardingResumeContext,
  getOnboardingResumeContext,
} from "@/features/kakeibo/lib/onboardingResume";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations";
import type { ReactNode } from "react";
import { PiggyBank, Repeat, Wallet, Zap, type LucideIcon } from "lucide-react";

export function RecapStep() {
  const step = useOnboardingUiStore((state) => state.step);
  const goToPreviousStep = useOnboardingUiStore(
    (state) => state.goToPreviousStep,
  );
  const navigate = useNavigate();

  const { answers } = useOnboardingAnswers();
  const { categories } = useCategories();
  const { saveSettings } = useAppSettings();
  const { saveBudget } = useMonthlyBudget(getCurrentMonthKey());

  const isRecurring = answers.mode !== "oneoff";
  const savingsObjectivePercent = answers.savingsObjectivePercent ?? 0;
  const resumeContext = getOnboardingResumeContext();

  let title = "C'est prêt !";
  if (resumeContext) {
    title = "Merci !";
  } else if (answers.firstName) {
    title = `Prêt(e), ${answers.firstName} ?`;
  }

  const handleStart = async () => {
    // Resuming an already-onboarded profile after an update: only backfill
    // the missing settings — never touch existing budgets/goals/etc.
    if (!resumeContext) {
      await saveBudget({
        ...createEmptyBudget(getCurrentMonthKey(), categories, isRecurring),
        revenu: answers.startingAmount ?? 0,
      });
    }

    await saveSettings({
      onboardingCompleted: true,
      firstName: answers.firstName,
      defaultBudgetMode: isRecurring ? "recurring" : "oneoff",
      savingsObjectivePercent,
    });

    if (resumeContext) {
      clearOnboardingResumeContext();
      navigate(resumeContext.returnTo, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 sm:mx-auto sm:max-w-md sm:justify-center">
      <OnboardingProgress step={step} />

      <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold mb-6">{title}</h1>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <RecapItem
            Icon={isRecurring ? Repeat : Zap}
            label="Mode"
            value={isRecurring ? "Salarié (récurrent)" : "Ponctuel"}
          />

          <RecapItem
            Icon={Wallet}
            label="Montant de départ"
            value={formatAmount(answers.startingAmount ?? 0)}
          />

          <RecapItem
            Icon={PiggyBank}
            label="Objectif d'épargne"
            value={
              <span className="text-base font-bold">
                {Math.round(savingsObjectivePercent * 100)}% (
                {formatAmount(
                  (answers.startingAmount ?? 0) * savingsObjectivePercent,
                )}{" "}
                )
              </span>
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="ghost" onClick={goToPreviousStep}>
          Précédent
        </Button>

        <Button type="button" onClick={handleStart}>
          {resumeContext ? "Continuer" : "Commencer"}
        </Button>
      </div>
    </div>
  );
}

interface RecapItemProps {
  label: string;
  value: ReactNode;
  Icon: LucideIcon;
}

function RecapItem({ label, value, Icon }: Readonly<RecapItemProps>) {
  return (
    <div className="bg-accent/35 rounded-lg px-6 py-5 flex items-center gap-6">
      <div className="rounded-full bg-gray-200 dark:bg-accent flex items-center justify-center w-11 h-11">
        <Icon strokeWidth={1.4} size={22} />
      </div>

      <div className="flex flex-col items-start flex-1">
        <span className="text-xs md:text-sm text-foreground">{label}</span>

        <span className="text-base font-bold">{value}</span>
      </div>
    </div>
  );
}
