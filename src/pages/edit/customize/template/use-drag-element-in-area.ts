import { TPosition } from '@/utils/types/global'
import { useEffect, useRef } from 'react'

// type TRegisteredFunctions = {
//   onDragStart?: (initialPosition: TPosition) => void
//   onDragEnd?: (finalPosition: TPosition) => void
// }

export const useDragElementInArea = (allowedMovingAreaQuery: string) => {
  const draggedElementRef = useRef<HTMLImageElement>(null)
  const allowedMovingAreaElementRef = useRef<HTMLElement>(null)
  const isDraggingRef = useRef<boolean>(false)
  const dragStartPosRef = useRef<TPosition>({ x: 0, y: 0 }) // vị trí của chuột khi bắt đầu kéo

  const capturePlacedImagePlacement = (e: Event) => {
    if (!(e instanceof PointerEvent)) return
    isDraggingRef.current = true
    allowedMovingAreaElementRef.current =
      draggedElementRef.current?.closest<HTMLElement>(allowedMovingAreaQuery) || null
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const draggingPlacedImage = (e: Event) => {
    if (!isDraggingRef.current || !(e instanceof PointerEvent)) return
    const draggedElement = draggedElementRef.current
    if (!draggedElement) return
    const allowedMovingAreaRect = allowedMovingAreaElementRef.current?.getBoundingClientRect()
    if (!allowedMovingAreaRect) return
    console.log('>>> allowed Rect 36:', allowedMovingAreaRect)
    const draggedElementRect = draggedElement.getBoundingClientRect()
    console.log('>>> dragged Rect 37:', draggedElementRect)
    const pointerTranslationY = dragStartPosRef.current.y - e.clientY
    const pointerTranslationX = dragStartPosRef.current.x - e.clientX
    console.log('>>> oke 39:', {
      y: pointerTranslationY,
      x: pointerTranslationX,
    })
    draggedElement.style.top = `${Math.max(
      0,
      Math.min(
        allowedMovingAreaRect.height - draggedElementRect.height,
        draggedElement.offsetTop + pointerTranslationY
      )
    )}px`
    draggedElement.style.left = `${Math.max(
      0,
      Math.min(
        allowedMovingAreaRect.width - draggedElementRect.width,
        draggedElement.offsetLeft + pointerTranslationX
      )
    )}px`
  }

  const cancelDraggingPlacedImage = (e: Event) => {
    isDraggingRef.current = false
    allowedMovingAreaElementRef.current = null
  }

  const init = () => {
    draggedElementRef.current?.addEventListener('pointerdown', capturePlacedImagePlacement)
    draggedElementRef.current?.addEventListener('pointermove', draggingPlacedImage)
    draggedElementRef.current?.addEventListener('pointerup', cancelDraggingPlacedImage)
  }

  useEffect(() => {
    init()
    return () => {
      draggedElementRef.current?.removeEventListener('pointerdown', capturePlacedImagePlacement)
      draggedElementRef.current?.removeEventListener('pointermove', draggingPlacedImage)
      draggedElementRef.current?.removeEventListener('pointerup', cancelDraggingPlacedImage)
    }
  }, [])

  return {
    draggedElementRef,
  }
}
