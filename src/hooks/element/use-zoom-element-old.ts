import { useRef, useCallback, useState, useEffect } from 'react'
import { checkIfMobileScreen } from '@/utils/helpers'
import { toast } from 'react-toastify'

type UseElementZoomOptions = {
  minZoom?: number // Scale tối thiểu (mặc định 0.3)
  maxZoom?: number // Scale tối đa (mặc định 2)
  sensitivityForDesktop?: number // Độ nhạy zoom cho desktop (mặc định 0.01)
  sensitivityForMobile?: number // Độ nhạy zoom cho mobile (mặc định 0.01)
  onZoomStart?: () => void // Callback khi bắt đầu zoom
  onZoomEnd?: () => void // Callback khi kết thúc zoom
  currentZoom: number
  setCurrentZoom: React.Dispatch<React.SetStateAction<number>>
  scaleFactor?: number // Transform scale hiện tại của container (mặc định 1)
}

type UseElementZoomReturn<T extends HTMLElement = HTMLElement> = {
  zoomButtonRef: React.RefObject<HTMLButtonElement | null>
  containerRef: React.RefObject<T | null>
  resetZoom: () => void
  isZooming: boolean
}

export const useZoomElementOld = <T extends HTMLElement = HTMLElement>(
  options: UseElementZoomOptions
): UseElementZoomReturn<T> => {
  const {
    minZoom,
    maxZoom,
    sensitivityForDesktop = 0.003,
    sensitivityForMobile = 0.01,
    onZoomStart,
    onZoomEnd,
    currentZoom,
    setCurrentZoom,
    scaleFactor = 1,
  } = options

  // Refs
  const zoomButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<T>(null)
  const isZoomingRef = useRef(false)
  const startXRef = useRef(0)
  const startZoomRef = useRef(1)

  // State
  const [isZooming, setIsZooming] = useState<boolean>(false)

  // Lấy sensitivity phù hợp với thiết bị
  const getSensitivity = useCallback(() => {
    return checkIfMobileScreen() ? sensitivityForMobile : sensitivityForDesktop
  }, [sensitivityForDesktop, sensitivityForMobile])

  // Xử lý khi bắt đầu nhấn vào nút zoom
  const handleStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()

      isZoomingRef.current = true
      setIsZooming(true)

      // Gọi callback để thông báo đang zoom
      onZoomStart?.()

      // Lấy vị trí X ban đầu
      if (e instanceof MouseEvent) {
        startXRef.current = e.clientX
      } else {
        startXRef.current = e.touches[0].clientX
      }

      // Lưu zoom hiện tại (không nhân với scaleFactor)
      startZoomRef.current = currentZoom

      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    },
    [currentZoom, onZoomStart]
  )

  // Xử lý khi di chuyển
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isZoomingRef.current) return

      e.preventDefault()
      e.stopPropagation()

      // Lấy vị trí X hiện tại
      let currentX: number
      if (e instanceof MouseEvent) {
        currentX = e.clientX
      } else {
        currentX = e.touches[0].clientX
      }

      // Tính độ chênh lệch theo trục X
      const deltaX = currentX - startXRef.current

      // QUAN TRỌNG: Chia deltaX cho scaleFactor để bù trừ effect của container scale
      // Ví dụ: nếu container có scale 0.5, thì 100px di chuyển trên màn hình
      // tương đương với 200px trong không gian của container
      const adjustedDeltaX = deltaX / scaleFactor

      // Tính zoom mới:
      // - Kéo sang phải (+deltaX) = zoom in (phóng to)
      // - Kéo sang trái (-deltaX) = zoom out (thu nhỏ)
      const newZoom = startZoomRef.current + adjustedDeltaX * getSensitivity()

      // Giới hạn zoom trong khoảng min/max
      let finalZoom = newZoom
      if (minZoom !== undefined && newZoom < minZoom) {
        finalZoom = minZoom
      }
      if (maxZoom !== undefined && newZoom > maxZoom) {
        finalZoom = maxZoom
      }

      setCurrentZoom(finalZoom)
    },
    [getSensitivity, minZoom, maxZoom, setCurrentZoom, scaleFactor]
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

  // Reset zoom về giá trị mặc định (1)
  const resetZoom = useCallback(() => {
    setCurrentZoom(1)
  }, [setCurrentZoom])

  // Effect để đăng ký/hủy sự kiện
  useEffect(() => {
    const button = zoomButtonRef.current
    if (!button) return

    // Đăng ký sự kiện chỉ trên nút zoom
    button.addEventListener('mousedown', handleStart)
    button.addEventListener('touchstart', handleStart, { passive: false })

    // Sự kiện move và end trên document để xử lý khi kéo ra ngoài
    document.body.addEventListener('mousemove', handleMove)
    document.body.addEventListener('touchmove', handleMove, { passive: false })

    document.body.addEventListener('mouseup', handleEnd)
    document.body.addEventListener('touchend', handleEnd)

    // Cleanup
    return () => {
      button.removeEventListener('mousedown', handleStart)
      button.removeEventListener('touchstart', handleStart)

      document.body.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('touchmove', handleMove)

      document.body.removeEventListener('mouseup', handleEnd)
      document.body.removeEventListener('touchend', handleEnd)

      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }, [handleStart, handleMove, handleEnd, scaleFactor])

  return {
    zoomButtonRef,
    containerRef,
    resetZoom,
    isZooming,
  }
}
