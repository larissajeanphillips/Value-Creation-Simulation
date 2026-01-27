import { Plus, MessageSquare, Trash2, ChevronLeft, Bot, RefreshCw } from 'lucide-react'
import { Conversation, Agent } from '../types'

interface SidebarProps {
  conversations: Conversation[]
  activeConversationId: string
  agents: Agent[]
  selectedAgent: string | null
  isOpen: boolean
  onToggle: () => void
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  onSelectAgent: (agent: string | null) => void
  onRefreshAgents: () => void
}

export function Sidebar({
  conversations,
  activeConversationId,
  agents,
  selectedAgent,
  isOpen,
  onToggle,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onSelectAgent,
  onRefreshAgents,
}: SidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="w-72 h-full flex flex-col bg-surface-primary border-r border-surface-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Conversations
        </h2>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-text-primary"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* New conversation button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-mck-blue-500 text-white font-medium hover:bg-mck-blue-600 transition-colors shadow-mck"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onSelect={() => onSelectConversation(conv.id)}
              onDelete={() => onDeleteConversation(conv.id)}
            />
          ))}
        </div>
      </div>

      {/* Agent selector */}
      <div className="border-t border-surface-border p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Agent
          </h3>
          <button
            onClick={onRefreshAgents}
            className="p-1 rounded hover:bg-surface-tertiary transition-colors text-text-muted hover:text-text-secondary"
            aria-label="Refresh agents"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-1">
          <AgentOption
            name="Auto (routing)"
            description="Let the system choose"
            isSelected={selectedAgent === null}
            onSelect={() => onSelectAgent(null)}
          />
          {agents.map((agent) => (
            <AgentOption
              key={agent.name}
              name={agent.name}
              description={agent.description}
              isSelected={selectedAgent === agent.name}
              onSelect={() => onSelectAgent(agent.name)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

function ConversationItem({ conversation, isActive, onSelect, onDelete }: ConversationItemProps) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all ${
        isActive
          ? 'bg-mck-blue-50 border-l-2 border-mck-blue-500'
          : 'hover:bg-surface-tertiary border-l-2 border-transparent'
      }`}
      onClick={onSelect}
    >
      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-mck-blue-500' : 'text-text-muted'}`} />
      <span className={`flex-1 truncate text-sm ${isActive ? 'text-mck-blue-700 font-medium' : 'text-text-secondary'}`}>
        {conversation.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 text-text-muted hover:text-red-600 transition-all"
        aria-label="Delete conversation"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

interface AgentOptionProps {
  name: string
  description: string
  isSelected: boolean
  onSelect: () => void
}

function AgentOption({ name, description, isSelected, onSelect }: AgentOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all ${
        isSelected
          ? 'bg-mck-blue-50 border border-mck-blue-200'
          : 'hover:bg-surface-tertiary border border-transparent'
      }`}
    >
      <Bot className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-mck-blue-500' : 'text-text-muted'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isSelected ? 'text-mck-blue-700 font-medium' : 'text-text-secondary'}`}>
          {name}
        </p>
        {description && (
          <p className="text-xs text-text-muted truncate">{description}</p>
        )}
      </div>
    </button>
  )
}
