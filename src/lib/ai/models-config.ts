import type { ModelId, ModelOption } from "@/features/dx/types"

export const MODEL_OPTIONS: Record<ModelId, ModelOption> = {
  "qwen-0.5b": {
    id: "qwen-0.5b",
    name: "Qwen3 0.6B",
    provider: "huggingface",
    modelName: "onnx-community/Qwen3-0.6B-ONNX",
    quantization: "q4",
    contextLength: 2048,
    description: "Fast, browser-optimized 0.6B model",
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.05,
    status: "available",
  },
  "tinyllama-1.1b": {
    id: "tinyllama-1.1b",
    name: "TinyLlama 1.1B",
    provider: "huggingface",
    modelName: "onnx-community/TinyLlama-1.1B-Chat-v1.0",
    quantization: "q4",
    contextLength: 2048,
    description: "Compact 1.1B chat model, good for most tasks",
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.1,
    status: "available",
  },
  "minicpm-1b": {
    id: "minicpm-1b",
    name: "MiniCPM 1.5B",
    provider: "huggingface",
    modelName: "onnx-community/Qwen2.5-1.5B-Instruct",
    quantization: "q4",
    contextLength: 4096,
    description: "1.5B instruct model (needs sufficient RAM)",
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.1,
    status: "available",
  },
}

export const DEFAULT_MODEL_ID: ModelId = "qwen-0.5b"

export function getModelConfig(id: ModelId): ModelOption {
  return MODEL_OPTIONS[id]
}
