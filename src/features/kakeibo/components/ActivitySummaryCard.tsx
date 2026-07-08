import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { useBudgetMonths } from "@/features/kakeibo/hooks/useBudgetMonths";
import { useSavingsContributions } from "@/features/kakeibo/hooks/useSavingsContributions";
import { useSavingsGoals } from "@/features/kakeibo/hooks/useSavingsGoals";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { computeConfirmedProgress } from "@/features/kakeibo/services/savingsService";

export function ActivitySummaryCard() {
  const { data: months } = useBudgetMonths();
  const { goals } = useSavingsGoals();
  const { contributions } = useSavingsContributions();

  const totalConfirmedSavings = goals.reduce(
    (sum, goal) =>
      sum + computeConfirmedProgress(goal, contributions).cumulative,
    0,
  );
  const goalsReached = goals.filter(
    (goal) => computeConfirmedProgress(goal, contributions).reached,
  ).length;

  return (
    <Card className="bg-stat-savings">
      <CardHeader>
        <CardTitle>Votre activité</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-bold">{months?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">mois suivis</p>
        </div>
        <div>
          <p className="text-lg font-bold">
            {formatAmount(totalConfirmedSavings)}
          </p>
          <p className="text-xs text-muted-foreground">épargné (confirmé)</p>
        </div>
        <div>
          <p className="text-lg font-bold">{goalsReached}</p>
          <p className="text-xs text-muted-foreground">objectifs atteints</p>
        </div>
      </CardContent>
    </Card>
  );
}