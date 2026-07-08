import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { useCategories } from "@/features/kakeibo/hooks/useCategories";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/features/kakeibo/lib/schemas";
import type { CategoryDefinition } from "@/features/kakeibo/lib/types";

interface CategoryFormProps {
  category?: CategoryDefinition;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const { saveCategory, deleteCategory } = useCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      emoji: category?.emoji ?? "🏷",
      label: category?.label ?? "",
      color: category?.color ?? "#6B7280",
      recommendedRatio: category?.recommendedRatio ?? 0.1,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          saveCategory({ id: category?.id, ...values }),
        )}
        className="flex flex-wrap items-end gap-3"
      >
        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem className="w-16">
              <FormLabel>Emoji</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Culture" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel>Couleur</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recommendedRatio"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormLabel>% cible</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(field.value * 100)}
                  onChange={(e) =>
                    field.onChange((e.target.valueAsNumber || 0) / 100)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {category ? "Mettre à jour" : "Ajouter la catégorie"}
        </Button>
        {category && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => deleteCategory(category.id)}
          >
            Supprimer
          </Button>
        )}
      </form>
    </Form>
  );
}