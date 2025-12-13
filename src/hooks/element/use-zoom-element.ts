import { useRef, useCallback, useState, useEffect } from 'react'

type UseElementZoomOptions = {
  minZoom?: number // Scale tối thiểu (mặc định 0.3)
  maxZoom?: number // Scale tối đa (mặc định 2)
  sensitivity?: number // Độ nhạy zoom (mặc định 0.01)
  onZoomStart?: () => void // Callback khi bắt đầu zoom
  onZoomEnd?: () => void // Callback khi kết thúc zoom
  currentZoom: number
  setCurrentZoom: React.Dispatch<React.SetStateAction<number>>
}

type UseElementZoomReturn<T extends HTMLElement = HTMLElement> = {
  zoomButtonRef: React.RefObject<HTMLButtonElement | null>
  containerRef: React.RefObject<T | null>
  resetZoom: () => void
  isZooming: boolean
}

export const useZoomElement = <T extends HTMLElement = HTMLElement>(
  options: UseElementZoomOptions
): UseElementZoomReturn<T> => {
  const {
    minZoom,
    maxZoom,
    sensitivity = 0.01,
    onZoomStart,
    onZoomEnd,
    currentZoom,
    setCurrentZoom,
  } = options

  // Refs
  const zoomButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<T>(null)
  const isZoomingRef = useRef(false)
  const startDistanceRef = useRef(0)
  const startScaleRef = useRef(1)

  // State
  const [isZooming, setIsZooming] = useState<boolean>(false)

  // Hàm tính khoảng cách từ vị trí pointer đến tâm element
  const getDistanceFromCenter = useCallback((clientX: number, clientY: number): number => {
    if (!containerRef.current) return 0

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Tính khoảng cách Euclidean
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }, [])

  // Xử lý khi bắt đầu nhấn vào nút zoom
  const handleStart = useCallback(
    (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()

      isZoomingRef.current = true
      setIsZooming(true)

      // Gọi callback để thông báo đang zoom
      onZoomStart?.()

      // Lấy khoảng cách ban đầu từ pointer đến tâm element
      startDistanceRef.current = getDistanceFromCenter(e.clientX, e.clientY)
      startScaleRef.current = currentZoom

      document.body.style.cursor = 'grab'
      document.body.style.userSelect = 'none'
    },
    [currentZoom, onZoomStart, getDistanceFromCenter]
  )

  // Xử lý khi di chuyển
  const handleMove = useCallback(
    (e: PointerEvent) => {
      if (!isZoomingRef.current) return

      e.preventDefault()
      e.stopPropagation()

      // Tính khoảng cách hiện tại từ pointer đến tâm element
      const currentDistance = getDistanceFromCenter(e.clientX, e.clientY)

      // Tính độ thay đổi khoảng cách:
      // - Khoảng cách tăng (+deltaDistance) = kéo ra xa tâm = zoom in (phóng to)
      // - Khoảng cách giảm (-deltaDistance) = kéo về tâm = zoom out (thu nhỏ)
      const deltaDistance = currentDistance - startDistanceRef.current

      // Tính scale mới
      const newScale = startScaleRef.current + deltaDistance * sensitivity

      // Giới hạn scale trong khoảng min/max và cập nhật
      let adjustedScale = newScale
      if (minZoom && newScale < minZoom) {
        adjustedScale = minZoom
      }
      if (maxZoom && newScale > maxZoom) {
        adjustedScale = maxZoom
      }
      setCurrentZoom(adjustedScale)
    },
    [sensitivity, minZoom, maxZoom, setCurrentZoom, getDistanceFromCenter]
  )

  // Xử lý khi thả chuột/tay
  const handleEnd = useCallback(() => {
    isZoomingRef.current = false
    setIsZooming(false)
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'

    // Gọi callback để thông báo kết thúc zoom
    onZoomEnd?.()
  }, [onZoomEnd])

  // Reset zoom
  const resetZoom = useCallback(() => {
    setCurrentZoom(currentZoom)
  }, [currentZoom, setCurrentZoom])

  // Effect để đăng ký/hủy sự kiện
  useEffect(() => {
    const button = zoomButtonRef.current
    if (!button) return

    // Đăng ký sự kiện pointer chỉ trên nút zoom
    button.addEventListener('pointerdown', handleStart)

    // Sự kiện move và end trên document để xử lý khi kéo ra ngoài
    document.body.addEventListener('pointermove', handleMove)
    document.body.addEventListener('pointerup', handleEnd)
    document.body.addEventListener('pointercancel', handleEnd)

    // Cleanup
    return () => {
      button.removeEventListener('pointerdown', handleStart)

      document.body.removeEventListener('pointermove', handleMove)
      document.body.removeEventListener('pointerup', handleEnd)
      document.body.removeEventListener('pointercancel', handleEnd)

      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }, [handleStart, handleMove, handleEnd])

  return {
    zoomButtonRef,
    containerRef,
    resetZoom,
    isZooming,
  }
}
