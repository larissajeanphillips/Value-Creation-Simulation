import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface InputBarProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

export function InputBar({ onSend, disabled, placeholder = 'Type your message...' }: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mck-card-elevated p-2">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-text-primary placeholder-text-muted px-3 py-2 max-h-[200px] scrollbar-thin focus:ring-0"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={`p-3 rounded-md transition-all ${
            disabled || !value.trim()
              ? 'bg-surface-tertiary text-text-muted cursor-not-allowed'
              : 'bg-mck-blue-500 text-white hover:bg-mck-blue-600 shadow-mck'
          }`}
          aria-label="Send message"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-text-muted mt-2 px-3">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
