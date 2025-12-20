import { TKeyboardSuggestion } from '@/utils/types/global'
import { create } from 'zustand'

type TKeyboardStore = {
  visible: boolean
  suggestions: TKeyboardSuggestion[]

  // Actions
  setSuggestions: (suggestions: TKeyboardSuggestion[]) => void
  clearSuggestions: () => void
  setIsVisible: (visible: boolean) => void
  hideKeyboard: () => void
  resetData: () => void
}

export const useKeyboardStore = create<TKeyboardStore>((set, get) => ({
  visible: false,
  suggestions: [],

  clearSuggestions: () => {
    set(() => ({
      suggestions: [],
    }))
  },
  setSuggestions: (suggestions: TKeyboardSuggestion[]) => {
    set(() => ({
      suggestions,
    }))
  },
  resetData: () => {
    set({ visible: false })
  },
  setIsVisible: (visible: boolean) => {
    set(() => ({ visible }))
    if (!visible) {
      get().clearSuggestions()
    }
  },
  hideKeyboard: () => {
    get().setIsVisible(false)
  },
}))
