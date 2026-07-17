// lib/ai/providers.ts

import { bedrock } from "@ai-sdk/amazon-bedrock"
import { anthropic } from "@ai-sdk/anthropic"
import { createAzure } from "@ai-sdk/azure"
import { cerebras } from "@ai-sdk/cerebras"
import { cohere } from "@ai-sdk/cohere"
import { deepseek } from "@ai-sdk/deepseek"
import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { mistral } from "@ai-sdk/mistral"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { xai } from "@ai-sdk/xai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import type React from "react"
import {
  AmazonQLogo,
  AnthropicLogo,
  AzureLogo,
  ClaudeLogo,
  CloudflareLogo,
  CohereLogo,
  DeepseekLogo,
  GeminiLogo,
  GoogleLogo,
  GrokLogo,
  GroqLogo,
  HuggingfaceLogo,
  IbmLogo,
  InflectionLogo,
  MetaLogo,
  MistralLogo,
  NvidiaLogo,
  OllamaLogo,
  OpenaiLogo,
  OpenrouterLogo,
  PalmLogo,
  PerplexityLogo,
  ProviderMonogram,
  QwenLogo,
  ReplicateLogo,
  StabilityLogo,
  TogetherLogo,
  VercelLogo,
} from "@/features/dx/components/chat/provider-logos"

// ── Specialized SDK clients ──
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const githubModels = createOpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_MODELS_API_KEY,
})

const azure = createAzure({
  apiKey: process.env.AZURE_API_KEY,
  resourceName: process.env.AZURE_RESOURCE_NAME,
})

const fireworks = createOpenAICompatible({
  name: "fireworks",
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: process.env.FIREWORKS_API_KEY,
})

const together = createOpenAICompatible({
  name: "together",
  baseURL: "https://api.together.xyz/v1",
  apiKey: process.env.TOGETHER_API_KEY,
})

const perplexity = createOpenAICompatible({
  name: "perplexity",
  baseURL: "https://api.perplexity.ai",
  apiKey: process.env.PERPLEXITY_API_KEY,
})

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
})

const qwen = createOpenAICompatible({
  name: "qwen",
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.QWEN_API_KEY,
})

const huggingface = createOpenAICompatible({
  name: "huggingface",
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
})

const nvidia = createOpenAICompatible({
  name: "nvidia",
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
})

const stability = createOpenAICompatible({
  name: "stability",
  baseURL: "https://api.stability.ai/v1",
  apiKey: process.env.STABILITY_API_KEY,
})

// Generic OpenAI-compatible client factory (for the long tail of providers).
function oaiCompatible(
  name: string,
  baseURL: string,
  envVar?: string,
  extraHeaders?: Record<string, string>
) {
  return createOpenAICompatible({
    name,
    baseURL,
    apiKey: envVar ? process.env[envVar] : "dummy",
    headers: extraHeaders,
  })
}

// ═══════════════════════════════════════════════════
//  PROVIDER REGISTRY — single source of truth
// ═══════════════════════════════════════════════════
export type ProviderId =
  | "opencode"
  | "ai-gateway"
  | "openai"
  | "anthropic"
  | "claude"
  | "gemini"
  | "google"
  | "vertex"
  | "palm"
  | "meta"
  | "llama"
  | "xai"
  | "grok"
  | "mistral"
  | "cohere"
  | "deepseek"
  | "groq"
  | "cerebras"
  | "fireworks"
  | "together"
  | "perplexity"
  | "qwen"
  | "openrouter"
  | "ollama"
  | "huggingface"
  | "nvidia"
  | "stability"
  | "azure"
  | "bedrock"
  | "github_models"
  | "replicate"
  | "cloudflare"
  | "inflection"
  | "ibm"
  | "amazon"
  | "vercel"
  | "moonshot"
  | "kimi"
  | "minimax"
  | "zhipu"
  | "baichuan"
  | "stepfun"
  | "yi"
  | "upstage"
  | "ai21"
  | "databricks"
  | "nebius"
  | "deepinfra"
  | "siliconflow"
  | "scaleway"
  | "ovh"
  | "lepton"
  | "lambda"
  | "venice"
  | "cartesia"
  | "exa"
  | "jina"
  | "tavily"
  | "novita"
  | "featherless"
  | "glhf"
  | "fal"
  | "modal"
  | "kluster"
  | "monsterapi"
  | "premai"
  | "unify"
  | "trubit"
  | "aionlabs"
  | "zeno"
  | "xenova"

export interface ModelConfig {
  id: string
  name: string
  modelId: string
  description: string
}

export interface ProviderConfig {
  id: ProviderId
  name: string
  icon: React.ComponentType<{ className?: string }>
  models: ModelConfig[]
  defaultModel: string
  description: string
}

const m = (
  id: string,
  name: string,
  modelId: string,
  description: string
): ModelConfig => ({ id, name, modelId, description })

