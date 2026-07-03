import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/features/shared/components/ui/chart"
import { monthKeyToLabel } from "@/features/kakeibo/lib/format"
import type { RoadmapMonth, SavingsGoal } from "@/features/kakeibo/lib/types"

const GOAL_CHART_COLORS = [
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
]

interface BudgetTrendChartProps {
  months: RoadmapMonth[]
  goals: SavingsGoal[]
}

export function BudgetTrendChart({ months, goals }: BudgetTrendChartProps) {
  const chartConfig = {
    revenu: { label: "Revenu", color: "var(--chart-1)" },
    totalDepenses: { label: "Dépenses", color: "var(--chart-2)" },
    ...Object.fromEntries(
      goals.map((goal, index) => [
        goal.id,
        {
          label: goal.label,
          color: GOAL_CHART_COLORS[index % GOAL_CHART_COLORS.length],
        },
      ])
    ),
  } satisfies ChartConfig

  const data = months.map((month) => ({
    label: monthKeyToLabel(month.monthKey),
    revenu: month.revenu,
    totalDepenses: month.totalDepenses,
    ...Object.fromEntries(
      month.goalProgress.map((progress) => [
        progress.goalId,
        progress.cumulativeSavings,
      ])
    ),
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="revenu"
          type="monotone"
          fill="var(--color-revenu)"
          fillOpacity={0.15}
          stroke="var(--color-revenu)"
        />
        <Area
          dataKey="totalDepenses"
          type="monotone"
          fill="var(--color-totalDepenses)"
          fillOpacity={0.15}
          stroke="var(--color-totalDepenses)"
        />
        {goals.map((goal) => (
          <Area
            key={goal.id}
            dataKey={goal.id}
            type="monotone"
            fill={`var(--color-${goal.id})`}
            fillOpacity={0.2}
            stroke={`var(--color-${goal.id})`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
