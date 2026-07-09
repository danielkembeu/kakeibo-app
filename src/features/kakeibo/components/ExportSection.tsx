import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";
import { useMonthlyBudget } from "@/features/kakeibo/hooks/useMonthlyBudget";
import { budgetToCsv } from "@/features/kakeibo/lib/csv";
import { getCurrentMonthKey } from "@/features/kakeibo/lib/monthKey";
import type { KakeiboExportPayload } from "@/features/kakeibo/lib/schemas";
import {
  downloadJsonExport,
  parseAndValidateImport,
} from "@/features/kakeibo/services/exportImportService";
import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository";
import { downloadFile } from "@/features/shared/lib/download";

export function ExportSection() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] =
    useState<KakeiboExportPayload | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const currentMonthKey = getCurrentMonthKey();
  const { budget } = useMonthlyBudget(currentMonthKey);
  const { categories } = useCategories();

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportError(null);

    try {
      const raw = await file.text();
      setPendingImport(parseAndValidateImport(raw));
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Import impossible.",
      );
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    await localStorageBudgetRepository.importState(pendingImport);
    setPendingImport(null);
    await queryClient.invalidateQueries({ queryKey: ["kakeibo"] });
    toast.success("Données importées avec succès.");
  };

  const exportJson = async () => {
    await downloadJsonExport();
    toast.success("Export JSON téléchargé.");
  };

  const exportCsv = () => {
    downloadFile(
      `kakeibo-${currentMonthKey}.csv`,
      budgetToCsv(budget, categories),
      "text/csv",
    );
    toast.success("Export CSV téléchargé.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export &amp; import</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download /> Exporter (JSON)
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download /> Exporter le mois en cours (CSV)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload /> Importer (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>

        {importError && (
          <Alert variant="destructive">
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Le JSON permet de transférer toutes vos données vers un autre
          navigateur. Le CSV n'exporte que le mois en cours, pour l'ouvrir
          rapidement dans un tableur.
        </p>
      </CardContent>

      <AlertDialog
        open={pendingImport !== null}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remplacer les données locales ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'import va remplacer toutes vos données actuelles (budgets,
              objectifs, catégories...) par le contenu du fichier. Cette action
              ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>
              Remplacer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}