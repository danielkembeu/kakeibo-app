import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/features/shared/components/ui/button"
import { monthKeyToLabel } from "@/features/kakeibo/lib/format"
import { useKakeiboUiStore } from "@/features/kakeibo/lib/uiStore"

export function MonthSelector() {
  const selectedMonthKey = useKakeiboUiStore((state) => state.selectedMonthKey)
  const goToPreviousMonth = useKakeiboUiStore((state) => state.goToPreviousMonth)
  const goToNextMonth = useKakeiboUiStore((state) => state.goToNextMonth)
  const goToCurrentMonth = useKakeiboUiStore((state) => state.goToCurrentMonth)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousMonth}
        aria-label="Mois précédent"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="ghost"
        onClick={goToCurrentMonth}
        className="min-w-40 flex-1 capitalize"
      >
        {monthKeyToLabel(selectedMonthKey)}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextMonth}
        aria-label="Mois suivant"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
