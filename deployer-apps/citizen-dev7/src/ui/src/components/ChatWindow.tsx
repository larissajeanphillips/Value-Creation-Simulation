import { useRef, useEffect } from 'react'
import { Menu, MessageSquareText } from 'lucide-react'
import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { TypingIndicator } from './TypingIndicator'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  selectedAgent: string | null
  onSendMessage: (content: string) => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function ChatWindow({
  messages,
  isLoading,
  selectedAgent,
  onSendMessage,
  onToggleSidebar,
  sidebarOpen,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full bg-surface-primary">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-surface-border bg-surface-primary">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-surface-tertiary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-text-tertiary" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-mck-blue-500 flex items-center justify-center shadow-mck">
            <MessageSquareText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Agent Chat</h1>
            {selectedAgent && (
              <p className="text-xs text-mck-blue-600 font-medium">
                Using: {selectedAgent}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-surface-secondary">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-4 bg-surface-primary border-t border-surface-border">
        <div className="max-w-4xl mx-auto">
          <InputBar
            onSend={onSendMessage}
            disabled={isLoading}
            placeholder={selectedAgent ? `Ask ${selectedAgent}...` : 'Type your objective...'}
          />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-mck-blue-50 border border-mck-blue-100 flex items-center justify-center">
          <MessageSquareText className="w-8 h-8 text-mck-blue-500" />
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          What would you like to optimize?
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Share your code or describe your software challenge, and get expert analysis and recommendations.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            'Analyze my code for performance issues',
            'Recommend better data structures',
            'Review algorithm complexity',
          ].map((suggestion) => (
            <button
              key={suggestion}
              className="px-4 py-2 text-sm rounded-full bg-surface-primary border border-surface-border hover:border-mck-blue-300 hover:bg-mck-blue-50 transition-all text-text-secondary hover:text-mck-blue-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
