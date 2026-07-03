import { RoadmapMonthCard } from "@/features/kakeibo/components/RoadmapMonthCard"
import type { RoadmapMonth } from "@/features/kakeibo/lib/types"

interface RoadmapTimelineProps {
  months: RoadmapMonth[]
}

export function RoadmapTimeline({ months }: RoadmapTimelineProps) {
  return (
    <div className="space-y-3">
      {months.map((month) => (
        <RoadmapMonthCard key={month.monthKey} month={month} />
      ))}
    </div>
  )
}
