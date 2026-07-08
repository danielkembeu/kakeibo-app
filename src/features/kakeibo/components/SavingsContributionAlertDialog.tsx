import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { useSavingsContributions } from "@/features/kakeibo/hooks/useSavingsContributions";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import type { SavingsGoal } from "@/features/kakeibo/lib/types";

interface SavingsContributionAlertDialogProps {
  goal: SavingsGoal;
}

export function SavingsContributionAlertDialog({
  goal,
}: SavingsContributionAlertDialogProps) {
  const { saveContribution } = useSavingsContributions();
  const [amount, setAmount] = useState(goal.monthlyContribution);

  const confirm = () => {
    saveContribution({
      goalId: goal.id,
      monthKey: getCurrentMonthKey(),
      amount,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        Confirmer l'épargne de ce mois
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Épargne pour « {goal.label} »</AlertDialogTitle>
          <AlertDialogDescription>
            Avez-vous effectivement mis de côté{" "}
            {formatAmount(goal.monthlyContribution)} ce mois-ci ? Ajustez le
            montant si besoin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
