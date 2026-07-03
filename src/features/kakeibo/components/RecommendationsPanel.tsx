import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

import {
  Alert,
  AlertDescription,
} from "@/features/shared/components/ui/alert"
import { cn } from "@/features/shared/lib/utils"
import { useRecommendations } from "@/features/kakeibo/hooks/useRecommendations"
import type { RecommendationLevel } from "@/features/kakeibo/lib/types"

interface RecommendationsPanelProps {
  monthKey: string
}

const ICONS: Record<RecommendationLevel, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
}

const SUCCESS_CLASSNAMES =
  "border-emerald-600/30 text-emerald-700 dark:text-emerald-400 *:[svg]:text-emerald-600"

export function RecommendationsPanel({ monthKey }: RecommendationsPanelProps) {
  const { recommendations } = useRecommendations(monthKey)

  return (
    <div className="space-y-2">
      {recommendations.map((recommendation, index) => {
        const Icon = ICONS[recommendation.level]

        return (
          <Alert
            key={index}
            variant={
              recommendation.level === "warning" ? "destructive" : "default"
            }
            className={cn(
              recommendation.level === "success" && SUCCESS_CLASSNAMES
            )}
          >
            <Icon />
            <AlertDescription>{recommendation.message}</AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