export const providers: Record<ProviderId, ProviderConfig> = {
  opencode: {
    id: "opencode",
    name: "Opencode",
    icon: OpenaiLogo,
    models: [
      m("opencode-low", "MiniMax M3 Free", "minimax-m3-free", "Free Tier"),
      m("opencode-high", "BigPickle", "bigpickle", "Free Tier"),
      m("opencode-xhigh", "DeepSeek V4 Flash Free", "deepseek-v4-flash-free", "Free Tier"),
      m("opencode-default", "Mimo V2.5 Free", "mimo-v2.5-free", "Free Tier"),
      m("opencode-medium", "Nemotron 3 Super Free", "nemotron-3-super-free", "Free Tier"),
      m("opencode-xlow", "Nemotron 3 Ultra Free", "nemotron-3-ultra-free", "Free Tier"),
    ],
    defaultModel: "opencode-default",
    description: "Opencode Free Models",
  },

  "ai-gateway": {
    id: "ai-gateway",
    name: "AI Gateway",
    icon: OpenaiLogo,
    models: [
      m("openai-gpt-4o", "GPT-4o", "openai/gpt-4o", "OpenAI's most capable model"),
      m("anthropic-claude-opus-4", "Claude Opus 4", "anthropic/claude-opus-4", "Anthropic's most powerful model"),
      m("google-gemini-3-flash", "Gemini 3 Flash", "google/gemini-3-flash", "Google's fastest model"),
      m("meta-llama-4", "Llama 4", "meta/llama-4", "Meta's latest open model"),
      m("xai-grok-3", "Grok 3", "xai/grok-3", "xAI's latest model"),
    ],
    defaultModel: "openai-gpt-4o",
    description: "Access 20+ providers through AI Gateway",
  },

  openai: {
    id: "openai",
    name: "OpenAI",
    icon: OpenaiLogo,
    models: [
      m("gpt-4o", "GPT-4o", "gpt-4o", "Most capable OpenAI model"),
      m("gpt-4o-mini", "GPT-4o Mini", "gpt-4o-mini", "Fast and efficient"),
      m("o1", "o1", "o1", "Reasoning model"),
      m("o3-mini", "o3-mini", "o3-mini", "Cost-effective reasoning"),
    ],
    defaultModel: "gpt-4o",
    description: "OpenAI's frontier models",
  },

  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    icon: AnthropicLogo,
    models: [
      m("claude-opus-4", "Claude Opus 4", "claude-opus-4", "Most capable Claude model"),
      m("claude-sonnet-4", "Claude Sonnet 4", "claude-sonnet-4", "Balanced performance and speed"),
      m("claude-haiku-4", "Claude Haiku 4", "claude-haiku-4", "Fastest Claude model"),
    ],
    defaultModel: "claude-sonnet-4",
    description: "Anthropic's Claude models with extended thinking",
  },

  claude: {
    id: "claude",
    name: "Claude (direct)",
    icon: ClaudeLogo,
    models: [
      m("claude-3-5-sonnet", "Claude 3.5 Sonnet", "claude-3-5-sonnet-latest", "Previous-gen Sonnet"),
      m("claude-3-opus", "Claude 3 Opus", "claude-3-opus-latest", "Previous-gen Opus"),
    ],
    defaultModel: "claude-3-5-sonnet",
    description: "Anthropic Claude (alias)",
  },

  gemini: {
    id: "gemini",
    name: "Google Gemini",
    icon: GeminiLogo,
    models: [
      m("gemini-3.1-flash-lite-preview", "Gemini 3.1 Flash-Lite", "gemini-3.1-flash-lite-preview", "Fastest and most cost-effective"),
      m("gemini-2.5-flash", "Gemini 2.5 Flash", "gemini-2.5-flash", "Best price-performance for reasoning"),
      m("gemini-2.0-flash-exp", "Gemini 2.0 Flash Experimental", "gemini-2.0-flash-exp", "Experimental multimodal model"),
    ],
    defaultModel: "gemini-3.1-flash-lite-preview",
    description: "Google's latest multimodal AI models",
  },

  google: {
    id: "google",
    name: "Google AI",
    icon: GoogleLogo,
    models: [
      m("gemini-2.5-pro", "Gemini 2.5 Pro", "gemini-2.5-pro", "Google's pro model"),
      m("gemini-1.5-flash", "Gemini 1.5 Flash", "gemini-1.5-flash", "Legacy fast model"),
    ],
    defaultModel: "gemini-2.5-pro",
    description: "Google AI Studio models",
  },

  vertex: {
    id: "vertex",
    name: "Vertex AI",
    icon: GoogleLogo,
    models: [
      m("gemini-2.5-pro", "Gemini 2.5 Pro", "gemini-2.5-pro", "Vertex-hosted Gemini"),
      m("claude-opus-4", "Claude Opus 4", "claude-opus-4", "Claude on Vertex"),
    ],
    defaultModel: "gemini-2.5-pro",
    description: "Google Cloud Vertex AI",
  },

  palm: {
    id: "palm",
    name: "PaLM",
    icon: PalmLogo,
    models: [
      m("chat-bison", "Chat Bison", "chat-bison-001", "Legacy PaLM model"),
    ],
    defaultModel: "chat-bison",
    description: "Google PaLM API (legacy)",
  },

  meta: {
    id: "meta",
    name: "Meta",
    icon: MetaLogo,
    models: [
      m("llama-3.1-405b", "Llama 3.1 405B", "llama-3.1-405b", "Largest open model"),
      m("llama-3.3-70b", "Llama 3.3 70B", "llama-3.3-70b", "Balanced open model"),
    ],
    defaultModel: "llama-3.3-70b",
    description: "Meta's Llama open-weight models",
  },

  llama: {
    id: "llama",
    name: "Llama API",
    icon: MetaLogo,
    models: [
      m("llama-3.3-70b", "Llama 3.3 70B", "llama-3.3-70b-instruct", "Meta Llama API"),
    ],
    defaultModel: "llama-3.3-70b",
    description: "Meta's official Llama API",
  },

  xai: {
    id: "xai",
    name: "xAI",
    icon: GrokLogo,
    models: [
      m("grok-3", "Grok 3", "grok-3", "Latest Grok model"),
      m("grok-2", "Grok 2", "grok-2", "Previous generation Grok"),
    ],
    defaultModel: "grok-3",
    description: "xAI's Grok models with real-time data",
  },

  grok: {
    id: "grok",
    name: "Grok",
    icon: GrokLogo,
    models: [
      m("grok-3-mini", "Grok 3 Mini", "grok-3-mini", "Compact Grok 3"),
    ],
    defaultModel: "grok-3-mini",
    description: "xAI Grok (alias)",
  },

  github_models: {
    id: "github_models",
    name: "GitHub Models",
    icon: OpenaiLogo,
    models: [
      m("gpt-4o-mini", "GPT-4o Mini", "gpt-4o-mini", "Fast and efficient model"),
      m("gpt-4o", "GPT-4o", "gpt-4o", "Most capable OpenAI model"),
    ],
    defaultModel: "gpt-4o-mini",
    description: "Latest OpenAI models via GitHub",
  },

  groq: {
    id: "groq",
    name: "Groq",
    icon: GroqLogo,
    models: [
      m("llama-3.1-8b-instant", "Llama 3.1 8B", "llama-3.1-8b-instant", "Fast 8B parameter model"),
      m("llama-3.3-70b-versatile", "Llama 3.3 70B", "llama-3.3-70b-versatile", "Versatile 70B parameter model"),
      m("mixtral-8x7b-32768", "Mixtral 8x7B", "mixtral-8x7b-32768", "Mixture of experts model"),
    ],
    defaultModel: "llama-3.1-8b-instant",
    description: "Ultra-fast LPU inference engine",
  },

  cerebras: {
    id: "cerebras",
    name: "Cerebras",
    icon: NvidiaLogo,
    models: [
      m("llama3.1-8b", "Llama 3.1 8B", "llama3.1-8b", "8B parameter model"),
      m("llama3.1-70b", "Llama 3.1 70B", "llama3.1-70b", "70B parameter model"),
    ],
    defaultModel: "llama3.1-8b",
    description: "Wafer-scale fastest AI inference",
  },

  mistral: {
    id: "mistral",
    name: "Mistral",
    icon: MistralLogo,
    models: [
      m("mistral-small-latest", "Mistral Small", "mistral-small-latest", "Cost-effective model"),
      m("mistral-large-latest", "Mistral Large", "mistral-large-latest", "Most capable Mistral model"),
    ],
    defaultModel: "mistral-small-latest",
    description: "European open-weight powerhouse",
  },

  cohere: {
    id: "cohere",
    name: "Cohere",
    icon: CohereLogo,
    models: [
      m("command-r-plus", "Command R+", "command-r-plus", "Enhanced capabilities"),
      m("command-r", "Command R", "command-r", "Standard model"),
    ],
    defaultModel: "command-r-plus",
    description: "Enterprise RAG & generation models",
  },

  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    icon: DeepseekLogo,
    models: [
      m("deepseek-v3.2", "DeepSeek V3.2", "deepseek-v3.2", "Latest chat model"),
      m("deepseek-r1", "DeepSeek R1", "deepseek-r1", "Reasoning model"),
    ],
    defaultModel: "deepseek-v3.2",
    description: "Latest reasoning & coding models",
  },

  azure: {
    id: "azure",
    name: "Azure OpenAI",
    icon: AzureLogo,
    models: [
      m("gpt-4o", "GPT-4o", "gpt-4o", "OpenAI via Azure"),
      m("gpt-4o-mini", "GPT-4o Mini", "gpt-4o-mini", "Fast model via Azure"),
    ],
    defaultModel: "gpt-4o",
    description: "OpenAI models via Azure",
  },

  bedrock: {
    id: "bedrock",
    name: "AWS Bedrock",
    icon: AmazonQLogo,
    models: [
      m("claude-opus-4", "Claude Opus 4", "anthropic.claude-opus-4", "Claude via AWS"),
      m("llama-3-70b", "Llama 3 70B", "meta.llama3-70b-instruct-v1:0", "Llama via AWS"),
    ],
    defaultModel: "claude-opus-4",
    description: "Multiple models via AWS Bedrock",
  },

  amazon: {
    id: "amazon",
    name: "Amazon Q",
    icon: AmazonQLogo,
    models: [
      m("amazon-q", "Amazon Q", "amazon.q:latest", "AWS assistant model"),
    ],
    defaultModel: "amazon-q",
    description: "Amazon Q Developer",
  },

  ibm: {
    id: "ibm",
    name: "IBM watsonx",
    icon: IbmLogo,
    models: [
      m("granite-3-8b", "Granite 3 8B", "ibm/granite-3-8b-instruct", "IBM open model"),
    ],
    defaultModel: "granite-3-8b",
    description: "IBM watsonx.ai models",
  },

  vercel: {
    id: "vercel",
    name: "Vercel AI Gateway",
    icon: VercelLogo,
    models: [
      m("gpt-4o", "GPT-4o", "openai/gpt-4o", "Via Vercel gateway"),
    ],
    defaultModel: "gpt-4o",
    description: "Vercel AI SDK gateway",
  },

  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    icon: OpenrouterLogo,
    models: [
      m("deepseek-r1-free", "DeepSeek R1", "deepseek/deepseek-r1:free", "Latest reasoning model (free)"),
      m("gemini-3.1-flash-lite-free", "Gemini 3.1 Flash-Lite", "google/gemini-3.1-flash-lite:free", "Google's fastest model (free)"),
      m("llama-4-scout-free", "Llama 4 Scout", "meta-llama/llama-4-scout:free", "Latest Llama model (free)"),
      m("claude-opus-4", "Claude Opus 4", "anthropic/claude-opus-4", "Most capable Claude (paid)"),
      m("gpt-4o", "GPT-4o", "openai/gpt-4o", "OpenAI's best model (paid)"),
    ],
    defaultModel: "deepseek-r1-free",
    description: "300+ models aggregator (free & paid)",
  },

  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    icon: OllamaLogo,
    models: [
      m("llama3.1", "Llama 3.1", "llama3.1", "Local Llama 3.1"),
      m("mistral", "Mistral", "mistral", "Local Mistral"),
      m("codellama", "Code Llama", "codellama", "Local coding model"),
    ],
    defaultModel: "llama3.1",
    description: "Run models locally with Ollama",
  },

  qwen: {
    id: "qwen",
    name: "Qwen (Alibaba)",
    icon: QwenLogo,
    models: [
      m("qwen-max", "Qwen Max", "qwen-max", "Most capable Qwen model"),
      m("qwen-plus", "Qwen Plus", "qwen-plus", "Balanced Qwen model"),
      m("qwen2.5-72b", "Qwen2.5 72B", "qwen2.5-72b-instruct", "Open-weight 72B model"),
    ],
    defaultModel: "qwen-max",
    description: "Alibaba's Qwen large language models",
  },

  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    icon: HuggingfaceLogo,
    models: [
      m("meta-llama-3.3-70b", "Llama 3.3 70B", "meta-llama/Llama-3.3-70B-Instruct", "Open Meta model via HF router"),
      m("qwen2.5-72b", "Qwen2.5 72B", "Qwen/Qwen2.5-72B-Instruct", "Open Alibaba model via HF router"),
      m("mistral-7b", "Mistral 7B", "mistralai/Mistral-7B-Instruct-v0.3", "Open Mistral model via HF router"),
    ],
    defaultModel: "meta-llama-3.3-70b",
    description: "Thousands of open models via HF Inference",
  },

  nvidia: {
    id: "nvidia",
    name: "NVIDIA NIM",
    icon: NvidiaLogo,
    models: [
      m("nemotron-70b", "Llama 3.1 Nemotron 70B", "nvidia/llama-3.1-nemotron-70b-instruct", "NVIDIA-tuned Llama model"),
      m("nemotron-3-70b", "Nemotron 3 70B", "nvidia/llama-3.3-nemotron-super-49b-v1", "NVIDIA Nemotron super model"),
    ],
    defaultModel: "nemotron-70b",
    description: "Optimized inference on NVIDIA NIM",
  },

  stability: {
    id: "stability",
    name: "Stability AI",
    icon: StabilityLogo,
    models: [
      m("stable-lm-2-12b", "Stable LM 2 12B", "stabilityai/stablelm-2-12b", "Stability's open language model"),
      m("stable-code-3b", "Stable Code 3B", "stabilityai/stable-code-3b", "Code completion model"),
    ],
    defaultModel: "stable-lm-2-12b",
    description: "Open models from Stability AI",
  },

  fireworks: {
    id: "fireworks",
    name: "Fireworks AI",
    icon: MetaLogo,
    models: [
      m("llama-3.1-70b", "Llama 3.1 70B", "accounts/fireworks/models/llama-v3p1-70b-instruct", "Fast Llama inference"),
      m("mixtral-8x7b", "Mixtral 8x7B", "accounts/fireworks/models/mixtral-8x7b-instruct", "Mixture of experts"),
    ],
    defaultModel: "llama-3.1-70b",
    description: "Fast inference for open models",
  },

  together: {
    id: "together",
    name: "Together AI",
    icon: TogetherLogo,
    models: [
      m("llama-3.1-70b", "Llama 3.1 70B", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "Fast Llama inference"),
      m("qwen-2.5-72b", "Qwen 2.5 72B", "Qwen/Qwen2.5-72B-Instruct-Turbo", "Alibaba's model"),
    ],
    defaultModel: "llama-3.1-70b",
    description: "Fast inference platform",
  },

  perplexity: {
    id: "perplexity",
    name: "Perplexity",
    icon: PerplexityLogo,
    models: [
      m("llama-3.1-sonar-large", "Sonar Large", "llama-3.1-sonar-large-128k-online", "Online search-enabled"),
      m("llama-3.1-sonar-small", "Sonar Small", "llama-3.1-sonar-small-128k-online", "Fast online search"),
    ],
    defaultModel: "llama-3.1-sonar-large",
    description: "Search-augmented models",
  },

  replicate: {
    id: "replicate",
    name: "Replicate",
    icon: ReplicateLogo,
    models: [
      m("llama-3.1-70b", "Llama 3.1 70B", "meta/meta-llama-3-70b-instruct", "Hosted open models"),
    ],
    defaultModel: "llama-3.1-70b",
    description: "Open models via Replicate",
  },

  cloudflare: {
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    icon: CloudflareLogo,
    models: [
      m("llama-3.1-8b", "Llama 3.1 8B", "@cf/meta/llama-3.1-8b-instruct", "Edge inference"),
    ],
    defaultModel: "llama-3.1-8b",
    description: "Serverless inference at the edge",
  },

  inflection: {
    id: "inflection",
    name: "Inflection AI",
    icon: InflectionLogo,
    models: [
      m("inflection-3", "Inflection 3", "inflection-3-product", "Pi assistant model"),
    ],
    defaultModel: "inflection-3",
    description: "Inflection's Pi models",
  },

  // ── Long tail: OpenAI-compatible providers (monogram logos) ──
  moonshot: {
    id: "moonshot",
    name: "Moonshot AI",
    icon: (p: any) => <ProviderMonogram name="Moonshot" {...p} />,
    models: [m("kimi-k2", "Kimi K2", "moonshot-v1-8k", "Moonshot's flagship")],
    defaultModel: "kimi-k2",
    description: "Moonshot AI (Kimi)",
  },

  kimi: {
    id: "kimi",
    name: "Kimi",
    icon: (p: any) => <ProviderMonogram name="Kimi" {...p} />,
    models: [m("kimi-k2", "Kimi K2", "kimi-k2", "Long-context assistant")],
    defaultModel: "kimi-k2",
    description: "Kimi chat models",
  },

  minimax: {
    id: "minimax",
    name: "MiniMax",
    icon: (p: any) => <ProviderMonogram name="MiniMax" {...p} />,
    models: [m("minimax-m3", "MiniMax M3", "MiniMax-Text-01", "MiniMax flagship")],
    defaultModel: "minimax-m3",
    description: "MiniMax language models",
  },

  zhipu: {
    id: "zhipu",
    name: "Zhipu AI",
    icon: (p: any) => <ProviderMonogram name="Zhipu" {...p} />,
    models: [m("glm-4", "GLM-4", "glm-4-plus", "Zhipu's GLM model")],
    defaultModel: "glm-4",
    description: "Zhipu AI (GLM) models",
  },

  baichuan: {
    id: "baichuan",
    name: "Baichuan",
    icon: (p: any) => <ProviderMonogram name="Baichuan" {...p} />,
    models: [m("baichuan-4", "Baichuan 4", "Baichuan4-Turbo", "Baichuan flagship")],
    defaultModel: "baichuan-4",
    description: "Baichuan Intelligent Technology",
  },

  stepfun: {
    id: "stepfun",
    name: "StepFun",
    icon: (p: any) => <ProviderMonogram name="StepFun" {...p} />,
    models: [m("step-2", "Step-2", "step-2-16k", "StepFun flagship")],
    defaultModel: "step-2",
    description: "StepFun AI models",
  },

  yi: {
    id: "yi",
    name: "01.AI (Yi)",
    icon: (p: any) => <ProviderMonogram name="Yi" {...p} />,
    models: [m("yi-large", "Yi Large", "yi-large", "01.AI flagship")],
    defaultModel: "yi-large",
    description: "01.AI Yi models",
  },

  upstage: {
    id: "upstage",
    name: "Upstage",
    icon: (p: any) => <ProviderMonogram name="Upstage" {...p} />,
    models: [m("solar-pro", "Solar Pro", "solar-pro", "Upstage flagship")],
    defaultModel: "solar-pro",
    description: "Upstage Solar models",
  },

  ai21: {
    id: "ai21",
    name: "AI21 Labs",
    icon: (p: any) => <ProviderMonogram name="AI21" {...p} />,
    models: [m("jamba-1.5", "Jamba 1.5", "jamba-1.5-large", "AI21 Jamba model")],
    defaultModel: "jamba-1.5",
    description: "AI21 Jamba models",
  },

  databricks: {
    id: "databricks",
    name: "Databricks",
    icon: (p: any) => <ProviderMonogram name="Databricks" {...p} />,
    models: [m("dbrx", "DBRX", "dbrx-instruct", "Databricks open model")],
    defaultModel: "dbrx",
    description: "Databricks Mosaic AI",
  },

  nebius: {
    id: "nebius",
    name: "Nebius AI",
    icon: (p: any) => <ProviderMonogram name="Nebius" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "meta-llama/Llama-3.1-70B-Instruct", "Nebius-hosted Llama")],
    defaultModel: "llama-3.1-70b",
    description: "Nebius AI Studio",
  },

  deepinfra: {
    id: "deepinfra",
    name: "DeepInfra",
    icon: (p: any) => <ProviderMonogram name="DeepInfra" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "meta-llama/Meta-Llama-3.1-70B-Instruct", "DeepInfra inference")],
    defaultModel: "llama-3.1-70b",
    description: "Serverless model inference",
  },

  siliconflow: {
    id: "siliconflow",
    name: "SiliconFlow",
    icon: (p: any) => <ProviderMonogram name="SiliconFlow" {...p} />,
    models: [m("qwen2.5-72b", "Qwen2.5 72B", "Qwen/Qwen2.5-72B-Instruct", "SiliconFlow inference")],
    defaultModel: "qwen2.5-72b",
    description: "SiliconFlow acceleration platform",
  },

  scaleway: {
    id: "scaleway",
    name: "Scaleway",
    icon: (p: any) => <ProviderMonogram name="Scaleway" {...p} />,
    models: [m("llama-3.1-8b", "Llama 3.1 8B", "llama-3.1-8b-instruct", "Scaleway inference")],
    defaultModel: "llama-3.1-8b",
    description: "Scaleway Inference",
  },

  ovh: {
    id: "ovh",
    name: "OVHcloud",
    icon: (p: any) => <ProviderMonogram name="OVH" {...p} />,
    models: [m("llama-3.1-8b", "Llama 3.1 8B", "llama-3.1-8b-instruct", "OVH inference")],
    defaultModel: "llama-3.1-8b",
    description: "OVHcloud AI Endpoints",
  },

  lepton: {
    id: "lepton",
    name: "Lepton AI",
    icon: (p: any) => <ProviderMonogram name="Lepton" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama3-70b", "Lepton inference")],
    defaultModel: "llama-3.1-70b",
    description: "Lepton AI inference",
  },

  lambda: {
    id: "lambda",
    name: "Lambda Labs",
    icon: (p: any) => <ProviderMonogram name="Lambda" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama3.1-70b-instruct", "Lambda inference")],
    defaultModel: "llama-3.1-70b",
    description: "Lambda Inference API",
  },

  venice: {
    id: "venice",
    name: "Venice",
    icon: (p: any) => <ProviderMonogram name="Venice" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Uncensored inference")],
    defaultModel: "llama-3.1-70b",
    description: "Private, uncensored inference",
  },

  cartesia: {
    id: "cartesia",
    name: "Cartesia",
    icon: (p: any) => <ProviderMonogram name="Cartesia" {...p} />,
    models: [m("sonic", "Sonic", "sonic-2", "Real-time voice model")],
    defaultModel: "sonic",
    description: "Cartesia voice models",
  },

  exa: {
    id: "exa",
    name: "Exa",
    icon: (p: any) => <ProviderMonogram name="Exa" {...p} />,
    models: [m("exa-pro", "Exa Pro", "exa-pro", "Web-grounded search model")],
    defaultModel: "exa-pro",
    description: "Exa web search models",
  },

  jina: {
    id: "jina",
    name: "Jina AI",
    icon: (p: any) => <ProviderMonogram name="Jina" {...p} />,
    models: [m("reader", "Reader", "jina-reader", "Web reader model")],
    defaultModel: "reader",
    description: "Jina AI models",
  },

  tavily: {
    id: "tavily",
    name: "Tavily",
    icon: (p: any) => <ProviderMonogram name="Tavily" {...p} />,
    models: [m("tavily-qwen", "Tavily Qwen", "tavily-qwen-72b", "Search-grounded model")],
    defaultModel: "tavily-qwen",
    description: "Tavily search models",
  },

  novita: {
    id: "novita",
    name: "Novita AI",
    icon: (p: any) => <ProviderMonogram name="Novita" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "meta-llama/llama-3.1-70b-instruct", "Novita inference")],
    defaultModel: "llama-3.1-70b",
    description: "Novita AI inference",
  },

  featherless: {
    id: "featherless",
    name: "Featherless AI",
    icon: (p: any) => <ProviderMonogram name="Featherless" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Featherless inference")],
    defaultModel: "llama-3.1-70b",
    description: "Featherless AI inference",
  },

  glhf: {
    id: "glhf",
    name: "GLHF Chat",
    icon: (p: any) => <ProviderMonogram name="GLHF" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "GLHF inference")],
    defaultModel: "llama-3.1-70b",
    description: "GLHF.chat inference",
  },

  fal: {
    id: "fal",
    name: "fal.ai",
    icon: (p: any) => <ProviderMonogram name="fal" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "fal inference")],
    defaultModel: "llama-3.1-70b",
    description: "fal.ai inference",
  },

  modal: {
    id: "modal",
    name: "Modal",
    icon: (p: any) => <ProviderMonogram name="Modal" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Modal inference")],
    defaultModel: "llama-3.1-70b",
    description: "Modal serverless inference",
  },

  kluster: {
    id: "kluster",
    name: "Kluster.ai",
    icon: (p: any) => <ProviderMonogram name="Kluster" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Kluster inference")],
    defaultModel: "llama-3.1-70b",
    description: "Kluster.ai inference",
  },

  monsterapi: {
    id: "monsterapi",
    name: "MonsterAPI",
    icon: (p: any) => <ProviderMonogram name="Monster" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "MonsterAPI inference")],
    defaultModel: "llama-3.1-70b",
    description: "MonsterAPI inference",
  },

  premai: {
    id: "premai",
    name: "PremAI",
    icon: (p: any) => <ProviderMonogram name="Prem" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "PremAI inference")],
    defaultModel: "llama-3.1-70b",
    description: "PremAI inference",
  },

  unify: {
    id: "unify",
    name: "Unify AI",
    icon: (p: any) => <ProviderMonogram name="Unify" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Unify inference")],
    defaultModel: "llama-3.1-70b",
    description: "Unify AI router",
  },

  trubit: {
    id: "trubit",
    name: "Trubit AI",
    icon: (p: any) => <ProviderMonogram name="Trubit" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Trubit inference")],
    defaultModel: "llama-3.1-70b",
    description: "Trubit AI inference",
  },

  aionlabs: {
    id: "aionlabs",
    name: "AionLabs",
    icon: (p: any) => <ProviderMonogram name="Aion" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "AionLabs inference")],
    defaultModel: "llama-3.1-70b",
    description: "AionLabs inference",
  },

  zeno: {
    id: "zeno",
    name: "Zeno",
    icon: (p: any) => <ProviderMonogram name="Zeno" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Zeno inference")],
    defaultModel: "llama-3.1-70b",
    description: "Zeno inference",
  },

  xenova: {
    id: "xenova",
    name: "Xenova",
    icon: (p: any) => <ProviderMonogram name="Xenova" {...p} />,
    models: [m("llama-3.1-70b", "Llama 3.1 70B", "llama-3.1-70b", "Xenova inference")],
    defaultModel: "llama-3.1-70b",
    description: "Xenova inference",
  },
}

