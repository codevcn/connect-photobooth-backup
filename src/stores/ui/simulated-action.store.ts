import { create } from 'zustand'

export type TSimulatedPointerState = {
  isActive: boolean
  x: number
  y: number
  opacity: number
  scale: number
}

interface SimulatedActionStoreState {
  pointer: TSimulatedPointerState
  setPointerState: (state: Partial<TSimulatedPointerState>) => void
  resetPointer: () => void
}

const initialState: TSimulatedPointerState = {
  isActive: false,
  x: 0,
  y: 0,
  opacity: 0,
  scale: 1,
}

export const useSimulatedActionStore = create<SimulatedActionStoreState>((set) => ({
  pointer: initialState,
  setPointerState: (state) =>
    set((prev) => ({
      pointer: { ...prev.pointer, ...state },
    })),
  resetPointer: () => set({ pointer: initialState }),
}))
