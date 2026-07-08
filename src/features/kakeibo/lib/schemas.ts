import { z } from "zod";

export const budgetItemComputedSchema = z.object({
  unitAmount: z.number().min(0, "Prix unitaire invalide"),
  quantity: z.number().min(0, "Quantité invalide"),
  defaultQuantity: z.number().min(0, "Quantité par défaut invalide"),
});

export const budgetItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom requis"),
  amount: z.number().min(0, "Montant invalide"),
  computed: budgetItemComputedSchema.optional(),
});

export const budgetFormSchema = z.object({
  revenu: z.number().positive("Le revenu doit être positif"),
  items: z.record(z.string(), z.array(budgetItemSchema)),
  isRecurring: z.boolean(),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export const savingsGoalFormSchema = z.object({
  label: z.string().min(1, "Nom de l'objectif requis"),
  targetAmount: z.number().positive("Le montant cible doit être positif"),
  monthlyContribution: z
    .number()
    .positive("La contribution mensuelle doit être positive"),
  startMonthKey: z.string().regex(/^\d{4}-\d{2}$/, "Mois invalide"),
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>;

export const savingsContributionFormSchema = z.object({
  amount: z.number().min(0, "Montant invalide"),
});

export type SavingsContributionFormValues = z.infer<
  typeof savingsContributionFormSchema
>;

export const kaizenFormSchema = z.object({
  promise: z.string().max(500, "500 caractères maximum"),
});

export type KaizenFormValues = z.infer<typeof kaizenFormSchema>;

export const categoryFormSchema = z.object({
  emoji: z.string().min(1, "Emoji requis"),
  label: z.string().min(1, "Nom requis"),
  color: z.string().min(1, "Couleur requise"),
  recommendedRatio: z
    .number()
    .min(0, "Doit être ≥ 0")
    .max(1, "Doit être ≤ 100%"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const budgetModeSchema = z.enum(["recurring", "oneoff"]);

export const appSettingsSchema = z.object({
  onboardingCompleted: z.boolean(),
  firstName: z.string().optional(),
  defaultBudgetMode: budgetModeSchema,
  savingsObjectivePercent: z.number().min(0).max(1).optional(),
});

export const onboardingAnswersSchema = z.object({
  firstName: z.string().optional(),
  mode: budgetModeSchema.optional(),
  startingAmount: z.number().optional(),
  savingsObjectivePercent: z.number().min(0).max(1).optional(),
});

export type OnboardingAnswersFormValues = z.infer<
  typeof onboardingAnswersSchema
>;

// Full entity schemas — used for export/import round-trips, distinct from
// the *FormSchema variants above which validate user-entered form subsets.
export const monthlyBudgetSchema = z.object({
  monthKey: z.string(),
  revenu: z.number(),
  items: z.record(z.string(), z.array(budgetItemSchema)),
  isRecurring: z.boolean(),
});

export const categoryDefinitionSchema = z.object({
  id: z.string(),
  emoji: z.string(),
  label: z.string(),
  color: z.string(),
  recommendedRatio: z.number(),
});

export const savingsGoalSchema = z.object({
  id: z.string(),
  label: z.string(),
  targetAmount: z.number(),
  monthlyContribution: z.number(),
  startMonthKey: z.string(),
});

export const savingsContributionSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  monthKey: z.string(),
  amount: z.number(),
  confirmedAt: z.string(),
});

export const kaizenNoteSchema = z.object({
  monthKey: z.string(),
  promise: z.string(),
  createdAt: z.string(),
});

export const kakeiboExportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    budgets: z.array(monthlyBudgetSchema),
    goals: z.array(savingsGoalSchema),
    categories: z.array(categoryDefinitionSchema),
    contributions: z.array(savingsContributionSchema),
    kaizenNotes: z.array(kaizenNoteSchema),
    settings: appSettingsSchema,
  }),
});

export type KakeiboExportPayload = z.infer<typeof kakeiboExportSchema>;
