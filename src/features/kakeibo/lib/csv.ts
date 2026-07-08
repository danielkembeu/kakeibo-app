import { resolveItemAmount } from "@/features/kakeibo/services/budgetCalculations"
import type { CategoryDefinition, MonthlyBudget } from "@/features/kakeibo/lib/types"

export function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function budgetToCsv(
  budget: MonthlyBudget,
  categories: CategoryDefinition[]
): string {
  const rows = [["Catégorie", "Poste", "Montant"]]

  for (const category of categories) {
    const items = budget.items[category.id] ?? []
    for (const item of items) {
      rows.push([
        category.label,
        item.name,
        String(resolveItemAmount(item)),
      ])
    }
  }

  return rows
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n")
}
