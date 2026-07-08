import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import { useOnboardingUiStore } from "@/features/kakeibo/lib/onboardingUiStore";
import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository";
import { parseAndValidateImport } from "@/features/kakeibo/services/exportImportService";

export function WelcomeStep() {
  const start = useOnboardingUiStore((state) => state.start);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSucceeded, setImportSucceeded] = useState(false);

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportError(null);
    setIsImporting(true);

    try {
      const raw = await file.text();
      const payload = parseAndValidateImport(raw);
      await localStorageBudgetRepository.importState(payload);
      // A successful restore always counts as "configured" — skip the
      // rest of onboarding regardless of what the backup's flag says.
      await localStorageBudgetRepository.saveSettings({
        onboardingCompleted: true,
      });
      // Refresh every ["kakeibo", ...] query (including settings, read by
      // OnboardingGate) before showing success — avoids a flash back into
      // onboarding on stale cached data once the user continues.
      await queryClient.invalidateQueries({ queryKey: ["kakeibo"] });
      setIsImporting(false);
      setImportSucceeded(true);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Import impossible.",
      );
      setIsImporting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="animate-in space-y-2 fade-in slide-in-from-bottom-3 duration-300">
        <p className="font-mono text-lg tracking-widest text-muted-foreground uppercase">
          家計簿
        </p>
        <h1 className="text-3xl lg:text-6xl font-bold">
          Bienvenue sur Kakeibo
        </h1>
        <p className="text-muted-foreground">
          Quelques questions pour configurer votre budget.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 mt-7">
        <Button size="lg" onClick={start} className="w-full">
          Commencer
        </Button>

        <div className="flex justify-center gap-2 items-center">
          <span className="w-32 h-px bg-gray-200 dark:bg-accent" /> ou{" "}
          <span className="w-32 h-px bg-gray-200 dark:bg-accent" />
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
        >
          <Upload />{" "}
          {isImporting
            ? "Import en cours..."
            : "Importer une sauvegarde (JSON)"}
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
        <Alert variant="destructive" className="max-w-sm">
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      <AlertDialog open={importSucceeded}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importation réussie</AlertDialogTitle>
            <AlertDialogDescription>
              Vos données ont bien été restaurées. Votre espace Kakeibo est
              prêt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/", { replace: true })}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
