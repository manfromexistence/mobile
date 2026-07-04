import type { ModelId, ModelOption } from "@/features/dx/types"

export type ExtendedModelOption = ModelOption & {
  wllamaRepo?: string
  wllamaFile?: string
  mlcModelId?: string
}

export const MODEL_OPTIONS: Record<ModelId, ExtendedModelOption> = {
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
    mlcModelId: "Qwen2-0.5B-Instruct-q4f16_1-MLC",
    wllamaRepo: "Qwen/Qwen2-0.5B-Instruct-GGUF",
    wllamaFile: "qwen2-0_5b-instruct-q4_k_m.gguf",
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
    mlcModelId: "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
    wllamaRepo: "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF",
    wllamaFile: "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
  },
  "minicpm-1b": {
    id: "minicpm-1b",
    name: "MiniCPM 1B",
    provider: "huggingface",
    modelName: "openbmb/MiniCPM-1B",
    quantization: "q4",
    contextLength: 4096,
    description: "1B instruct model",
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    repetitionPenalty: 1.1,
    status: "available",
    mlcModelId: "Llama-3.2-1B-Instruct-q4f16_1-MLC", // fallback string, adjust if specific 1B model is in MLC
    wllamaRepo: "openbmb/MiniCPM-S-1B-sft-gguf",
    wllamaFile: "MiniCPM-S-1B-sft.gguf",
  },
}

export const DEFAULT_MODEL_ID: ModelId = "minicpm-1b"

export function getModelConfig(id: ModelId): ExtendedModelOption {
  return MODEL_OPTIONS[id]
}
