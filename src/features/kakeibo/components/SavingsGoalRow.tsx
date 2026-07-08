import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow";
import { Progress } from "@/features/shared/components/ui/progress";
import { SavingsGoalForm } from "@/features/kakeibo/components/SavingsGoalForm";
import { SavingsContributionAlertDialog } from "@/features/kakeibo/components/SavingsContributionAlertDialog";
import { useSavingsContributions } from "@/features/kakeibo/hooks/useSavingsContributions";
import { formatAmount, monthKeyToLabel } from "@/features/kakeibo/lib/format";
import { computeConfirmedProgress } from "@/features/kakeibo/services/savingsService";
import type { SavingsGoal } from "@/features/kakeibo/lib/types";

interface SavingsGoalRowProps {
  goal: SavingsGoal;
}

export function SavingsGoalRow({ goal }: SavingsGoalRowProps) {
  const { contributions } = useSavingsContributions();
  const progress = computeConfirmedProgress(goal, contributions);

  return (
    <CollapsibleRow
      label={
        <span>
          {goal.label} — {formatAmount(goal.targetAmount)}{" "}
          <span className="font-normal text-muted-foreground capitalize">
            (dès {monthKeyToLabel(goal.startMonthKey)})
          </span>
        </span>
      }
    >
      <div className="space-y-2 pb-2">
        <Progress value={progress.percent}>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatAmount(progress.cumulative)} /{" "}
              {formatAmount(goal.targetAmount)}
            </span>

            <span>
              {progress.reached
                ? "Objectif atteint 🎉"
                : `${progress.percent}%`}
            </span>
          </div>
        </Progress>

        <SavingsContributionAlertDialog goal={goal} />
      </div>
      <SavingsGoalForm goal={goal} />
    </CollapsibleRow>
  );
}
