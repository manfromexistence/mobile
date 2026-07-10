"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  Box,
  ChartAreaIcon,
  File,
  FileText,
  Image,
  Mic,
  MoreHorizontal,
  Music,
  Paperclip,
  Radio,
  Send,
  Text,
  Video,
  Volume2,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { VoiceBar } from "@/features/dx/components/chat-voice"
import { providers } from "@/lib/ai/providers"
import { cn } from "@/lib/utils"
import { ImageControls, LiveControls } from "./media-controls"
import { PdfIcon } from "@hugeicons/core-free-icons"
import { AiProvider } from "@/features/dx/components/chat/ai-provider"
import { OverflowActionsPreview } from "@/features/dx/components/chat/media-control"
import { ExpandableTabsPreview } from "@/features/dx/components/chat/media-switcher"
import { DynamicIslandPreview } from "@/features/dx/components/chat/dynamic-status"


interface MediaType {
  id: string
  label: string
  icon: React.ElementType
}

interface Message {
  role: string
  content: string
  id: string
}

interface AIInputBarProps {
  messages?: Message[]
  onMessagesChange?: (messages: Message[]) => void
  isLoading?: boolean
  onLoadingChange?: (loading: boolean) => void
  inputValue?: string
  onInputChange?: (val: string) => void
  onSubmit?: (e?: React.FormEvent) => void
  onStop?: () => void
  isGenerating?: boolean
  isVoiceMode?: boolean
  onVoiceModeChange?: (isVoice: boolean) => void
  selectedModelId?: string
  onModelChange?: (model: string) => void
  onMediaSubmit?: (params: { prompt: string; mediaType: string }) => void
  isLiveConnected?: boolean
  isLiveSpeaking?: boolean
  onLiveConnect?: () => void
  onLiveDisconnect?: () => void
}

const MEDIA_TYPES: MediaType[] = [
  { id: "text", label: "Text", icon: Text },
  { id: "image", label: "Image", icon: Image },
  { id: "video", label: "Video", icon: Video },
  { id: "audio", label: "Audio", icon: Music },
]

const MORE_MEDIA_TYPES: MediaType[] = [
  { id: "live", label: "Live", icon: Radio },
  { id: "3d", label: "3D", icon: Box },
  { id: "charts", label: "Charts", icon: ChartAreaIcon },
  { id: "documents", label: "Documents", icon: File },
]