// OpenAI-compatible base URLs for the generic long-tail providers.
const OAI: Partial<Record<ProviderId, { baseURL: string; envVar?: string; headers?: Record<string, string> }>> = {
  meta: { baseURL: "https://api.llama-api.com/v1", envVar: "META_API_KEY" },
  llama: { baseURL: "https://api.llama-api.com/v1", envVar: "LLAMA_API_KEY" },
  moonshot: { baseURL: "https://api.moonshot.cn/v1", envVar: "MOONSHOT_API_KEY" },
  kimi: { baseURL: "https://api.moonshot.cn/v1", envVar: "KIMI_API_KEY" },
  minimax: { baseURL: "https://api.minimax.chat/v1", envVar: "MINIMAX_API_KEY" },
  zhipu: { baseURL: "https://open.bigmodel.cn/api/paas/v4", envVar: "ZHIPU_API_KEY" },
  baichuan: { baseURL: "https://api.baichuan-ai.com/v1", envVar: "BAICHUAN_API_KEY" },
  stepfun: { baseURL: "https://api.stepfun.com/v1", envVar: "STEPFUN_API_KEY" },
  yi: { baseURL: "https://api.01.ai/v1", envVar: "YI_API_KEY" },
  upstage: { baseURL: "https://api.upstage.ai/v1/solar", envVar: "UPSTAGE_API_KEY" },
  ai21: { baseURL: "https://api.ai21.com/studio/v1", envVar: "AI21_API_KEY" },
  databricks: { baseURL: "https://your-workspace.cloud.databricks.com/serving-endpoints", envVar: "DATABRICKS_TOKEN" },
  nebius: { baseURL: "https://api.nebius.ai/v1", envVar: "NEBIUS_API_KEY" },
  deepinfra: { baseURL: "https://api.deepinfra.com/v1/openai", envVar: "DEEPINFRA_API_KEY" },
  siliconflow: { baseURL: "https://api.siliconflow.cn/v1", envVar: "SILICONFLOW_API_KEY" },
  scaleway: { baseURL: "https://inference-api.scaleway.ai/v1", envVar: "SCALEWAY_API_KEY" },
  ovh: { baseURL: "https://llm.endpoints.ai.cloud.ovh.net/api/openai", envVar: "OVH_TOKEN" },
  lepton: { baseURL: "https://api.lepton.ai/v1", envVar: "LEPTON_API_KEY" },
  lambda: { baseURL: "https://api.lambda.ai/v1", envVar: "LAMBDA_API_KEY" },
  venice: { baseURL: "https://api.venice.ai/api/v1", envVar: "VENICE_API_KEY" },
  cartesia: { baseURL: "https://api.cartesia.ai/v1", envVar: "CARTESIA_API_KEY" },
  exa: { baseURL: "https://api.exa.ai/v1", envVar: "EXA_API_KEY" },
  jina: { baseURL: "https://api.jina.ai/v1", envVar: "JINA_API_KEY" },
  tavily: { baseURL: "https://api.tavily.com/v1", envVar: "TAVILY_API_KEY" },
  novita: { baseURL: "https://api.novita.ai/v3/openai", envVar: "NOVITA_API_KEY" },
  featherless: { baseURL: "https://api.featherless.ai/v1", envVar: "FEATHERLESS_API_KEY" },
  glhf: { baseURL: "https://api.glhf.chat/v1", envVar: "GLHF_API_KEY" },
  fal: { baseURL: "https://api.fal.ai/v1", envVar: "FAL_API_KEY" },
  modal: { baseURL: "https://api.modal.com/v1", envVar: "MODAL_API_KEY" },
  kluster: { baseURL: "https://api.kluster.ai/v1", envVar: "KLUSTER_API_KEY" },
  monsterapi: { baseURL: "https://api.monsterapi.ai/v1", envVar: "MONSTERAPI_KEY" },
  premai: { baseURL: "https://api.premai.io/v1", envVar: "PREMAI_API_KEY" },
  unify: { baseURL: "https://api.unify.ai/v1", envVar: "UNIFY_API_KEY" },
  trubit: { baseURL: "https://api.trubit.ai/v1", envVar: "TRUBIT_API_KEY" },
  aionlabs: { baseURL: "https://api.aionlabs.ai/v1", envVar: "AIONLABS_API_KEY" },
  zeno: { baseURL: "https://api.zeno.ai/v1", envVar: "ZENO_API_KEY" },
  xenova: { baseURL: "https://api.xenova.ai/v1", envVar: "XENOVA_API_KEY" },
}

