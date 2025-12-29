import { TBase64, TURL } from '@/utils/types/global'
import { create } from 'zustand'

type TCommonDataStore = {
  urlBase64Cache: Record<TURL, TBase64>
  localBlobURLsCache: Record<TURL, Blob>

  createLocalBlobURL: (blob: Blob) => TURL
  getLocalBlobURL: (url: TURL) => Blob | undefined
  removeLocalBlobURL: (url: TURL) => void
  setURLAsBase64: (url: TURL, base64: TBase64) => void
  getBase64ByURL: (url: TURL) => TBase64 | undefined
  removeBase64ByURL: (url: TURL) => void
}

export const useCommonDataStore = create<TCommonDataStore>((set, get) => ({
  urlBase64Cache: {},
  localBlobURLsCache: {},

  createLocalBlobURL: (blob) => {
    const url = URL.createObjectURL(blob)
    set({
      localBlobURLsCache: {
        ...get().localBlobURLsCache,
        [url]: blob,
      },
    })
    return url
  },
  getLocalBlobURL: (url) => {
    const cache = get().localBlobURLsCache
    return cache[url]
  },
  removeLocalBlobURL: (url) => {
    const cache = get().localBlobURLsCache
    if (cache[url]) {
      const newCache = { ...cache }
      delete newCache[url]
      set({ localBlobURLsCache: newCache })
    }
  },
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
