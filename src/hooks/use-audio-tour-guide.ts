import { useEffect, useRef } from 'react'
import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

const AUDIO_FILE_PATH: string = '/audios/tour-guide-audio.wav'

export type TTourAction = (
  | {
      type: 'swipe'
      direction: 'left' | 'right' | 'up' | 'down'
      delay?: number
      distance?: number
      duration?: number
      selector: string
    }
  | {
      type: 'click'
      delay?: number
      selector: string
    }
  | {
      type: 'scroll' // Đang có lỗi driver.js chặn cuộn, chi tiết xem ở root/doc/errors-plains/driverjs chặn scroll.md
      selector: string
      delay?: number
      topMargin?: number
    }
  | {
      type: 'drag-drop'
      delay?: number
      selector: string
      direction: 'left' | 'right' | 'up' | 'down'
      distance?: number
      duration?: number
    }
  | {
      type: 'custom'
      delay?: number
      executor: () => void
    }
) & { hide_pointer?: boolean }

interface TourSegment {
  name: string
  startTime: number
  element?: string
  popover: {
    title: string
    description: string
  }
  actions?: TTourAction[]
  no_driver?: boolean
}

const TOUR_SEGMENTS: TourSegment[] = [
  {
    name: 'product-selection',
    startTime: 0,
    element: '.NAME-products-gallery',
    popover: {
      title: '1. Chọn Sản Phẩm',
      description:
        'Lướt và chọn sản phẩm bạn muốn thiết kế. Chúng mình có rất nhiều mẫu mã sản phẩm đa dạng ở đây!',
    },
    actions: [
      {
        type: 'swipe',
        direction: 'left',
        delay: 1000, // delay 1.5s to let user read
        selector: '.NAME-simulated-swipe-target--product-selection',
      },
      {
        type: 'swipe',
        direction: 'right',
        delay: 2500, // delay 1.5s to let user read
        selector: '.NAME-simulated-swipe-target--product-selection',
      },
      {
        type: 'click',
        delay: 5000,
        selector: '.NAME-simulated-click-target--product-selection',
      },
    ],
  },
  {
    name: 'product-display-area',
    startTime: 5.6,
    element: '.NAME-print-area-container',
    popover: {
      title: '2. Khu Vực Thiết Kế',
      description: 'Sản phẩm mà bạn chọn sẽ được hiển thị tại đây.',
    },
  },
  {
    name: 'add-printed-image',
    startTime: 9.1,
    element: '.NAME-layout-slot',
    popover: {
      title: '3. Thêm Ảnh Photobooth',
      description: 'Nhấn vào ô dấu cộng để thêm ảnh chụp photobooth của bạn lên sản phẩm.',
    },
    actions: [
      {
        type: 'click',
        delay: 3900,
        selector: '.NAME-simulated-click-target--add-printed-image',
      },
    ],
  },
  {
    name: 'pick-printed-image',
    startTime: 14.1,
    element: '.NAME-printed-images-modal',
    popover: {
      title: '4. Chọn Ảnh Yêu Thích',
      description: 'Vuốt và chọn một tấm ảnh bạn ưng ý để thêm lên sản phẩm nhé!',
    },
    actions: [
      {
        type: 'click',
        delay: 3000,
        selector: '.NAME-simulated-click-target--pick-printed-image',
      },
    ],
  },
  {
    name: 'replace-printed-image',
    startTime: 18.1,
    element: '.NAME-layout-slot',
    popover: {
      title: '5. Thay Đổi Ảnh',
      description: 'Bạn nhấn vào ảnh đã thêm lên sản phẩm để đổi ảnh khác!',
    },
  },
  {
    name: 'select-layouts',
    startTime: 22.0,
    element: '.NAME-start-of-customization',
    popover: {
      title: '6. Chọn Bố Cục Ảnh',
      description:
        'Còn nữa, bạn còn có thể chọn layout yêu thích để sắp xếp ảnh trên sản phẩm theo ý thích nha!',
    },
    actions: [
      {
        type: 'click',
        delay: 1000,
        selector: '.NAME-simulated-click-target--2-vertical-square--select-layouts',
      },
      {
        type: 'click',
        delay: 2500,
        selector: '.NAME-simulated-click-target--2-horizontal-square--select-layouts',
      },
      {
        type: 'click',
        delay: 4000,
        selector: '.NAME-simulated-click-target--no-layout--select-layouts',
      },
    ],
  },
  {
    name: 'select-no-layouts',
    startTime: 27.8,
    element: '.NAME-customization-area',
    popover: {
      title: '7. Tự Do Sắp Xếp',
      description:
        'Bạn cũng có thể chọn layout "Custom" để tự do điều chỉnh ảnh theo cách của riêng bạn nhé!',
    },
    actions: [
      {
        type: 'click',
        delay: 4000,
        selector: '.NAME-simulated-click-target--picked-img--select-no-layouts',
      },
    ],
  },
  {
    name: 'select-previewed-img-no-layouts',
    startTime: 32.8,
    element: '.NAME-select-previewed-img-no-layouts',
    popover: {
      title: '...',
      description: '...',
    },
    no_driver: true,
    actions: [
      {
        type: 'click',
        delay: 800,
        selector: '.NAME-simulated-click-target--select-previewed-img-no-layouts',
      },
    ],
  },
  {
    name: 'drag-drop-element',
    startTime: 35.0,
    element: '.NAME-print-area-container',
    popover: {
      title: '8. Kéo Thả Theo Ý Bạn',
      description: 'Bạn nhấn giữ và di chuyển ảnh đã chọn để sắp xếp lại theo ý muốn của mình.',
    },
    actions: [
      {
        type: 'drag-drop',
        delay: 1000,
        selector: '.NAME-simulated-drag-target--drag-drop-element',
        direction: 'down',
        distance: 25,
        duration: 500,
      },
      {
        type: 'drag-drop',
        delay: 3000,
        selector: '.NAME-simulated-drag-target--drag-drop-element',
        direction: 'up',
        distance: 50,
        duration: 500,
      },
    ],
  },
  {
    name: 'select-sticker-text',
    startTime: 41.5,
    element: '.NAME-stickers-and-text-container',
    popover: {
      title: '9. Thêm Sticker & Chữ',
      description: 'Thêm chút cá tính riêng cho sản phẩm của bạn bằng nhãn dán và chữ ở đây nha!',
    },
  },
  {
    name: 'variant-selection',
    startTime: 45.8,
    element: '.NAME-variant-info-area',
    popover: {
      title: '10. Chọn Thuộc Tính Sản Phẩm',
      description:
        'Bạn có thể chọn chất liệu mong muốn cho sản phẩm tại khu vực này, chẳng hạn như màu sắc, hay là kích thước tại đây!',
    },
    actions: [
      {
        type: 'scroll',
        delay: 0,
        selector: '.NAME-simulated-scroll-target--variant-selection',
        topMargin: 0,
        hide_pointer: true,
      },
      {
        type: 'custom',
        delay: 2900,
        executor: () => {
          // logic ẩn (ẩn 8s rồi hiện lại) màn hướng dẫn của driver.js, mục đích để lớp modal tối màu của driver.js không che đi khu vực cần demo ở khu vực edit sản phẩm (live preview)
          const time_to_hide_driver = 8000
          const overlay = document.querySelector('.driver-overlay') as HTMLElement
          const popover = document.querySelector('.driver-popover') as HTMLElement

          if (overlay) overlay.style.display = 'none'
          if (popover) popover.style.display = 'none'

          setTimeout(() => {
            if (overlay) overlay.style.display = 'block'
            if (popover) popover.style.display = 'block'
          }, time_to_hide_driver)
        },
      },
      {
        type: 'swipe',
        direction: 'left',
        delay: 3000,
        selector: '.NAME-simulated-swipe-target--color--variant-selection',
      },
      {
        type: 'click',
        delay: 5500,
        selector: '.NAME-simulated-click-target--color--variant-selection',
      },
      {
        type: 'click',
        delay: 7000,
        selector: '.NAME-simulated-click-target--size--variant-selection',
      },
    ],
  },
  {
    name: 'additional-product-info',
    startTime: 55.5,
    element: '.NAME-additional-product-info',
    popover: {
      title: '11. Xem Thêm Các Thông Tin Khác',
      description:
        'Bạn cũng có thể xem thêm thông tin về sản phẩm như mô tả, hay vận chuyển trả hàng, hay các câu hỏi thường gặp tại đây nha!',
    },
  },
  {
    name: 'preview-mockup',
    startTime: 63.0,
    element: '.NAME-mockup-preview-action-btn',
    popover: {
      title: '12. Xem Trước Thành Phẩm',
      description:
        'Bạn nhấn "xem trước mockup" để biết sản phẩm sẽ trông như thế nào khi nhận về tay nhé!',
    },
  },
  {
    name: 'ready-to-checkout',
    startTime: 68.0,
    element: '.NAME-add-to-cart-action-btn',
    popover: {
      title: '13. Thêm Vào Giỏ Hàng',
      description:
        'Khi đã chỉnh sửa ưng ý, Bạn nhấn "thêm vào giỏ hàng" để đặt mua sản phẩm bạn nhé!',
    },
  },
  {
    name: 'go-checkout',
    startTime: 72.7,
    element: '.NAME-go-checkout-btn',
    popover: {
      title: '14. Tiến Hành Thanh Toán',
      description: 'Cuối cùng, bạn nhấn "xem giỏ hàng" để bắt đầu thanh toán nha!',
    },
  },
  {
    name: 'finish-tour',
    startTime: 76.3,
    popover: {
      title: '15. Hoàn Thành Hướng Dẫn',
      description:
        'Phần hướng dẫn đã xong, chúng mình mong rằng có thể giúp bạn lưu giữ được những khoảnh khắc đáng quý bên bạn bè và người thương ạ! Chúc bạn thiết kế vui vẻ!',
    },
  },
]

