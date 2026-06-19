import { useRef, useCallback, useEffect } from 'react'
import { useSimulatedActionStore } from '@/stores/ui/simulated-action.store'

type TSimulateSwipeOptions = {
  selector: string
  direction: 'left' | 'right' | 'up' | 'down'
  distance?: number // Distance to swipe in px
  duration?: number // Duration of swipe in ms
  hidePointer?: boolean
}

type TSimulateClickOptions = {
  selector: string
  hidePointer?: boolean
}

type TSimulateScrollOptions = {
  selector: string
  topMargin?: number // Khoảng cách từ top của viewport sau khi scroll (px)
  hidePointer?: boolean
}

type TSimulateDragDropOptions = {
  selector: string
  direction: 'left' | 'right' | 'up' | 'down'
  distance?: number // Distance to drag in px
  duration?: number // Duration of drag in ms
  hidePointer?: boolean
}

export const useSimulatedBehavior = () => {
  const { setPointerState, resetPointer } = useSimulatedActionStore()
  const activeTimeouts = useRef<NodeJS.Timeout[]>([])
  const activeIntervals = useRef<NodeJS.Timeout[]>([])

  const clearAllTimers = useCallback(() => {
    activeTimeouts.current.forEach(clearTimeout)
    activeTimeouts.current = []
    activeIntervals.current.forEach(clearInterval)
    activeIntervals.current = []
  }, [])

  const cancelSimulation = useCallback(() => {
    clearAllTimers()
    resetPointer()
  }, [clearAllTimers, resetPointer])

  const simulateSwipe = useCallback(
    ({
      selector,
      direction,
      distance = 200,
      duration = 1000,
      hidePointer,
    }: TSimulateSwipeOptions) => {
      cancelSimulation()

      let element: Element | null | undefined = document.body.querySelector(selector)
      if (!element) {
        console.warn(`>>> [Simulation] Element ${selector} not found.`)
        return
      }

      const rect = element.getBoundingClientRect()

      // Calculate start and end coordinates based on direction
      let startX = rect.left + rect.width / 2
      let startY = rect.top + rect.height / 2
      let endX = startX
      let endY = startY
      let scrollX = 0
      let scrollY = 0

      if (direction === 'left') {
        startX = rect.right - 50 // Start near right edge
        endX = startX - distance
        scrollX = distance
      } else if (direction === 'right') {
        startX = rect.left + 50 // Start near left edge
        endX = startX + distance
        scrollX = -distance
      } else if (direction === 'up') {
        startY = rect.bottom - 50
        endY = startY - distance
        scrollY = distance
      } else if (direction === 'down') {
        startY = rect.top + 50
        endY = startY + distance
        scrollY = -distance
      }

      // Step 1: Move pointer to start position and show it
      setPointerState({
        isActive: true,
        x: startX,
        y: startY,
        opacity: 0,
        scale: 1,
      })

      // Step 2: Fade in
      const t1 = setTimeout(() => {
        if (!hidePointer) setPointerState({ opacity: 1 })
      }, 50)
      activeTimeouts.current.push(t1)

      // Step 3: Simulate "touch down" (scale down)
      const t2 = setTimeout(() => {
        setPointerState({ scale: 0.8 })
      }, 400)
      activeTimeouts.current.push(t2)

      // Step 4: Swipe and scroll
      const t3 = setTimeout(() => {
        setPointerState({ x: endX, y: endY })

        // Smooth scroll the element manually to match the pointer
        const startTime = Date.now()
        const startScrollLeft = element.scrollLeft
        const startScrollTop = element.scrollTop

        const animateScroll = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function (easeOutQuad)
          const easeProgress = progress * (2 - progress)

          if (scrollX !== 0) {
            element.scrollLeft = startScrollLeft + scrollX * easeProgress
          }
          if (scrollY !== 0) {
            element.scrollTop = startScrollTop + scrollY * easeProgress
          }

          if (progress < 1) {
            const nextFrame = setTimeout(animateScroll, 16)
            activeTimeouts.current.push(nextFrame)
          }
        }
        animateScroll()
      }, 800)
      activeTimeouts.current.push(t3)

      // Step 5: Touch up (scale back)
      const t4 = setTimeout(() => {
        setPointerState({ scale: 1 })
      }, 800 + duration)
      activeTimeouts.current.push(t4)

      // Step 6: Fade out and finish
      const t5 = setTimeout(
        () => {
          setPointerState({ opacity: 0 })
          const resetTimer = setTimeout(() => {
            resetPointer()
          }, 300)
          activeTimeouts.current.push(resetTimer)
        },
        800 + duration + 300
      )
      activeTimeouts.current.push(t5)
    },
    [setPointerState, resetPointer, cancelSimulation]
  )

  const simulateClick = useCallback(
    ({ selector, hidePointer }: TSimulateClickOptions) => {
      cancelSimulation()

      let element: Element | null | undefined = document.querySelector(selector)
      if (!element) {
        console.warn(`>>> [Simulation] Element ${selector} not found.`)
        return
      }

      const rect = element.getBoundingClientRect()

      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // Step 1: Move pointer to position and hide it initially
      setPointerState({
        isActive: true,
        x,
        y,
        opacity: 0,
        scale: 1,
      })

      // Step 2: Fade in
      const t1 = setTimeout(() => {
        if (!hidePointer) setPointerState({ opacity: 1 })
      }, 50)
      activeTimeouts.current.push(t1)

      // Step 3: Simulate "mouse down" (scale down)
      const t2 = setTimeout(() => {
        setPointerState({ scale: 0.8 })
      }, 300)
      activeTimeouts.current.push(t2)

      // Step 4: Simulate "mouse up" (scale up)
      const t3 = setTimeout(() => {
        setPointerState({ scale: 1 })
        const clickTimer = setTimeout(() => {
          ;(element as HTMLElement)?.click()
        }, 200)
        activeTimeouts.current.push(clickTimer)
      }, 500)
      activeTimeouts.current.push(t3)

      // Step 5: Fade out and finish
      const t4 = setTimeout(() => {
        setPointerState({ opacity: 0 })
        const resetTimer = setTimeout(() => {
          resetPointer()
        }, 300)
        activeTimeouts.current.push(resetTimer)
      }, 800)
      activeTimeouts.current.push(t4)
    },
    [setPointerState, resetPointer, cancelSimulation]
  )

  const simulateScroll = useCallback(
    ({ selector, topMargin = 0, hidePointer }: TSimulateScrollOptions) => {
      cancelSimulation()

      const element: HTMLElement | null = document.body.querySelector(selector)
      if (!element) {
        console.warn(`>>> [Simulation] Element ${selector} not found.`)
        return
      }

      let rect = element.getBoundingClientRect()
      const viewportH = window.innerHeight
      const centerX = rect.left + rect.width / 2

      // Xác định element đang ở đâu so với viewport
      const isBelow = rect.top > viewportH // Element nằm bên dưới viewport
      const isAbove = rect.bottom < 0 // Element nằm bên trên viewport
      const isPartiallyVisible = !isBelow && !isAbove

      // Vị trí bắt đầu của con trỏ
      const startY = isBelow
        ? viewportH * 0.65 // Bắt đầu từ phần dưới màn hình
        : isAbove
          ? viewportH * 0.35 // Bắt đầu từ phần trên màn hình
          : rect.top + rect.height / 2 // Bắt đầu tại vị trí element

      // Vị trí kết thúc — con trỏ trượt ngược chiều cuộn
      const gestureDistance = viewportH * 0.3
      const endY = isBelow
        ? startY - gestureDistance // Vuốt lên (nội dung cuộn xuống để lộ element bên dưới)
        : isAbove
          ? startY + gestureDistance // Vuốt xuống (nội dung cuộn lên để lộ element bên trên)
          : isPartiallyVisible
            ? startY - gestureDistance // Mặc định vuốt lên nếu đang thấy
            : startY

      // Step 1: Hiện con trỏ tại vị trí bắt đầu
      setPointerState({
        isActive: true,
        x: centerX,
        y: startY,
        opacity: 0,
        scale: 1,
      })

      // Step 2: Fade in
      const t1 = setTimeout(() => {
        if (!hidePointer) setPointerState({ opacity: 1 })
      }, 50)
      activeTimeouts.current.push(t1)

      // Step 3: "Touch down" — scale nhỏ lại
      const t2 = setTimeout(() => {
        setPointerState({ scale: 0.8 })
      }, 350)
      activeTimeouts.current.push(t2)

      // Step 4: Di chuyển con trỏ + thực hiện scroll
      const t3 = setTimeout(() => {
        // Di chuyển con trỏ theo cử chỉ cuộn
        setPointerState({ y: endY })

        // Lấy element đang được driver.js active
        const activeDriverElement = document.querySelector('.driver-active-element')

        // Driver.js lock overflow trên PARENT TRỰC TIẾP của element đang highlight
        // bằng CSS: `:not(body):has(> .driver-active-element) { overflow: hidden !important }`
        // Tìm parent của activeDriverElement (hoặc fall back về element.parentElement) và đi ngược lên để unlock
        const lockedAncestors: Array<{ el: HTMLElement; prev: string }> = []
        let cursor: HTMLElement | null = activeDriverElement
          ? (activeDriverElement.parentElement as HTMLElement)
          : element.parentElement

        while (cursor && cursor !== document.documentElement) {
          const computed = getComputedStyle(cursor).overflow
          if (computed === 'hidden') {
            lockedAncestors.push({ el: cursor, prev: cursor.style.overflow })
            cursor.style.setProperty('overflow', 'visible', 'important')
          }
          cursor = cursor.parentElement
        }

        // Cũng unlock html + body phòng trường hợp phiên bản driver.js khác
        const prevBodyOverflow = document.body.style.overflow
        const prevHtmlOverflow = document.documentElement.style.overflow
        document.body.style.setProperty('overflow', 'visible', 'important')
        document.documentElement.style.setProperty('overflow', 'visible', 'important')

        // Tính toán vị trí scroll đích để element cách top topMargin px
        const elementAbsoluteTop = rect.top + window.scrollY
        window.scrollTo({
          top: Math.max(0, elementAbsoluteTop - topMargin),
          behavior: 'instant',
        })

        // Restore tất cả overflow trong rAF tiếp theo
        requestAnimationFrame(() => {
          lockedAncestors.forEach(({ el, prev }) => {
            el.style.overflow = prev
          })
          document.body.style.overflow = prevBodyOverflow
          document.documentElement.style.overflow = prevHtmlOverflow
        })
      }, 500)
      activeTimeouts.current.push(t3)

      // Step 5: "Touch up" — scale trở về bình thường
      const t4 = setTimeout(() => {
        setPointerState({ scale: 1 })
      }, 750)
      activeTimeouts.current.push(t4)

      // Step 6: Fade out và reset
      const t5 = setTimeout(() => {
        setPointerState({ opacity: 0 })
        const resetTimer = setTimeout(() => {
          resetPointer()
        }, 300)
        activeTimeouts.current.push(resetTimer)
      }, 900)
      activeTimeouts.current.push(t5)
    },
    [setPointerState, resetPointer, cancelSimulation]
  )

  const simulateDragAndDrop = useCallback(
    ({
      selector,
      direction,
      distance = 200,
      duration = 1500,
      hidePointer,
    }: TSimulateDragDropOptions) => {
      cancelSimulation()

      const sourceElement: HTMLElement | null = document.querySelector(selector)

      if (!sourceElement) {
        console.warn(`>>> [Simulation] Element ${selector} not found.`)
        return
      }

      const sourceRect = sourceElement.getBoundingClientRect()

      const startX = sourceRect.left + sourceRect.width / 2
      const startY = sourceRect.top + sourceRect.height / 2

      let endX = startX
      let endY = startY

      if (direction === 'left') {
        endX -= distance
      } else if (direction === 'right') {
        endX += distance
      } else if (direction === 'up') {
        endY -= distance
      } else if (direction === 'down') {
        endY += distance
      }

      // Step 1: Move pointer to start position and hide it initially
      setPointerState({
        isActive: true,
        x: startX,
        y: startY,
        opacity: 0,
        scale: 1,
      })

      const eventOptions = {
        bubbles: true,
        cancelable: true,
        view: window,
        buttons: 1, // Left mouse button
      }

      // Step 2: Fade in
      const t1 = setTimeout(() => {
        if (!hidePointer) setPointerState({ opacity: 1 })
      }, 50)
      activeTimeouts.current.push(t1)

      // Step 3: Simulate "touch down" (scale down) + trigger pointerdown
      const t2 = setTimeout(() => {
        setPointerState({ scale: 0.8 })
        const downTimer = setTimeout(() => {
          sourceElement.dispatchEvent(
            new PointerEvent('pointerdown', { ...eventOptions, clientX: startX, clientY: startY })
          )
        }, 200)
        activeTimeouts.current.push(downTimer)
      }, 300)
      activeTimeouts.current.push(t2)

      // Step 4: Simulate dragging
      const t3 = setTimeout(() => {
        const startTime = Date.now()

        const animateDrag = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function (easeOutQuad)
          const easeProgress = progress * (2 - progress)

          const currentX = startX + (endX - startX) * easeProgress
          const currentY = startY + (endY - startY) * easeProgress

          setPointerState({ x: currentX, y: currentY })

          const elUnderPointer = document.elementFromPoint(currentX, currentY) || sourceElement
          elUnderPointer.dispatchEvent(
            new PointerEvent('pointermove', {
              ...eventOptions,
              clientX: currentX,
              clientY: currentY,
            })
          )

          if (progress < 1) {
            const nextFrame = setTimeout(animateDrag, 16)
            activeTimeouts.current.push(nextFrame)
          } else {
            // Drag finished, trigger pointerup
            elUnderPointer.dispatchEvent(
              new PointerEvent('pointerup', {
                ...eventOptions,
                clientX: endX,
                clientY: endY,
                buttons: 0,
              })
            )
          }
        }
        animateDrag()
      }, 700)
      activeTimeouts.current.push(t3)

      // Step 5: "Touch up" (scale up)
      const t4 = setTimeout(
        () => {
          setPointerState({ scale: 1 })
        },
        700 + duration + 100
      )
      activeTimeouts.current.push(t4)

      // Step 6: Fade out and finish
      const t5 = setTimeout(
        () => {
          setPointerState({ opacity: 0 })
          const resetTimer = setTimeout(() => {
            resetPointer()
          }, 300)
          activeTimeouts.current.push(resetTimer)
        },
        700 + duration + 400
      )
      activeTimeouts.current.push(t5)
    },
    [setPointerState, resetPointer, cancelSimulation]
  )

  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [clearAllTimers])

  return {
    simulateSwipe,
    simulateClick,
    simulateScroll,
    simulateDragAndDrop,
    cancelSimulation,
  }
}
