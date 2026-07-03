export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  id: string
  role: MessageRole
  content: string
  createdAt: number
  metrics?: {
    speed: number
    durationMs: number
    tokenCount: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  modelId: string
  createdAt: number
  updatedAt: number
}

export interface StreamChunk {
  type: "text" | "done" | "error"
  content?: string
  error?: string
}

export type ModelId = "minicpm-1b" | "tinyllama-1.1b" | "qwen-0.5b"

export interface ModelOption {
  id: ModelId
  name: string
  provider: "huggingface" | "openai-compatible"
  modelName: string
  quantization: string
  contextLength: number
  description: string
  maxTokens: number
  temperature: number
  topP: number
  repetitionPenalty: number
  status: "available" | "downloading" | "unavailable"
}

export interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isGenerating: boolean
  selectedModel: ModelId
}
