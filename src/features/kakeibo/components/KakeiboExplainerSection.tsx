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
          <h3 className="font-medium">L'histoire des deux seaux</h3>
          <p className="text-muted-foreground">
            Deux hommes recueillent l'eau de pluie : l'un avec un grand seau
            percé, l'autre avec un petit seau étanche. Le second reverse son
            eau dans le seau du premier chaque jour — pourtant, à la fin,
            c'est lui qui a le plus d'eau. Savoir gérer de petites sommes
            rigoureusement prépare à bien gérer de grosses sommes.
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
