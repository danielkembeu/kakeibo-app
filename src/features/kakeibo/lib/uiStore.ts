import { create } from "zustand"

import { getCurrentMonthKey, shiftMonthKey } from "@/features/kakeibo/lib/monthKey"

interface KakeiboUiState {
  selectedMonthKey: string
  setSelectedMonthKey: (monthKey: string) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToCurrentMonth: () => void
}

export const useKakeiboUiStore = create<KakeiboUiState>((set) => ({
  selectedMonthKey: getCurrentMonthKey(),
  setSelectedMonthKey: (monthKey) => set({ selectedMonthKey: monthKey }),
  goToPreviousMonth: () =>
    set((state) => ({
      selectedMonthKey: shiftMonthKey(state.selectedMonthKey, -1),
    })),
  goToNextMonth: () =>
    set((state) => ({
      selectedMonthKey: shiftMonthKey(state.selectedMonthKey, 1),
    })),
  goToCurrentMonth: () => set({ selectedMonthKey: getCurrentMonthKey() }),
}))
