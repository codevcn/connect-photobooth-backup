import { hardCodedLayoutData } from '@/configs/print-layout/print-layout-data'
import { TPrintLayout } from '@/utils/types/print-layout'
import { create } from 'zustand'

type TLayoutStore = {
  pickedLayout: TPrintLayout | null
  allLayouts: TPrintLayout[]

  pickLayout: (layout: TPrintLayout) => void
  setAllLayouts: (layouts: TPrintLayout[]) => void
}

export const useLayoutStore = create<TLayoutStore>((set) => ({
  pickedLayout: null,
  allLayouts: hardCodedLayoutData(),

  pickLayout: (layout: TPrintLayout) => set({ pickedLayout: layout }),
  setAllLayouts: (layouts: TPrintLayout[]) => set({ allLayouts: layouts }),
}))
