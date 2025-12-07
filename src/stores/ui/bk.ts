import { createInitialConstants } from '@/utils/contants'
import { TElementLayerState } from '@/utils/types/global'
import { create } from 'zustand'

type TUseElementLayerStore = {
  elementLayers: TElementLayerState[] // min index is ELEMENT_ZINDEX_STEP

  addElementLayers: (elementLayers: TElementLayerState[]) => void
  removeElementLayers: (elementId: string[]) => void
  updateElementLayerIndex: (elementId: string, newIndex: number) => void
  resetData: () => void
}

export const useElementLayerStore = create<TUseElementLayerStore>((set, get) => ({
  elementLayers: [],

  resetData: () => {
    set({ elementLayers: [] })
  },
  addElementLayers: (newElementLayers) => {
    const { elementLayers } = get()
    const layersToAdd = [...newElementLayers]
    if (elementLayers.length > 0) {
      if (elementLayers.some((el) => layersToAdd.some((newEl) => newEl.elementId === el.elementId)))
        return
      const maxIndex = Math.max(...elementLayers.map((layer) => layer.index))
      let index = 1
      for (const layer of layersToAdd) {
        layer.index = maxIndex + index * createInitialConstants<number>('ELEMENT_ZINDEX_STEP')
        index++
      }
      console.log('>>> [idx] layersToAdd 1:', layersToAdd)
      set({ elementLayers: [...elementLayers, ...layersToAdd] })
    } else {
      let index = 1
      for (const layer of layersToAdd) {
        layer.index = index * createInitialConstants<number>('ELEMENT_ZINDEX_STEP')
        index++
      }
      console.log('>>> [idx] layersToAdd 2:', layersToAdd)
      set({ elementLayers: layersToAdd })
    }
    // set(({ elementLayers }) => {
    //   if (elementLayers.some((el) => el.elementId === newElementLayers.elementId)) {
    //     return { elementLayers }
    //   }
    //   return { elementLayers: [...elementLayers, ...newElementLayers] }
    // })
  },
  removeElementLayers: (elementIds) => {
    set({
      elementLayers: get().elementLayers.filter((el) => !elementIds.includes(el.elementId)),
    })
  },
  updateElementLayerIndex: (elementId, newIndex) => {
    return set(() => {
      const currentLayers = get().elementLayers
      // Tìm index hiện tại của element
      const currentIndex = currentLayers.findIndex((layer) => layer.elementId === elementId)
      if (currentIndex === -1) return { elementLayers: currentLayers }

      const isMovingUp = newIndex > 0

      // Kiểm tra boundary
      if (isMovingUp && currentIndex === currentLayers.length - 1)
        return { elementLayers: currentLayers } // Đã ở trên cùng
      if (!isMovingUp && currentIndex === 0) return { elementLayers: currentLayers } // Đã ở dưới cùng

      // Tạo mảng mới và swap vị trí
      const updatedLayers = [...currentLayers]
      const targetIndex = currentIndex + (isMovingUp ? 1 : -1)

      // Swap
      const temp = updatedLayers[currentIndex]
      updatedLayers[currentIndex] = updatedLayers[targetIndex]
      updatedLayers[targetIndex] = temp

      // Cập nhật lại index cho tất cả layers
      return {
        elementLayers: updatedLayers.map((layer, idx) => ({
          ...layer,
          index: (idx + 1) * createInitialConstants<number>('ELEMENT_ZINDEX_STEP') + 1,
        })),
      }
    })
  },
}))
