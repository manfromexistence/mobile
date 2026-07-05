"use client";

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Copy,
  Folder,
  MessageSquare,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tab, Workspace } from "./types";
import { WorkspaceIcon } from "./workspace-icon";

interface SidebarCollapsedProps {
  workspaces: Workspace[];
  activeWorkspace: string;
  visibleWorkspaces: Workspace[];
  canScrollLeft: boolean;
  canScrollRight: boolean;
  archivesOpen: boolean;
  plusMenuOpen: boolean;
  onSetActiveWorkspace: (id: string) => void;
  onSetarchivesOpen: (open: boolean) => void;
  onSetPlusMenuOpen: (open: boolean) => void;
  onStartScrolling: (direction: "left" | "right") => void;
  onStopScrolling: () => void;
  onCreateWorkspace: () => void;
  onOpenWorkspaceDialog: () => void;
  onCreateFolder: () => void;
  onAddNewTab: () => void;
  activeWorkspaceTabs?: Tab[];
  activeTab?: string;
  onSetActiveTab?: (id: string) => void;
  onSetCommandOpen?: (open: boolean) => void;
  onSetSettingsOpen?: (open: boolean) => void;
}

export function SidebarCollapsed({
  workspaces,
  activeWorkspace,
  visibleWorkspaces,
  canScrollLeft,
  canScrollRight,
  archivesOpen,
  plusMenuOpen,
  onSetActiveWorkspace,
  onSetarchivesOpen,
  onSetPlusMenuOpen,
  onStartScrolling,
  onStopScrolling,
  onCreateWorkspace,
  onOpenWorkspaceDialog,
  onCreateFolder,
  onAddNewTab,
  activeWorkspaceTabs = [],
  activeTab = "",
  onSetActiveTab,
  onSetCommandOpen,
  onSetSettingsOpen,
}: SidebarCollapsedProps) {
  const activeWorkspaceObj =
    workspaces.find((w) => w.id === activeWorkspace) || workspaces[0];

  return (
    <motion.div className="flex flex-1 flex-col items-center py-2 h-full">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
          onClick={() => onSetCommandOpen?.(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
          onClick={() => onAddNewTab?.()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 w-full px-2">
        <div className="flex flex-col items-center gap-2">
          {activeWorkspaceTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8",
                activeTab === tab.id ? "bg-accent" : "text-muted-foreground"
              )}
              onClick={() => onSetActiveTab?.(tab.id)}
              title={tab.title}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="relative mt-auto flex flex-col items-center pt-3 pb-3 border-border border-t w-full">
        {canScrollLeft && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onMouseDown={() => onStartScrolling("left")}
            onMouseUp={onStopScrolling}
            onMouseLeave={onStopScrolling}
            onTouchStart={() => onStartScrolling("left")}
            onTouchEnd={onStopScrolling}
            className="bg-background text-primary z-50 mb-1 flex h-8 w-8 items-center justify-center rounded-full border"
            aria-label="Scroll workspaces up"
          >
            <ChevronLeft className="h-4 w-4 rotate-90" />
          </motion.button>
        )}

        <div className="flex max-h-[240px] flex-col items-center overflow-hidden">
          {visibleWorkspaces.map((workspace) => (
            <ContextMenu key={workspace.id}>
              <ContextMenuTrigger asChild>
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                  onClick={() => onSetActiveWorkspace(workspace.id)}
                  className={cn(
                    "group flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    activeWorkspace === workspace.id && "scale-110",
                  )}
                  title={workspace.name}
                  aria-label={`Switch to ${workspace.name} workspace`}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                  drag
                  dragConstraints={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                  dragElastic={0.2}
                >
                  <WorkspaceIcon
                    workspace={workspace}
                    isActive={activeWorkspace === workspace.id}
                  />
                </motion.button>
              </ContextMenuTrigger>
              <ContextMenuContent className="border-border bg-card w-56">
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Change Name
                </ContextMenuItem>
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Change Icon
                </ContextMenuItem>
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Edit Theme
                </ContextMenuItem>
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Set Profile
                  <ChevronRight className="ml-auto h-4 w-4" />
                </ContextMenuItem>
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Unload Space
                </ContextMenuItem>
                <div className="border-border my-1 border-t" />
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="mr-2 h-4 w-4 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span className="max-w-[75%] truncate">{workspace.name}</span>
                </ContextMenuItem>
                {workspaces
                  .filter((w) => w.id !== workspace.id)
                  .map((w) => (
                    <ContextMenuItem
                      key={w.id}
                      onClick={() => onSetActiveWorkspace(w.id)}
                      className="text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="mr-2 h-4 w-4 flex items-center justify-center shrink-0">
                        <WorkspaceIcon workspace={w} isActive={false} />
                      </div>
                      <span className="max-w-[75%] truncate">{w.name}</span>
                    </ContextMenuItem>
                  ))}
                <div className="border-border my-1 border-t" />
                <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Reorder Spaces
                </ContextMenuItem>
                <div className="border-border my-1 border-t" />
                <ContextMenuItem
                  onClick={onOpenWorkspaceDialog}
                  className="text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  Create Space
                </ContextMenuItem>
                <ContextMenuItem className="text-destructive focus:bg-accent focus:text-destructive">
                  Delete Space
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>

        {canScrollRight && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onMouseDown={() => onStartScrolling("right")}
            onMouseUp={onStopScrolling}
            onMouseLeave={onStopScrolling}
            onTouchStart={() => onStartScrolling("right")}
            onTouchEnd={onStopScrolling}
            className="bg-background text-primary z-50 mt-1 flex h-8 w-8 items-center justify-center rounded-full border"
            aria-label="Scroll workspaces down"
          >
            <ChevronRight className="h-4 w-4 rotate-90" />
          </motion.button>
        )}
      </div>

      <div className="border-border flex flex-col items-center gap-2 border-t pt-3">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
            >
              <Popover open={archivesOpen} onOpenChange={onSetarchivesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetarchivesOpen(true);
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  className="border-border bg-card w-80 p-4"
                >
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      No archived chats.
                    </p>
                    <div className="border-border border-t pt-4">
                      <button className="text-accent-foreground hover:text-accent-foreground text-sm underline">
                        Show all archived chats
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent className="border-border bg-card">
            <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              Open Archived Chats
            </ContextMenuItem>
            <ContextMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              Clear Archive
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
          onClick={() => onSetSettingsOpen?.(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.5,
          }}
        >
          <DropdownMenu open={plusMenuOpen} onOpenChange={onSetPlusMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateWorkspace();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSetPlusMenuOpen(true);
                }}
              >
                <WorkspaceIcon workspace={activeWorkspaceObj} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={5}
              className="border-border bg-card w-56"
            >
              <DropdownMenuItem
                onClick={() => {
                  onCreateFolder();
                  onSetPlusMenuOpen(false);
                }}
                className="text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Folder className="mr-2 h-4 w-4" />
                Create Folder
              </DropdownMenuItem>
              <div className="border-border my-1 border-t" />
              <DropdownMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <Folder className="mr-2 h-4 w-4" />
                Live Folder
                <ChevronRight className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <div className="border-border my-1 border-t" />
              <DropdownMenuItem
                onClick={() => {
                  onOpenWorkspaceDialog();
                  onSetPlusMenuOpen(false);
                }}
                className="text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Copy className="mr-2 h-4 w-4" />
                Create Space
              </DropdownMenuItem>
              <div className="border-border my-1 border-t" />
              <DropdownMenuItem className="text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <Columns2 className="mr-2 h-4 w-4" />
                New Split
              </DropdownMenuItem>
              <div className="border-border my-1 border-t" />
              <DropdownMenuItem
                onClick={() => {
                  onAddNewTab();
                  onSetPlusMenuOpen(false);
                }}
                className="text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.div>
  );
}
