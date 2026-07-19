"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircleIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  MicIcon,
  PlusIcon,
  StopIcon,
  XIcon,
} from "@/components/friday-icons";
import { cn, newId } from "@/lib/friday/utils";
import { playClickSound } from "@/lib/friday/sound";
import { AttachmentChips, type Attachment } from "@/features/dx/components/friday/attachment-chip";
import {
  MentionMenu,
  PlusMenu,
  SlashMenu,
  type SlashCommand,
} from "@/features/dx/components/friday/input-popovers";
import { providers } from "@/lib/ai/providers";
import { ScrollArea } from "@/components/friday-ui/scroll-area";
import { Input } from "@/components/friday-ui/input";

const CATEGORY_LABELS: Record<string, string> = {
  NoAuth: "Free (No Auth)",
  OAuth: "OAuth Providers",
  WebCookie: "Web / Cookie",
  APIKey: "API Key Providers",
  Local: "Local / Self-Hosted",
  Search: "Search Providers",
  Audio: "Audio Providers",
  Proxy: "Upstream Proxy",
  CloudAgent: "Cloud Agents",
  System: "System",
};

const CATEGORY_ORDER = [
  "NoAuth",
  "OAuth",
  "WebCookie",
  "APIKey",
  "Local",
  "Search",
  "Audio",
  "Proxy",
  "CloudAgent",
  "System",
];

type ChatInputProps = {
  onSend: (text: string, attachments: Attachment[]) => void;
  onStop?: () => void;
  streaming?: boolean;
  providerId: string;
  modelId: string;
  onProviderChange: (id: string) => void;
  onModelChange: (id: string) => void;
  onMenuOpenChange?: (open: boolean) => void;
};

const MAX_HEIGHT = 220;
const ACCESS_COLORS: Record<string, string> = {
  full: "text-[#f97316] hover:bg-[#f97316]/10",
  limited: "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10",
  read: "text-blue-600 dark:text-blue-400 hover:bg-blue-500/10",
};

