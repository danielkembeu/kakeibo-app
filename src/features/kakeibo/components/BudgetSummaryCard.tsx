import { Badge } from "@/features/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";
import { cn } from "@/features/shared/lib/utils";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { formatAmount } from "@/features/kakeibo/lib/format";

interface BudgetSummaryCardProps {
  monthKey: string;
}

export function BudgetSummaryCard({
  monthKey,
}: Readonly<BudgetSummaryCardProps>) {
  const { kpis } = useKpis(monthKey);

  return (
    <Card className={kpis.isDeficit ? "bg-stat-expense" : "bg-stat-income"}>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Revenu mensuel</CardTitle>
          <p className="mt-1 font-mono text-2xl font-bold">
            {formatAmount(kpis.revenu)}
          </p>
        </div>
        <div className="text-right">
          <Badge variant={kpis.isDeficit ? "destructive" : "secondary"}>
            {kpis.isDeficit ? "Déficit" : "Disponible"}
          </Badge>
          <p
            className={cn(
              "mt-1 font-mono text-2xl font-bold",
              kpis.isDeficit && "text-destructive",
            )}
          >
            {formatAmount(kpis.disponible)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Dépenses : {formatAmount(kpis.totalDepenses)}</span>
          <span>{kpis.depensesRatio}%</span>
        </div>

        <Progress value={kpis.depensesRatio} />
      </CardContent>
    </Card>
  );
}
