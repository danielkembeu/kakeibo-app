import { describe, expect, it } from "vitest";

import { budgetToCsv, escapeCsvField } from "@/features/kakeibo/lib/csv";
import { createEmptyBudget } from "@/features/kakeibo/services/budgetCalculations";
import { TEST_CATEGORIES } from "@/features/kakeibo/lib/testFixtures";

describe("escapeCsvField", () => {
  it("leaves a plain field untouched", () => {
    expect(escapeCsvField("Loyer")).toBe("Loyer");
  });

  it("quotes a field containing a comma", () => {
    expect(escapeCsvField("Café, thé")).toBe('"Café, thé"');
  });

  it("quotes and doubles embedded quotes", () => {
    expect(escapeCsvField('Le "meilleur" café')).toBe('"Le ""meilleur"" café"');
  });
});

describe("budgetToCsv", () => {
  it("produces one row per item across categories, plus a header", () => {
    const budget = {
      ...createEmptyBudget("2026-07", TEST_CATEGORIES),
      items: {
        ...createEmptyBudget("2026-07", TEST_CATEGORIES).items,
        survie: [{ id: "1", name: "Loyer", amount: 500 }],
        desirs: [{ id: "2", name: "Café, thé", amount: 20 }],
      },
    };

    const csv = budgetToCsv(budget, TEST_CATEGORIES);
    const rows = csv.split("\n");

    expect(rows).toHaveLength(3);
    expect(rows[0]).toBe("Catégorie,Poste,Montant");
    expect(rows).toContain("Survie,Loyer,500");
    expect(rows).toContain('Désirs,"Café, thé",20');
  });

  it("exports the resolved total for computed items, not raw quantity/unit", () => {
    const budget = {
      ...createEmptyBudget("2026-07", TEST_CATEGORIES),
      items: {
        ...createEmptyBudget("2026-07", TEST_CATEGORIES).items,
        survie: [
          {
            id: "1",
            name: "Transport",
            amount: 0,
            computed: { quantity: 20, unitAmount: 500, defaultQuantity: 20 },
          },
        ],
      },
    };

    const csv = budgetToCsv(budget, TEST_CATEGORIES);

    expect(csv).toContain("Survie,Transport,10000");
  });
});