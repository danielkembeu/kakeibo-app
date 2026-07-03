import { z } from "zod"

export const budgetItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom requis"),
  amount: z.number().min(0, "Montant invalide"),
})

export const budgetFormSchema = z.object({
  revenu: z.number().positive("Le revenu doit être positif"),
  items: z.object({
    survie: z.array(budgetItemSchema),
    engagement: z.array(budgetItemSchema),
    desirs: z.array(budgetItemSchema),
    imprevus: z.array(budgetItemSchema),
  }),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>

export const savingsGoalFormSchema = z.object({
  label: z.string().min(1, "Nom de l'objectif requis"),
  targetAmount: z.number().positive("Le montant cible doit être positif"),
  monthlyContribution: z
    .number()
    .positive("La contribution mensuelle doit être positive"),
  startMonthKey: z.string().regex(/^\d{4}-\d{2}$/, "Mois invalide"),
})

export type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>
