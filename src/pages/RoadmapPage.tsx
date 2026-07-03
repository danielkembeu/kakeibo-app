import { BudgetTrendChart } from "@/features/kakeibo/components/BudgetTrendChart"
import { RoadmapTimeline } from "@/features/kakeibo/components/RoadmapTimeline"
import { SavingsGoalList } from "@/features/kakeibo/components/SavingsGoalList"
import { useYearRoadmap } from "@/features/kakeibo/hooks/useYearRoadmap"

export default function RoadmapPage() {
  const { roadmap, isLoading } = useYearRoadmap()

  if (isLoading) return null

  return (
    <div className="space-y-4">
      <SavingsGoalList />
      <BudgetTrendChart months={roadmap.months} goals={roadmap.goals} />
      <RoadmapTimeline months={roadmap.months} />
    </div>
  )
}
