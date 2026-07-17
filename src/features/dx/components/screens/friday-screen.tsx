"use client";

import { FridayThemeProvider } from "@/components/friday-theme-provider";
import { FridayChatShell } from "@/features/dx/components/friday/chat-shell";

export function FridayScreen() {
  return (
    <FridayThemeProvider>
      <div className="h-full w-full overflow-hidden bg-background">
        <FridayChatShell />
      </div>
    </FridayThemeProvider>
  );
}
