# Décisions produit &amp; techniques

Chaque décision est présentée avec sa justification. L'état existant du code au
moment du brainstorming est en italique quand pertinent.

## 1. Deux modes de budget : récurrent vs ponctuel

Un flag (`isRecurring` ou équivalent) distingue un budget mensuel salarié d'un
budget ponctuel non salarié. Les deux réutilisent le même modèle de catégories,
items, calcul de KPIs et recommandations — seul le budget récurrent alimente la
feuille de route (roadmap) et l'historique mensuel.
*Existant : `MonthlyBudget` est aujourd'hui toujours récurrent, ancré sur `monthKey`.*

## 2. Catégories configurables

Les 4 catégories (`KAKEIBO_CATEGORIES`) et leurs ratios cibles deviennent des
données utilisateur éditables (nom, emoji, couleur, ratio), avec les valeurs
Kakeibo classiques en défaut — plutôt qu'une constante figée dans le code.
*Existant : `constants.ts` définit 4 catégories en dur (Survie 55%, Engagement
10%, Désirs 25%, Imprévus 10%) — la catégorie « Engagement » ne correspond pas
exactement au bucket « Culture » de la méthode source ; la rendre éditable
permet à l'utilisateur de corriger ça lui-même.*

## 3. Items calculés (quantité × prix unitaire)

Généralisation du besoin « transport » : un item peut être un montant fixe ou le
produit `quantité × prix unitaire` (ex. jours travaillés/mois × coût du trajet),
avec une quantité par défaut configurable. Réutilisable pour tout poste
répétitif, pas seulement le transport.

## 4. Kaizen — bilan mensuel

Le 4ᵉ pilier (« la promesse ») devient une fonctionnalité à part entière : à la
clôture du mois, synthèse des recommandations déjà calculées + comparaison au
mois précédent + un champ libre où l'utilisateur écrit son engagement pour le
mois suivant, réaffiché au mois d'après.

## 5. Épargne réelle confirmée, avec progression visuelle

Les objectifs d'épargne sont aujourd'hui **projetés** (on suppose la contribution
mensuelle tenue). On ajoute un registre de contributions réelles confirmées
(goalId, mois, montant), alimenté par un AlertDialog de fin de mois
(« avez-vous effectivement mis de côté X ? »). Le composant `SavingsGoalRow`
affiche une barre de progression (`Progress`, déjà installé mais inutilisé)
basée sur le **confirmé réel**, pas la projection — montrer clairement
l'avancée de A vers B est explicitement identifié comme un facteur de
motivation.

## 6. Stockage : localStorage conservé, pas de SQLite

Le SQLite en WASM ne résout pas le vrai problème posé (portabilité entre
navigateurs/appareils) — il reste local comme localStorage. Le repository est
déjà abstrait derrière une interface (`BudgetRepository`), donc changer de
moteur de stockage plus tard coûtera peu si le besoin apparaît (ex. backend/sync
multi-appareils).

## 7. Export / Import

- **JSON** : bidirectionnel, c'est le format de transfert de données complet
  d'un navigateur à un autre (export + import), validé par les schémas Zod déjà
  en place avant écriture en localStorage. Écrasement de données existantes
  confirmé via AlertDialog.
- **CSV/XLSX** : export uniquement, réservé aux petits blocs de données simples
  qui ne seront pas corrompus par un aller-retour dans Excel (ex. dépenses d'un
  mois). Pas d'import CSV/XLSX — un tableur reformaté à la main casserait
  silencieusement une reconstruction d'état complexe (catégories imbriquées,
  objectifs, registre d'épargne).
- *Tranché* : CSV uniquement pour l'instant, zéro dépendance. Un vrai `.xlsx`
  (multi-feuilles, formaté, nécessiterait SheetJS) est explicitement différé.

## 8. Analytics : décompte d'utilisateurs anonyme

