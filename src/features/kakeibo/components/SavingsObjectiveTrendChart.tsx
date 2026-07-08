import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/features/shared/components/ui/chart"
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings"
import { useBudgetHistory } from "@/features/kakeibo/hooks/useBudgetHistory"
import { monthKeyToLabel } from "@/features/kakeibo/lib/format"

const chartConfig = {
  marge: { label: "Marge disponible", color: "var(--chart-2)" },
  objectif: { label: "Objectif", color: "var(--chart-4)" },
} satisfies ChartConfig

export function SavingsObjectiveTrendChart() {
  const { settings } = useAppSettings()
  const { history, isLoading } = useBudgetHistory()

  const percent = settings?.savingsObjectivePercent
  if (isLoading || !percent || history.length === 0) return null

  // useBudgetHistory returns most-recent-first; a trend chart reads
  // chronologically left to right.
  const data = [...history].reverse().map(({ budget, kpis }) => ({
    label: monthKeyToLabel(budget.monthKey),
    marge: kpis.disponible,
    objectif: kpis.revenu * percent,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="marge"
          type="monotone"
          fill="var(--color-marge)"
          fillOpacity={0.15}
          stroke="var(--color-marge)"
        />
        <Area
          dataKey="objectif"
          type="monotone"
          fill="var(--color-objectif)"
          fillOpacity={0.1}
          stroke="var(--color-objectif)"
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ChartContainer>
  )
}
