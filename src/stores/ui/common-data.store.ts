import { create } from 'zustand'

type TURL = string
type TBase64 = string

type TCommonDataStore = {
  urlBase64Cache: Record<TURL, TBase64>

  setURLAsBase64: (url: TURL, base64: TBase64) => void
  getBase64ByURL: (url: TURL) => TBase64 | undefined
  removeBase64ByURL: (url: TURL) => void
}

export const useCommonDataStore = create<TCommonDataStore>((set, get) => ({
  urlBase64Cache: {},

  removeBase64ByURL: (url) => {
    const cache = get().urlBase64Cache
    if (cache[url]) {
      const newCache = { ...cache }
      delete newCache[url]
      set({ urlBase64Cache: newCache })
    }
  },
  setURLAsBase64: (url, base64) => {
    const cache = get().urlBase64Cache
    set({
      urlBase64Cache: {
        ...cache,
        [url]: base64,
      },
    })
  },
  getBase64ByURL: (url) => {
    const cache = get().urlBase64Cache
    return cache[url]
  },
}))
