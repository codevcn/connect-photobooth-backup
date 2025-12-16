// typescript ignore
// @ts-nocheck

import React, { useState, useRef, useEffect } from 'react'

export default function ZoomDragComponent() {
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const divRef = useRef(null)
  const buttonRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0, distance: 0 })

  const getDistance = (x, y, centerX, centerY) => {
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)

    const divRect = divRef.current.getBoundingClientRect()
    const centerX = divRect.left + divRect.width / 2
    const centerY = divRect.top + divRect.height / 2

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      distance: getDistance(e.clientX, e.clientY, centerX, centerY),
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const divRect = divRef.current.getBoundingClientRect()
    const centerX = divRect.left + divRect.width / 2
    const centerY = divRect.top + divRect.height / 2

    const currentDistance = getDistance(e.clientX, e.clientY, centerX, centerY)
    const distanceDiff = currentDistance - dragStartRef.current.distance

    // Tính toán scale: kéo xa center = zoom in, kéo gần center = zoom out
    const sensitivity = 0.003
    const newScale = Math.max(0.5, Math.min(3, scale + distanceDiff * sensitivity))

    setScale(newScale)
    dragStartRef.current.distance = currentDistance
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, scale])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        ref={divRef}
        className="bg-white border-2 border-gray-300 shadow-lg"
        style={{
          position: 'relative',
          width: '400px',
          height: '400px',
          transform: `scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          transformOrigin: 'center center',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Zoom Container</h2>
          <p className="text-gray-600 mb-2">Scale: {scale.toFixed(2)}x</p>
          <p className="text-sm text-gray-500">
            Kéo button về trung tâm để zoom out
            <br />
            Kéo button ra xa để zoom in
          </p>
        </div>

        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg transition-colors"
          style={{
            position: 'absolute',
            bottom: '-30px',
            right: '-30px',
            width: '60px',
            height: '60px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
