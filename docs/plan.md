# Kakeibo — Plan d'implémentation

> ✅ **Les 9 phases ci-dessous sont implémentées.** Ce document reste le
> compte-rendu historique du plan initial. Les évolutions décidées et
> construites après coup (séparation Projets/Épargne, objectif d'épargne
> général, reprise d'onboarding, écran d'accueil + import de sauvegarde,
> partage de lien...) sont documentées dans
> [decisions.md](./decisions.md#15-séparation-projets--épargne-feuille-de-route)
> à partir de la décision 15, pas ici.

## Context

L'app Kakeibo (React 19 + Vite + TS + Tailwind v4 + shadcn "base-nova"/@base-ui/react + Zustand + TanStack Query + react-hook-form + Zod + Vitest) est aujourd'hui fonctionnelle mais reste un tracker de dépenses générique avec 4 catégories figées dans le code. Un brainstorming complet (voir `docs/vision.md` et `docs/decisions.md` dans le repo, déjà écrits et approuvés) a établi que l'app doit devenir une réplique fidèle et numérique de la méthode Kakeibo manuelle, pour deux profils (salarié en continu / non-salarié ponctuel), avec : catégories et items configurables, un vrai bilan Kaizen mensuel, une épargne confirmée (pas seulement projetée) avec visualisation de progression motivante, un thème sombre 100% automatique, une séparation nette consultation/édition (Sheet), un export/import de données, un onboarding de première visite, et une page Profil incluant un mini-documentaire sur la méthode. Couleur/dégradés restent réservés aux cartes stat et graphiques ; `framer-motion` est désinstallé au profit de CSS/`tw-animate-css`/View Transitions natives.

Ce plan découpe le travail en 9 phases séquentielles, chacune laissant l'app compilable et testable manuellement avant de passer à la suivante. La phase la plus risquée (migration des catégories) est volontairement placée en premier, tant que la base de code est la plus petite.

Deux constats techniques qui simplifient le plan :
- `@base-ui/react/dialog` et `@base-ui/react/alert-dialog` sont déjà présents dans `node_modules` — `shadcn add sheet`/`alert-dialog` généreront des composants fonctionnels immédiatement.
- Tailwind v4 a un variant `dark:` par défaut déjà branché sur `@media (prefers-color-scheme: dark)`. Le fichier `src/index.css` le surcharge actuellement avec `@custom-variant dark (&:is(.dark *));` — supprimer cette seule ligne (sans toucher aucun composant) restaure le comportement piloté par l'OS pour tous les `dark:` déjà présents dans `button.tsx`, `badge.tsx`, `select.tsx`, etc.

---

## Phase 1 — Migration des catégories (union fermée → données utilisateur)

Le plus gros changement transversal, fait en premier. **L'UI d'édition des catégories est différée en Phase 9** — jusque-là, comportement identique à aujourd'hui, juste piloté par des données au lieu d'une constante.

**Forme cible :** `BudgetItemsByCategory` reste `Record<string, BudgetItem[]>` (identique au JSON déjà en localStorage — zéro script de migration puisque les 4 ids par défaut restent `survie`/`engagement`/`desirs`/`imprevus`). `BudgetCategoryId` devient `string`.

**Fichiers :**
- `lib/types.ts` — `BudgetCategoryId = string`.
- `lib/constants.ts` — `KAKEIBO_CATEGORIES` renommé `DEFAULT_CATEGORIES` (seed), + `CATEGORIES_STORAGE_KEY`.
- `services/budgetRepository.ts` — `listCategories()` (seed au premier lecture + `writeJson`), `saveCategory()`, `deleteCategory()` — même pattern que `saveGoal`/`deleteGoal`.
- `hooks/useCategories.ts` (nouveau) — miroir exact de `useBudgetMonths.ts` (query seule ; mutations ajoutées en Phase 9).
- `lib/schemas.ts` — `budgetFormSchema.items` devient `z.record(z.string(), z.array(budgetItemSchema))`.
- `services/budgetCalculations.ts` — `computeCategoryTotals`, `computeKpis`, `createEmptyBudget` prennent `categories: CategoryDefinition[]` en paramètre au lieu d'importer la constante.
- `services/recommendationEngine.ts`, `services/projectionService.ts` — même changement, `categories` en paramètre.
- `hooks/useMonthlyBudget.ts`, `useKpis.ts`, `useRecommendations.ts`, `useYearRoadmap.ts` — appellent `useCategories()` et composent `isLoading` (même pattern que `useYearRoadmap.ts` déjà aujourd'hui).
- `hooks/useSubmitBudget.ts` — remplace les 4 clés en dur (`survie`/`engagement`/`desirs`/`imprevus`, confirmé dans le fichier actuel) par `Object.fromEntries(Object.entries(values.items).map(([id, items]) => [id, withIds(items)]))`.
- `components/BudgetEntryForm/BudgetEntryForm.tsx`, `CategoryBreakdown.tsx` — `KAKEIBO_CATEGORIES.map` → `useCategories().categories.map`.
- `components/BudgetEntryForm/CategoryItemsFieldArray.tsx` — `useFieldArray({ name: \`items.${category.id}\` })` nécessite un cast explicite unique (`as FieldArrayPath<BudgetFormValues>`) puisque `category.id` n'est plus un littéral de l'union fermée.
- `services/budgetCalculations.test.ts`, `projectionService.test.ts` — mise à jour des appels à `createEmptyBudget` avec une fixture `TEST_CATEGORIES` partagée (nouveau `lib/testFixtures.ts`), réutilisant les mêmes 4 ids par défaut.

**Vérification :** `pnpm test`, `pnpm build`, puis `pnpm dev` → `/` affiche les mêmes 4 catégories qu'avant, ajout/soumission d'item fonctionne, `kakeibo:v1:categories` apparaît en localStorage au premier chargement (devtools).

---

## Phase 2 — Fondations : thème sombre, nettoyage dépendances, Sheet/AlertDialog, tokens de dégradé

**Thème sombre — diff exact de `src/index.css` :** supprimer `@custom-variant dark (&:is(.dark *));` et le sélecteur `.dark { ... }`, remplacer par `@media (prefers-color-scheme: dark) { :root { /* mêmes 17 tokens, mêmes valeurs */ } }`. Aucun changement dans `chart.tsx` : ses `ChartConfig` de ce projet utilisent tous `color: var(--chart-N)` (jamais la variante `theme: {light,dark}`), donc son mapping `THEMES` reste inoffensif — le vrai re-thème vient des tokens `--chart-N` qui basculent via le media query dans `index.css`. Ajouter un commentaire au-dessus de `THEMES` pour éviter qu'un futur lecteur ne le "corrige" inutilement.

**Tokens de dégradé (pour la règle « couleur uniquement sur cartes stat/graphes ») :** ajouter dans `index.css`, même mécanisme que `--chart-N` → `@theme inline` → classes Tailwind générées automatiquement (`bg-stat-income`, etc. via le namespace `--background-image-*`). Un seul point de vérité, pas de système parallèle. (Ce plan ne fixe pas les valeurs de couleur exactes — passe design séparée.)

**Dépendances / scaffolding :**
- `pnpm remove framer-motion` (aucun import existant).
- `pnpm dlx shadcn@latest add sheet alert-dialog` → doivent atterrir dans `src/features/shared/components/ui/` en s'appuyant sur `@base-ui/react/dialog`/`@base-ui/react/alert-dialog`.
- `src/features/shared/lib/viewTransition.ts` (nouveau) — helper `withViewTransition(update)` avec feature-detect `document.startViewTransition`, réutilisé par l'onboarding (Phase 7).

**Vérification :** `pnpm build` sans `framer-motion` ; bascule du thème OS (devtools rendering emulation) sans aucun toggle manuel dans l'app ; test manuel d'ouverture/fermeture d'un Sheet et d'un AlertDialog.

---

## Phase 3 — Extensions du modèle de saisie : mode récurrent/ponctuel + items calculés

**`MonthlyBudget.isRecurring: boolean`** :
- `createEmptyBudget(monthKey, categories, isRecurring = true)`.
- `budgetRepository.ts` : lecture rétrocompatible `budgets[key].isRecurring ?? true` pour les données antérieures à ce champ.
- Nouveau `hooks/useRecurringBudgetMonths.ts` (filtre `useBudgetMonths` sur `isRecurring`), utilisé par `useYearRoadmap.ts` et `useBudgetHistory.ts` — la règle de filtrage vit à la couche hook (métier), pas dans le repository (agnostique du stockage).
- `BudgetEntryForm.tsx` : sélecteur de mode (réutilise `select.tsx`), champ `isRecurring` dans `budgetFormSchema`.
- Note assumée : la navigation mois par mois (`MonthSelector`) n'est pas repensée pour le mode ponctuel dans cette phase — hors scope demandé.

**Items calculés (`quantity × unitAmount`)** :
- `BudgetItem` gagne `computed?: { unitAmount: number; quantity: number; defaultQuantity: number }`, `amount` reste toujours le total effectif (synchronisé à l'écriture) — préféré à une union discriminée pour ne rien casser côté lecteurs existants (`computeCategoryTotals`, `CategoryCard`, futur export CSV).
- `resolveItemAmount(item)` dans `budgetCalculations.ts` — source unique de vérité, utilisée à la fois par l'aperçu live du formulaire et par `useSubmitBudget.ts` avant sauvegarde.
- `schemas.ts` : `budgetItemSchema.computed` optionnel.
- `CategoryItemsFieldArray.tsx` : bouton "Ajouter un poste calculé", deux `NumberInput` (quantité, prix unitaire, réutilise le composant générique existant) + total en lecture seule.
- `CategoryCard.tsx` : affiche `"{quantity} × {formatAmount(unitAmount)}"` sous le nom de l'item quand `computed` est présent.

**Vérification :** ajout d'un item calculé (ex. Transport 20 jours × 500 F), total de catégorie correct ; bascule en mode "Ponctuel", le mois disparaît de `/roadmap` et `/historique` mais reste visible sur `/`.

---

## Phase 4 — Flux de création/édition dans un Sheet

Dépend de la Phase 2.

- Suppression de `BudgetEntryFormSection.tsx`.
- Nouveau `BudgetEntrySheet.tsx` : bouton déclencheur + `Sheet` contenant `BudgetEntryForm`.
- `BudgetEntryForm.tsx` : prop `onSaved?: () => void`, appelée après succès de soumission pour fermer le panneau.
- `pages/BudgetPage.tsx` : devient purement consultation (`MonthSelector`, `BudgetSummaryCard`, `CategoryBreakdown`, `RecommendationsPanel`) + `BudgetEntrySheet` comme CTA claire.

**Vérification :** `/` sans formulaire inline, CTA ouvre le panneau, soumission ferme le panneau et met à jour la vue immédiatement (le pattern `setQueryData`/`invalidateQueries` existant dans `useMonthlyBudget.ts` suffit, aucune plomberie nouvelle).

---

## Phase 5 — Épargne confirmée + progression visuelle A→B

Dépend de la Phase 2 (AlertDialog).

- `types.ts` : `SavingsContribution { id, goalId, monthKey, amount, confirmedAt }`.
- `constants.ts` : `SAVINGS_CONTRIBUTIONS_STORAGE_KEY`.
- `budgetRepository.ts` : `listContributions()`, `saveContribution()` — miroir exact de `saveGoal`.
- `hooks/useSavingsContributions.ts` (nouveau) — miroir de `useSavingsGoals.ts`.
- Nouveau `services/savingsService.ts` (délibérément séparé de `projectionService.ts` pour garder net la distinction projeté/confirmé) : `computeConfirmedProgress(goal, contributions)` → `{ cumulative, percent, reached }`.
- `SavingsGoalRow.tsx` : ajoute la `Progress` (composant déjà installé, jamais utilisé jusqu'ici) liée au confirmé réel + bouton "Confirmer l'épargne de ce mois".
- Nouveau `SavingsContributionAlertDialog.tsx` : `AlertDialog` pré-rempli avec `monthlyContribution`, confirmation → `saveContribution`.

**Vérification :** confirmer des contributions sur plusieurs mois, la barre avance ; vérifier que la barre (confirmé) et le graphe de tendance (`BudgetTrendChart`, projeté) peuvent diverger — preuve que les deux sont bien découplés.

---

## Phase 6 — Bilan Kaizen mensuel

Dépend des Phases 1 et 3 (comparaison au mois précédent n'a de sens que pour un budget récurrent).

- `types.ts` : `KaizenNote { monthKey, promise, createdAt }`.
- `constants.ts` : `KAIZEN_STORAGE_KEY`.
- `budgetRepository.ts` : `getKaizenNote(monthKey)`, `saveKaizenNote()` — un enregistrement par mois, upsert par `monthKey`.
- `hooks/useKaizenNote.ts` (nouveau) — miroir du pattern mutation de `useMonthlyBudget.ts`.
- `recommendationEngine.ts` : `buildKaizenSynthesis(monthKey, kpis, previousKpis, goals, categories)` → recommandations + deltas vs mois précédent (`null` si pas de mois précédent).
- Nouveau `KaizenCard.tsx` : kpis du mois courant + mois précédent (`useKpis(shiftMonthKey(monthKey, -1))`), affiche la promesse du mois dernier, formulaire pour la promesse du mois courant (nécessite `shadcn add textarea`, absent aujourd'hui).
- `BudgetPage.tsx` : `<KaizenCard>` affichée seulement si `budget.isRecurring`.
- Nouveau `recommendationEngine.test.ts` : deltas, cas `previousKpis` absent, passthrough des recommandations.

**Vérification :** deux mois récurrents saisis à la suite → la carte Kaizen affiche la comparaison et la promesse précédente ; la nouvelle promesse persiste après rechargement.

---

## Phase 7 — Entité Settings + onboarding première visite

- `types.ts` : `AppSettings { onboardingCompleted, firstName?, defaultBudgetMode }`, `OnboardingAnswers` (tous champs optionnels, persistance incrémentale).
- `constants.ts` : `SETTINGS_STORAGE_KEY`, `ONBOARDING_ANSWERS_STORAGE_KEY`.
- `budgetRepository.ts` : `getSettings`/`saveSettings` (merge), `getOnboardingAnswers`/`saveOnboardingAnswers` (merge) — chaque réponse est écrite dès qu'elle est donnée, ce qui rend l'onboarding reprenable.
- `hooks/useAppSettings.ts`, `hooks/useOnboardingAnswers.ts` (nouveaux) — même pattern query+mutation que le reste.
- **Choix de state management (tranché)** : réponses durables → TanStack Query + repository + Zod (comme toute autre entité, pas de canal parallèle non validé) ; navigation d'étape éphémère (index courant) → nouveau petit store Zustand `onboardingUiStore.ts`, calqué sur `uiStore.ts` existant (même précédent que `selectedMonthKey`), non persisté (une reprise après rechargement se fait via les réponses durables, pas via la position dans l'assistant).
- Nouveau `pages/OnboardingGate.tsx` : layout route ajoutée dans `router.tsx`, redirige vers `/onboarding` si `!settings.onboardingCompleted`, et inversement.
- `components/Onboarding/` : `OnboardingPage.tsx`, `OnboardingProgress.tsx` (jauge toujours visible), `PrenomStep.tsx`, `ModeStep.tsx`, `RevenuStep.tsx`, `ObjectifStep.tsx` (skippable), `RecapStep.tsx`. Transitions via `withViewTransition` (Phase 2). Chaque étape sauvegarde son champ immédiatement via `saveOnboardingAnswers`.
- "Commencer" sur `RecapStep` : `saveSettings({onboardingCompleted:true, ...})`, crée le budget du mois courant (`createEmptyBudget` + `revenu`), crée l'objectif initial si renseigné, navigue vers `/`.

**Questions retenues (5 max, confirmées)** : prénom → mode salarié/ponctuel → montant de départ → objectif d'épargne initial (optionnel) → récapitulatif + CTA "Commencer".

**Vérification :** localStorage vidé → redirection immédiate vers `/onboarding` ; parcours des 5 écrans, étape optionnelle passée, rechargement à mi-parcours → réponses déjà données pré-remplies ; fin de parcours → redirection vers `/` avec les données reflétées ; `/onboarding` non ré-accessible ensuite.

---

## Phase 8 — Export / Import (JSON) + Export CSV + suppression des données

Dépend de toutes les entités des Phases 1, 3, 5, 6, 7, et de l'AlertDialog (Phase 2).

- `schemas.ts` : `kakeiboExportSchema` (version + payload composé de tous les schémas d'entité complets — ajouter les schémas d'entité complets manquants à ce stade si seules des variantes "form" existaient).
- `budgetRepository.ts` : `exportState()` (lecture des 6 stores), `importState(payload)` (écriture brute via `writeJson`, remplacement complet, pas d'upsert un par un), `clearAllData()` (via `removeKey` sur les 6 clés).
- Nouveau `services/exportImportService.ts` : `downloadJsonExport()`, `parseAndValidateImport(raw)` (échoue explicitement sur JSON invalide, aucune écriture partielle). Téléchargement factorisé dans `src/features/shared/lib/download.ts#downloadFile(...)`, réutilisé pour JSON et CSV.
- Nouveau `lib/csv.ts` : `escapeCsvField` (RFC4180), `budgetToCsv(budget, categories)` — **scope volontairement limité au mois courant** (dépenses uniquement, pas objectifs/contributions/kaizen), zéro dépendance, décidé avec l'utilisateur (SheetJS différé). Utilise `resolveItemAmount` (Phase 3) pour que les items calculés exportent leur total résolu.
- Nouveau `csv.test.ts` : échappement virgule/guillemet, nombre de lignes, résolution des items calculés.
- `ExportSection.tsx` (Profil, Phase 9) : boutons Export JSON / Export CSV (mois courant) / Import JSON (input fichier → parse+validation → `AlertDialog` de confirmation d'écrasement avant `importState`, annulation = aucune écriture).
- `DangerZone.tsx` (Profil, Phase 9) : "Supprimer toutes les données locales" derrière un `AlertDialog`, puis rechargement pour redéclencher l'onboarding sur état vide.

**Vérification :** export JSON conforme au schéma ; suppression totale → retour à l'onboarding ; ré-import du JSON exporté → toutes les données reviennent à l'identique ; import d'un JSON invalide → rejeté, aucune clé `kakeibo:v1:*` modifiée ; export CSV du mois courant → ouverture correcte dans un tableur, y compris avec un nom d'item contenant une virgule.

---

## Phase 9 — Page Profil (assemblage final)

- Nouveau `pages/ProfilePage.tsx`, route `/profil` ajoutée en Phase 7.
- `AppLayout.tsx` : entrée de nav "Profil" ajoutée.
- Nouveau `ActivitySummaryCard.tsx` : dérivé de données déjà existantes (`useBudgetMonths`, `useSavingsGoals` + `useSavingsContributions` via `computeConfirmedProgress`), rien de nouveau à tracker.
- Nouveau `CategoryManager.tsx` : UI d'édition des catégories différée en Phase 1, calquée sur `SavingsGoalList`/`SavingsGoalForm`. `useCategories.ts` étendu avec `saveCategory`/`deleteCategory` (miroir de `useSavingsGoals.ts`).
- `ExportSection.tsx`, `DangerZone.tsx` (Phase 8) assemblés ici.
- Nouveau `KakeiboExplainerSection.tsx` : contenu statique transcrit de `docs/vision.md` (histoire des seaux, formule magique, 4 piliers, 4 buckets, méthode des enveloppes, règle des 30 jours) — JSX pur avec les primitives `Card` existantes, aucune dépendance de données.

**Vérification :** `/profil` reflète les données saisies pendant les phases précédentes ; ajout/édition/suppression d'une catégorie se répercute immédiatement sur `BudgetPage` (invalidation de `useCategories`) ; suppression d'une catégorie utilisée par des mois passés → limitation assumée et documentée (les items historiques ne sont pas purgés, juste non affichés dans la répartition tant que la catégorie n'est pas recréée avec le même id).

---

## Couverture de tests ajoutée

- `budgetCalculations.test.ts`, `projectionService.test.ts` — mise à jour des signatures (Phase 1).
- `recommendationEngine.test.ts` (nouveau, Phase 6) — synthèse Kaizen.
- `csv.test.ts` (nouveau, Phase 8) — échappement et résolution des montants.
- Pas de suite dédiée pour la migration des catégories elle-même (logique de seed simple, vérifiée manuellement) — cohérent avec l'absence de test existant sur `budgetRepository.ts`.

---

## Fichiers critiques

- `src/features/kakeibo/lib/types.ts`
- `src/features/kakeibo/services/budgetRepository.ts`
- `src/features/kakeibo/services/budgetCalculations.ts`
- `src/features/kakeibo/lib/schemas.ts`
- `src/index.css`
- `src/router.tsx`

## Documentation associée

- `docs/vision.md` — la méthode Kakeibo et le principe directeur de l'app
- `docs/decisions.md` — le détail et la justification de chaque décision produit/technique