// Cache of lazily-created OpenAI-compatible clients.
const oaiClients: Partial<Record<ProviderId, ReturnType<typeof oaiCompatible>>> = {}

function getOaiClient(id: ProviderId) {
  if (!oaiClients[id]) {
    const cfg = OAI[id]
    if (!cfg) return null
    oaiClients[id] = oaiCompatible(id, cfg.baseURL, cfg.envVar, cfg.headers)
  }
  return oaiClients[id]!
}

// Helper function to get model by provider and model ID
export function getModel(providerId: ProviderId, modelId: string) {
  const provider = providers[providerId]
  if (!provider) return null

  const modelConfig = provider.models.find((mm) => mm.id === modelId)
  if (!modelConfig) return null

  switch (providerId) {
    case "opencode": {
      const opencodeProvider = createOpenAICompatible({
        name: "opencode",
        baseURL: "https://opencode.ai/zen/v1",
        apiKey: process.env.OPENCODE_API_KEY || "public",
        headers: {
          "HTTP-Referer": "https://opencode.ai/",
          "X-Title": "opencode",
        },
      })
      return opencodeProvider(modelConfig.modelId)
    }
    case "ai-gateway":
      return modelConfig.modelId
    case "openai":
      return openai(modelConfig.modelId)
    case "anthropic":
    case "claude":
      return anthropic(modelConfig.modelId)
    case "gemini":
    case "google":
    case "vertex":
    case "palm":
      return google(modelConfig.modelId)
    case "meta":
    case "llama": {
      const client = getOaiClient(providerId)
      return client ? client(modelConfig.modelId) : null
    }
    case "xai":
    case "grok":
      return xai(modelConfig.modelId)
    case "github_models":
      return githubModels(modelConfig.modelId)
    case "groq":
      return groq(modelConfig.modelId)
    case "cerebras":
      return cerebras(modelConfig.modelId)
    case "mistral":
      return mistral(modelConfig.modelId)
    case "openrouter":
      return openrouter(modelConfig.modelId)
    case "cohere":
      return cohere(modelConfig.modelId)
    case "deepseek":
      return deepseek(modelConfig.modelId)
    case "azure":
      return azure(modelConfig.modelId)
    case "bedrock":
      return bedrock(modelConfig.modelId)
    case "fireworks":
      return fireworks(modelConfig.modelId)
    case "together":
      return together(modelConfig.modelId)
    case "perplexity":
      return perplexity(modelConfig.modelId)
    case "ollama":
      return ollama(modelConfig.modelId)
    case "qwen":
      return qwen(modelConfig.modelId)
    case "huggingface":
      return huggingface(modelConfig.modelId)
    case "nvidia":
      return nvidia(modelConfig.modelId)
    case "stability":
      return stability(modelConfig.modelId)
    case "replicate":
    case "cloudflare":
    case "inflection":
    case "ibm":
    case "amazon":
    case "vercel": {
      const client = getOaiClient(providerId)
      return client ? client(modelConfig.modelId) : null
    }
    default: {
      const client = getOaiClient(providerId)
      return client ? client(modelConfig.modelId) : null
    }
  }
}

export const providerList = Object.values(providers)
export const defaultProvider: ProviderId = "opencode"
export const defaultModel = "opencode-default"
