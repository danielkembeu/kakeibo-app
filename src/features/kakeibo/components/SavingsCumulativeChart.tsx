import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/features/shared/components/ui/chart";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useYearToDateRoadmap } from "@/features/kakeibo/hooks/useYearToDateRoadmap";
import { monthKeyToLabel } from "@/features/kakeibo/lib/format";

const chartConfig = {
  margeCumulee: { label: "Marge cumulée", color: "var(--chart-2)" },
  objectifCumule: { label: "Épargne cumulée", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function SavingsCumulativeChart() {
  const { settings } = useAppSettings();
  const { roadmap, isLoading } = useYearToDateRoadmap();

  const percent = settings?.savingsObjectivePercent;

  if (isLoading || !percent || roadmap.months.length === 0) return null;

  let margeCumulee = 0;
  let objectifCumule = 0;

  const data = roadmap.months.map((month) => {
    margeCumulee += month.disponible;
    objectifCumule += month.revenu * percent;

    return {
      label: monthKeyToLabel(month.monthKey),
      margeCumulee,
      objectifCumule,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumul d'épargnes</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
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
              dataKey="margeCumulee"
              type="monotone"
              fill="var(--color-margeCumulee)"
              fillOpacity={0.15}
              stroke="var(--color-margeCumulee)"
            />

            <Area
              dataKey="objectifCumule"
              type="monotone"
              fill="var(--color-objectifCumule)"
              fillOpacity={0.1}
              stroke="var(--color-objectifCumule)"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
