import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";
import { useAppSettings } from "@/features/kakeibo/hooks/useAppSettings";
import { useBudgetHistory } from "@/features/kakeibo/hooks/useBudgetHistory";
import { useKpis } from "@/features/kakeibo/hooks/useKpis";
import { formatAmount } from "@/features/kakeibo/lib/format";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";

export function SavingsObjectiveCard() {
  const { settings } = useAppSettings();
  const { kpis } = useKpis(getCurrentMonthKey());
  const { history } = useBudgetHistory();

  if (!settings?.savingsObjectivePercent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Objectif d'épargne</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Aucun objectif défini pour l'instant — renseignez un montant
            ci-dessus pour commencer à suivre votre progression.
          </p>
        </CardContent>
      </Card>
    );
  }

  const target = kpis.revenu * settings.savingsObjectivePercent;
  const percent =
    // Le calcul d'origine (kpis.disponible / target) * 100 représente le pourcentage de l'objectif d'épargne atteint.
    // Si 'disponible' vaut 80€ et 'target' vaut 100€, alors (80 / 100) * 100 = 80%, ce qui reflète la progression vers l'objectif.
    // L'inverse (target / kpis.disponible) indiquerait à l'utilisateur combien de fois il a atteint ou dépassé l'objectif, ce qui n'est généralement pas le sens commun recherché pour afficher une progression.
    target > 0
      ? Math.min(100, Math.round((kpis.disponible / target) * 100))
      : 0;

  const monthsReached = history.filter(
    ({ kpis: monthKpis }) =>
      monthKpis.disponible >=
      monthKpis.revenu * settings.savingsObjectivePercent!,
  ).length;

  return (
    <Card className="bg-stat-savings">
      <CardHeader>
        <CardTitle>
          Objectif d'épargne —{" "}
          {Math.round(settings.savingsObjectivePercent * 100)}%
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <Progress value={percent}>
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatAmount(Math.max(0, kpis.disponible))} /{" "}
              {formatAmount(target)}
            </span>

            <span>{percent}%</span>
          </div>
        </Progress>

        <p className="text-xs text-muted-foreground">
          Basé sur le disponible du mois en cours. Modifiable ci-dessus.
        </p>

        {history.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Régularité : {monthsReached}/{history.length} mois où l'objectif a
            été tenu.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
