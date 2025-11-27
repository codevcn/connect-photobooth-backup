import { useEffect, useRef, useState } from 'react'

type TBoundingBox = {
  x: number
  y: number
  width: number
  height: number
  confidence: number
}

type TDetectionResult = {
  success: boolean
  boxes?: TBoundingBox[]
  error?: string
}

type TFastBoxesModule = {
  _malloc: (size: number) => number
  _free: (ptr: number) => void
  _detect: (ptr: number, len: number) => number
  UTF8ToString: (ptr: number) => string
  HEAPU8?: Uint8Array
  HEAP8?: Int8Array
  wasmMemory?: WebAssembly.Memory
  asm?: {
    memory?: WebAssembly.Memory
    [key: string]: any
  }
}

declare global {
  interface Window {
    createFastBoxes?: () => Promise<TFastBoxesModule>
  }
}

/**
 * Custom hook để sử dụng WASM module fast_boxes
 * Module này dùng để detect bounding boxes từ ảnh
 */
export const useFastBoxes = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const moduleRef = useRef<TFastBoxesModule | null>(null)

  useEffect(() => {
    let mounted = true

    const loadWasm = async () => {
      try {
        // Load script nếu chưa có
        if (!window.createFastBoxes) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = '/wasm/fast_boxes.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load fast_boxes.js'))
            document.head.appendChild(script)
          })
        }

        if (!window.createFastBoxes) {
          throw new Error('createFastBoxes not found on window')
        }

        // Khởi tạo module
        const module = await window.createFastBoxes()
        
        if (!mounted) return

        moduleRef.current = module
        setIsLoading(false)
      } catch (err) {
        if (!mounted) return
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        setIsLoading(false)
        console.error('Failed to load WASM module:', err)
      }
    }

    loadWasm()

    return () => {
      mounted = false
    }
  }, [])

  /**
   * Get HEAPU8 từ module, tìm trong nhiều locations khác nhau
   */
  const getHeapU8 = (mod: TFastBoxesModule): Uint8Array | null => {
    if (mod.HEAPU8) return mod.HEAPU8
    if (mod.HEAP8) return new Uint8Array(mod.HEAP8.buffer)

    const maybeMem =
      mod.wasmMemory ||
      (mod.asm &&
        (mod.asm.memory ||
          Object.values(mod.asm).find((v) => v instanceof WebAssembly.Memory))) ||
      Object.values(mod).find((v) => v instanceof WebAssembly.Memory)

    if (maybeMem && 'buffer' in maybeMem) {
      return new Uint8Array(maybeMem.buffer)
    }

    return null
  }

  /**
   * Detect bounding boxes từ File object
   */
  const detectFromFile = async (file: File): Promise<TDetectionResult> => {
    if (!moduleRef.current) {
      return { success: false, error: 'WASM module not loaded' }
    }

    try {
      const mod = moduleRef.current
      const heapU8 = getHeapU8(mod)

      if (!heapU8) {
        throw new Error('HEAPU8 not exposed from wasm module')
      }

      // Đọc file thành ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buf = new Uint8Array(arrayBuffer)

      // Allocate memory trong WASM heap
      const ptr = mod._malloc(buf.length)
      heapU8.set(buf, ptr)

      // Gọi hàm detect
      const resPtr = mod._detect(ptr, buf.length)
      const resultJson = mod.UTF8ToString(resPtr)

      // Free memory
      mod._free(ptr)

      // Parse kết quả
      const result = JSON.parse(resultJson)
      
      // Debug: log để kiểm tra format
      console.log('>>> WASM result:', result)
      console.log('>>> WASM result type:', typeof result)
      console.log('>>> WASM result.boxes:', result.boxes)

      // Xử lý nhiều format khác nhau
      let boxes = []
      if (Array.isArray(result)) {
        // Nếu result là array trực tiếp
        boxes = result
      } else if (result.boxes) {
        // Nếu result là object có property boxes
        boxes = result.boxes
      } else if (result.image_part) {
        // Nếu result có format image_part (như server trả về)
        boxes = result.image_part.map((part: any) => ({
          x: part.x,
          y: part.y,
          width: part.w,
          height: part.h,
          confidence: part.confidence || 1.0,
        }))
      }

      return {
        success: true,
        boxes,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Detection failed'
      console.error('Detection error:', err)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Detect bounding boxes từ image URL hoặc base64
   */
  const detectFromUrl = async (imageUrl: string): Promise<TDetectionResult> => {
    try {
      // Fetch image
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: blob.type })

      return detectFromFile(file)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image'
      console.error('Load image error:', err)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Detect bounding boxes từ HTMLImageElement
   */
  const detectFromImage = async (img: HTMLImageElement): Promise<TDetectionResult> => {
    try {
      // Convert image to blob
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(img, 0, 0)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to convert canvas to blob'))
        }, 'image/jpeg')
      })

      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
      return detectFromFile(file)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image'
      console.error('Process image error:', err)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  return {
    isLoading,
    error,
    isReady: !isLoading && !error,
    detectFromFile,
    detectFromUrl,
    detectFromImage,
  }
}

export type { TBoundingBox, TDetectionResult }
