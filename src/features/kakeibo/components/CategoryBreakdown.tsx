import { CategoryCard } from "@/features/kakeibo/components/CategoryCard"
import { useKpis } from "@/features/kakeibo/hooks/useKpis"
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget"
import { useCategories } from "@/features/kakeibo/hooks/useCategories"

interface CategoryBreakdownProps {
  monthKey: string
}

export function CategoryBreakdown({ monthKey }: CategoryBreakdownProps) {
  const { budget } = useMonthlyBudget(monthKey)
  const { kpis } = useKpis(monthKey)
  const { categories } = useCategories()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {categories.map((category) => {
        const categoryTotal = kpis.categoryTotals.find(
          (c) => c.id === category.id
        )

        return (
          <CategoryCard
            key={category.id}
            category={category}
            items={budget.items[category.id]}
            total={categoryTotal?.total ?? 0}
            ratio={categoryTotal?.ratio ?? 0}
            overRecommended={categoryTotal?.overRecommended ?? false}
          />
        )
      })}
    </div>
  )
}
