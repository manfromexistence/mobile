"use client"

import type { Message } from "@/features/dx/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BotMessageActions } from "./dx-chat-message"
import { Copy, Pencil, Share2 } from "lucide-react"

export function ChatMessage({
  message,
  isGenerating,
}: {
  message: Message
  isGenerating?: boolean
}) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="group my-6 flex flex-col items-end">
        <div className="max-w-[90%] rounded-[1.5rem] rounded-tr-sm border border-border bg-muted px-4 py-3 text-[14px] text-foreground shadow-xs md:max-w-[85%] md:px-5 md:text-[15px]">
          {message.content}
        </div>
        <div className="mt-1 flex items-center gap-1 pr-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
            <Copy className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
            <Share2 className="size-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative my-8 flex w-full flex-col items-start gap-2">
      <div className="w-full text-[14px] leading-[1.7] text-foreground/80 md:text-[15px]">
        {message.content ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : isGenerating ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-foreground/40" />
            <span className="size-2 animate-pulse rounded-full bg-foreground/40" style={{ animationDelay: "0.2s" }} />
            <span className="size-2 animate-pulse rounded-full bg-foreground/40" style={{ animationDelay: "0.4s" }} />
            <span className="ml-1 text-sm">Thinking...</span>
          </div>
        ) : null}
      </div>
      {message.content && !isGenerating && <BotMessageActions />}
    </div>
  )
}
