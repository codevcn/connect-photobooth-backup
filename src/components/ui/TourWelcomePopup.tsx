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
    <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-pop-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Chào mừng bạn! 🎉</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Đây là lần đầu bạn đến đây. Tụi mình sẽ hướng dẫn bạn một vòng để làm quen với trang web
          nhé! Chỉ mất của bạn 30 giây thôi nè!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="w-full bg-main-cl text-white font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition"
          >
            Bắt đầu hướng dẫn
          </button>
          <button
            onClick={handleSkip}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 px-4 rounded-xl active:scale-95 transition"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  )
}
