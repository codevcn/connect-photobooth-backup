import { useRef, useState, useEffect, useCallback } from 'react'

type UseElementZoomOptions = {
  minZoom?: number // Scale tối thiểu (mặc định 0.3)
  maxZoom?: number // Scale tối đa (mặc định 2)
  sensitivity?: number // Độ nhạy zoom (mặc định 0.01)
  onZoomStart?: () => void // Callback khi bắt đầu zoom
  onZoomEnd?: () => void // Callback khi kết thúc zoom
  currentZoom: number
  setCurrentZoom: React.Dispatch<React.SetStateAction<number>>
}

type UseElementZoomReturn = {
  zoomButtonRef: React.RefObject<HTMLButtonElement | null>
  containerRef: React.RefObject<HTMLElement | null>
  isZooming: boolean
}

export const useZoomElement = (options: UseElementZoomOptions): UseElementZoomReturn => {
  const {
    minZoom = 0.2,
    maxZoom = 10,
    sensitivity = 0.003,
    onZoomStart,
    onZoomEnd,
    currentZoom,
    setCurrentZoom,
  } = options
  const [isZooming, setIsZooming] = useState(false)
  const isZoomingRef = useRef(false)
  const containerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0, distance: 0 })

  const getDistance = useCallback(
    (x: number, y: number, centerX: number, centerY: number): number => {
      return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
    },
    []
  )

  const handleMouseDown = useCallback(
    (e: PointerEvent) => {
      console.log('>>> [zzz] call:', isZooming)
      e.preventDefault()
      e.stopPropagation()

      isZoomingRef.current = true
      setIsZooming(true)

      // Gọi callback khi bắt đầu zoom
      onZoomStart?.()

      const divRect = containerRef.current?.getBoundingClientRect()
      if (!divRect) return
      const centerX = divRect.left + divRect.width / 2
      const centerY = divRect.top + divRect.height / 2

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        distance: getDistance(e.clientX, e.clientY, centerX, centerY),
      }

      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    },
    [getDistance, onZoomStart]
  )

  const handleMouseMove = useCallback(
    (e: PointerEvent) => {
      if (!isZoomingRef.current) return
      e.preventDefault()
      e.stopPropagation()

      const divRect = containerRef.current?.getBoundingClientRect()
      if (!divRect) return
      const centerX = divRect.left + divRect.width / 2
      const centerY = divRect.top + divRect.height / 2

      const currentDistance = getDistance(e.clientX, e.clientY, centerX, centerY)
      const distanceDiff = currentDistance - dragStartRef.current.distance

      // Tính toán scale: kéo xa center = zoom in, kéo gần center = zoom out
      const newScale = Math.max(
        minZoom,
        Math.min(maxZoom, currentZoom + distanceDiff * sensitivity)
      )

      setCurrentZoom(newScale)
      dragStartRef.current.distance = currentDistance
    },
    [getDistance, minZoom, maxZoom, currentZoom, sensitivity, setCurrentZoom]
  )

  const handleMouseUp = useCallback(() => {
    isZoomingRef.current = false
    setIsZooming(false)
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'

    // Gọi callback khi kết thúc zoom
    onZoomEnd?.()
  }, [onZoomEnd])

  // Effect để add/remove listeners khi isZooming thay đổi
  useEffect(() => {
    document.body.addEventListener('pointermove', handleMouseMove)
    document.body.addEventListener('pointerup', handleMouseUp)
    document.body.addEventListener('pointercancel', handleMouseUp)
    return () => {
      document.body.removeEventListener('pointermove', handleMouseMove)
      document.body.removeEventListener('pointerup', handleMouseUp)
      document.body.removeEventListener('pointercancel', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Effect để add listener cho button
  useEffect(() => {
    const button = buttonRef.current
    console.log('>>> [zzz] button:', button)
    if (!button) return
    console.log('>>> [zzz] add listener')
    button.addEventListener('pointerdown', handleMouseDown)
    return () => {
      button.removeEventListener('pointerdown', handleMouseDown)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }, [handleMouseDown])

  return {
    zoomButtonRef: buttonRef,
    containerRef: containerRef,
    isZooming: isZooming,
  }
}
