import { useEffect, useState } from 'react'

interface FullscreenModalProps {
  show: boolean
  onConfirm: () => void
}

export const FullscreenModal = ({ show, onConfirm }: FullscreenModalProps) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  const handleEnterFullscreen = async () => {
    try {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        // Safari
        await (document.documentElement as any).webkitRequestFullscreen()
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        // Firefox
        await (document.documentElement as any).mozRequestFullScreen()
      } else if ((document.documentElement as any).msRequestFullscreen) {
        // IE/Edge
        await (document.documentElement as any).msRequestFullscreen()
      }

      // Hide modal after entering fullscreen
      setIsVisible(false)
      onConfirm()
    } catch (error) {
      console.error('Không thể chuyển sang chế độ toàn màn hình:', error)
      // Even if fullscreen fails, still hide the modal
      setIsVisible(false)
      onConfirm()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-11/12 animate-pop-in">
        {/* Decorative top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-main-cl rounded-full flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Trải nghiệm tốt nhất
          </h2>
          <p className="text-gray-600 mb-8">
            Vui lòng chuyển sang chế độ toàn màn hình để có trải nghiệm tốt nhất!
          </p>

          {/* Button */}
          <button
            onClick={handleEnterFullscreen}
            className="w-full bg-main-cl hover:bg-dark-main-cl text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            <span>Chuyển sang toàn màn hình</span>
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-main-cl rounded-b-3xl"></div>
      </div>
    </div>
  )
}
