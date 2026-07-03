import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card"
import { cn } from "@/features/shared/lib/utils"
import { formatAmount, monthKeyToLabel } from "@/features/kakeibo/lib/format"
import type { BudgetKpis, MonthlyBudget } from "@/features/kakeibo/lib/types"

interface HistoryMonthCardProps {
  budget: MonthlyBudget
  kpis: BudgetKpis
}

export function HistoryMonthCard({ budget, kpis }: HistoryMonthCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="capitalize">
          {monthKeyToLabel(budget.monthKey)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Revenu {formatAmount(kpis.revenu)}
        </span>
        <span className={cn(kpis.isDeficit && "text-destructive")}>
          Disponible {formatAmount(kpis.disponible)}
        </span>
      </CardContent>
    </Card>
  )
}
