"use client";

import {
  Box,
  FileText,
  FileType,
  Mail,
  Mic,
  MoreHorizontal,
  Radio,
  Send,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AIModeSwitcher } from "./ai-mode-switcher";
import { AITargetSwitcher } from "./ai-target-switcher";
import { ImageControls, MediaControls } from "./media-controls";
import { ModelPicker } from "./model-picker";

interface MediaType {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Message {
  role: string;
  content: string;
  id: string;
}

interface AIInputBarProps {
  messages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  // Merged props from dx-chat
  inputValue?: string;
  onInputChange?: (val: string) => void;
  onSubmit?: (e?: React.FormEvent) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  isVoiceMode?: boolean;
  onVoiceModeChange?: (isVoice: boolean) => void;
  selectedModelId?: string;
  onModelChange?: (model: string) => void;
}

const MEDIA_TYPES: MediaType[] = [
  { id: "text", label: "Text", icon: FileText },
  { id: "image", label: "Image", icon: FileType },
  { id: "video", label: "Video", icon: Video },
  { id: "audio", label: "Audio", icon: Mic },
  { id: "email", label: "Email", icon: Mail },
  { id: "live", label: "Live", icon: Radio },
  { id: "3d", label: "3D", icon: Box },
];

import { Paperclip, X, ArrowUp, Volume2 } from "lucide-react";
import { VoiceBar } from "@/features/dx/components/dx-chat-voice";
import { Input } from "@/components/ui/input";

export function AIInputBar({ 
  messages = [], 
  onMessagesChange, 
  isLoading = false, 
  onLoadingChange,
  inputValue,
  onInputChange,
  onSubmit,
  onStop,
  isGenerating,
  isVoiceMode,
  onVoiceModeChange,
  selectedModelId,
  onModelChange
}: AIInputBarProps) {
  const [selectedMedia, setSelectedMedia] = useState<string>("text");
  const [selectedProvider, setSelectedProvider] = useState<string>("gemini");
  const [selectedModel, setSelectedModel] =
    useState<string>("gemini-3.1-flash-lite-preview");
  const [internalInput, setInternalInput] = useState("");
  const input = inputValue !== undefined ? inputValue : internalInput;
  const setInput = (val: string) => {
    if (onInputChange) onInputChange(val);
    else setInternalInput(val);
  };
  const [isFocused, setIsFocused] = useState(false);
  const [showMoreMedia, setShowMoreMedia] = useState(false);
  const [visibleMediaCount, setVisibleMediaCount] = useState(7);
  const [showMediaLabels, setShowMediaLabels] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible media items and label visibility based on container width
  useEffect(() => {
    const updateVisibleMedia = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;

      if (width < 600) {
        setVisibleMediaCount(1);
        setShowMediaLabels(false);
      } else if (width < 750) {
        setVisibleMediaCount(3);
        setShowMediaLabels(false);
      } else if (width < 900) {
        setVisibleMediaCount(5);
        setShowMediaLabels(false);
      } else {
        setVisibleMediaCount(7);
        setShowMediaLabels(true);
      }
    };

    updateVisibleMedia();
    const ro = new ResizeObserver(updateVisibleMedia);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    return () => ro.disconnect();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
      return;
    }

    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    };

    onMessagesChange([...messages, userMessage]);
    setInput("");
    onLoadingChange(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          providerId: selectedProvider,
          modelId: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantId = Date.now().toString();
      onMessagesChange([
        ...messages,
        userMessage,
        { role: "assistant", content: "", id: assistantId },
      ]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "" || line === "data: [DONE]") continue;

          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              const parsed = JSON.parse(jsonStr);

              if (parsed.type === "text-delta" && parsed.delta) {
                assistantMessage += parsed.delta;
                onMessagesChange([
                  ...messages,
                  userMessage,
                  { role: "assistant", content: assistantMessage, id: assistantId },
                ]);
              }
            } catch (_parseError) {
              console.log("Failed to parse SSE data:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      onLoadingChange(false);
    }
  };

