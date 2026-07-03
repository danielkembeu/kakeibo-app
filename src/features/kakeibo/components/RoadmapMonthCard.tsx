import { Trophy } from "lucide-react"

import { Badge } from "@/features/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card"
import { Separator } from "@/features/shared/components/ui/separator"
import { cn } from "@/features/shared/lib/utils"
import { formatAmount, monthKeyToLabel } from "@/features/kakeibo/lib/format"
import type { RoadmapMonth } from "@/features/kakeibo/lib/types"

interface RoadmapMonthCardProps {
  month: RoadmapMonth
}

export function RoadmapMonthCard({ month }: RoadmapMonthCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="capitalize">
          {monthKeyToLabel(month.monthKey)}
        </CardTitle>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {!month.isExplicit && <Badge variant="outline">Estimé</Badge>}
          {month.goalsReachedThisMonth.map((reached) => (
            <Badge key={reached.goalId} className="gap-1">
              <Trophy className="size-3" /> {reached.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Revenu</span>
          <span className="font-mono">{formatAmount(month.revenu)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Dépenses</span>
          <span className="font-mono">{formatAmount(month.totalDepenses)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-sm font-medium">
          <span>Disponible</span>
          <span
            className={cn(
              "font-mono",
              month.disponible < 0 && "text-destructive"
            )}
          >
            {formatAmount(month.disponible)}
          </span>
        </div>
        {month.totalCumulativeSavings > 0 && (
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Épargne cumulée</span>
            <span className="font-mono">
              {formatAmount(month.totalCumulativeSavings)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
