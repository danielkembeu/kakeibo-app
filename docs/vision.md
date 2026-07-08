# Vision produit

## La méthode Kakeibo (source)

Le Kakeibo (家計簿, littéralement « livre de comptes du foyer ») est une méthode
japonaise de tenue de comptes manuscrite. Le principe : noter chaque soir ses
dépenses dans un carnet papier, pour se confronter à ce qu'on dépense réellement —
la friction volontaire de l'écriture manuelle est ce qui rend la méthode efficace.

**Un peu d'histoire** : le Kakeibo est inventé en 1904 par Hani Motoko, considérée
comme la première femme journaliste du Japon, dans le magazine *Fujin no Tomo*
(« l'amie de la femme »). Conçue pour aider les foyers à mieux gérer leur budget en
notant à la main leurs dépenses plutôt qu'en s'en remettant à un calcul
automatique, la méthode reste largement pratiquée au Japon plus d'un siècle après
et est souvent citée comme l'un des facteurs du taux d'épargne élevé des ménages
japonais. En théorie, elle fonctionne comme une boucle mensuelle plutôt qu'un
budget figé : on se pose les 4 piliers en début de mois, on note chaque dépense au
fil de l'eau dans ses enveloppes, puis en fin de mois on compare le prévu au réel
et on ajuste (Kaizen) pour le mois suivant.
*(Ce contenu remplace l'ancienne anecdote des deux seaux, jugée moins fidèle et
moins utile que l'histoire réelle de la méthode — voir [decisions.md](./decisions.md#22-contenu-kakeibo--histoire-réelle-plutôt-que-lanecdote).)*

**La formule magique** : `Revenus (Inc) − Épargne (SM) = Argent à dépenser (Exp)`.
L'épargne se décide *avant* de répartir le reste, elle n'est jamais un solde
résiduel.

**Les 4 piliers** (les 4 questions posées chaque mois) :
1. Incomes — combien je perçois ?
2. Goal — combien je veux épargner ?
3. Fixed Expenses — combien je dois dépenser ?
4. The Promise (Kaizen, 改善) — comment puis-je m'améliorer ?

**Les 4 buckets de dépense** :
- Survie (loyer, nourriture, transport, utilités, santé)
- Optionnels (les « fuites », l'essentiel du gaspillage évitable)
- Culture (enrichissement personnel — livres, musées — considéré comme un
  investissement, pas une dépense)
- Extra (imprévus)

**La méthode des enveloppes** : chaque bucket a un budget fixe, mis dans une
enveloppe. Enveloppe vide = plus de dépense sur ce poste, point. Pas de découvert,
pas de report.

**Besoins vs envies** : toute envie d'achat non essentiel est d'abord notée sur une
liste d'attente. Après 30 jours, si le besoin est toujours là, l'achat est autorisé.

## Principe directeur de l'application

Kakeibo (l'app) doit être une **réplique fidèle et numérique** du carnet papier —
pas un tracker de dépenses générique auquel on aurait collé une mascotte
japonaise. Chaque écran/fonctionnalité doit pouvoir se rattacher explicitement à
un des mécanismes ci-dessus : si une fonctionnalité n'a pas d'équivalent dans la
méthode manuelle, elle doit être justifiée autrement (ergonomie, portabilité des
données) et rester secondaire.

## Deux profils d'usage

- **Salarié** : revenu récurrent, budgétisation continue mois après mois, avec
  projection/feuille de route et un objectif d'épargne général suivi dans le
  temps.
- **Non salarié** : réception d'une somme ponctuelle, à répartir immédiatement
  selon les mêmes principes (enveloppes, besoins/envies), sans continuité
  mensuelle forcée.

## Le pilier « Goal » se scinde en deux concepts distincts

En pratique, le pilier Kakeibo « combien je veux épargner » recouvre deux besoins
différents qu'on a fini par séparer en deux pages :

- **Objectif d'épargne général** (page **Épargne**, `/roadmap`) : une part du
  revenu qu'on décide de systématiquement mettre de côté — pas lié à un achat
  précis, configurable comme le pourcentage cible d'une catégorie. C'est
  littéralement le pilier « Goal » du Kakeibo manuel.
- **Projets d'achat nommés** (page **Projets**, `/projets`) : épargner
  progressivement pour un achat précis (d'où le nom sur chaque objectif), avec
  confirmation mensuelle du montant réellement mis de côté.

Les deux se répondent mais ne se substituent pas l'un à l'autre : l'objectif
général est la discipline de fond, les projets sont ses usages concrets.
