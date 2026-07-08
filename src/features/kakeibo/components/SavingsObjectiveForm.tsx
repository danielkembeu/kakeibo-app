import { useState } from "react";

import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import type { AppSettings } from "@/features/kakeibo/lib/types";

interface SavingsObjectiveFormInnerProps {
  settings: AppSettings;
  revenu: number;
  saveSettings: (patch: Partial<AppSettings>) => Promise<AppSettings>;
}

function SavingsObjectiveFormInner({
  settings,
  revenu,
  saveSettings,
}: Readonly<SavingsObjectiveFormInnerProps>) {
  const [amount, setAmount] = useState(
    (settings.savingsObjectivePercent ?? 0) * revenu,
  );

  const percent = revenu > 0 ? Math.round((amount / revenu) * 100) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (revenu <= 0) return;
        saveSettings({ savingsObjectivePercent: amount / revenu });
      }}
      className="flex items-end gap-3"
    >
      <div className="grid md:flex flex-1 md:items-end gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="savings-objective-amount">Montant à épargner</Label>

          <Input
            id="savings-objective-amount"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
          />
        </div>

        <p className="pb-2 text-sm text-muted-foreground">
          {revenu > 0
            ? `= ${percent}% de votre revenu (${formatAmount(revenu)})`
            : "Renseignez d'abord le revenu du mois en cours."}
        </p>
      </div>

      <Button type="submit" disabled={revenu <= 0}>
        Enregistrer
      </Button>
    </form>
  );
}

export function SavingsObjectiveForm() {
  const {
    settings,
    saveSettings,
    isLoading: isSettingsLoading,
  } = useAppSettings();
  const { kpis, isLoading: isKpisLoading } = useKpis(getCurrentMonthKey());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectif d'épargne</CardTitle>
        <CardDescription>
          Le montant que vous voulez systématiquement mettre de côté chaque
          mois.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isSettingsLoading && !isKpisLoading && settings && (
          <SavingsObjectiveFormInner
            settings={settings}
            revenu={kpis.revenu}
            saveSettings={saveSettings}
          />
        )}
      </CardContent>
    </Card>
  );
}
