import { SavingsCumulativeChart } from "@/features/kakeibo/components/SavingsCumulativeChart"
import { SavingsObjectiveCard } from "@/features/kakeibo/components/SavingsObjectiveCard"
import { SavingsObjectiveForm } from "@/features/kakeibo/components/SavingsObjectiveForm"
import { SavingsObjectiveTrendChart } from "@/features/kakeibo/components/SavingsObjectiveTrendChart"

export default function RoadmapPage() {
  return (
    <div className="space-y-4">
      <SavingsObjectiveForm />
      <SavingsObjectiveCard />
      <SavingsObjectiveTrendChart />
      <SavingsCumulativeChart />
    </div>
  )
}
