import { useEffect, useState, ChangeEvent, KeyboardEvent, useRef } from 'react'

type AutosizeTextareaProps = {} & Partial<{
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onEnter: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSelect: () => void
  onClick: () => void
  placeholder: string
  minHeight: number
  maxHeight: number
  className: string
  textfieldRef: React.RefObject<HTMLTextAreaElement | null>
}>

export const AutoSizeTextField = ({
  value = '',
  onChange,
  onEnter,
  onKeyDown,
  onSelect,
  onClick,
  placeholder = 'Nhập văn bản...',
  minHeight = 40,
  maxHeight = 300,
  className = '',
  textfieldRef,
}: AutosizeTextareaProps) => {
  const [text, setText] = useState(value)
  const textFieldInternalRef = useRef<HTMLTextAreaElement | null>(null)
  const finalTextFieldRef = textfieldRef || textFieldInternalRef

  // Auto-resize textarea
  const adjustHeight = () => {
    const textarea = finalTextFieldRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [text])

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setText(newValue)
    if (onChange) {
      onChange(e)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      if (onEnter) {
        e.preventDefault()
        onEnter(e)
      }
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  return (
    <textarea
      ref={finalTextFieldRef}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={onSelect}
      onClick={onClick}
      placeholder={placeholder}
      className={className}
      style={{
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        overflow: text.length > 0 ? 'auto' : 'hidden',
        resize: 'none',
      }}
    />
  )
}
