import { encode } from "@dx-serializer/core";

export interface CompactionConfig {
  enabled: boolean;
  /** Compact structured content (tool calls, JSON blocks) using DX Compact */
  compactStructured: boolean;
  /** Compact text messages using caveman rules */
  compactText: boolean;
  /** Collapse whitespace (default true) */
  collapseWhitespace: boolean;
  /** Minimum message count before compaction triggers */
  minMessages: number;
  /** Context ratio threshold (0-1). Compact when tokens > contextLength * threshold */
  contextRatio: number;
}

const DEFAULT_CONFIG: CompactionConfig = {
  enabled: true,
  compactStructured: true,
  compactText: true,
  collapseWhitespace: true,
  minMessages: 3,
  contextRatio: 0.6,
};

// Caveman-style text compression rules
const CAVEMAN_RULES: [RegExp, string][] = [
  // Pleasantries
  [
    /\\bsure\\b|\\bcertainly\\b|\\bof course\\b|\\bhappy to\\b|\\bglad to\\b|\\bno problem\\b|\\byou're welcome\\b|\\byoure welcome\\b|\\babsolutely\\b/gi,
    "",
  ],
  // Polite framing
  [
    /\\bplease\\b|\\bkindly\\b|\\bcould you please\\b|\\bwould you please\\b|\\bcan you please\\b/gi,
    "",
  ],
  // Hedging
  [
    /\\bit seems like\\b|\\bit appears that\\b|\\bi think that\\b|\\bi believe that\\b|\\bprobably\\b|\\bpossibly\\b|\\bmaybe it\\b/gi,
    "",
  ],
  // Verbose instructions
  [
    /provide a detailed|give me a comprehensive|write an in-depth|create a thorough|explain in detail/gi,
    "",
  ],
  // Filler adverbs
  [
    /\\bbasically\\b|\\bessentially\\b|\\bactually\\b|\\bliterally\\b|\\bsimply\\b|\\bcurrently\\b/gi,
    "",
  ],
  // Filler phrases
  [/\\bi want to\\b|\\bi need to\\b|\\bi'd like to\\b|\\bi'm looking for\\b/gi, ""],
  // Redundant openers
  [/\\bhi there\\b|\\bhello\\b|\\bgood morning\\b|\\bhey\\b/gi, ""],
  // Redundant phrasing
  [
    /due to the fact that|the reason is because|it is important to note|you should be aware|i would like to point out/gi,
    "",
  ],
  // Leader phrases
  [/\\bi'll\\b|\\bi will\\b|\\bi can\\b|\\bi'd\\b|\\blet me\\b/gi, ""],
  // Ultra abbreviations
  [/\\bdatabase\\b/gi, "db"],
  [/\\bconfiguration\\b/gi, "config"],
  [/\\bfunction\\b/gi, "fn"],
  [/\\bapplication\\b/gi, "app"],
  [/\\bdocumentation\\b/gi, "docs"],
  [/\\binformation\\b/gi, "info"],
  [/\\bcommunication\\b/gi, "comm"],
  [/\\brepresentation\\b/gi, "rep"],
  [/\\bimplementation\\b/gi, "impl"],
  [/\\bmanagement\\b/gi, "mgmt"],
  [/\\bdevelopment\\b/gi, "dev"],
  [/\\badministration\\b/gi, "admin"],
  [/\\bauthenticate\\b|\\bauthentication\\b/gi, "auth"],
  [/\\binitialize\\b/gi, "init"],
  [/\\butilization\\b/gi, "usage"],
];

function applyCaveman(text: string): string {
  let result = text;
  for (const [pattern, replacement] of CAVEMAN_RULES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function collapseWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .replace(/ +$/gm, "")
    .trim();
}

function compactStructuredContent(text: string): string {
  // Find JSON blocks and try to encode them with DX Compact
  return text.replace(/```json\n([\s\S]*?)\n```/g, (_match, jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr.trim());
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        const dxEncoded = encode(parsed);
        if (dxEncoded && dxEncoded.length < jsonStr.length) {
          return `\`\`\`dx-compact\n${dxEncoded}\n\`\`\``;
        }
      }
    } catch {
      /* fall through */
    }
    return _match;
  });
}

export interface CompactionResult {
  text: string;
  compressed: boolean;
  originalTokens: number;
  compressedTokens: number;
  savingsPercent: number;
}

export function compactText(
  text: string,
  config: Partial<CompactionConfig> = {},
): CompactionResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const originalTokens = countTokensSimple(text);
  let result = text;

  if (cfg.collapseWhitespace) {
    result = collapseWhitespace(result);
  }
  if (cfg.compactText) {
    result = applyCaveman(result);
  }
  if (cfg.compactStructured) {
    result = compactStructuredContent(result);
  }

  const compressedTokens = countTokensSimple(result);
  const savings = originalTokens - compressedTokens;
  const compressed = savings > 0;

  return {
    text: result,
    compressed,
    originalTokens,
    compressedTokens,
    savingsPercent: originalTokens > 0 ? Math.round((savings / originalTokens) * 10000) / 100 : 0,
  };
}

export interface ContextWindowState {
  totalTokens: number;
  contextLimit: number;
  ratio: number;
  shouldCompact: boolean;
}

export function checkContextWindow(
  messages: { content: string }[],
  contextLength: number,
  config: Partial<CompactionConfig> = {},
): ContextWindowState {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const totalTokens = messages.reduce((sum, m) => sum + countTokensSimple(m.content || ""), 0);
  const ratio = contextLength > 0 ? totalTokens / contextLength : 0;

  return {
    totalTokens,
    contextLimit: contextLength,
    ratio,
    shouldCompact: messages.length >= cfg.minMessages && ratio >= cfg.contextRatio,
  };
}

export function compactMessages(
  messages: { role: string; content: string }[],
  contextLength: number,
  config: Partial<CompactionConfig> = {},
): { messages: { role: string; content: string }[]; compacted: boolean; stats: CompactionResult } {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const state = checkContextWindow(messages, contextLength, config);

  if (!state.shouldCompact) {
    return {
      messages,
      compacted: false,
      stats: {
        text: "",
        compressed: false,
        originalTokens: state.totalTokens,
        compressedTokens: state.totalTokens,
        savingsPercent: 0,
      },
    };
  }

  let totalOriginal = 0;
  let totalCompressed = 0;
  let anyCompressed = false;

  const compacted = messages.map((msg) => {
    if (msg.role === "system") return msg; // never compact system messages
    const result = compactText(msg.content, config);
    totalOriginal += result.originalTokens;
    totalCompressed += result.compressedTokens;
    if (result.compressed) anyCompressed = true;
    return { ...msg, content: result.text };
  });

  return {
    messages: compacted,
    compacted: anyCompressed,
    stats: {
      text: "",
      compressed: anyCompressed,
      originalTokens: totalOriginal,
      compressedTokens: totalCompressed,
      savingsPercent:
        totalOriginal > 0
          ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 10000) / 100
          : 0,
    },
  };
}

function countTokensSimple(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}
