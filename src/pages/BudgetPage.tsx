import { BudgetEntrySheet } from "@/features/kakeibo/components/BudgetEntryForm/BudgetEntrySheet";
import { BudgetSummaryCard } from "@/features/kakeibo/components/BudgetSummaryCard";
import { CategoryBreakdown } from "@/features/kakeibo/components/CategoryBreakdown";
import { KaizenCard } from "@/features/kakeibo/components/KaizenCard";
import { MonthSelector } from "@/features/kakeibo/components/MonthSelector";
import { RecommendationsPanel } from "@/features/kakeibo/components/RecommendationsPanel";
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget";
import { useKakeiboUiStore } from "@/features/kakeibo/lib/uiStore";

export default function BudgetPage() {
  const selectedMonthKey = useKakeiboUiStore((state) => state.selectedMonthKey);
  const { budget } = useMonthlyBudget(selectedMonthKey);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <MonthSelector />
        <BudgetEntrySheet monthKey={selectedMonthKey} />
      </div>

      <BudgetSummaryCard monthKey={selectedMonthKey} />
      <CategoryBreakdown monthKey={selectedMonthKey} />
      <RecommendationsPanel monthKey={selectedMonthKey} />
      {budget.isRecurring && <KaizenCard monthKey={selectedMonthKey} />}
    </div>
  );
}
