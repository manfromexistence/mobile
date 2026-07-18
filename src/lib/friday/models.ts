export type ModelTier = "low" | "medium" | "high";

export type TierPricing = {
  label: string;
  pricePer1M: number;
  contextWindow: number;
};

export type ZenModel = {
  id: string;
  label: string;
  provider: string;
  description: string;
  badge?: string;
  tiers: Record<ModelTier, TierPricing>;
  maxTier: ModelTier;
};

export const TIER_LABELS: Record<ModelTier, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const TIER_LABELS_LIST: ModelTier[] = ["low", "medium", "high"];

export const ZEN_MODELS: ZenModel[] = [
  {
    id: "big-pickle",
    label: "Big Pickle",
    provider: "Stealth",
    description: "General-purpose stealth model",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 32_000 },
      medium: { label: "Medium", pricePer1M: 0.15, contextWindow: 64_000 },
      high: { label: "High", pricePer1M: 0.5, contextWindow: 128_000 },
    },
    maxTier: "high",
  },
  {
    id: "deepseek-v4-flash-free",
    label: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    description: "Fast responses, quick questions",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 16_000 },
      medium: { label: "Medium", pricePer1M: 0.1, contextWindow: 32_000 },
      high: { label: "High", pricePer1M: 0.35, contextWindow: 64_000 },
    },
    maxTier: "high",
  },
  {
    id: "mimo-v2.5-free",
    label: "MiMo V2.5",
    provider: "Xiaomi",
    description: "Balanced general-purpose performance",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 32_000 },
      medium: { label: "Medium", pricePer1M: 0.12, contextWindow: 64_000 },
      high: { label: "High", pricePer1M: 0.4, contextWindow: 128_000 },
    },
    maxTier: "high",
  },
  {
    id: "hy3-free",
    label: "Hy3",
    provider: "Tencent · Hy",
    description: "Reasoning, long context, coding & agents",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 64_000 },
      medium: { label: "Medium", pricePer1M: 0.2, contextWindow: 128_000 },
      high: { label: "High", pricePer1M: 0.8, contextWindow: 190_000 },
    },
    maxTier: "high",
  },
  {
    id: "north-mini-code-free",
    label: "North Mini Code",
    provider: "OpenCode",
    description: "Code generation focused",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 16_000 },
      medium: { label: "Medium", pricePer1M: 0.08, contextWindow: 32_000 },
      high: { label: "High", pricePer1M: 0.25, contextWindow: 64_000 },
    },
    maxTier: "high",
  },
  {
    id: "nemotron-3-ultra-free",
    label: "Nemotron 3 Ultra",
    provider: "NVIDIA",
    description: "Advanced reasoning & agentic workloads",
    badge: "Free",
    tiers: {
      low: { label: "Low", pricePer1M: 0, contextWindow: 64_000 },
      medium: { label: "Medium", pricePer1M: 0.25, contextWindow: 128_000 },
      high: { label: "High", pricePer1M: 1.0, contextWindow: 256_000 },
    },
    maxTier: "high",
  },
];

export const ZEN_BASE = "https://opencode.ai/zen/v1";
