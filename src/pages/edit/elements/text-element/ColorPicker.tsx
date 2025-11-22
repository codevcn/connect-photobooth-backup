import { useDebouncedCallback } from '@/hooks/use-debounce'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

type ColorPickerModalProps = {
  show: boolean
  onHideShow: (show: boolean) => void
  onColorChange: (color: string) => void
  inputText: string
}

export const ColorPickerModal = ({
  show,
  onHideShow,
  onColorChange,
  inputText,
}: ColorPickerModalProps) => {
  const [currentColor, setCurrentColor] = useState<string>('#fe6e87')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Hàm convert tên màu CSS sang hex
  const convertColorToHex = (color: string): string => {
    // Tạo element tạm để browser convert màu
    const tempElement = document.createElement('div')
    tempElement.style.color = color
    document.body.appendChild(tempElement)

    const computedColor = window.getComputedStyle(tempElement).color
    document.body.removeChild(tempElement)

    // Convert rgb/rgba sang hex
    const match = computedColor.match(/\d+/g)
    if (match && match.length >= 3) {
      const r = parseInt(match[0]).toString(16).padStart(2, '0')
      const g = parseInt(match[1]).toString(16).padStart(2, '0')
      const b = parseInt(match[2]).toString(16).padStart(2, '0')
      return `#${r}${g}${b}`
    }

    return color
  }

  const handleColorPickerChange = (color: string) => {
    setCurrentColor(color)
    onColorChange(color)
  }

  const validateColorValue = (value: string): boolean => {
    const isValidHex = /^#[0-9A-F]{6}$/i.test(value)
    const isValidShortHex = /^#[0-9A-F]{3}$/i.test(value)
    const isNamedColor = /^[a-z]+$/i.test(value)
    return isValidHex || isValidShortHex || isNamedColor
  }

  const handleInputChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (validateColorValue(value)) {
      // Convert sang hex để HexColorPicker hiểu được
      const hexColor = convertColorToHex(value)
      setCurrentColor(hexColor)
      onColorChange(value) // Gửi giá trị gốc (có thể là tên màu)
    }
  }, 300)

  useEffect(() => {
    if (show) {
      
    }
  }, [show])

  if (!show) return null

  return (
    <div className="NAME-color-picker-modal fixed inset-0 flex items-center justify-center z-50 animate-pop-in">
      <div onClick={() => onHideShow(false)} className="bg-black/50 absolute inset-0 z-10"></div>
      <div className="bg-white rounded-lg p-4 w-full mx-4 shadow-2xl max-h-[95vh] overflow-y-auto relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Chọn màu chữ</h3>
          <button
            onClick={() => onHideShow(false)}
            className="text-gray-800 active:scale-90 w-8 h-8 flex items-center justify-center rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Color Picker */}
        <div className="flex justify-center mb-4">
          <HexColorPicker
            style={{ width: '100%' }}
            color={currentColor}
            onChange={handleColorPickerChange}
          />
        </div>

        {/* Current Color Display */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Xem trước màu chữ:
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-300 p-2 text-center">
              <p className="text-3xl font-bold" style={{ color: currentColor }}>
                {inputText}
              </p>
            </div>
          </div>
        </div>

        {/* Input Color */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Nhập mã màu:</label>
          <input
            type="text"
            ref={inputRef}
            value={currentColor}
            onChange={handleInputChange}
            placeholder="Nhập tên màu (red / pink / ...) hoặc mã màu hex (#fe6e87)"
            className="w-full px-3 text-gray-800 py-2 border-gray-300 border-2 rounded-lg outline-none transition-all"
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => onHideShow(false)}
            className="bg-main-cl mobile-touch text-white font-semibold px-6 py-2 rounded-lg transition w-full"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  )
}