export function ChatInput({
  onSend,
  onStop,
  streaming,
  providerId,
  modelId,
  onProviderChange,
  onModelChange,
  onMenuOpenChange,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [access, setAccess] = useState<"full" | "limited" | "read">("full");
  const [plusOpen, setPlusOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);

  const [expanded, setExpanded] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineH = 24;
    const next = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = next + "px";
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
    const wantsExpand = el.scrollHeight > lineH + 8;
    if (wantsExpand !== expandedRef.current) {
      expandedRef.current = wantsExpand;
      setExpanded(wantsExpand);
    }
  }, [value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setAccessOpen(false);
        setPlusOpen(false);
        setSlashOpen(false);
        setMentionOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (onMenuOpenChange) onMenuOpenChange(menuOpen);
  }, [menuOpen, onMenuOpenChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cursor = el.selectionStart ?? value.length;
    const before = value.slice(0, cursor);
    const lastSlash = before.lastIndexOf("/");
    const lastAt = before.lastIndexOf("@");
    if (lastSlash >= 0 && /\s|^/.test(before[lastSlash - 1] ?? "")) {
      const query = before.slice(lastSlash + 1);
      if (!query.includes(" ")) {
        setSlashOpen(true);
        setMentionOpen(false);
        return;
      }
    }
    setSlashOpen(false);
    if (lastAt >= 0 && /\s|^/.test(before[lastAt - 1] ?? "")) {
      const query = before.slice(lastAt + 1);
      if (!query.includes(" ")) {
        setMentionOpen(true);
        return;
      }
    }
    setMentionOpen(false);
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text && attachments.length === 0) return;
    onSend(text, attachments);
    setValue("");
    setAttachments([]);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) {
        el.style.height = "auto";
        el.focus();
      }
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !slashOpen && !mentionOpen) {
      e.preventDefault();
      submit();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const insertAtCursor = (text: string) => {
    const el = ref.current;
    if (!el) {
      setValue((v) => v + text);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + text + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + text.length;
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((f) => {
      const id = newId();
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachments((prev) => [
            ...prev,
            {
              id,
              kind: "image",
              name: f.name,
              meta: `${(f.size / 1024).toFixed(1)} KB`,
              preview: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(f);
      } else {
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
        const kind: Attachment["kind"] = [
          "py",
          "ts",
          "tsx",
          "js",
          "json",
          "yaml",
          "yml",
          "md",
        ].includes(ext)
          ? "code"
          : ["mp3", "wav", "ogg"].includes(ext)
            ? "audio"
            : ["mp4", "webm"].includes(ext)
              ? "video"
              : "file";
        newAttachments.push({
          id,
          kind,
          name: f.name,
          meta: `${(f.size / 1024).toFixed(1)} KB`,
        });
      }
    });
    if (newAttachments.length) setAttachments((p) => [...p, ...newAttachments]);
  };

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const images = items.filter((i) => i.type.startsWith("image/"));
    if (images.length) {
      e.preventDefault();
      images.forEach((i) => {
        const f = i.getAsFile();
        if (f) handleFiles({ 0: f, length: 1, item: () => f } as unknown as FileList);
      });
    }
  };

  const currentProvider = providers[providerId];
  const currentModel = currentProvider?.models.find((m) => m.id === modelId);

  const onSlashSelect = (cmd: SlashCommand) => {
    const el = ref.current;
    if (el) {
      const cursor = el.selectionStart ?? value.length;
      const before = value.slice(0, cursor);
      const lastSlash = before.lastIndexOf("/");
      if (lastSlash >= 0) {
        const next = value.slice(0, lastSlash) + value.slice(cursor);
        setValue(next);
        requestAnimationFrame(() => {
          if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = lastSlash;
          }
        });
      }
    }
    setSlashOpen(false);
    if (cmd.id === "image" || cmd.id === "video" || cmd.id === "upload" || cmd.id === "camera") {
      fileRef.current?.click();
    } else if (cmd.id === "link") {
      insertAtCursor("https://");
    } else if (cmd.id === "schedule") {
      insertAtCursor("[scheduled for \u2026] ");
    } else if (cmd.id === "summary") {
      insertAtCursor("/summary ");
    } else if (cmd.id === "plan") {
      insertAtCursor("/plan ");
    } else if (cmd.id === "edit") {
      insertAtCursor("/edit ");
    } else if (cmd.id === "run") {
      insertAtCursor("/run ");
    }
  };

  const onMentionSelect = (m: { id: string; label: string }) => {
    const el = ref.current;
    if (el) {
      const cursor = el.selectionStart ?? value.length;
      const before = value.slice(0, cursor);
      const lastAt = before.lastIndexOf("@");
      if (lastAt >= 0) {
        const next = value.slice(0, lastAt) + `@${m.label} ` + value.slice(cursor);
        setValue(next);
        requestAnimationFrame(() => {
          if (el) {
            el.focus();
            const pos = lastAt + m.label.length + 2;
            el.selectionStart = el.selectionEnd = pos;
          }
        });
      }
    }
    setMentionOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={fileRef}
        type="file"
        multiple
        hidden
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <AnimatePresence>
        {slashOpen && (
          <SlashMenu
            open={slashOpen}
            query={value.slice(value.lastIndexOf("/") + 1)}
            onSelect={onSlashSelect}
            onClose={() => setSlashOpen(false)}
          />
        )}
        {mentionOpen && (
          <MentionMenu
            open={mentionOpen}
            query={value.slice(value.lastIndexOf("@") + 1)}
            onSelect={onMentionSelect}
            onClose={() => setMentionOpen(false)}
          />
        )}
        {plusOpen && (
          <PlusMenu
            open={plusOpen}
            onSelect={(id) => {
              if (id === "upload" || id === "image" || id === "camera" || id === "video") {
                fileRef.current?.click();
              } else if (id === "link") {
                insertAtCursor("https://");
              } else if (id === "schedule") {
                insertAtCursor("[scheduled] ");
              } else if (id === "mention") {
                insertAtCursor("@");
              } else if (id === "plugin") {
                insertAtCursor("/");
              }
            }}
            onClose={() => setPlusOpen(false)}
          />
        )}
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(2px)" }}
            transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-[calc(100%+8px)] right-2 sm:right-16 z-50 origin-bottom-right"
          >
            <ModelPickerPopover
              providerId={providerId}
              modelId={modelId}
              onProviderChange={onProviderChange}
              onModelChange={onModelChange}
              onClose={() => setMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recording && (
          <RecordingBar
            onStop={() => {
              setRecording(false);
              playClickSound();
            }}
          />
        )}
      </AnimatePresence>

      <motion.form
        ref={formRef}
        onSubmit={onSubmit}
        layout
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        animate={{
          boxShadow: focused
            ? "0 0 0 4px rgba(168,85,247,0.10), 0 10px 30px -10px rgba(0,0,0,0.18)"
            : "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px -8px rgba(0,0,0,0.10)",
        }}
        className={cn(
          "relative flex w-full flex-col rounded-2xl border bg-surface p-1.5 sm:p-2 transition-colors",
          focused ? "border-border-strong" : "border-border",
        )}
      >
        <AttachmentChips
          attachments={attachments}
          onRemove={(id) => setAttachments((p) => p.filter((a) => a.id !== id))}
        />

        <div className="relative w-full">
          <textarea
            ref={ref}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder="Ask for follow-up changes \u2014 try /image, @gpt, or paste a file"
            className={cn(
              "scrollbar-thin w-full resize-none bg-transparent px-3 sm:px-4 pt-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed transition-all",
              expanded ? "pb-2" : "pb-0",
            )}
            style={{
              maxHeight: MAX_HEIGHT,
              minHeight: 40,
              height: 40,
            }}
          />
        </div>

        <motion.div
          layout
          className={cn("flex w-full items-center gap-1 sm:gap-2", expanded ? "mt-0.5" : "mt-0")}
        >
          <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setPlusOpen((p) => !p);
                setSlashOpen(false);
                setMentionOpen(false);
              }}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-md transition-colors",
                plusOpen
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
              aria-label="Add to chat"
            >
              {plusOpen ? <XIcon className="h-4 w-4" /> : <PlusIcon className="h-5 w-5" />}
            </motion.button>

            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setAccessOpen((p) => !p)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  ACCESS_COLORS[access],
                )}
              >
                <AlertCircleIcon className="h-3.5 w-3.5" />
                {access === "full" ? "Full access" : access === "limited" ? "Limited" : "Read-only"}
                <ChevronDownIcon className="h-3 w-3 opacity-60" />
              </motion.button>
              <AnimatePresence>
                {accessOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-44 bg-surface border border-border rounded-lg shadow-xl overflow-hidden p-1 z-30"
                  >
                    {(
                      [
                        { id: "full", label: "Full access", desc: "Read, write, run" },
                        { id: "limited", label: "Limited", desc: "Read, suggest edits" },
                        { id: "read", label: "Read-only", desc: "View only" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setAccess(opt.id);
                          setAccessOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex flex-col hover:bg-surface-2"
                      >
                        <span className="text-[12.5px] font-medium text-foreground flex items-center gap-2">
                          {opt.label}
                          {access === opt.id && (
                            <span className="ml-auto text-accent">{"\u25CF"}</span>
                          )}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground">{opt.desc}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-2 pr-1 shrink-0">
            <motion.button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                menuOpen
                  ? "bg-foreground text-background"
                  : "bg-surface-2 text-foreground-muted hover:bg-surface-2",
              )}
            >
              <span className="flex items-center gap-1.5">
                {currentProvider && (
                  <currentProvider.icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate max-w-[100px]">
                  {currentModel?.name || currentProvider?.name || "Select Model"}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  {currentProvider?.name}
                </span>
              </span>
              <ChevronDownIcon className="h-3.5 w-3.5 ml-0.5 opacity-50" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                setRecording((r) => !r);
                playClickSound();
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "hidden sm:grid h-9 w-9 place-items-center rounded-full transition-colors",
                recording
                  ? "bg-red-500 text-white"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
              aria-label="Voice input"
            >
              <MicIcon className="h-4 w-4" />
            </motion.button>

            {streaming ? (
              <motion.button
                type="button"
                onClick={onStop}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background shadow-sm"
                aria-label="Stop generating"
              >
                <StopIcon className="h-3.5 w-3.5" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={!value.trim() && attachments.length === 0}
                initial={false}
                animate={{
                  scale: value.trim() || attachments.length > 0 ? 1 : 0.9,
                  opacity: value.trim() || attachments.length > 0 ? 1 : 0.4,
                }}
                whileHover={value.trim() || attachments.length > 0 ? { scale: 1.06 } : undefined}
                whileTap={value.trim() || attachments.length > 0 ? { scale: 0.94 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background shadow-sm shrink-0"
                aria-label="Send message"
              >
                <ArrowUpIcon className="h-4 w-4" strokeWidth={2.5} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function RecordingBar({ onStop }: { onStop: () => void }) {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const bars = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        h1: `${20 + seededRandom(i * 3) * 20}%`,
        h2: `${10 + seededRandom(i * 3 + 1) * 80}%`,
        h3: `${20 + seededRandom(i * 3 + 2) * 20}%`,
        dur: 0.6 + seededRandom(i * 7) * 0.4,
      })),
    [],
  );

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute inset-0 z-30 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-surface/95 p-3 backdrop-blur"
    >
      <motion.div
        className="h-2.5 w-2.5 rounded-full bg-red-500"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <div className="flex-1 flex items-center justify-center gap-0.5 h-8">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="w-0.5 rounded-full bg-red-500"
            animate={{
              height: [b.h1, b.h2, b.h3],
            }}
            transition={{
              duration: b.dur,
              repeat: Infinity,
              delay: i * 0.04,
              ease: "easeInOut",
            }}
            style={{ height: "30%" }}
          />
        ))}
      </div>
      <div className="font-mono text-[12px] tabular-nums text-foreground-muted">
        {format(duration)}
      </div>
      <motion.button
        type="button"
        onClick={onStop}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="grid h-9 w-9 place-items-center rounded-full bg-red-500 text-white"
        aria-label="Stop recording"
      >
        <StopIcon className="h-3.5 w-3.5" />
      </motion.button>
    </motion.div>
  );
}

function ModelPickerPopover({
  providerId,
  modelId,
  onProviderChange,
  onModelChange,
  onClose,
}: {
  providerId: string;
  modelId: string;
  onProviderChange: (id: string) => void;
  onModelChange: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const groups: Record<string, typeof providers[keyof typeof providers][]> = {};

    const providerValues = Object.values(providers);
    const filtered = search
      ? providerValues.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.models.some(
              (m) =>
                m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.id.toLowerCase().includes(search.toLowerCase()),
            ),
        )
      : providerValues;

    for (const provider of filtered) {
      const cat = provider.category || "APIKey";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(provider);
    }

    return Object.entries(groups)
      .sort(([a], [b]) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b))
      .map(([cat, provs]) => [cat, provs] as const);
  }, [search]);

  return (
    <div
      className="p-3 bg-surface border border-border rounded-xl shadow-2xl w-[92vw] max-w-[500px] select-none"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="relative mb-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search providers or models..."
          className="pl-6 h-7 text-[11px]"
        />
      </div>

      <ScrollArea className="h-[320px] max-h-[60vh]">
        {grouped.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
            No providers found
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(([cat, provs]) => (
              <div key={cat}>
                <div className="flex items-center gap-2 px-1 pb-1">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {CATEGORY_LABELS[cat] || cat}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[9px] text-muted-foreground/50">{provs.length}</span>
                </div>
                <div className="space-y-0.5">
                  {provs.map((provider) => {
                    const isProviderSelected = providerId === provider.id;
                    return (
                      <div key={provider.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onProviderChange(provider.id);
                            onModelChange(provider.defaultModel);
                            playClickSound();
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all text-xs",
                            isProviderSelected
                              ? "bg-chart-2/10 text-chart-2 font-medium"
                              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                          )}
                        >
                          <provider.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="flex-1 truncate">{provider.name}</span>
                          <span className="text-[9px] opacity-50 shrink-0">
                            {provider.models.length}
                          </span>
                        </button>
                        {isProviderSelected && (
                          <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-chart-2/30 pl-2">
                            {provider.models.slice(0, 12).map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  onProviderChange(provider.id);
                                  onModelChange(m.id);
                                  onClose();
                                  playClickSound();
                                }}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[11px] transition-all",
                                  modelId === m.id
                                    ? "bg-chart-2/20 text-chart-2 font-medium"
                                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                                )}
                              >
                                <div className="flex-1 truncate">{m.name}</div>
                                {m.contextLength && (
                                  <span className="text-[9px] opacity-50 shrink-0">
                                    {(m.contextLength / 1000).toFixed(0)}k
                                  </span>
                                )}
                              </button>
                            ))}
                            {provider.models.length > 12 && (
                              <div className="px-2 py-0.5 text-[9px] text-muted-foreground/50">
                                +{provider.models.length - 12} more models
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
