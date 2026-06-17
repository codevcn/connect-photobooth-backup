import { useEffect, useState } from 'react'
import { useAudioTourGuide } from '@/hooks/use-audio-tour-guide'

export const TourWelcomePopup = () => {
  const [show, setShow] = useState(false)
  const { startTour } = useAudioTourGuide()

  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_tour')
    if (!hasSeen) {
      setShow(true)
    }
  }, [])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Danh sách các ảnh ví dụ, sau này chỉ cần thêm URL vào mảng này là nó tự động chạy
  const EXAMPLE_IMAGES = [
    '/images/tour-guide/example-2.png',
  ]

  useEffect(() => {
    if (!show || EXAMPLE_IMAGES.length <= 1) return
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length)
    }, 2000) // Thời gian hiển thị mỗi ảnh (2 giây)
    return () => clearInterval(timer)
  }, [show])

  if (!show) return null

  const handleStart = () => {
    setShow(false)
    startTour()
  }

  const handleSkip = () => {
    setShow(false)
    localStorage.setItem('has_seen_tour', 'true')
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Lớp nền mờ */}
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />

      {/* Bảng popup */}
      <div className="relative bg-white/95 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 max-w-sm w-full shadow-[0_24px_40px_-12px_rgba(0,0,0,0.15)] animate-pop-in">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3 text-center">
          Chào mừng đến với Studio Thiết Kế! 🎉
        </h2>
        
        <div className="NAME-list-examples relative flex justify-center items-center my-4 h-50">
          {EXAMPLE_IMAGES.map((src, index) => (
            <img
              key={src}
              className={`absolute m-auto h-50 object-contain transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              src={src}
              alt={`Tour Example ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-zinc-600 mb-8 text-center text-lg leading-relaxed">
          Đây là lần đầu bạn đến đây. Cùng tụi mình dạo 1 vòng trang web nhé! Chỉ mất của bạn hơn{' '}
          <span className="font-bold">1 phút</span> thôi nè!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="w-full text-lg bg-main-cl text-white font-medium py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all hover:bg-zinc-800 shadow-md"
          >
            Bắt đầu hướng dẫn
          </button>
          <button
            onClick={handleSkip}
            className="w-full text-lg bg-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 font-medium py-3.5 px-4 rounded-2xl active:scale-[0.98] transition-all"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  )
}
