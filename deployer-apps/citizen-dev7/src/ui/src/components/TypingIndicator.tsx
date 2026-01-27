import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-mck-blue-500 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="mck-card rounded-lg rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mck-blue-400 animate-typing" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-mck-blue-400 animate-typing" style={{ animationDelay: '200ms' }} />
          <span className="w-2 h-2 rounded-full bg-mck-blue-400 animate-typing" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  )
}
