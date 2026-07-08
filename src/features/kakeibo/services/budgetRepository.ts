import { nanoid } from "nanoid";

import {
  readJson,
  removeKey,
  writeJson,
} from "@/features/shared/lib/storage/localStorageClient";
import {
  BUDGETS_STORAGE_KEY,
  CATEGORIES_STORAGE_KEY,
  DEFAULT_CATEGORIES,
  GOALS_STORAGE_KEY,
  KAIZEN_STORAGE_KEY,
  ONBOARDING_ANSWERS_STORAGE_KEY,
  SAVINGS_CONTRIBUTIONS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from "@/features/kakeibo/lib/constants";
import type { KakeiboExportPayload } from "@/features/kakeibo/lib/schemas";
import type {
  AppSettings,
  CategoryDefinition,
  KaizenNote,
  MonthlyBudget,
  OnboardingAnswers,
  SavingsContribution,
  SavingsGoal,
} from "@/features/kakeibo/lib/types";

const DEFAULT_SETTINGS: AppSettings = {
  onboardingCompleted: false,
  defaultBudgetMode: "recurring",
};

type BudgetsByMonth = Record<string, MonthlyBudget>;

export interface BudgetRepository {
  getMonth(monthKey: string): Promise<MonthlyBudget | null>;
  saveMonth(budget: MonthlyBudget): Promise<MonthlyBudget>;
  listMonths(): Promise<MonthlyBudget[]>;
  listGoals(): Promise<SavingsGoal[]>;
  saveGoal(
    goal: Omit<SavingsGoal, "id"> & { id?: string },
  ): Promise<SavingsGoal>;
  deleteGoal(id: string): Promise<void>;
  listCategories(): Promise<CategoryDefinition[]>;
  saveCategory(
    category: Omit<CategoryDefinition, "id"> & { id?: string },
  ): Promise<CategoryDefinition>;
  deleteCategory(id: string): Promise<void>;
  listContributions(): Promise<SavingsContribution[]>;
  saveContribution(
    contribution: Omit<SavingsContribution, "id" | "confirmedAt"> & {
      id?: string;
    },
  ): Promise<SavingsContribution>;
  getKaizenNote(monthKey: string): Promise<KaizenNote | null>;
  saveKaizenNote(promise: string, monthKey: string): Promise<KaizenNote>;
  getSettings(): Promise<AppSettings>;
  saveSettings(patch: Partial<AppSettings>): Promise<AppSettings>;
  getOnboardingAnswers(): Promise<OnboardingAnswers>;
  saveOnboardingAnswers(
    patch: Partial<OnboardingAnswers>,
  ): Promise<OnboardingAnswers>;
  exportState(): Promise<KakeiboExportPayload>;
  importState(payload: KakeiboExportPayload): Promise<void>;
  clearAllData(): Promise<void>;
}

const ALL_STORAGE_KEYS = [
  BUDGETS_STORAGE_KEY,
  GOALS_STORAGE_KEY,
  CATEGORIES_STORAGE_KEY,
  SAVINGS_CONTRIBUTIONS_STORAGE_KEY,
  KAIZEN_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  ONBOARDING_ANSWERS_STORAGE_KEY,
];

function readBudgets(): BudgetsByMonth {
  const budgets = readJson<BudgetsByMonth>(BUDGETS_STORAGE_KEY) ?? {};

  // Budgets saved before the recurring/one-off distinction existed had no
  // `isRecurring` field — treat them as recurring, matching the only
  // behavior that existed at the time.
  for (const budget of Object.values(budgets)) {
    budget.isRecurring ??= true;
  }

  return budgets;
}

function readGoals(): SavingsGoal[] {
  return readJson<SavingsGoal[]>(GOALS_STORAGE_KEY) ?? [];
}

function readCategories(): CategoryDefinition[] {
  const stored = readJson<CategoryDefinition[]>(CATEGORIES_STORAGE_KEY);
  if (stored) return stored;

  writeJson(CATEGORIES_STORAGE_KEY, DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

function readContributions(): SavingsContribution[] {
  return (
    readJson<SavingsContribution[]>(SAVINGS_CONTRIBUTIONS_STORAGE_KEY) ?? []
  );
}

type KaizenNotesByMonth = Record<string, KaizenNote>;

function readKaizenNotes(): KaizenNotesByMonth {
  return readJson<KaizenNotesByMonth>(KAIZEN_STORAGE_KEY) ?? {};
}

function readSettings(): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...readJson<AppSettings>(SETTINGS_STORAGE_KEY),
  };
}

function readOnboardingAnswers(): OnboardingAnswers {
  return readJson<OnboardingAnswers>(ONBOARDING_ANSWERS_STORAGE_KEY) ?? {};
}

export const localStorageBudgetRepository: BudgetRepository = {
  async getMonth(monthKey) {
    const budgets = readBudgets();
    return budgets[monthKey] ?? null;
  },

  async saveMonth(budget) {
    const budgets = readBudgets();
    budgets[budget.monthKey] = budget;
    writeJson(BUDGETS_STORAGE_KEY, budgets);
    return budget;
  },

  async listMonths() {
    const budgets = readBudgets();
    return Object.values(budgets).sort((a, b) =>
      a.monthKey.localeCompare(b.monthKey),
    );
  },

  async listGoals() {
    return readGoals().sort((a, b) =>
      a.startMonthKey.localeCompare(b.startMonthKey),
    );
  },

  async saveGoal(goal) {
    const goals = readGoals();
    const saved: SavingsGoal = { ...goal, id: goal.id ?? nanoid() };
    const index = goals.findIndex((existing) => existing.id === saved.id);

    if (index >= 0) {
      goals[index] = saved;
    } else {
      goals.push(saved);
    }

    writeJson(GOALS_STORAGE_KEY, goals);
    return saved;
  },

  async deleteGoal(id) {
    const goals = readGoals().filter((goal) => goal.id !== id);
    writeJson(GOALS_STORAGE_KEY, goals);
  },

  async listCategories() {
    return readCategories();
  },

  async saveCategory(category) {
    const categories = readCategories();
    const saved: CategoryDefinition = {
      ...category,
      id: category.id ?? nanoid(),
    };
    const index = categories.findIndex((existing) => existing.id === saved.id);

    if (index >= 0) {
      categories[index] = saved;
    } else {
      categories.push(saved);
    }

    writeJson(CATEGORIES_STORAGE_KEY, categories);
    return saved;
  },

  async deleteCategory(id) {
    const categories = readCategories().filter(
      (category) => category.id !== id,
    );
    writeJson(CATEGORIES_STORAGE_KEY, categories);
  },

  async listContributions() {
    return readContributions();
  },

  async saveContribution(contribution) {
    const contributions = readContributions();
    const saved: SavingsContribution = {
      ...contribution,
      id: contribution.id ?? nanoid(),
      confirmedAt: new Date().toISOString(),
    };
    const index = contributions.findIndex(
      (existing) => existing.id === saved.id,
    );

    if (index >= 0) {
      contributions[index] = saved;
    } else {
      contributions.push(saved);
    }

    writeJson(SAVINGS_CONTRIBUTIONS_STORAGE_KEY, contributions);
    return saved;
  },

  async getKaizenNote(monthKey) {
    const notes = readKaizenNotes();
    return notes[monthKey] ?? null;
  },

  async saveKaizenNote(promise, monthKey) {
    const notes = readKaizenNotes();
    const saved: KaizenNote = {
      monthKey,
      promise,
      createdAt: new Date().toISOString(),
    };
    notes[monthKey] = saved;
    writeJson(KAIZEN_STORAGE_KEY, notes);
    return saved;
  },

  async getSettings() {
    return readSettings();
  },

  async saveSettings(patch) {
    const settings = { ...readSettings(), ...patch };
    writeJson(SETTINGS_STORAGE_KEY, settings);
    return settings;
  },

  async getOnboardingAnswers() {
    return readOnboardingAnswers();
  },

  async saveOnboardingAnswers(patch) {
    const answers = { ...readOnboardingAnswers(), ...patch };
    writeJson(ONBOARDING_ANSWERS_STORAGE_KEY, answers);
    return answers;
  },

  async exportState() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        budgets: Object.values(readBudgets()),
        goals: readGoals(),
        categories: readCategories(),
        contributions: readContributions(),
        kaizenNotes: Object.values(readKaizenNotes()),
        settings: readSettings(),
      },
    };
  },

  async importState(payload) {
    const budgets: BudgetsByMonth = {};

    for (const budget of payload.data.budgets) {
      budgets[budget.monthKey] = budget;
    }

    writeJson(BUDGETS_STORAGE_KEY, budgets);
    writeJson(GOALS_STORAGE_KEY, payload.data.goals);
    writeJson(CATEGORIES_STORAGE_KEY, payload.data.categories);
    writeJson(SAVINGS_CONTRIBUTIONS_STORAGE_KEY, payload.data.contributions);

    const kaizenNotes: KaizenNotesByMonth = {};

    for (const note of payload.data.kaizenNotes) {
      kaizenNotes[note.monthKey] = note;
    }

    writeJson(KAIZEN_STORAGE_KEY, kaizenNotes);
    writeJson(SETTINGS_STORAGE_KEY, payload.data.settings);
  },

  async clearAllData() {
    for (const key of ALL_STORAGE_KEYS) {
      removeKey(key);
    }
  },
};
