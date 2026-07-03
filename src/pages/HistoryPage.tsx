import { HistoryMonthCard } from "@/features/kakeibo/components/HistoryMonthCard"
import { useBudgetHistory } from "@/features/kakeibo/hooks/useBudgetHistory"

export default function HistoryPage() {
  const { history, isLoading } = useBudgetHistory()

  if (isLoading) return null

  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun mois saisi pour le moment.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {history.map(({ budget, kpis }) => (
        <HistoryMonthCard key={budget.monthKey} budget={budget} kpis={kpis} />
      ))}
    </div>
  )
}
