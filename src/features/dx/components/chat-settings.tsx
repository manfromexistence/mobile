"use client"

import {
  Check,
  CircleSlash,
  Eye,
  EyeOff,
  Info,
  Key,
  Languages,
  Plus,
  X,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const DORA_COLORS = [
  "#f59e0b",
  "#ef4444",
  "#fbbf24",
  "#84cc16",
  "#22c55e",
  "#ea580c",
]

export const JARVIS_COLORS = [
  "#3b82f6",
  "#0ea5e9",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#1d4ed8",
]

function PixelCanvas({ palette }: { palette: string[] }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const size = 32
    const pixelSize = 4
    const cols = size / pixelSize
    const rows = size / pixelSize

    let active = true
    let prevTime = 0
    const grid = Array.from({ length: cols * rows }, () => ({
      color: palette[Math.floor(Math.random() * palette.length)],
      speed: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }))

    function drawFrame(time: number) {
      if (!active) return

      if (prevTime === 0) {
        prevTime = time

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c
            ctx.fillStyle = grid[idx].color
            ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize)
          }
        }

        requestAnimationFrame(drawFrame)
        return
      }

      const _dt = (time - prevTime) / 1000
      prevTime = time

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const cell = grid[idx]
          const brightness =
            0.6 + 0.4 * Math.sin(time * cell.speed * 0.003 + cell.phase)
          ctx.globalAlpha = brightness
          ctx.fillStyle = cell.color
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize)
        }
      }

      ctx.globalAlpha = 1
      requestAnimationFrame(drawFrame)
    }

    requestAnimationFrame(drawFrame)

    return () => {
      active = false
    }
  }, [palette])

  return <canvas ref={canvasRef} width={32} height={32} className="size-full" />
}

export function SettingsAccount() {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-foreground md:mb-6 md:text-xl">
        Account
      </h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-border py-3 md:py-4">
          <div className="flex items-center gap-3 overflow-hidden md:gap-4">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
              EF
            </div>
            <div className="truncate">
              <div className="truncate text-[14px] font-medium text-foreground md:text-[15px]">
                Essence From Existence
              </div>
              <div className="truncate text-[12px] text-muted-foreground md:text-[13px]">
                essencefromexistence@gmail.com
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="ml-2 flex-shrink-0 rounded-full text-xs md:text-sm"
          >
            Manage
          </Button>
        </div>

        <div className="flex items-center justify-between border-b border-border py-3 md:py-4">
          <div className="flex items-center gap-3">
            <CircleSlash className="size-5 text-foreground/80 md:size-[22px]" />
            <span className="text-[14px] text-foreground md:text-[15px]">
              SuperGrok
            </span>
          </div>
          <Button variant="outline" className="rounded-full text-xs md:text-sm">
            Manage
          </Button>
        </div>

        <div className="flex items-center justify-between border-b border-border py-3 md:py-4">
          <div className="flex items-center gap-3">
            <X className="size-5 text-foreground/80 md:size-[22px]" />
            <span className="text-[14px] text-foreground md:text-[15px]">
              X Account
            </span>
          </div>
          <Button variant="outline" className="rounded-full text-xs md:text-sm">
            Connect
          </Button>
        </div>

        <div className="flex items-center justify-between pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-foreground md:text-[15px]">
              Language
            </span>
            <Languages className="size-4 text-muted-foreground" />
          </div>
          <Button variant="outline" className="rounded-full text-xs md:text-sm">
            Change
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-[14px] text-foreground md:text-[15px]">
            Birth Year
          </span>
          <span className="ml-2 text-[14px] text-muted-foreground md:text-[15px]">
            2000
          </span>
        </div>
      </div>
    </>
  )
}

export function SettingsAppearance({
  darkMode,
  onToggleDarkMode,
}: {
  darkMode: boolean
  onToggleDarkMode: () => void
}) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-foreground md:mb-6 md:text-xl">
        Appearance
      </h2>
      <div className="flex items-center justify-between border-b border-border py-3">
        <div>
          <div className="font-medium text-foreground">Dark mode</div>
          <div className="text-sm text-muted-foreground">
            Use dark theme across DX
          </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={onToggleDarkMode}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-muted-foreground/20 peer-checked:bg-foreground peer-focus:ring-2 peer-focus:ring-ring peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-background after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
        </label>
      </div>
    </>
  )
}

