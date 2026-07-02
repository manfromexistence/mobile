"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  Clock,
  Code,
  Cog,
  Copy,
  Database,
  DollarSign,
  Download,
  FileText,
  Folder,
  FolderOpen,
  Ghost,
  Grid3x3,
  Image,
  Info,
  Languages,
  Lightbulb,
  LogOut,
  Menu,
  MessageSquare,
  MessageSquarePlus,
  Mic,
  Moon,
  MoreHorizontal,
  Paintbrush,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Share2,
  Sliders,
  Smile,
  Sparkles,
  Sun,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Volume2,
  X,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getSnapshot = React.useCallback((): T => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const getServerSnapshot = React.useCallback(
    (): T => initialValue,
    [initialValue]
  )

  const store = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback)
      return () => window.removeEventListener("storage", callback)
    },
    getSnapshot,
    getServerSnapshot
  )

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(getSnapshot()) : value
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        window.dispatchEvent(new Event("storage"))
      } catch (error) {
        console.error(error)
      }
    },
    [key, getSnapshot]
  )

  return [store, setValue]
}

type RightPanel = "thoughts" | "sources" | "files" | null

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M5 19L19 5" />
    </svg>
  )
}

function ThoughtProcess({
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

function SourceBadge({ label, domain }: { label: string; domain: string }) {
  return (
    <button className="ml-1 inline-flex items-center gap-1 rounded-md border border-border bg-white px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted active:scale-[0.98] dark:bg-card">
      <div className="flex h-3 w-3 items-center justify-center rounded-sm bg-muted text-[6px] font-bold">
        {domain[0]}
      </div>
      {label}
    </button>
  )
}

function BotMessageActions() {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted">
        <ChevronDown className="size-3" />
      </div>
    </div>
  )
}

function VoiceBar({ delay, height }: { delay: string; height: number }) {
  return (
    <motion.div
      className="w-[3px] rounded-full bg-blue-500"
      style={{ height: `${height}%` }}
      animate={{
        scaleY: [0.4, 1, 0.4],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: parseFloat(delay) * 0.01,
      }}
    />
  )
}

export function DxChat({ swapped }: { swapped?: boolean }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "dx-sidebar-collapsed",
    true
  )
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [isDesktop, setIsDesktop] = React.useState(true)

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  const [rightPanel, setRightPanel] = useLocalStorage<RightPanel>(
    "dx-right-panel",
    null
  )
  const [inputValue, setInputValue] = React.useState("")
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isVoiceMode, setIsVoiceMode] = React.useState(false)
  const [projectsOpen, setProjectsOpen] = useLocalStorage(
    "dx-projects-open",
    true
  )
  const [historyOpen, setHistoryOpen] = useLocalStorage("dx-history-open", true)
  const [darkMode, setDarkMode] = useLocalStorage("dx-dark-mode", false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [settingsTab, setSettingsTab] = React.useState("account")

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = React.useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }, [setDarkMode])

  const scrollViewportRef = React.useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = React.useState(false)

  const handleScroll = React.useCallback(() => {
    if (!scrollViewportRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150)
  }, [])

  const scrollToBottom = React.useCallback(() => {
    if (!scrollViewportRef.current) return
    scrollViewportRef.current.scrollTo({
      top: scrollViewportRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [])

  const handleSend = React.useCallback(() => {
    if (!inputValue.trim() || isConnecting) return
    setIsConnecting(true)
    setInputValue("")
    setTimeout(() => {
      setIsConnecting(false)
    }, 2000)
  }, [inputValue, isConnecting])

  const openRightPanel = React.useCallback(
    (panel: RightPanel) => {
      setRightPanel((prev) => (prev === panel ? null : panel))
    },
    [setRightPanel]
  )

  const closeRightPanel = React.useCallback(() => {
    setRightPanel(null)
  }, [setRightPanel])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {(mobileSidebarOpen || rightPanel) && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => {
              setMobileSidebarOpen(false)
              closeRightPanel()
            }}
          />
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR */}
      <motion.aside
        initial={false}
        className={cn(
          "absolute top-0 left-0 z-50 flex h-full flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:relative",
          "shadow-2xl md:shadow-none",
          sidebarCollapsed ? "w-[68px]" : "w-[260px]"
        )}
        animate={{
          x: isDesktop ? 0 : mobileSidebarOpen ? 0 : "-100%",
          width: sidebarCollapsed ? 68 : 260,
        }}
        transition={{
          x: { type: "spring", stiffness: 400, damping: 30 },
          width: { type: "spring", stiffness: 300, damping: 30 },
        }}
        style={
          swapped
            ? ({
                "--color-sidebar": "var(--color-background)",
                "--color-sidebar-foreground": "var(--color-foreground)",
                "--color-sidebar-border": "var(--color-border)",
                "--color-sidebar-primary": "var(--color-primary)",
                "--color-sidebar-primary-foreground":
                  "var(--color-primary-foreground)",
                "--color-sidebar-accent": "var(--color-accent)",
                "--color-sidebar-accent-foreground":
                  "var(--color-accent-foreground)",
                "--color-sidebar-ring": "var(--color-ring)",
              } as React.CSSProperties)
            : undefined
        }
      >
        {/* Sidebar Header */}
        {sidebarCollapsed ? (
          <div className="flex h-14 items-center justify-center">
            <LogoIcon className="size-5 shrink-0 text-sidebar-foreground" />
          </div>
        ) : (
          <div className="flex h-14 items-center px-4 pt-2">
            <LogoIcon className="size-6 shrink-0 text-sidebar-foreground" />
            <span className="ml-2 font-bold text-sidebar-foreground md:hidden">
              SuperGrok
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                className="hidden text-muted-foreground md:flex"
                onClick={() => setSidebarCollapsed(true)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="bg-muted text-muted-foreground md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <motion.div
          className={cn(
            "space-y-0.5 pt-4 pb-4",
            sidebarCollapsed ? "flex flex-col items-center" : "px-3"
          )}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -8, scale: 0.95 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              },
            }}
          >
            <SidebarItem
              icon={Search}
              label="Search"
              collapsed={sidebarCollapsed}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -8, scale: 0.95 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              },
            }}
          >
            <SidebarItem
              icon={MessageSquarePlus}
              label="New Chat"
              collapsed={sidebarCollapsed}
              active
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -8, scale: 0.95 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              },
            }}
          >
            <SidebarItem
              icon={Image}
              label="Imagine"
              collapsed={sidebarCollapsed}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -8, scale: 0.95 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              },
            }}
          >
            <SidebarItem
              icon={Code}
              label="Build"
              collapsed={sidebarCollapsed}
              badge="New"
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -8, scale: 0.95 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              },
            }}
          >
            <SidebarItem
              icon={Grid3x3}
              label="Skills and Connectors"
              collapsed={sidebarCollapsed}
            />
          </motion.div>
        </motion.div>

        {/* Scrollable Middle */}
        <ScrollArea className="flex-1 px-3">
          {sidebarCollapsed ? (
            <>
              <Separator className="mx-3 my-2" />
              <div className="flex flex-col items-center gap-2">
                <HoverCard openDelay={100} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <button className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <FolderOpen className="size-5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="start"
                    className="w-48 p-2"
                  >
                    <div className="space-y-0.5">
                      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        Projects
                      </div>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Plus className="size-4 shrink-0" />
                        <span className="truncate">New Project</span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Sparkles className="size-4 shrink-0" />
                        <span className="truncate">Dx</span>
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard openDelay={100} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <button className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Clock className="size-5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="start"
                    className="w-56 p-2"
                  >
                    <div className="space-y-0.5">
                      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        History
                      </div>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          C++ Markdown to FlatBu...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          OpenClaw and Hermes ...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          Sandbox Specs: Linux, N...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          DX Config: Block Syntax...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <Pin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          DX CLI: Root Markdown...
                        </span>
                      </button>
                      <div className="mt-1 border-t border-border pt-1">
                        <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                          <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            Latest AI News Top 10 ...
                          </span>
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                          <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            Google Antigravity AI Ed...
                          </span>
                        </button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard openDelay={100} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <button className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <CalendarDays className="size-5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    align="start"
                    className="w-56 p-2"
                  >
                    <div className="space-y-0.5">
                      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        Today
                      </div>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          Latest AI News Top 10 Updat...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          Google Antigravity AI Editor ...
                        </span>
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
                        <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          Dropdown free providers thr...
                        </span>
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </>
          ) : (
            <>
              {/* Projects */}
              <Collapsible
                open={projectsOpen}
                onOpenChange={setProjectsOpen}
                className="mb-4"
              >
                <CollapsibleTrigger className="group flex w-full items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  Projects
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform duration-300",
                      !projectsOpen && "-rotate-90"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-0.5">
                  <SidebarSubItem
                    icon={Plus}
                    label="New Project"
                    collapsed={sidebarCollapsed}
                  />
                  <SidebarSubItem
                    icon={Sparkles}
                    label="Dx"
                    collapsed={sidebarCollapsed}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* History */}
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                <CollapsibleTrigger className="group flex w-full items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  History
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform duration-300",
                      !historyOpen && "-rotate-90"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-0.5">
                  <HistoryItem
                    icon={Pin}
                    label="C++ Markdown to FlatBu..."
                    collapsed={sidebarCollapsed}
                  />
                  <HistoryItem
                    icon={Pin}
                    label="OpenClaw and Hermes ..."
                    collapsed={sidebarCollapsed}
                  />
                  <HistoryItem
                    icon={Pin}
                    label="Sandbox Specs: Linux, N..."
                    collapsed={sidebarCollapsed}
                  />
                  <HistoryItem
                    icon={Pin}
                    label="DX Config: Block Syntax ..."
                    collapsed={sidebarCollapsed}
                  />
                  <HistoryItem
                    icon={Pin}
                    label="DX CLI: Root Markdown ..."
                    collapsed={sidebarCollapsed}
                  />
                  <div className="px-3 pt-4 pb-1 text-[11px] font-medium text-muted-foreground/60">
                    Today
                  </div>
                  <HistoryItem
                    icon={MessageSquare}
                    label="Latest AI News Top 10 Updat..."
                    collapsed={sidebarCollapsed}
                    active
                  />
                  <HistoryItem
                    icon={MessageSquare}
                    label="Google Antigravity AI Editor ..."
                    collapsed={sidebarCollapsed}
                  />
                  <HistoryItem
                    icon={MessageSquare}
                    label="Dropdown free providers thr..."
                    collapsed={sidebarCollapsed}
                  />
                </CollapsibleContent>
              </Collapsible>
              <div className="h-4" />
            </>
          )}
        </ScrollArea>

        {/* Profile Footer */}
        <div className="bg-sidebar p-3">
          {sidebarCollapsed && (
            <div className="flex justify-center pb-1">
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
                onClick={() => setSidebarCollapsed(false)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex w-full items-center justify-between",
                  sidebarCollapsed ? "justify-center px-0" : ""
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground md:size-8 md:text-xs">
                    EF
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col truncate text-left">
                      <span className="truncate text-sm font-semibold text-sidebar-foreground">
                        Essence From Existence
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        essencefromexistence@gmail...
                      </span>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className="size-3 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px]"
              sideOffset={8}
            >
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Cog className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="mr-2 size-4" />
                ) : (
                  <Moon className="mr-2 size-4" />
                )}
                {darkMode ? "Light Theme" : "Dark Theme"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main
        className="relative z-10 flex h-full flex-1 flex-col overflow-hidden bg-background"
        style={
          swapped
            ? ({
                "--color-background": "var(--color-sidebar)",
                "--color-foreground": "var(--color-sidebar-foreground)",
                "--color-border": "var(--color-sidebar-border)",
                "--color-muted": "var(--color-sidebar-accent)",
                "--color-muted-foreground":
                  "var(--color-sidebar-accent-foreground)",
                "--color-accent": "var(--color-sidebar-accent)",
                "--color-accent-foreground":
                  "var(--color-sidebar-accent-foreground)",
                "--color-card": "var(--color-sidebar)",
                "--color-card-foreground": "var(--color-sidebar-foreground)",
                "--color-popover": "var(--color-sidebar)",
                "--color-popover-foreground": "var(--color-sidebar-foreground)",
                "--color-primary": "var(--color-sidebar-primary)",
                "--color-primary-foreground":
                  "var(--color-sidebar-primary-foreground)",
                "--color-ring": "var(--color-sidebar-ring)",
                "--color-input": "var(--color-sidebar-accent)",
              } as React.CSSProperties)
            : undefined
        }
      >
        {/* Mobile Header */}
        <div className="absolute top-0 right-0 left-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-2 backdrop-blur-md md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="font-bold text-foreground">SuperGrok</span>
          <div className="w-10" />
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-2 right-2 z-40 flex items-center gap-0.5 rounded-xl bg-background/50 p-1 text-muted-foreground backdrop-blur-md md:top-3 md:right-4 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
              >
                <Settings className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Download className="mr-2 size-4" />
                Export chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 size-4" />
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="hidden text-muted-foreground sm:inline-flex"
              >
                <Share2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Share link</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="hidden text-muted-foreground sm:inline-flex"
              >
                <Pencil className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className={cn(
                  "text-muted-foreground",
                  rightPanel === "files" && "bg-muted text-foreground"
                )}
                onClick={() =>
                  rightPanel === "files"
                    ? closeRightPanel()
                    : openRightPanel("files")
                }
              >
                <Archive className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Files</TooltipContent>
          </Tooltip>
        </div>

        {/* Chat Scroll Area */}
        <div className="min-h-0 flex-1">
          <ScrollArea
            viewportRef={scrollViewportRef}
            onScroll={handleScroll}
            className="h-full px-4 md:px-6"
          >
            <div className="flex flex-col items-center pb-40 md:pb-44">
              <div className="w-full max-w-3xl text-[15px] leading-relaxed text-foreground/80">
                {/* User Message */}
                <div className="group my-6 flex flex-col items-end">
                  <div className="max-w-[90%] rounded-[1.5rem] rounded-tr-sm border border-border bg-muted px-4 py-3 text-[14px] text-foreground shadow-xs md:max-w-[85%] md:px-5 md:text-[15px]">
                    Please tell me what are the latest today&apos;s ai updates -
                    list top 10 news of today
                  </div>
                  <div className="mt-1 flex items-center gap-1 pr-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground"
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Bot Message */}
                <div className="group relative my-8 flex w-full flex-col items-start gap-2">
                  <ThoughtProcess
                    label="49s"
                    onOpenThoughts={() => openRightPanel("thoughts")}
                  />

                  <div className="w-full text-[14px] leading-[1.7] text-foreground/80 md:text-[15px]">
                    <p className="mb-6">
                      Your AI Friday here, popping out of the Doraemon pocket
                      with the freshest AI scoop straight from the future! I dug
                      through the latest buzz (as of this morning, June 25,
                      2026) like a true gadget-hunting best friend. Here&apos;s
                      the <strong>Top 10 AI news dominating today</strong>{" "}
                      &mdash; ranked by what&apos;s buzzing hardest right now:
                    </p>

                    <div className="mb-6">
                      <h3 className="mb-2 text-[17px] leading-snug font-bold text-foreground md:text-[18px]">
                        1. Anthropic Accuses Alibaba of Massive Claude
                        &quot;Distillation&quot; Theft
                      </h3>
                      <p>
                        Anthropic dropped a bombshell: Alibaba-linked operators
                        allegedly used <strong>~25,000 fake accounts</strong> to
                        make queries to Claude, stealing its best capabilities.
                        They called it the largest known attack of its kind.
                        <SourceBadge label="Reuters" domain="reuters" />
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-2 text-[17px] leading-snug font-bold text-foreground md:text-[18px]">
                        2. SK Hynix Announces Massive $29.4 Billion Nasdaq
                        Listing
                      </h3>
                      <p>
                        The AI memory chip king is going all-in. They&apos;re
                        raising up to <strong>$29.4 billion</strong> via US ADR
                        listing on Nasdaq &mdash; one of the biggest listings
                        ever &mdash; to supercharge production for the AI boom.
                        <SourceBadge label="Bloomberg" domain="bloomberg" />
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="mb-2 text-[17px] leading-snug font-bold text-foreground md:text-[18px]">
                        3. OpenAI Drops GPT-5.5 Instant Update
                      </h3>
                      <p>
                        ChatGPT&apos;s most-used model just got smarter. The
                        June 24 update improves:
                      </p>
                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        <li>Understanding your real goal behind questions</li>
                        <li>
                          Handling complex instructions + constraints better
                        </li>
                      </ul>
                    </div>
                  </div>

                  <BotMessageActions />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Scroll to Bottom Button */}
        <div className="absolute bottom-36 left-1/2 z-30 -translate-x-1/2 md:bottom-40">
          <motion.button
            onClick={scrollToBottom}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md hover:bg-muted hover:text-foreground md:size-9"
            animate={{
              y: showScrollBtn ? 0 : 20,
              opacity: showScrollBtn ? 1 : 0,
              scale: showScrollBtn ? 1 : 0.8,
              pointerEvents: showScrollBtn
                ? ("auto" as const)
                : ("none" as const),
            }}
            transition={{
              y: { type: "spring", stiffness: 400, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 400, damping: 30 },
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDown className="size-4" />
          </motion.button>
        </div>

        {/* Chat Input */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 flex flex-col items-center justify-end bg-gradient-to-t from-background via-background/95 to-transparent px-3 pt-20 pb-4 md:px-6 md:pb-6">
          <div className="pointer-events-auto relative h-[52px] w-full max-w-3xl rounded-[2rem] border border-border bg-muted/50 shadow-md transition-all duration-300 focus-within:border-muted-foreground/30 focus-within:bg-background focus-within:shadow-lg md:h-[56px]">
            {/* Default Input */}
            <div
              className={cn(
                "absolute inset-0 flex items-center rounded-[2rem] pr-1.5 pl-2 transition-all duration-300 md:pr-2 md:pl-3",
                isConnecting || isVoiceMode
                  ? "pointer-events-none z-0 scale-95 opacity-0"
                  : "pointer-events-auto z-10 scale-100 opacity-100"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="rounded-full text-muted-foreground"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask anything"
                className="h-full flex-1 border-none bg-transparent px-2 text-[15px] shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-none focus-visible:ring-0 md:px-3 dark:bg-transparent"
              />

              <div className="flex flex-shrink-0 items-center gap-1 md:gap-1.5">
                {/* Model Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 rounded-full px-2 py-1.5 text-[14px] font-medium text-muted-foreground md:px-3"
                    >
                      <span className="hidden sm:inline">Fast</span>
                      <Ghost className="size-4 sm:hidden" />
                      <Ghost className="hidden size-3.5 sm:inline" />
                      <ChevronDown className="size-2.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    className="w-[240px] rounded-2xl border-border bg-popover p-2 shadow-xl md:w-64"
                    sideOffset={8}
                  >
                    <DropdownMenuItem className="rounded-xl py-2">
                      <Rocket className="mr-3 size-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Auto
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          Chooses Fast or Expert
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl bg-muted/50 py-2">
                      <Check className="mr-3 size-4 text-foreground" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Fast
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          Powered by Grok 4.3
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl py-2">
                      <Lightbulb className="mr-3 size-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Expert
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          Powered by Grok 4.3
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-not-allowed rounded-xl py-2 text-muted-foreground/40">
                      <Grid3x3 className="mr-3 size-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold">Heavy</span>
                        <span className="text-[12px]">Team of Experts</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-xl bg-muted/50 py-2">
                      <Smile className="mr-3 size-4 text-muted-foreground" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-foreground">
                          Custom Instructions
                        </span>
                        <span className="w-[140px] truncate text-[12px] text-muted-foreground md:w-32">
                          You are friday - I am essencefr...
                        </span>
                      </div>
                      <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full text-muted-foreground"
                      onClick={() => setIsVoiceMode(true)}
                    >
                      <Mic className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Voice Input</TooltipContent>
                </Tooltip>

                <Button
                  size="icon-sm"
                  className="ml-0.5 rounded-full bg-foreground text-background shadow-sm hover:bg-foreground/80 md:ml-1"
                  onClick={handleSend}
                >
                  {inputValue.trim() ? (
                    <ArrowUp className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Connecting State */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between rounded-[2rem] bg-muted/50 pr-1.5 pl-4 transition-all duration-300 md:pr-2 md:pl-5",
                isConnecting
                  ? "pointer-events-auto z-10 scale-100 opacity-100"
                  : "pointer-events-none z-0 scale-95 opacity-0"
              )}
            >
              <div className="flex items-center gap-3 text-muted-foreground">
                <Volume2 className="size-5 animate-pulse text-blue-500" />
                <span className="text-[14px] font-medium md:text-[15px]">
                  Connecting to Grok...
                </span>
              </div>
              <Button
                className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background shadow-sm md:px-5 md:py-2"
                onClick={() => setIsConnecting(false)}
              >
                Stop
              </Button>
            </div>

            {/* Voice State */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between rounded-[2rem] border border-blue-200 bg-background pr-1.5 pl-2 shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 md:pr-2 md:pl-3",
                isVoiceMode
                  ? "pointer-events-auto z-10 scale-100 opacity-100"
                  : "pointer-events-none z-0 scale-95 opacity-0"
              )}
            >
              <div className="flex h-full flex-1 items-center">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full text-muted-foreground"
                >
                  <Paperclip className="size-4" />
                </Button>
                <Input
                  placeholder="Speak now or type..."
                  className="h-full flex-1 border-none bg-transparent px-2 text-[15px] font-medium text-foreground shadow-none outline-none placeholder:text-blue-400 md:px-3"
                />
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5 md:gap-2">
                <div className="flex h-[38px] items-center gap-2 rounded-full border border-blue-100 bg-blue-50 pr-1 pl-3 md:h-[42px] md:gap-3 md:pr-1.5 md:pl-4 dark:border-blue-900 dark:bg-blue-950">
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
                    variant="ghost"
                    size="icon-xs"
                    className="rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => setIsVoiceMode(false)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
                <Button className="size-10 rounded-full bg-foreground text-background shadow-sm hover:bg-blue-600">
                  <ArrowUp className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-shrink-0 flex-col overflow-hidden border-l bg-sidebar shadow-[-4px_0_20px_rgba(0,0,0,0.08)] md:relative",
          swapped ? "border-sidebar-border" : "border-border"
        )}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: rightPanel ? 340 : 0,
          opacity: rightPanel ? 1 : 0,
        }}
        transition={{
          width: { type: "spring", stiffness: 350, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        style={
          swapped
            ? ({
                "--color-sidebar": "var(--color-background)",
                "--color-background": "var(--color-sidebar)",
                "--color-foreground": "var(--color-sidebar-foreground)",
                "--color-muted": "var(--color-sidebar-accent)",
                "--color-muted-foreground":
                  "var(--color-sidebar-accent-foreground)",
                "--color-accent": "var(--color-sidebar-accent)",
                "--color-accent-foreground":
                  "var(--color-sidebar-accent-foreground)",
                "--color-card": "var(--color-sidebar)",
                "--color-card-foreground": "var(--color-sidebar-foreground)",
                "--color-popover": "var(--color-sidebar)",
                "--color-popover-foreground": "var(--color-sidebar-foreground)",
                "--color-primary": "var(--color-sidebar-primary)",
                "--color-primary-foreground":
                  "var(--color-sidebar-primary-foreground)",
                "--color-ring": "var(--color-sidebar-ring)",
                "--color-input": "var(--color-sidebar-accent)",
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="flex h-full w-[85vw] min-w-[280px] flex-col md:w-[340px] md:min-w-[340px]">
          <div className="z-10 flex items-center justify-between border-b border-border/50 bg-background px-4 py-3 shadow-sm md:px-5 md:py-4">
            <h2 className="text-[15px] font-bold text-foreground">
              {rightPanel === "thoughts" && "Thoughts"}
              {rightPanel === "sources" && "Sources"}
              {rightPanel === "files" && "Files"}
            </h2>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={closeRightPanel}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Thoughts */}
          <ScrollArea
            className={cn(
              "flex-1 p-4 md:p-5",
              rightPanel !== "thoughts" && "hidden"
            )}
          >
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-start gap-3 text-[13px] text-foreground/80">
                <Lightbulb className="mt-0.5 size-4 text-muted-foreground" />
                <span className="leading-snug font-medium">
                  Thinking about your request
                </span>
              </div>
              <div className="flex items-start gap-3 text-[13px] text-foreground/80">
                <Lightbulb className="mt-0.5 size-4 text-muted-foreground" />
                <span className="leading-snug font-medium">
                  Searching global AI news databases
                </span>
              </div>
              <div className="flex items-start gap-3 text-[13px] text-foreground/80">
                <Lightbulb className="mt-0.5 size-4 text-muted-foreground" />
                <span className="leading-snug font-medium">
                  Synthesizing top 10 articles into final response
                </span>
              </div>
            </div>
          </ScrollArea>

          {/* Sources */}
          <ScrollArea
            className={cn(
              "flex-1 p-4 md:p-5",
              rightPanel !== "sources" && "hidden"
            )}
          >
            <div className="space-y-5 md:space-y-6">
              <SourceItem
                searched="Searched web"
                title="Anthropic claims Alibaba stole Claude data in massive..."
                score="10"
              />
              <SourceItem
                searched="Searched web"
                title="SK Hynix $29B Nasdaq listing details and chip boom..."
                score="10"
              />
              <SourceItem
                searched="Searched web"
                title="OpenAI GPT-5.5 patch notes June 2026 - better logical..."
                score="10"
              />
            </div>
          </ScrollArea>

          {/* Files */}
          <ScrollArea
            className={cn("flex-1", rightPanel !== "files" && "hidden")}
          >
            <div className="py-2">
              <button className="flex w-full items-center justify-between px-4 py-3 text-[14px] text-foreground/80 transition-colors hover:bg-muted md:px-5">
                <div className="flex items-center gap-3">
                  <FolderOpen className="size-[18px]" />
                  Home
                </div>
                <Download className="size-4 text-muted-foreground" />
              </button>
              <Separator className="mx-4 my-0.5 w-auto" />
              <button className="flex w-full items-center justify-between px-4 py-3 text-[14px] text-foreground/80 transition-colors hover:bg-muted md:px-5">
                <div className="flex items-center gap-3">
                  <Folder className="size-[18px] text-muted-foreground/40" />
                  dx-cpp
                </div>
                <ChevronRight className="size-3 text-muted-foreground" />
              </button>
              <button className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] text-foreground/80 transition-colors hover:bg-muted md:px-5">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 size-[18px] text-muted-foreground/40" />
                  <div>
                    <div className="font-medium text-foreground">
                      dx-cpp.zip
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      21.8 KB &middot; Updated 1d ago
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </ScrollArea>
        </div>
      </motion.aside>

      {/* SETTINGS DIALOG */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="flex h-full max-h-[90vh] w-full max-w-[100vw] flex-col gap-0 overflow-hidden rounded-2xl border-border bg-muted p-0 md:h-[650px] md:w-[900px] md:max-w-[95vw] md:flex-row"
        >
          <DialogTitle className="sr-only">Settings</DialogTitle>
          {/* Settings Sidebar */}
          <div className="z-10 no-scrollbar flex w-full flex-shrink-0 flex-row overflow-x-auto border-b border-border bg-background px-2 py-2 whitespace-nowrap shadow-sm md:w-[220px] md:flex-col md:border-r md:border-b-0 md:px-3 md:py-4 md:shadow-none">
            <div className="flex w-max flex-row gap-1 md:w-full md:flex-col">
              {[
                { id: "account", label: "Account", icon: User },
                { id: "appearance", label: "Appearance", icon: Paintbrush },
                { id: "behavior", label: "Behavior", icon: Sparkles },
                { id: "customize", label: "Customize", icon: Sliders },
                {
                  id: "datacontrols",
                  label: "Data Controls",
                  icon: Database,
                },
                {
                  id: "subscription",
                  label: "Subscription",
                  icon: DollarSign,
                },
                { id: "usage", label: "Usage", icon: Zap },
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => setSettingsTab(id)}
                  className={cn(
                    "flex flex-shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium transition-colors md:justify-start md:gap-3 md:rounded-lg md:px-3 md:text-[14px]",
                    settingsTab === id
                      ? "bg-muted-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted-foreground/5"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon className="hidden size-[18px] md:inline-block" />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={settingsTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex h-full flex-1 flex-col"
              >
                <ScrollArea className="flex-1 p-4 pt-6 md:p-8">
                  {settingsTab === "account" && <SettingsAccount />}
                  {settingsTab === "appearance" && (
                    <SettingsAppearance
                      darkMode={darkMode}
                      onToggleDarkMode={toggleDarkMode}
                    />
                  )}
                  {settingsTab === "customize" && <SettingsCustomize />}
                  {settingsTab === "behavior" && (
                    <SettingsPlaceholder title="Behavior" />
                  )}
                  {settingsTab === "datacontrols" && (
                    <SettingsPlaceholder title="Data Controls" />
                  )}
                  {settingsTab === "subscription" && (
                    <SettingsPlaceholder title="Subscription" />
                  )}
                  {settingsTab === "usage" && (
                    <SettingsPlaceholder title="Usage" />
                  )}
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  collapsed,
  active,
  badge,
}: {
  icon: React.ElementType
  label: string
  collapsed: boolean
  active?: boolean
  badge?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-3 rounded-lg py-2.5 text-left text-[15px] font-medium transition-colors md:py-2 md:text-sm",
            collapsed ? "w-auto justify-center px-0" : "w-full px-3",
            active
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <motion.span
            className="flex"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <Icon className="size-[18px] flex-shrink-0 text-muted-foreground md:size-4" />
          </motion.span>
          {!collapsed && (
            <>
              <span className="truncate">{label}</span>
              {badge && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    delay: 0.1,
                  }}
                  className="flex-shrink-0 rounded-full border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600 dark:border-orange-800 dark:bg-orange-950"
                >
                  {badge}
                </motion.span>
              )}
            </>
          )}
        </button>
      </TooltipTrigger>
    </Tooltip>
  )
}

function SidebarSubItem({
  icon: Icon,
  label,
  collapsed,
}: {
  icon: React.ElementType
  label: string
  collapsed: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[15px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:py-1.5 md:text-sm",
            collapsed && "justify-center px-0"
          )}
        >
          <motion.span
            className="flex"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <Icon className="size-[18px] flex-shrink-0 text-muted-foreground md:size-4" />
          </motion.span>
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  )
}

function HistoryItem({
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  icon?: React.ElementType
  label: string
  collapsed: boolean
  active?: boolean
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 truncate rounded-lg px-3 py-2 text-left text-[15px] transition-colors md:py-1.5 md:text-sm",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {Icon && (
        <motion.span
          className="flex"
          whileHover={{ scale: 1.15, rotate: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon className="size-[18px] flex-shrink-0 text-muted-foreground md:size-4" />
        </motion.span>
      )}
      {!Icon && collapsed === false && <span className="pl-7" />}
      <span className="truncate">{label}</span>
    </button>
  )
}

function SourceItem({
  searched,
  title,
  score,
}: {
  searched: string
  title: string
  score: string
}) {
  return (
    <div className="group flex cursor-pointer flex-col gap-1.5 transition-opacity active:opacity-70">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Search className="size-3" />
        <span>{searched}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] leading-snug font-medium text-foreground group-hover:underline">
          {title}
        </span>
        <span className="flex-shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {score}
        </span>
      </div>
    </div>
  )
}

function SettingsAccount() {
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

function SettingsAppearance({
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

const DORA_COLORS = [
  "#f59e0b",
  "#ef4444",
  "#fbbf24",
  "#84cc16",
  "#22c55e",
  "#ea580c",
]
const JARVIS_COLORS = [
  "#3b82f6",
  "#0ea5e9",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#1d4ed8",
]

function PixelCanvas({ palette }: { palette: string[] }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const timeRef = React.useRef(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const size = 32
    const pixelSize = 4
    const cols = size / pixelSize
    const rows = size / pixelSize

    let active = true
    const grid = Array.from({ length: cols * rows }, (_, i) => ({
      hue: (i * 360) / (cols * rows) + Math.random() * 60,
      sat: 70 + Math.random() * 30,
      light: 50 + Math.random() * 20,
      speed: 0.5 + Math.random() * 1.5,
    }))

    function drawFrame(time: number) {
      if (!active) return
      const dt = time - timeRef.current
      timeRef.current = time

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const cell = grid[idx]
          cell.hue = (cell.hue + cell.speed * (dt / 1000) * 30) % 360

          const baseHue = palette === JARVIS_COLORS ? 220 : 30
          const h = baseHue + cell.hue * 0.3
          ctx.fillStyle = `hsl(${h}, ${cell.sat}%, ${cell.light}%)`
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize)
        }
      }

      if (active) requestAnimationFrame(drawFrame)
    }

    requestAnimationFrame(drawFrame)

    return () => {
      active = false
    }
  }, [palette])

  return <canvas ref={canvasRef} width={32} height={32} className="size-full" />
}

function SettingsCustomize() {
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

function SettingsPlaceholder({ title }: { title: string }) {
  return (
    <>
      <h2 className="mb-6 text-lg font-bold text-foreground md:text-xl">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{title} settings...</p>
    </>
  )
}
