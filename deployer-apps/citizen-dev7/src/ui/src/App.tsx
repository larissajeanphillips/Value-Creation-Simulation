import { useState, useCallback } from 'react'
import { ChatWindow } from './components/ChatWindow'
import { Sidebar } from './components/Sidebar'
import { Message, Conversation, Agent } from './types'
import { sendMessage, getAgents } from './services/api'

const SAMPLE_AGENTS: Agent[] = [
  { name: 'software_analyzer', description: 'Analyzes code structure, complexity, and performance', keywords: ['analyze', 'review', 'examine', 'complexity'] },
  { name: 'recommendation', description: 'Provides prioritized optimization suggestions', keywords: ['recommend', 'improve', 'optimize', 'refactor'] },
  { name: 'user_prompting', description: 'Asks clarifying questions when more info needed', keywords: ['clarify', 'question', 'context'] },
  { name: 'catchall', description: 'General software engineering assistance', keywords: [] },
]

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'New conversation', messages: [], createdAt: new Date() }
  ])
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversation || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Add user message immediately
    setConversations(prev => prev.map(conv =>
      conv.id === activeConversationId
        ? { ...conv, messages: [...conv.messages, userMessage], title: conv.messages.length === 0 ? content.slice(0, 40) + '...' : conv.title }
        : conv
    ))

    setIsLoading(true)

    try {
      const response = await sendMessage(content, selectedAgent)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.result,
        timestamp: new Date(),
        agent: response.agent,
      }

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      ))
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
        isError: true,
      }

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, errorMessage] }
          : conv
      ))
    } finally {
      setIsLoading(false)
    }
  }, [activeConversation, activeConversationId, isLoading, selectedAgent])

  const handleNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
  }, [])

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id)
      if (filtered.length === 0) {
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: 'New conversation',
          messages: [],
          createdAt: new Date(),
        }
        setActiveConversationId(newConv.id)
        return [newConv]
      }
      if (activeConversationId === id) {
        setActiveConversationId(filtered[0].id)
      }
      return filtered
    })
  }, [activeConversationId])

  const handleRefreshAgents = useCallback(async () => {
    try {
      const fetchedAgents = await getAgents()
      setAgents(fetchedAgents)
    } catch {
      // Keep sample agents on error
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        agents={agents}
        selectedAgent={selectedAgent}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onSelectAgent={setSelectedAgent}
        onRefreshAgents={handleRefreshAgents}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          messages={activeConversation?.messages || []}
          isLoading={isLoading}
          selectedAgent={selectedAgent}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </main>
    </div>
  )
}

export default App
