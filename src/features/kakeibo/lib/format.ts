export function formatAmount(amount: number): string {
  const rounded = Math.round(amount)
  const sign = rounded < 0 ? "−" : ""
  return `${sign}${Math.abs(rounded).toLocaleString("fr-FR")} F`
}

export function toPercent(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(Math.round((part / total) * 100), 100)
}

export function monthKeyToLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}