function base64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

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
  onModelChange,
  onMediaSubmit,
  isLiveConnected,
  isLiveSpeaking,
  onLiveConnect,
  onLiveDisconnect,
}: AIInputBarProps) {
  const [selectedMedia, setSelectedMedia] = useState<string>("text")
  const [selectedProvider, setSelectedProvider] = useState<string>("opencode")
  const [selectedModel, setSelectedModel] = useState<string>("opencode-high")
  const [internalInput, setInternalInput] = useState("")
  const input = inputValue !== undefined ? inputValue : internalInput
  const setInput = (val: string) => {
    if (onInputChange) onInputChange(val)
    else setInternalInput(val)
  }
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedModelId) {
      setSelectedModel(selectedModelId)
      for (const [providerId, providerConfig] of Object.entries(providers)) {
        if (providerConfig.models.some((m) => m.id === selectedModelId)) {
          setSelectedProvider(providerId)
          break
        }
      }
    }
  }, [selectedModelId])

  const handleAttachFile = async () => {
    const input_ = document.createElement("input")
    input_.type = "file"
    input_.accept = "image/*,video/*,audio/*,.pdf,.txt,.md"
    input_.multiple = false

    input_.onchange = async () => {
      const file = input_.files?.[0]
      if (!file) return

      try {
        const base64 = await base64FromFile(file)
        const mimeType = file.type || "application/octet-stream"

        const googleApiKey =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("google_api_key") || ""
            : ""

        const userMessage = {
          role: "user",
          content: `Please analyze this attached file: ${file.name}`,
          id: Date.now().toString(),
          experimental_attachments: [
            {
              name: file.name,
              contentType: mimeType,
              url: `data:${mimeType};base64,${base64}`,
            },
          ],
        }

        if (onMessagesChange) {
          onMessagesChange([...messages, userMessage])
          onLoadingChange?.(true)

          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [...messages, userMessage],
                modelId: selectedModel,
                apiKey: googleApiKey || undefined,
              }),
            })

            if (!response.ok) throw new Error("Failed to fetch")

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let assistantContent = ""

            const assistantId = Date.now().toString()
            onMessagesChange([
              ...messages,
              userMessage,
              { role: "assistant", content: "", id: assistantId },
            ])

            while (reader) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              const lines = chunk.split("\n")

              for (const line of lines) {
                if (line.trim() === "" || line === "data: [DONE]") continue

                if (line.startsWith("data: ")) {
                  try {
                    const jsonStr = line.slice(6)
                    const parsed = JSON.parse(jsonStr)
                    if (parsed.type === "text-delta" && parsed.delta) {
                      assistantContent += parsed.delta
                      onMessagesChange([
                        ...messages,
                        userMessage,
                        {
                          role: "assistant",
                          content: assistantContent,
                          id: assistantId,
                        },
                      ])
                    }
                  } catch {
                    // ignore parse errors
                  }
                }
              }
            }
          } catch (error) {
            console.error("Chat error:", error)
          } finally {
            onLoadingChange?.(false)
          }
        }
      } catch (error) {
        console.error("Failed to attach file:", error)
      }
    }

    input_.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isGenerating) return

    if (selectedMedia !== "text" && onMediaSubmit) {
      const prompt = input.trim()
      setInput("")
      onMediaSubmit({ prompt, mediaType: selectedMedia })
      return
    }

    if (onSubmit) {
      onSubmit(e)
      return
    }

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
      id: Date.now().toString(),
    }

    onMessagesChange([...messages, userMessage])
    setInput("")
    onLoadingChange(true)

    try {
      const googleApiKey =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("google_api_key") || ""
          : ""
      const openaiApiKey =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("openai_api_key") || ""
          : ""

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          providerId: selectedProvider,
          modelId: selectedModel,
          apiKey: googleApiKey || undefined,
          providerKey: (!googleApiKey ? openaiApiKey : undefined) || undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      const assistantId = Date.now().toString()
      onMessagesChange([
        ...messages,
        userMessage,
        { role: "assistant", content: "", id: assistantId },
      ])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.trim() === "" || line === "data: [DONE]") continue

          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6)
              const parsed = JSON.parse(jsonStr)

              if (parsed.type === "text-delta" && parsed.delta) {
                assistantMessage += parsed.delta
                onMessagesChange([
                  ...messages,
                  userMessage,
                  {
                    role: "assistant",
                    content: assistantMessage,
                    id: assistantId,
                  },
                ])
              }
            } catch (_parseError) {
              console.log("Failed to parse SSE data:", line)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-md border mx-auto lg:max-w-[60%]"
    // className={cn(
    //   "backdrop-blur-2xl relative w-full rounded-3xl shadow-2xl transition-all duration-300 ring-1 ring-border/20 lg:w-[70%]! mx-auto! bg-green-500 oveflow-hidden",
    //   isFocused && "shadow-xl bg-background/80 border-border ring-border/50"
    // )}
    >
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
              : selectedMedia === "live"
                ? isLiveConnected
                  ? "Connected to Gemini Live. Speak naturally..."
                  : "Click 'Start Live' to begin a voice call..."
                : "Ask me anything or describe what you need help with..."
        }
        disabled={isLoading || isLiveConnected}
        className="text-foreground placeholder:text-muted-foreground/50 min-h-full resize-none border-0 px-4 py-2 text-sm leading-tight focus-visible:ring-0 rounded-none"
      />
      {/* <DynamicIslandPreview />/ */}
      <div className="flex items-center justify-start">
        <div className="flex items-center justify-start p-3 gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-dashed rounded-full max-h-8 max-w-8"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full px-0 text-muted-foreground"
              onClick={handleAttachFile}
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </motion.div>
          <AiProvider />
        </div>

        <div className="flex items-center justify-end p-3 gap-2">
          <ExpandableTabsPreview />
          <OverflowActionsPreview />
        </div>
      </div>

      {/* <form onSubmit={handleSubmit}>
        {onVoiceModeChange && (
          <div
          // className={cn(
          //   "absolute inset-0 flex items-center gap-2 rounded-2xl backdrop-blur-xl border border-primary/20 pr-1.5 pl-2 shadow-lg transition-all duration-300 md:pr-2 md:pl-3 bg-pink-500",
          //   isVoiceMode
          //     ? "pointer-events-auto z-50 scale-100 opacity-100"
          //     : "pointer-events-none z-0 scale-95 opacity-0"
          // )}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="rounded-full text-muted-foreground shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak now or type..."
              className="h-8 flex-1 border-none bg-muted/30 px-3 text-[15px] font-medium text-foreground shadow-none outline-none placeholder:text-primary/60 rounded-lg focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim()) onSubmit?.()
                }
              }}
            />
            <div className="flex h-8 items-center gap-2 rounded-full border border-primary/20 bg-muted/30 px-2 shrink-0">
              <div className="flex h-3 items-center gap-[3px]">
                <VoiceBar delay="0.1s" height={30} />
                <VoiceBar delay="0.3s" height={60} />
                <VoiceBar delay="0.5s" height={45} />
                <VoiceBar delay="0.2s" height={75} />
                <VoiceBar delay="0.6s" height={35} />
                <VoiceBar delay="0.4s" height={65} />
                <VoiceBar delay="0.7s" height={25} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="rounded-full h-5 w-5 text-primary hover:bg-primary/20 flex items-center justify-center p-0"
                onClick={() => onVoiceModeChange(false)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </div>
            <Button
              type="submit"
              className="size-8 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center justify-center shrink-0"
              onClick={
                isGenerating
                  ? (e) => {
                    e.preventDefault()
                    onStop?.()
                  }
                  : undefined
              }
            >
              {isGenerating ? (
                <div className="h-3 w-3 rounded-sm bg-background" />
              ) : input.trim() ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
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
                  : selectedMedia === "live"
                    ? isLiveConnected
                      ? "Connected to Gemini Live. Speak naturally..."
                      : "Click 'Start Live' to begin a voice call..."
                    : "Ask me anything or describe what you need help with..."
            }
            disabled={isLoading || isLiveConnected}
            className="text-foreground placeholder:text-muted-foreground/50 min-h-px max-h-[120px] resize-none border-0 bg-red-500 px-4 py-2 text-sm leading-tight focus-visible:ring-0"
          />
        </div>

        <div className="relative flex items-center gap-3 bg-muted/20 backdrop-blur-md px-4 py-3 border-t border-border/20">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {selectedMedia === "image" && <ImageControls />}
            {selectedMedia === "live" && onLiveConnect && (
              <LiveControls
                isConnected={isLiveConnected}
                isSpeaking={isLiveSpeaking}
                onConnect={onLiveConnect}
                onDisconnect={onLiveDisconnect}
              />
            )}
            {selectedMedia === "video" ||
              selectedMedia === "audio" ||
              selectedMedia === "3d" ? (
              <span className="text-xs text-muted-foreground">
                {selectedMedia === "video"
                  ? "Video generation"
                  : selectedMedia === "audio"
                    ? "Audio generation"
                    : "3D generation"}{" "}
                via MuAPI
              </span>
            ) : null}
            {!isLiveConnected && (
              <>
                <DynamicIslandPreview />
                <ExpandableTabsPreview />
                <OverflowActionsPreview />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-dashed rounded-full"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full px-0 text-muted-foreground"
                    onClick={handleAttachFile}
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </motion.div>
                <AiProvider />
              </>

              <Select
                value={selectedModelId || selectedModel}
                onValueChange={(val) => {
                  setSelectedModel(val)
                  onModelChange?.(val)
                  for (const [pid, pConfig] of Object.entries(providers)) {
                    if (pConfig.models.some((m) => m.id === val)) {
                      setSelectedProvider(pid)
                      break
                    }
                  }
                }}
              >
                <SelectTrigger className="h-8 w-auto min-w-[120px] gap-1.5 px-2.5 text-xs">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const seen = new Set<string>()
                    const items: {
                      modelId: string
                      name: string
                      ProviderIcon: React.ElementType
                    }[] = []
                    for (const provider of Object.values(providers)) {
                      for (const model of provider.models) {
                        if (!seen.has(model.id)) {
                          seen.add(model.id)
                          items.push({
                            modelId: model.id,
                            name: model.name,
                            ProviderIcon: provider.icon,
                          })
                        }
                      }
                    }
                    return items.map(({ modelId, name, ProviderIcon }) => (
                      <SelectItem
                        key={modelId}
                        value={modelId}
                        className="text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <ProviderIcon className="h-3.5 w-3.5" />
                          {name}
                        </span>
                      </SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex shrink-0 items-center self-center gap-1 absolute left-1/2 -translate-x-1/2 border p-1.5 rounded-full">
            <AnimatePresence mode="popLayout">
              {MEDIA_TYPES.map((media) => {
                const Icon = media.icon
                const isSelected = selectedMedia === media.id
                return (
                  <motion.div
                    key={media.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedMedia(media.id)}
                      className={cn(
                        "h-7 gap-1.5 p-1.5 transition-all duration-200 rounded-full border"
                      )}
                      title={media.label}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            <Popover>
              <PopoverTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 p-1.5 transition-all duration-200 rounded-full border"
                    title="More media types"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-48 p-2">
                <div className="space-y-1">
                  {MORE_MEDIA_TYPES.map((media) => {
                    const Icon = media.icon
                    const isSelected = selectedMedia === media.id
                    return (
                      <Button
                        key={media.id}
                        type="button"
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedMedia(media.id)}
                        className="w-full justify-start gap-2 h-8"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-sm">{media.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {!isLiveConnected && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-dashed rounded-full"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full px-0 text-muted-foreground"
                  onClick={handleAttachFile}
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            {onVoiceModeChange && !isLiveConnected && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-dashed rounded-full"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full px-0 text-muted-foreground border border-dashed"
                  onClick={() => onVoiceModeChange(true)}
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                onClick={
                  isGenerating
                    ? (e) => {
                      e.preventDefault()
                      onStop?.()
                    }
                    : undefined
                }
                disabled={!input.trim() || isLoading || isLiveConnected}
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
      </form> */}
    </motion.div>
  )
}
