// import { useState } from 'react'
// import { useRef, useEffect, useCallback } from 'react'

// type TUseInteractiveElementReturn = {
//   divRef: React.RefObject<HTMLElement | null>
//   buttonRef: React.RefObject<HTMLButtonElement | null>
//   rotateButtonRef: React.RefObject<HTMLButtonElement | null>
// }

// export const useInteractiveElement = (): TUseInteractiveElementReturn => {
//   const [scale, setScale] = useState(1)
//   const [rotation, setRotation] = useState(0)
//   const [isDragging, setIsDragging] = useState(false)
//   const [isRotating, setIsRotating] = useState(false)

//   const containerRef = useRef<HTMLElement | null>(null)
//   const buttonRef = useRef<HTMLButtonElement | null>(null)
//   const rotateButtonRef = useRef<HTMLButtonElement | null>(null)

//   const dragStartRef = useRef({ x: 0, y: 0, distance: 0 })
//   const isRotatingRef = useRef<boolean>(false)
//   const startAngleRef = useRef(0)
//   const startRotationRef = useRef(0)
//   const isSnappedRef = useRef(false)
//   const snappedAngleRef = useRef(0)
//   const previousAngleRef = useRef(0)
//   const rotationOffsetRef = useRef(0)

//   // Cấu hình snap
//   const snapThreshold = 5 // Khoảng cách để snap vào góc vuông (degrees)
//   const snapBreakThreshold = 10 // Khoảng cách để thoát khỏi snap (degrees)

//   const getDistance = (x: number, y: number, centerX: number, centerY: number) => {
//     return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
//   }

//   const getNearestRightAngle = useCallback((angle: number) => {
//     return Math.round(angle / 90) * 90
//   }, [])

//   const getDistanceToNearestRightAngle = useCallback(
//     (angle: number) => {
//       const nearest = getNearestRightAngle(angle)
//       let distance = Math.abs(angle - nearest)
//       if (distance > 180) distance = 360 - distance
//       return distance
//     },
//     [getNearestRightAngle]
//   )

//   const getAngleFromCenter = useCallback((clientX: number, clientY: number) => {
//     if (!divRef.current) return 0

//     const rect = divRef.current.getBoundingClientRect()
//     const centerX = rect.left + rect.width / 2
//     const centerY = rect.top + rect.height / 2

//     const angle = Math.atan2(clientY - centerY, clientX - centerX)
//     return angle * (180 / Math.PI)
//   }, [])

//   // Zoom handlers
//   const handleMouseDown = (e) => {
//     e.preventDefault()
//     setIsDragging(true)

//     const divRect = divRef.current.getBoundingClientRect()
//     const centerX = divRect.left + divRect.width / 2
//     const centerY = divRect.top + divRect.height / 2

//     dragStartRef.current = {
//       x: e.clientX,
//       y: e.clientY,
//       distance: getDistance(e.clientX, e.clientY, centerX, centerY),
//     }
//   }

//   const handleMouseMove = (e) => {
//     if (!isDragging) return

//     const divRect = divRef.current.getBoundingClientRect()
//     const centerX = divRect.left + divRect.width / 2
//     const centerY = divRect.top + divRect.height / 2

//     const currentDistance = getDistance(e.clientX, e.clientY, centerX, centerY)
//     const distanceDiff = currentDistance - dragStartRef.current.distance

//     const sensitivity = 0.003
//     const newScale = Math.max(0.5, Math.min(3, scale + distanceDiff * sensitivity))

//     setScale(newScale)
//     dragStartRef.current.distance = currentDistance
//   }

//   const handleMouseUp = () => {
//     setIsDragging(false)
//   }

//   // Rotation handlers with snap
//   const handleRotateStart = useCallback(
//     (e) => {
//       e.preventDefault()
//       e.stopPropagation()

//       isRotatingRef.current = true
//       setIsRotating(true)
//       isSnappedRef.current = false

//       const clientX = e.clientX
//       const clientY = e.clientY

//       const initialAngle = getAngleFromCenter(clientX, clientY)
//       startAngleRef.current = initialAngle
//       previousAngleRef.current = initialAngle
//       startRotationRef.current = rotation
//       rotationOffsetRef.current = 0

//       document.body.style.cursor = 'grabbing'
//       document.body.style.userSelect = 'none'
//     },
//     [rotation, getAngleFromCenter]
//   )

//   const handleRotateMove = useCallback(
//     (e) => {
//       if (!isRotatingRef.current) return

//       e.preventDefault()
//       e.stopPropagation()

//       const currentX = e.clientX
//       const currentY = e.clientY

//       const currentAngle = getAngleFromCenter(currentX, currentY)

//       // Tính delta angle so với góc trước đó
//       let angleDelta = currentAngle - previousAngleRef.current

//       // Xử lý trường hợp cross qua -180/180 boundary
//       if (angleDelta > 180) {
//         angleDelta -= 360
//         rotationOffsetRef.current -= 360
//       } else if (angleDelta < -180) {
//         angleDelta += 360
//         rotationOffsetRef.current += 360
//       }

//       // Cập nhật góc trước đó
//       previousAngleRef.current = currentAngle

//       // Tính góc xoay liên tục (không bị giới hạn -180/180)
//       const continuousAngle = currentAngle + rotationOffsetRef.current
//       const totalDelta = continuousAngle - startAngleRef.current
//       let newRotation = startRotationRef.current + totalDelta

//       const distanceToRightAngle = getDistanceToNearestRightAngle(newRotation)

//       if (isSnappedRef.current) {
//         const distanceFromSnapped = Math.abs(newRotation - snappedAngleRef.current)

//         if (distanceFromSnapped > snapBreakThreshold) {
//           isSnappedRef.current = false
//           setRotation(newRotation)
//         } else {
//           setRotation(snappedAngleRef.current)
//         }
//       } else {
//         if (distanceToRightAngle <= snapThreshold) {
//           const nearestRightAngle = getNearestRightAngle(newRotation)
//           isSnappedRef.current = true
//           snappedAngleRef.current = nearestRightAngle
//           setRotation(nearestRightAngle)
//         } else {
//           setRotation(newRotation)
//         }
//       }
//     },
//     [
//       getAngleFromCenter,
//       getDistanceToNearestRightAngle,
//       getNearestRightAngle,
//       snapThreshold,
//       snapBreakThreshold,
//     ]
//   )

//   const handleRotateEnd = useCallback(() => {
//     isRotatingRef.current = false
//     setIsRotating(false)
//     isSnappedRef.current = false
//     document.body.style.cursor = 'default'
//     document.body.style.userSelect = 'auto'
//   }, [])

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove)
//       document.addEventListener('mouseup', handleMouseUp)
//       return () => {
//         document.removeEventListener('mousemove', handleMouseMove)
//         document.removeEventListener('mouseup', handleMouseUp)
//       }
//     }
//   }, [isDragging, scale])

//   useEffect(() => {
//     const button = rotateButtonRef.current
//     if (!button) return

//     button.addEventListener('mousedown', handleRotateStart)
//     document.addEventListener('mousemove', handleRotateMove)
//     document.addEventListener('mouseup', handleRotateEnd)

//     return () => {
//       button.removeEventListener('mousedown', handleRotateStart)
//       document.removeEventListener('mousemove', handleRotateMove)
//       document.removeEventListener('mouseup', handleRotateEnd)

//       document.body.style.cursor = 'default'
//       document.body.style.userSelect = 'auto'
//     }
//   }, [handleRotateStart, handleRotateMove, handleRotateEnd])
// }
