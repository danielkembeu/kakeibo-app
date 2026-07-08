import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card"

export function KakeiboExplainerSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>家計簿 — La méthode Kakeibo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <section className="space-y-1">
          <h3 className="font-medium">Un peu d'histoire</h3>
          <p className="text-muted-foreground">
            Le Kakeibo est inventé en 1904 par Hani Motoko, considérée comme
            la première femme journaliste du Japon, dans le magazine{" "}
            <span className="italic">Fujin no Tomo</span> ("l'amie de la
            femme"). L'idée : aider les foyers à mieux gérer leur budget en
            notant à la main, chaque jour, leurs dépenses plutôt que de s'en
            remettre à un calcul automatique — la friction volontaire de
            l'écriture manuelle est ce qui force la prise de conscience.
            Plus d'un siècle plus tard, la méthode reste largement pratiquée
            au Japon et est souvent citée comme l'un des facteurs du taux
            d'épargne élevé des ménages japonais.
          </p>
          <p className="text-muted-foreground">
            En théorie, elle fonctionne comme une boucle mensuelle plutôt
            qu'un budget figé : on se pose les 4 piliers en début de mois, on
            note chaque dépense au fil de l'eau dans ses enveloppes, puis en
            fin de mois on compare le prévu au réel et on ajuste (Kaizen)
            pour le mois suivant.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">La formule magique</h3>
          <p className="text-muted-foreground">
            Revenus − Épargne = Argent à dépenser. L'épargne se décide{" "}
            <span className="italic">avant</span> de répartir le reste, elle
            n'est jamais un solde résiduel.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Les 4 piliers, posés chaque mois</h3>
          <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
            <li>Incomes — combien je perçois ?</li>
            <li>Goal — combien je veux épargner ?</li>
            <li>Fixed Expenses — combien je dois dépenser ?</li>
            <li>The Promise (Kaizen) — comment puis-je m'améliorer ?</li>
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">La méthode des enveloppes</h3>
          <p className="text-muted-foreground">
            Chaque catégorie de dépense a un budget fixe, mis dans une
            enveloppe. Enveloppe vide = plus de dépense sur ce poste, point.
            Pas de découvert, pas de report.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Besoins vs envies — la règle des 30 jours</h3>
          <p className="text-muted-foreground">
            Toute envie d'achat non essentiel est d'abord notée sur une liste
            d'attente. Après 30 jours, si le besoin est toujours là, l'achat
            est autorisé.
          </p>
        </section>
      </CardContent>
    </Card>
  )
}
