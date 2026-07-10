"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import type { ReactNode } from "react";

export function PosthogProvider({ children }: { children: ReactNode }) {
  return <PHProvider>{children}</PHProvider>;
}
