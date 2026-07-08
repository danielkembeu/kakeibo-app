import { formatAmount, toPercent } from "@/features/kakeibo/lib/format";
import type {
  BudgetKpis,
  CategoryDefinition,
  KaizenSynthesis,
  Recommendation,
  SavingsGoal,
} from "@/features/kakeibo/lib/types";

function buildGoalsRecommendation(
  monthKey: string,
  kpis: BudgetKpis,
  goals: SavingsGoal[],
): Recommendation | null {
  const activeGoals = goals.filter((goal) => goal.startMonthKey <= monthKey);

  if (activeGoals.length === 0) {
    return {
      level: "info",
      message: `Il vous reste ${formatAmount(
        kpis.disponible,
      )} ce mois-ci. Définissez un objectif d'épargne pour le mettre à profit.`,
    };
  }

  const totalContribution = activeGoals.reduce(
    (sum, goal) => sum + goal.monthlyContribution,
    0,
  );

  const labels = activeGoals.map((goal) => goal.label).join(", ");

  if (kpis.disponible >= totalContribution) {
    return {
      level: "success",
      message: `Vous pouvez financer vos objectifs (${labels}) pour un total de ${formatAmount(
        totalContribution,
      )}/mois et garder ${formatAmount(
        kpis.disponible - totalContribution,
      )} de marge.`,
    };
  }

  return {
    level: "warning",
    message: `Le disponible (${formatAmount(
      kpis.disponible,
    )}) ne couvre pas vos contributions prévues (${formatAmount(
      totalContribution,
    )}/mois pour ${activeGoals.length} objectif(s) : ${labels}).`,
  };
}

export function buildRecommendations(
  monthKey: string,
  kpis: BudgetKpis,
  goals: SavingsGoal[],
  categories: CategoryDefinition[],
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (kpis.isDeficit) {
    recommendations.push({
      level: "warning",
      message: `Budget déficitaire de ${formatAmount(
        Math.abs(kpis.disponible),
      )}. Réduisez en priorité les postes en dépassement ci-dessous.`,
    });
  }

  for (const category of kpis.categoryTotals) {
    if (!category.overRecommended) continue;

    const definition = categories.find((c) => c.id === category.id);

    if (!definition) continue;

    recommendations.push({
      level: "warning",
      message: `${definition.emoji} ${definition.label} représente ${toPercent(
        category.total,
        kpis.revenu,
      )}% du revenu (recommandé ≤ ${Math.round(
        definition.recommendedRatio * 100,
      )}%).`,
    });
  }

  if (!kpis.isDeficit) {
    const goalsRecommendation = buildGoalsRecommendation(monthKey, kpis, goals);
    if (goalsRecommendation) recommendations.push(goalsRecommendation);
  }

  const hasWarning = recommendations.some((r) => r.level === "warning");
  if (!hasWarning) {
    recommendations.push({
      level: "success",
      message: "Répartition équilibrée ce mois-ci — maintenez le cap.",
    });
  }

  return recommendations;
}

export function buildKaizenSynthesis(
  monthKey: string,
  kpis: BudgetKpis,
  previousKpis: BudgetKpis | null,
  goals: SavingsGoal[],
  categories: CategoryDefinition[],
): KaizenSynthesis {
  return {
    recommendations: buildRecommendations(monthKey, kpis, goals, categories),
    comparison: previousKpis
      ? {
          revenuDelta: kpis.revenu - previousKpis.revenu,
          depensesDelta: kpis.totalDepenses - previousKpis.totalDepenses,
          disponibleDelta: kpis.disponible - previousKpis.disponible,
        }
      : null,
  };
}
