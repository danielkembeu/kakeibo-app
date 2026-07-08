import { downloadFile } from "@/features/shared/lib/download"
import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository"
import {
  kakeiboExportSchema,
  type KakeiboExportPayload,
} from "@/features/kakeibo/lib/schemas"

export async function downloadJsonExport() {
  const payload = await localStorageBudgetRepository.exportState()
  downloadFile(
    `kakeibo-${payload.exportedAt.slice(0, 10)}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  )
}

export function parseAndValidateImport(raw: string): KakeiboExportPayload {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("Fichier JSON invalide.")
  }

  const result = kakeiboExportSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error("Le contenu du fichier ne correspond pas au format Kakeibo.")
  }

  return result.data
}