  const visibleMedia = MEDIA_TYPES.slice(0, visibleMediaCount);
  const hiddenMedia = MEDIA_TYPES.slice(visibleMediaCount);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-background/30 backdrop-blur-2xl border border-white/10 relative w-full rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden ring-1 ring-white/5",
        "dark:bg-black/40 dark:border-white/10",
        isFocused && "shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-background/40 dark:bg-black/50 border-white/20 ring-white/10",
      )}
    >
      <form onSubmit={handleSubmit}>
        {/* Voice Mode Overlay */}
        {onVoiceModeChange && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-between rounded-2xl bg-background/95 backdrop-blur-xl border border-blue-200/50 pr-1.5 pl-2 shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 md:pr-2 md:pl-3",
              isVoiceMode
                ? "pointer-events-auto z-50 scale-100 opacity-100"
                : "pointer-events-none z-0 scale-95 opacity-0"
            )}
          >
            <div className="flex h-full flex-1 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="rounded-full text-muted-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Speak now or type..."
                className="h-full flex-1 border-none bg-transparent px-2 text-[15px] font-medium text-foreground shadow-none outline-none placeholder:text-blue-400 md:px-3 focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) onSubmit?.();
                  }
                }}
              />
            </div>
            <div className="flex flex-shrink-0 items-center gap-1.5 md:gap-2">
              <div className="flex h-[38px] items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 pr-1 pl-3 md:h-[42px] md:gap-3 md:pr-1.5 md:pl-4 dark:border-blue-900/50 dark:bg-blue-950/80">
                <div className="flex h-4 items-center gap-[3px] md:h-5">
                  <VoiceBar delay="0.1s" height={40} />
                  <VoiceBar delay="0.3s" height={80} />
                  <VoiceBar delay="0.5s" height={60} />
                  <VoiceBar delay="0.2s" height={100} />
                  <VoiceBar delay="0.6s" height={50} />
                  <VoiceBar delay="0.4s" height={90} />
                  <VoiceBar delay="0.7s" height={30} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full h-6 w-6 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center justify-center p-0"
                  onClick={() => onVoiceModeChange(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                type="submit"
                className="size-10 rounded-full bg-foreground text-background shadow-sm hover:bg-blue-600 flex items-center justify-center"
                onClick={isGenerating ? (e) => { e.preventDefault(); onStop?.(); } : undefined}
              >
                {isGenerating ? <div className="h-3.5 w-3.5 rounded-sm bg-background" /> : (input.trim() ? <ArrowUp className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />)}
              </Button>
            </div>
          </div>
        )}

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              selectedMedia === "image"
                ? "Describe the image you want to generate..."
                : selectedMedia === "video"
                  ? "Describe the video you want to create..."
                  : "Ask me anything or describe what you need help with..."
            }
            disabled={isLoading}
            className="text-foreground placeholder:text-muted-foreground/50 min-h-px max-h-[120px] resize-none border-0 bg-transparent px-4 py-2 text-sm leading-tight focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-between gap-3 bg-white/5 dark:bg-black/20 backdrop-blur-md px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <AITargetSwitcher />
            <AIModeSwitcher />

            {selectedMedia === "image" && <ImageControls />}
            {(selectedMedia === "video" ||
              selectedMedia === "audio" ||
              selectedMedia === "live" ||
              selectedMedia === "3d") && (
              <MediaControls mediaType={selectedMedia as any} />
            )}

            <ModelPicker
              selectedProvider={selectedProvider}
              selectedModel={selectedModelId || selectedModel}
              onProviderChange={(provider) => {
                setSelectedProvider(provider);
              }}
              onModelChange={(model) => {
                setSelectedModel(model);
                onModelChange?.(model);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <AnimatePresence mode="popLayout">
                {visibleMedia.map((media) => {
                  const Icon = media.icon;
                  const isSelected = selectedMedia === media.id;
                  return (
                    <motion.div
                      key={media.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        type="button"
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedMedia(media.id)}
                        className={cn(
                          "h-7 transition-all",
                          showMediaLabels ? "gap-1.5 px-2.5" : "w-7 px-0",
                        )}
                        title={media.label}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {showMediaLabels && (
                          <span className="text-xs">{media.label}</span>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {hiddenMedia.length > 0 && (
                <Popover
                  open={showMoreMedia}
                  onOpenChange={setShowMoreMedia}
                >
                  <PopoverTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 px-0"
                        title="More media types"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="end"
                    className="w-48 p-2"
                  >
                    <div className="space-y-1">
                      {hiddenMedia.map((media) => {
                        const Icon = media.icon;
                        const isSelected = selectedMedia === media.id;
                        return (
                          <Button
                            key={media.id}
                            type="button"
                            variant={isSelected ? "default" : "ghost"}
                            size="sm"
                            onClick={() => {
                              setSelectedMedia(media.id);
                              setShowMoreMedia(false);
                            }}
                            className="w-full justify-start gap-2 h-8"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="text-sm">{media.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {onVoiceModeChange && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full px-0 text-muted-foreground mr-1"
                  onClick={() => onVoiceModeChange(true)}
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="submit"
                onClick={isGenerating ? (e) => { e.preventDefault(); onStop?.(); } : undefined}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="h-8 gap-2 px-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {isGenerating || isLoading ? (
                    <div className="h-3.5 w-3.5 rounded-sm bg-background animate-pulse" />
                  ) : (
                    "Send"
                  )}
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
