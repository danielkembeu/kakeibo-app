import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { localStorageBudgetRepository } from "@/features/kakeibo/services/budgetRepository";

export function DangerZone() {
  const handleClear = async () => {
    await localStorageBudgetRepository.clearAllData();
    window.location.href = "/";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone à risque</CardTitle>
      </CardHeader>

      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" size="sm" />}
          >
            <Trash2 /> Supprimer toutes les données locales
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tout supprimer ?</AlertDialogTitle>
              <AlertDialogDescription>
                Budgets, objectifs, catégories, épargne confirmée, bilans Kaizen
                — tout sera supprimé de ce navigateur, définitivement. Pensez à
                exporter vos données avant si besoin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleClear}>
                Tout supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}