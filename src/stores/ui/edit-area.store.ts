import { createInitialConstants } from '@/utils/contants'
import { create } from 'zustand'

type TUseEditAreaStore = {
  editBackgroundScaleValue: number

  setEditBackgroundScaleValue: (scaleValue: number) => void
}

export const useEditAreaStore = create<TUseEditAreaStore>((set) => ({
  editBackgroundScaleValue: createInitialConstants<number>('ELEMENT_ZOOM'),

  setEditBackgroundScaleValue: (scaleValue) => set({ editBackgroundScaleValue: scaleValue }),
}))
