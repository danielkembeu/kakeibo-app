import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow"
import { SavingsGoalForm } from "@/features/kakeibo/components/SavingsGoalForm"
import { formatAmount, monthKeyToLabel } from "@/features/kakeibo/lib/format"
import type { SavingsGoal } from "@/features/kakeibo/lib/types"

interface SavingsGoalRowProps {
  goal: SavingsGoal
}

export function SavingsGoalRow({ goal }: SavingsGoalRowProps) {
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
      <SavingsGoalForm goal={goal} />
    </CollapsibleRow>
  )
}
