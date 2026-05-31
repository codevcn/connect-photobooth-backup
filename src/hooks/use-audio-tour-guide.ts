import { useEffect, useRef } from 'react'
import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

interface TourSegment {
  startTime: number
  element?: string
  popover: {
    title: string
    description: string
  }
}

const TOUR_SEGMENTS: TourSegment[] = [
  {
    startTime: 0,
    element: '.NAME-products-gallery-wrapper',
    popover: {
      title: '1. Chọn Sản Phẩm',
      description:
        'Lướt và chọn sản phẩm bạn muốn thiết kế. Chúng mình có rất nhiều mẫu mã sản phẩm đa dạng ở đây!',
    },
  },
  {
    startTime: 6.0,
    element: '.NAME-variant-info-area',
    popover: {
      title: '2. Chọn Thuộc Tính',
      description:
        'Tùy chỉnh màu sắc, kích thước sản phẩm, hương thơm hoặc chất liệu (nếu có) cho sản phẩm của bạn ở khu vực này.',
    },
  },
  {
    startTime: 12.6,
    element: '.NAME-start-of-customization',
    popover: {
      title: '3. Thỏa Sức Sáng Tạo',
      description:
        'Bạn có thể thêm các layout, văn bản, nhãn dán hoặc chọn ảnh photobooth của bạn từ khu vực này để trang trí lên sản phẩm.',
    },
  },
  {
    startTime: 20.6,
    element: '.NAME-edit-actions-area',
    popover: {
      title: '4. Hoàn tất & Đặt hàng',
      description:
        'Khi đã ưng ý, hãy nhấn "Xem trước Mockup" để xem sản phẩm thực tế trông như thế nào, sau đó thì "Thêm vào giỏ hàng" và "Xem giỏ hàng" để tiến hành thanh toán bạn nhé!',
    },
  },
  {
    startTime: 30.0,
    popover: {
      title: 'Bạn đã sẵn sàng! 🚀',
      description:
        'Giờ thì hãy tự tay tạo ra sản phẩm tuyệt vời của riêng bạn nhé. Chúc bạn thiết kế vui vẻ!',
    },
  },
]

export const useAudioTourGuide = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const driverRef = useRef<any>(null)

  const startTour = () => {
    if (audioRef.current && !audioRef.current.paused) return

    audioRef.current = new Audio('/audios/tour-guide-audio.wav')

    const driverSteps: DriveStep[] = TOUR_SEGMENTS.map((segment) => ({
      element: segment.element,
      popover: segment.popover,
    }))

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Tiếp tục',
      prevBtnText: 'Quay lại',
      doneBtnText: 'Bắt đầu thiết kế',
      steps: driverSteps,
      onNextClick: () => {
        const activeIndex = driverRef.current.getActiveIndex()
        const nextIndex = activeIndex + 1

        if (nextIndex < TOUR_SEGMENTS.length) {
          if (audioRef.current) {
            audioRef.current.currentTime = TOUR_SEGMENTS[nextIndex].startTime
            audioRef.current.play().catch((e) => console.warn(e))
          }
          driverRef.current.moveNext()
        }
      },
      onPrevClick: () => {
        const activeIndex = driverRef.current.getActiveIndex()
        const prevIndex = activeIndex - 1

        if (prevIndex >= 0) {
          if (audioRef.current) {
            audioRef.current.currentTime = TOUR_SEGMENTS[prevIndex].startTime
            audioRef.current.play().catch((e) => console.warn(e))
          }
          driverRef.current.movePrevious()
        }
      },
      onDestroyStarted: () => {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        driverRef.current.destroy()
        localStorage.setItem('has_seen_tour', 'true')
      },
    })

    const handleTimeUpdate = () => {
      if (!audioRef.current || !driverRef.current) return

      const currentTime = audioRef.current.currentTime
      const activeIndex = driverRef.current.getActiveIndex()
      const nextIndex = activeIndex + 1

      if (nextIndex < TOUR_SEGMENTS.length && currentTime >= TOUR_SEGMENTS[nextIndex].startTime) {
        driverRef.current.moveNext()
      }
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('ended', () => {
      driverRef.current.destroy()
      localStorage.setItem('has_seen_tour', 'true')
    })

    audioRef.current
      .play()
      .then(() => {
        driverRef.current.drive(0)
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
    }
  }, [])

  return { startTour }
}