import { useSimulatedBehavior } from './use-simulated-behavior'

export const useAudioTourGuide = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const driverRef = useRef<any>(null)
  const { simulateSwipe, simulateClick, simulateScroll, simulateDragAndDrop, cancelSimulation } =
    useSimulatedBehavior()
  const actionTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const styleId = 'hide-driver-guide-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        body.hide-driver-guide .driver-overlay,
        body.hide-driver-guide .driver-popover {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const clearActionTimeouts = () => {
    actionTimeoutsRef.current.forEach(clearTimeout)
    actionTimeoutsRef.current = []
  }

  const handleSegmentAction = (index: number) => {
    cancelSimulation()
    clearActionTimeouts()

    const segment = TOUR_SEGMENTS[index]
    if (segment && segment.actions && segment.actions.length > 0) {
      for (const action of segment.actions) {
        const timeout = setTimeout(() => {
          if (action.type === 'custom') {
            action.executor()
            return
          }

          const targetSelector =
            ('selector' in action ? action.selector : undefined) || segment.element
          if (!targetSelector) return

          if (action.type === 'swipe') {
            simulateSwipe({
              selector: targetSelector,
              direction: action.direction,
              distance: action.distance,
              duration: action.duration,
              hidePointer: action.hide_pointer,
            })
          } else if (action.type === 'click') {
            simulateClick({
              selector: targetSelector,
              hidePointer: action.hide_pointer,
            })
          } else if (action.type === 'scroll') {
            simulateScroll({
              selector: targetSelector,
              topMargin: action.topMargin,
              hidePointer: action.hide_pointer,
            })
          } else if (action.type === 'drag-drop') {
            simulateDragAndDrop({
              selector: targetSelector,
              direction: action.direction,
              distance: action.distance,
              duration: action.duration,
              hidePointer: action.hide_pointer,
            })
          }
        }, action.delay || 0)
        actionTimeoutsRef.current.push(timeout)
      }
    }
  }

  const startTour = () => {
    if (audioRef.current && !audioRef.current.paused) return

    audioRef.current = new Audio(AUDIO_FILE_PATH)

    const driverSteps: DriveStep[] = TOUR_SEGMENTS.map((segment) => ({
      element: segment.element,
      popover: segment.popover,
      onHighlightStarted: () => {
        if (segment.no_driver) {
          document.body.classList.add('hide-driver-guide')
        } else {
          document.body.classList.remove('hide-driver-guide')
        }
      },
    }))

    const cancelTour = () => {
      document.body.classList.remove('hide-driver-guide')
      if (audioRef.current) {
        audioRef.current.pause()
      }
      cancelSimulation()
      clearActionTimeouts()
      driverRef.current.destroy()
      localStorage.setItem('has_seen_tour', 'true')
    }

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'close'],
      nextBtnText: 'Bỏ qua hướng dẫn',
      doneBtnText: 'Bắt đầu thiết kế',
      steps: driverSteps,
      // onNextClick: () => {
      //   const activeIndex = driverRef.current.getActiveIndex()
      //   const nextIndex = activeIndex + 1

      //   if (nextIndex < TOUR_SEGMENTS.length) {
      //     if (audioRef.current) {
      //       audioRef.current.currentTime = TOUR_SEGMENTS[nextIndex].startTime
      //       audioRef.current.play().catch((e) => console.warn(e))
      //     }
      //     driverRef.current.moveNext()
      //     handleSegmentAction(nextIndex)
      //   }
      // },
      // onPrevClick: () => {
      //   const activeIndex = driverRef.current.getActiveIndex()
      //   const prevIndex = activeIndex - 1

      //   if (prevIndex >= 0) {
      //     if (audioRef.current) {
      //       audioRef.current.currentTime = TOUR_SEGMENTS[prevIndex].startTime
      //       audioRef.current.play().catch((e) => console.warn(e))
      //     }
      //     driverRef.current.movePrevious()
      //     handleSegmentAction(prevIndex)
      //   }
      // },
      onNextClick: () => {
        cancelTour()
      },
      onDestroyStarted: () => {
        cancelTour()
      },
    })

    const handleTimeUpdate = () => {
      if (!audioRef.current || !driverRef.current) return

      const currentTime = audioRef.current.currentTime
      const activeIndex = driverRef.current.getActiveIndex()
      const nextIndex = activeIndex + 1

      if (nextIndex < TOUR_SEGMENTS.length && currentTime >= TOUR_SEGMENTS[nextIndex].startTime) {
        driverRef.current.moveNext()
        handleSegmentAction(nextIndex)
      }
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('ended', () => {
      cancelTour()
    })

    audioRef.current
      .play()
      .then(() => {
        driverRef.current.drive(0)
        handleSegmentAction(0)
      })
      .catch((error) => {
        console.error('Trình duyệt chặn phát âm thanh tự động:', error)
      })
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      if (driverRef.current) {
        driverRef.current.destroy()
      }
      cancelSimulation()
      clearActionTimeouts()
    }
  }, [])

  return { startTour }
}
