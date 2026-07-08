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
- *Point ouvert* : un vrai `.xlsx` (multi-feuilles, formaté) nécessite une petite
  dépendance (type SheetJS). Le CSV ne nécessite aucune dépendance et s'ouvre
  nativement dans Excel — à trancher dans le plan.

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
