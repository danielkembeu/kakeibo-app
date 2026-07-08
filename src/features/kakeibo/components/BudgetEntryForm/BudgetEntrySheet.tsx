import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/features/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/features/shared/components/ui/sheet";
import { BudgetEntryForm } from "@/features/kakeibo/components/BudgetEntryForm/BudgetEntryForm";

interface BudgetEntrySheetProps {
  monthKey: string;
}

export function BudgetEntrySheet({
  monthKey,
}: Readonly<BudgetEntrySheetProps>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} modal="trap-focus">
      <SheetTrigger
        render={
          <Button>
            <Pencil /> Saisir / modifier le budget
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Budget du mois</SheetTitle>
          <SheetDescription>
            Revenu, mode et postes de dépenses par catégorie.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-4 pb-4">
          <BudgetEntryForm monthKey={monthKey} onSaved={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
