import { CollapsibleRow } from "@/features/shared/components/CollapsibleRow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { CategoryForm } from "@/features/kakeibo/components/CategoryForm";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";

export function CategoryManager() {
  const { categories, isLoading } = useCategories();

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catégories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <CollapsibleRow
            key={category.id}
            label={`${category.emoji} ${category.label} — ${Math.round(category.recommendedRatio * 100)}%`}
          >
            <CategoryForm category={category} />
          </CollapsibleRow>
        ))}

        <CollapsibleRow label="+ Ajouter une catégorie">
          <CategoryForm />
        </CollapsibleRow>
      </CardContent>
    </Card>
  );
}