Pas de tracking IP fait maison (donnée personnelle sous RGPD, complexité
inutile pour un simple chiffre). Recommandation : un outil externe respectueux
de la vie privée, sans cookies (Plausible, Umami self-hosted, ou Fathom).

## 9. Thème sombre 100% automatique

`prefers-color-scheme` piloté uniquement par le système d'exploitation, aucun
bouton de bascule manuel. Techniquement : remplacer le bloc `.dark { ... }`
(actuellement piloté par une classe JS jamais posée) par un
`@media (prefers-color-scheme: dark) { :root { ... } }`. Les valeurs de couleur
ne changent pas, seul le déclencheur change.

## 10. Séparer consultation et édition

Le formulaire de budget (multi-catégories, listes dynamiques d'items) sort de
`BudgetPage` et s'ouvre dans un **Sheet**. L'**AlertDialog** est réservé aux
décisions courtes interruptives : confirmation d'épargne réelle, écrasement de
données à l'import, suppression du localStorage.

## 11. Couleur limitée aux cartes stat &amp; graphiques

Seuls les composants de type carte statistique et graphique (KPIs, répartition
par catégorie, courbe de tendance, barres de progression d'épargne) ont droit
aux couleurs/dégradés. Le reste de l'interface (boutons, formulaires,
navigation) reste neutre noir/blanc/gris — pas de changement de palette de base,
seulement plus de hiérarchie et de rythme visuel.

## 12. Animations : pas de framer-motion

`tw-animate-css` (déjà présent) + les animations natives de Sheet/AlertDialog
(base-ui) + l'API `View Transitions` native du navigateur couvrent tous les
besoins identifiés (onboarding plein écran, ouverture de panneaux, progression
animée). `framer-motion` n'est utile pour aucun cas du plan actuel →
recommandé à désinstaller.
*Note technique : le composant React `<ViewTransition>` est expérimental et
absent de React 19.2.7 stable (vérifié dans `node_modules`) — on utilise l'API
navigateur `document.startViewTransition()` directement, en amélioration
progressive.*

## 13. Onboarding première visite

Walkthrough plein écran, déclenché une seule fois (flag persisté), maximum 5
questions, une par écran, transitions animées entre écrans, jauge de
progression toujours visible, questions non essentielles « passables »,
réponses persistées au fur et à mesure (reprise possible si l'utilisateur
quitte en cours de route). Recueille au minimum : prénom, mode
salarié/ponctuel, montant de départ, objectif d'épargne (optionnel).

## 14. Page Profil

Résumé d'activité (calculé depuis les données existantes, rien de nouveau à
tracker), boutons d'export globaux (JSON/CSV/XLSX) centralisés, suppression du
localStorage en zone à risque avec AlertDialog de confirmation, et une section
**« Kakeibo »** : mini documentaire sur la méthode (quoi/pourquoi/comment/quand),
contenu statique basé sur [vision.md](./vision.md).

---

*Les décisions suivantes (15+) ont été prises après l'implémentation des 9
premières phases ([plan.md](./plan.md)), en cours d'usage réel de l'app.*

## 15. Séparation Projets / Épargne (feuille de route)

Malentendu initial corrigé : le `SavingsGoal` nommé (avec contribution
mensuelle) modélise un **projet d'achat**, pas l'objectif d'épargne général du
pilier « Goal ». Décision : déplacer tel quel `SavingsGoalList` (et son
formulaire, ses lignes, sa confirmation de contribution) vers une nouvelle page
**Projets** (`/projets`). La page **Épargne** (`/roadmap`, renommée dans la nav)
devient dédiée à un objectif d'épargne général unique — voir
[vision.md](./vision.md#le-pilier-goal-se-scinde-en-deux-concepts-distincts).
*Renommage volontairement limité au routing/nav et au contenu utilisateur — les
symboles internes (`SavingsGoal`, `useSavingsGoals`, etc.) n'ont pas été
renommés, pur refactor cosmétique à risque/bénéfice défavorable.*

## 16. Objectif d'épargne général : configurable comme une catégorie, mais en montant

`AppSettings.savingsObjectivePercent` (ratio 0-1) — éditable à tout moment,
même mécanisme qu'un `recommendedRatio` de catégorie. Contrairement à une
catégorie, le formulaire d'édition demande un **montant** (pas un pourcentage
brut) et affiche le pourcentage correspondant calculé à partir du revenu du
mois en cours — plus intuitif pour la plupart des utilisateurs que de raisonner
directement en %.

