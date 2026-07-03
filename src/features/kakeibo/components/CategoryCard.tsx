import { Badge } from "@/features/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card"
import { formatAmount } from "@/features/kakeibo/lib/format"
import type { BudgetItem, CategoryDefinition } from "@/features/kakeibo/lib/types"

interface CategoryCardProps {
  category: CategoryDefinition
  items: BudgetItem[]
  total: number
  ratio: number
  overRecommended: boolean
}

export function CategoryCard({
  category,
  items,
  total,
  ratio,
  overRecommended,
}: CategoryCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>
          {category.emoji} {category.label}
        </CardTitle>
        {overRecommended && <Badge variant="destructive">Dépassement</Badge>}
      </CardHeader>
      <CardContent className="space-y-1">
        {items.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">Non budgété</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2 text-xs">
              <span className="flex-1 text-muted-foreground">{item.name}</span>
              <span className="font-mono font-medium">
                {formatAmount(item.amount)}
              </span>
            </div>
          ))
        )}
        <div className="mt-2 flex items-center justify-between border-t pt-2">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-mono text-sm font-bold">
            {formatAmount(total)}
          </span>
        </div>
        <p className="text-right text-[11px] text-muted-foreground">
          {Math.round(ratio * 100)}% du revenu
        </p>
      </CardContent>
    </Card>
  )
}
