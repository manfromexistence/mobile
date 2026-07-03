"use client"

import * as React from "react"
import type { ModelId } from "@/features/dx/types"
import { getModelConfig } from "@/lib/ai/models-config"

type PipelineInstance = any

let cachedPipeline: { modelId: ModelId; instance: PipelineInstance } | null = null

function formatPrompt(messages: { role: string; content: string }[]): string {
  return (
    messages
      .map((m) => {
        if (m.role === "system") return `System: ${m.content}`
        if (m.role === "user") return `User: ${m.content}`
        return `Assistant: ${m.content}`
      })
      .join("\n") + "\nAssistant:"
  )
}

function getCacheKey(modelName: string): string {
  return `dx-model-cached:${modelName}`
}

function isModelCached(modelName: string): boolean {
  if (typeof localStorage === "undefined") return false
  return localStorage.getItem(getCacheKey(modelName)) === "1"
}

function markModelCached(modelName: string) {
  if (typeof localStorage === "undefined") return
  localStorage.setItem(getCacheKey(modelName), "1")
}

export interface ModelProgress {
  percent: number
  stage: string
  file: string | null
}

const MOCK_RESPONSES = [
  "That's a great question! Based on what I know, here are some key points to consider...",
  "I'd be happy to help you with that. Let me break this down into a few parts.",
  "Interesting topic! Here's my understanding of the matter.",
  "Let me think about this carefully. There are several aspects to consider.",
]

function getMockResponse(userMessage: string): string {
  const base = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
  const words = userMessage.split(" ").length
  const extra = `\n\nYou mentioned "${userMessage.slice(0, 60)}${userMessage.length > 60 ? "..." : ""}". This is a simulated response because the AI model could not be loaded in your browser. To use real AI, try:\n\n1. Switching to a smaller model in the model selector\n2. Using a browser with more memory (Chrome/Edge)\n3. Installing a local AI server`
  return base + extra
}

export function useModelInference() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [progress, setProgress] = React.useState<ModelProgress | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isMock, setIsMock] = React.useState(false)
  const loadedRef = React.useRef<ModelId | null>(null)
  const mockRef = React.useRef(false)

  const loadModel = React.useCallback(
    async (modelId: ModelId, onProgress?: (p: ModelProgress) => void) => {
      if (cachedPipeline && cachedPipeline.modelId === modelId) {
        loadedRef.current = modelId
        return cachedPipeline.instance
      }

      setIsLoading(true)
      setError(null)
      setIsMock(false)
      mockRef.current = false

      const config = getModelConfig(modelId)
      const cached = isModelCached(config.modelName)

      setProgress({
        percent: 0,
        stage: cached ? "Loading from cache..." : "Preparing model...",
        file: null,
      })

      function updateProgress(percent: number, stage: string, file: string | null = null) {
        const p: ModelProgress = { percent, stage, file }
        setProgress(p)
        onProgress?.(p)
      }

      try {
        const { pipeline } = await import("@huggingface/transformers")

        let lastPercent = 0

        const progress_callback = (data: any) => {
          let percent = lastPercent
          let stage = "Loading..."
          let file: string | null = data?.file ?? null

          if (data?.status === "download") {
            stage = `Downloading ${data.file}...`
            percent = Math.max(percent, 5)
          } else if (data?.status === "progress" && typeof data.progress === "number") {
            stage = data.file ? `Loading ${data.file}...` : "Loading..."
            percent = data.progress
            lastPercent = data.progress
          } else if (data?.status === "done") {
            stage = `Loaded ${data.file}`
            percent = Math.max(percent, 90)
          } else if (data?.status === "ready") {
            stage = "Initializing..."
            percent = 95
          }

          const p: ModelProgress = { percent, stage, file }
          setProgress(p)
          onProgress?.(p)
        }

        updateProgress(2, cached ? "Checking cache..." : "Connecting...")

        let instance: PipelineInstance | null = null
        let lastError: Error | null = null

        const backends = ["webgl", "wasm"]
        for (const device of backends) {
          if (instance) break
          try {
            updateProgress(cached ? 15 : 5, `Loading with ${device}...`)
            instance = await pipeline("text-generation", config.modelName, {
              dtype: "q4",
              device,
              progress_callback,
            })
          } catch (err) {
            lastError = err as Error
            updateProgress(
              cached ? 15 : 5,
              `${device} failed, trying next backend...`
            )
          }
        }

        if (!instance) throw lastError ?? new Error("All backends failed")

        updateProgress(100, "Ready!")

        cachedPipeline = { modelId, instance }
        loadedRef.current = modelId
        markModelCached(config.modelName)

        setIsLoading(false)
        setTimeout(() => setProgress(null), 500)

        return instance
      } catch (err) {
        const message = (err as Error).message
        if (
          message.includes("allocate a buffer") ||
          message.includes("memory") ||
          message.includes("bad_alloc") ||
          message.includes("Create a session")
        ) {
          setError(
            `Model too large for browser memory. Switching to fallback mode. Try the basic model.`
          )
          setIsMock(true)
          mockRef.current = true
        } else {
          setError(`${message}. Using fallback mode.`)
          setIsMock(true)
          mockRef.current = true
        }
        setIsLoading(false)
        setProgress(null)
        throw err
      }
    },
    []
  )

  const generate = React.useCallback(
    async (
      modelId: ModelId,
      messages: { role: string; content: string }[],
      onToken: (token: string) => void,
      onDone: () => void,
      onError: (err: Error) => void,
      signal?: AbortSignal
    ) => {
      if (mockRef.current || isMock) {
        try {
          const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
          const fullResponse = getMockResponse(lastUserMsg?.content ?? "")

          const words = fullResponse.split(/(?<=\s)/)
          for (const word of words) {
            if (signal?.aborted) return
            onToken(word)
            await new Promise((r) => setTimeout(r, 30 + Math.random() * 40))
          }
          onDone()
        } catch (err) {
          onError(err as Error)
        }
        return
      }

      try {
        const generator = cachedPipeline?.instance ?? (await loadModel(modelId))
        if (signal?.aborted) return

        const config = getModelConfig(modelId)
        const prompt = formatPrompt(messages)

        const { TextStreamer } = await import("@huggingface/transformers")

        const streamer = new TextStreamer(generator.tokenizer, {
          skip_prompt: true,
          skip_special_tokens: true,
          callback_function: (text: string) => {
            if (signal?.aborted) return
            onToken(text)
          },
        })

        await generator(prompt, {
          max_new_tokens: config.maxTokens,
          temperature: config.temperature,
          top_p: config.topP,
          repetition_penalty: config.repetitionPenalty,
          do_sample: true,
          streamer,
        })

        if (signal?.aborted) return
        onDone()
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        onError(err as Error)
      }
    },
    [loadModel, isMock]
  )

  return {
    isLoading,
    progress,
    error,
    isMock,
    loadModel,
    generate,
  }
}
