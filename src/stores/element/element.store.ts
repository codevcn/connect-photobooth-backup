import { TElementType } from '@/utils/types/global'
import { create } from 'zustand'

type TUseElementStore = {
  selectedElement: {
    elementId: string
    element: HTMLElement
    elementType: TElementType
    elementURL?: string
  } | null

  // Actions
  selectElement: (
    elementId: string,
    element: HTMLElement,
    elementType: TElementType,
    elementURL?: string
  ) => void
  cancelSelectingElement: () => void
}

export const useEditedElementStore = create<TUseElementStore>((set, get) => ({
  selectedElement: null,

  selectElement: (elementId, element, elementType, elementURL) => {
    set({ selectedElement: { element, elementType, elementId, elementURL } })
  },
  cancelSelectingElement: () => {
    set({ selectedElement: null })
  },
}))
