import { ChatResponse, Agent } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function sendMessage(objective: string, agent?: string | null): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objective,
      ...(agent && { agent }),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP ${response.status}`)
  }

  return response.json()
}

export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/agents`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  
  // Transform simple agent names to Agent objects
  if (Array.isArray(data.agents)) {
    return data.agents.map((name: string) => ({
      name,
      description: '',
      keywords: [],
    }))
  }

  return data
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
