import { useEffect, useState, ChangeEvent, KeyboardEvent, useRef } from 'react'

type AutosizeTextareaProps = {} & Partial<{
  id: string
  name: string
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
  onAllowResizeTextArea: () => boolean
}>

export const AutoSizeTextField = ({
  id,
  name,
  value = '',
  onChange,
  onEnter,
  onKeyDown,
  onSelect,
  onClick,
  placeholder = 'Nhập văn bản...',
  minHeight = 16,
  maxHeight = 300,
  className = '',
  textfieldRef,
  onAllowResizeTextArea,
}: AutosizeTextareaProps) => {
  const [text, setText] = useState(value)
  const textFieldInternalRef = useRef<HTMLTextAreaElement | null>(null)
  const finalTextFieldRef = textfieldRef || textFieldInternalRef

  const doResizeTextArea = () => {
    const textarea = finalTextFieldRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }
  }

  // Auto-resize textarea
  const adjustHeight = () => {
    if (onAllowResizeTextArea) {
      if (onAllowResizeTextArea()) {
        doResizeTextArea()
      }
    } else {
      doResizeTextArea()
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
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        if (onAllowResizeTextArea) {
          if (!onAllowResizeTextArea()) {
            e.preventDefault()
          }
        }
      } else {
        if (onEnter) {
          e.preventDefault()
          onEnter(e)
        }
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
      id={id}
      name={name}
      className={className}
      rows={1}
      style={{
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        overflow: text.length > 0 ? 'auto' : 'hidden',
        resize: 'none',
      }}
    ></textarea>
  )
}
