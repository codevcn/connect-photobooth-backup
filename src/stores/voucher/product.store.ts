import { generateUniqueId } from '@/utils/helpers'
import { TVoucher } from '@/utils/types/global'
import { create } from 'zustand'

type TVoucherStore = {
  appliedVoucher: TVoucher | null
  reapplyVoucherID: string | null

  setAppliedVoucher: (appliedVoucher: TVoucher | null) => void
  resetReapplyVoucherID: () => void
}

export const useVoucherStore = create<TVoucherStore>((set) => ({
  appliedVoucher: null,
  reapplyVoucherID: null,

  resetReapplyVoucherID: () => set({ reapplyVoucherID: generateUniqueId() }),
  setAppliedVoucher: (appliedVoucher: TVoucher | null) => set({ appliedVoucher }),
}))
