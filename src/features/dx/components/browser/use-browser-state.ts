"use client";

import { useEffect, useState } from "react";
import { COLORS } from "./constants";
import { DEFAULT_LOGOS } from "./default-logos";
import type { SVGLogo, Tab, TabFolder, Workspace } from "./types";

export function useBrowserState() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [spaceCollapsed, setSpaceCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [workspaceScrollPosition, setWorkspaceScrollPosition] = useState(0);

  const [workspaceEditMode, setWorkspaceEditMode] = useState<
    | {
        workspaceId: string;
        currentName: string;
        currentIcon: { type: "emoji" | "icon" | "dot"; value: string };
      }
    | undefined
  >(undefined);

  const [logos, setLogos] = useState<SVGLogo[]>(DEFAULT_LOGOS);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [folders, setFolders] = useState<TabFolder[]>([]);

  const [looseTabs, setLooseTabs] = useState<Tab[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleCreateWorkspace(workspace: {
    name: string;
    icon: { type: "emoji" | "icon" | "dot"; value: string };
    color: string;
  }): void {
    const workspaceName =
      workspace.name.trim() || `Workspace ${workspaces.length + 1}`;
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: workspaceName,
      color: workspace.color,
      icon: workspace.icon,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspace(newWorkspace.id);
  }

  function handleUpdateWorkspace(
    workspaceId: string,
    updates: {
      name?: string;
      icon?: { type: "emoji" | "icon" | "dot"; value: string };
    },
  ): void {
    setWorkspaces(
      workspaces.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              ...(updates.name && { name: updates.name }),
              ...(updates.icon && { icon: updates.icon }),
            }
          : w,
      ),
    );
  }

  return {
    sidebarExpanded,
    setSidebarExpanded,
    activeWorkspace,
    setActiveWorkspace,
    activeTab,
    setActiveTab,
    spaceCollapsed,
    setSpaceCollapsed,
    commandOpen,
    setCommandOpen,
    isMounted,
    downloadsOpen,
    setDownloadsOpen,
    plusMenuOpen,
    setPlusMenuOpen,
    workspaceDialogOpen,
    setWorkspaceDialogOpen,
    mediaPlaying,
    setMediaPlaying,
    workspaceScrollPosition,
    setWorkspaceScrollPosition,
    workspaceEditMode,
    setWorkspaceEditMode,
    logos,
    setLogos,
    workspaces,
    setWorkspaces,
    folders,
    setFolders,
    looseTabs,
    setLooseTabs,
    handleCreateWorkspace,
    handleUpdateWorkspace,
    COLORS,
  };
}
