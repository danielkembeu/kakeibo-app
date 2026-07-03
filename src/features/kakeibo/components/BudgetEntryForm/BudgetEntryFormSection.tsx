import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow"
import { BudgetEntryForm } from "@/features/kakeibo/components/BudgetEntryForm/BudgetEntryForm"

interface BudgetEntryFormSectionProps {
  monthKey: string
}

export function BudgetEntryFormSection({
  monthKey,
}: BudgetEntryFormSectionProps) {
  return (
    <CollapsibleRow label="Saisir / modifier le budget du mois">
      <BudgetEntryForm monthKey={monthKey} />
    </CollapsibleRow>
  )
}