## 17. Onboarding : suggestion de 3 paliers plutôt qu'un projet nommé

L'étape `ObjectifStep` (créait un projet d'achat) est remplacée par
`SavingsObjectiveStep` : 3 paliers suggérés (Prudent/Équilibré/Ambitieux),
calculés différemment selon le mode — % du revenu mensuel pour un salarié, %
de la somme reçue pour un usage ponctuel (pas de cadence mensuelle imposée à un
montant ponctuel). La création de projets nommés sort entièrement de
l'onboarding.

## 18. Feuille de route enrichie : graphe de tendance + régularité

Deux ajouts pour éviter une page réduite à une seule carte : un graphe
« marge vs objectif » sur les mois déjà saisis (vocabulaire volontairement
« marge », pas « épargne réalisée », pour ne pas laisser croire à une
confirmation comme sur Projets), et une statistique de régularité (« X/Y mois
où l'objectif a été tenu »), toutes deux dérivées de `useBudgetHistory` déjà
existant.

## 19. Onboarding : écran d'accueil + import de sauvegarde dès l'entrée

Avant la première question, un écran de bienvenue plein écran (« Bienvenue sur
Kakeibo ») avec deux chemins : **Commencer** (bascule vers les questions
habituelles) ou **Importer une sauvegarde (JSON)** — pour un nouvel
appareil/navigateur, restaurer directement un export existant plutôt que de
tout ressaisir. Un import réussi force `onboardingCompleted: true` et affiche
un AlertDialog de confirmation explicite avant de rediriger vers `/`.

## 20. Reprise d'onboarding après mise à jour de l'app

Problème anticipé : un profil déjà onboardé avant l'ajout d'un nouveau champ
requis (ex. `savingsObjectivePercent` ajouté après coup) se retrouverait
bloqué en silence. Solution : `getMissingSettingsFields` détecte les champs
`AppSettings` requis manquants indépendamment du flag `onboardingCompleted` ;
si un manque, un AlertDialog explicite s'affiche par-dessus la page en cours
(pas d'écran blanc), pré-remplit le brouillon d'onboarding avec ce qui est déjà
connu, saute directement à la première étape manquante, et renvoie
l'utilisateur exactement sur la page où il était une fois complété — sans
jamais recréer le budget existant ni perdre de données.

## 21. Correction : comparaison de pourcentage arrondie, pas flottante

`overRecommended` comparait `ratio > recommendedRatio` en flottant brut : avec
des montants réels non ronds, `11000/100000` peut différer d'un chouïa de
`11/100` en précision IEEE 754, donnant un avertissement « Dépassement » qui ne
disparaissait pas même après avoir aligné le seuil sur la valeur affichée.
Fix : comparer les pourcentages arrondis (`Math.round(ratio*100) >
Math.round(recommendedRatio*100)`), cohérent avec ce que l'utilisateur voit et
édite.

## 22. Contenu Kakeibo : histoire réelle plutôt que l'anecdote

L'anecdote des deux seaux est remplacée par l'histoire réelle de la méthode
(Hani Motoko, 1904, *Fujin no Tomo*) et son application théorique en boucle
mensuelle — plus fidèle et plus intéressant qu'une parabole générique.

## 23. Partage de lien : meta tags + bannière dédiée

`index.html` reçoit un titre/description explicites, les balises Open Graph et
Twitter Card, et une bannière dédiée (`public/og-banner.png`, générée depuis un
SVG source conservé pour édition). Point d'attention documenté dans le HTML :
WhatsApp et Facebook exigent des URLs absolues pour `og:image`/`og:url` — à
mettre à jour avec le vrai domaine de production.

## 24. Disponibilité pour un projet : après l'objectif d'épargne général, pas le disponible brut

Sur `/projets`, définir une épargne mensuelle pour un projet ne peut pas se
baser sur le disponible brut du budget — l'objectif d'épargne général (page
Épargne) est censé être décidé *avant* le reste, donc doit déjà être retiré du
montant de référence. `computeAvailableForProjects` (dans `savingsService.ts`)
calcule : disponible − (revenu × objectif d'épargne) − contributions déjà
engagées par les autres projets actifs. `SavingsGoalForm` affiche ce montant en
repère. *Révisé en décision 26 : ce garde-fou est passé de simple
avertissement à un vrai blocage.*

## 25. Toasts globaux sur les mutations

Ajout de **sonner** (choix shadcn standard) pour donner un retour explicite à
chaque opération lancée par l'utilisateur. Plutôt que d'ajouter un appel toast
à la main dans chacune des mutations, un `MutationCache` central
(`query-client.ts`) déclenche automatiquement un toast de succès/erreur pour
*toute* mutation, en lisant `meta.successMessage`/`meta.errorMessage` déclarés
sur chaque `useMutation`. Seule exception explicite : la sauvegarde des
réponses d'onboarding (`useOnboardingAnswers`), qui écrit à chaque écran —
passée en `meta.silent` pour éviter un toast à chaque "Suivant". Le composant
shadcn `sonner.tsx` scaffoldé dépendait de `next-themes` pour le thème ; retiré
et remplacé par `theme="system"` codé en dur, puisque sonner lit déjà
nativement `prefers-color-scheme` sans avoir besoin d'un theme provider — pas
de nouvelle dépendance pour une infra de thème qu'on a explicitement décidé de
ne pas avoir (décision 9).

## 26. Marge dépassée sur un projet : blocage plutôt qu'avertissement

Suite retour utilisateur : "on ne peut pas dire qu'on gardera 10 000/mois si,
après épargne, il reste moins de 10 000". Le bouton de sauvegarde de
`SavingsGoalForm` est désormais `disabled` (pas seulement un texte
d'avertissement) quand le montant saisi dépasse `computeAvailableForProjects`
— valable pour la création et l'édition. `SavingsGoalList` va plus loin : si
la marge pour un **nouveau** projet (calculée sans exclure aucun projet
existant) est déjà à 0, le point d'entrée "+ Ajouter un objectif d'épargne"
est remplacé par un message explicatif plutôt que par le formulaire.

## 27. Kaizen : la promesse bascule entre saisie et affichage

`KaizenCard` n'affiche le textarea que s'il n'y a pas encore de promesse pour
le mois en cours ; une fois soumise, elle s'affiche dans un cadre en lecture
seule avec un bouton **Modifier** pour rouvrir l'édition. La bascule est
dérivée de la présence de `note` pour le `monthKey` courant (pas d'état
manuel à resynchroniser dans le handler de sauvegarde) — un nouveau mois sans
promesse retombe automatiquement en mode saisie.

## 28. Graphe cumulatif jusqu'à fin d'année, sur la même base de projection

Ajout d'un second graphe sur `/roadmap` : cumul de la marge et de l'objectif
mois après mois, jusqu'à décembre — toujours, même si peu de mois sont encore
renseignés. Plutôt que d'écrire une nouvelle logique de projection,
`useYearToDateRoadmap` réutilise `buildRoadmap` (déjà écrit pour `/projets`)
en le faisant simplement démarrer en **janvier** de l'année en cours au lieu
de "maintenant" — la fonction reconstitue alors le passé connu et reconduit le
dernier budget connu pour le reste de l'année, sans code de projection
dupliqué. Chaque graphe de la page reçoit désormais un titre de section
("Tendance mensuelle" / "Cumul jusqu'à fin d'année"), affiché dans un `Card`
comme le reste de l'app.
