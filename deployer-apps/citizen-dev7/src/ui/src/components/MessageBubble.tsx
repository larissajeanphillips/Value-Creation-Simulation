import { User, Bot, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div
      className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
          isUser
            ? 'bg-text-secondary'
            : isError
            ? 'bg-red-50 border border-red-200'
            : 'bg-mck-blue-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-red-500" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}
      >
        {/* Agent badge */}
        {message.agent && !isUser && (
          <span className="inline-block mb-1 px-2 py-0.5 text-xs font-medium rounded bg-mck-blue-50 text-mck-blue-700 border border-mck-blue-100">
            {message.agent}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`inline-block rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-mck-blue-500 text-white rounded-tr-sm'
              : isError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-sm'
              : 'bg-surface-primary border border-surface-border text-text-primary rounded-tl-sm shadow-mck'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Style code blocks
                  code({ className, children, ...props }) {
                    const isInline = !className
                    return isInline ? (
                      <code
                        className="px-1.5 py-0.5 rounded bg-surface-tertiary text-mck-blue-700 font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className={`block p-3 rounded-md bg-surface-tertiary overflow-x-auto font-mono text-sm text-text-primary ${className}`}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  // Style links
                  a({ children, ...props }) {
                    return (
                      <a
                        className="text-mck-blue-600 hover:text-mck-blue-700 underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    )
                  },
                  // Style lists
                  ul({ children }) {
                    return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                  },
                  // Style headings
                  h1({ children }) {
                    return <h1 className="text-xl font-bold text-text-primary mt-4 mb-2">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-semibold text-text-primary mt-3 mb-2">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-semibold text-text-secondary mt-2 mb-1">{children}</h3>
                  },
                  // Style paragraphs
                  p({ children }) {
                    return <p className="my-2 leading-relaxed text-text-primary">{children}</p>
                  },
                  // Style blockquotes
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-2 border-mck-blue-500 pl-4 my-2 text-text-secondary italic">
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="mt-1 text-xs text-text-muted">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
