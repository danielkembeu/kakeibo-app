import { BudgetEntryFormSection } from "@/features/kakeibo/components/BudgetEntryForm/BudgetEntryFormSection";
import { BudgetSummaryCard } from "@/features/kakeibo/components/BudgetSummaryCard";
import { CategoryBreakdown } from "@/features/kakeibo/components/CategoryBreakdown";
import { MonthSelector } from "@/features/kakeibo/components/MonthSelector";
import { RecommendationsPanel } from "@/features/kakeibo/components/RecommendationsPanel";
import { useKakeiboUiStore } from "@/features/kakeibo/lib/uiStore";

export default function BudgetPage() {
  const selectedMonthKey = useKakeiboUiStore((state) => state.selectedMonthKey);

  return (
    <div className="space-y-4">
      <MonthSelector />
      <BudgetSummaryCard monthKey={selectedMonthKey} />
      <CategoryBreakdown monthKey={selectedMonthKey} />
      <RecommendationsPanel monthKey={selectedMonthKey} />
      <BudgetEntryFormSection monthKey={selectedMonthKey} />
    </div>
  );
}