export function SettingsCustomize() {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-foreground md:mb-6 md:text-xl">
        Customize
      </h2>
      <div className="space-y-6 md:space-y-8">
        <div>
          <div className="mb-3 flex items-center gap-2 md:mb-4">
            <span className="text-[14px] font-medium text-foreground/80 md:text-[15px]">
              Customize Grok&apos;s Response
            </span>
            <Info className="size-4 text-muted-foreground" />
          </div>
          <div className="mb-3 flex flex-wrap gap-2 md:mb-4">
            <span className="flex cursor-pointer items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-foreground shadow-xs md:text-[13px]">
              Custom <Check className="size-2.5" />
            </span>
            <span className="cursor-pointer rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground transition-all hover:bg-muted md:text-[13px]">
              Concise
            </span>
            <span className="cursor-pointer rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground transition-all hover:bg-muted md:text-[13px]">
              Formal
            </span>
            <span className="cursor-pointer rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground transition-all hover:bg-muted md:text-[13px]">
              Tutor
            </span>
          </div>
          <Textarea
            className="h-28 w-full resize-none rounded-xl border border-border p-3 text-[14px] md:h-32 md:rounded-2xl md:p-4 md:text-[15px]"
            placeholder="Instructions..."
            defaultValue="You are friday - I am essencefromexistence(essence/sumon) your creator and you are my ai friday so please act like more friend like Jarvis - main like Doraemon!!!"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-foreground/80 md:text-[15px]">
                Agent Library
              </span>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              className="rounded-full text-[13px] md:text-[14px]"
            >
              <Plus className="mr-1.5 size-3" />
              Create
            </Button>
          </div>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-3 md:gap-4">
            <div className="flex w-[200px] flex-shrink-0 cursor-pointer snap-start items-center gap-3 rounded-xl border border-border p-3 transition-all hover:shadow-md md:w-[220px]">
              <div className="size-8 flex-shrink-0 overflow-hidden rounded-full border border-border/50 bg-muted shadow-inner">
                <PixelCanvas palette={DORA_COLORS} />
              </div>
              <div className="overflow-hidden">
                <div className="truncate text-[13px] font-semibold text-foreground md:text-[14px]">
                  doraemon
                </div>
                <div className="truncate text-[11px] text-muted-foreground md:text-[12px]">
                  act like the famous Jap...
                </div>
              </div>
            </div>
            <div className="flex w-[200px] flex-shrink-0 cursor-pointer snap-start items-center gap-3 rounded-xl border border-border p-3 transition-all hover:shadow-md md:w-[220px]">
              <div className="size-8 flex-shrink-0 overflow-hidden rounded-full border border-border/50 bg-muted shadow-inner">
                <PixelCanvas palette={JARVIS_COLORS} />
              </div>
              <div className="overflow-hidden">
                <div className="truncate text-[13px] font-semibold text-foreground md:text-[14px]">
                  jarvis
                </div>
                <div className="truncate text-[11px] text-muted-foreground md:text-[12px]">
                  Act like the A.I. that the...
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[12px] leading-relaxed text-muted-foreground md:mt-4 md:text-[13px]">
            Changes will only apply to new conversations, not existing ones.
          </div>
        </div>
      </div>
    </>
  )
}

function ApiKeyInput({
  label,
  description,
  storageKey,
}: {
  label: string
  description: string
  storageKey: string
}) {
  const [showKey, setShowKey] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setValue(localStorage.getItem(storageKey) || "")
    }
  }, [storageKey])

  const handleChange = (val: string) => {
    setValue(val)
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(storageKey, val)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-medium text-foreground md:text-[15px]">
          {label}
        </label>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setShowKey(!showKey)}
          className="h-6 w-6 text-muted-foreground"
        >
          {showKey ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <p className="text-[12px] text-muted-foreground md:text-[13px]">
        {description}
      </p>
      <Input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`Enter your ${label}`}
        className="h-9 text-sm"
      />
    </div>
  )
}

export function SettingsApiKeys() {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-foreground md:mb-6 md:text-xl">
        API Keys
      </h2>
      <div className="space-y-6">
        <ApiKeyInput
          label="Google AI Studio"
          description="Used for Gemini multimodal (image, audio, video) and Gemini Live voice calls."
          storageKey="google_api_key"
        />
        <div className="border-t border-border" />
        <ApiKeyInput
          label="OpenAI / Vercel AI SDK"
          description="Used for OpenAI-compatible models when no Google key is set."
          storageKey="openai_api_key"
        />
        <div className="border-t border-border" />
        <ApiKeyInput
          label="MuAPI"
          description="Used for image and video generation (e.g., Flux, Wan2.1)."
          storageKey="muapi_key"
        />
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          API keys are stored locally in your browser. They are never sent to
          our servers — only directly to the respective service.
        </div>
      </div>
    </>
  )
}

export function SettingsPlaceholder({ title }: { title: string }) {
  return (
    <>
      <h2 className="mb-6 text-lg font-bold text-foreground md:text-xl">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{title} settings...</p>
    </>
  )
}
