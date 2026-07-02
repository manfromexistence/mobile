"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Copy,
  Lightbulb,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react"

export function ThoughtProcess({
  label,
  onOpenThoughts,
}: {
  label: string
  onOpenThoughts: () => void
}) {
  return (
    <button
      className="mb-1 -ml-2 flex w-max cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted active:scale-[0.98]"
      onClick={onOpenThoughts}
    >
      <Lightbulb className="size-3.5" />
      <span>Thought for {label}</span>
    </button>
  )
}

export function SourceBadge({ label, domain }: { label: string; domain: string }) {
  return (
    <button className="ml-1 inline-flex items-center gap-1 rounded-md border border-border bg-white px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted active:scale-[0.98] dark:bg-card">
      <div className="flex h-3 w-3 items-center justify-center rounded-sm bg-muted text-[6px] font-bold">
        {domain[0]}
      </div>
      {label}
    </button>
  )
}

export function BotMessageActions() {
  return (
    <div className="relative mt-2 flex w-full flex-wrap items-center gap-1 pb-2 md:gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <Copy className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Copy</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <Share2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Share</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <Volume2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Read aloud</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <ThumbsUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Good response</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <ThumbsDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Bad response</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <RefreshCw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Regenerate</TooltipContent>
      </Tooltip>
    </div>
  )
}
