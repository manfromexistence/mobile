import type { Metadata } from "next"

import { DxChat } from "@/features/dx/components/dx-chat"

export const metadata: Metadata = {
  title: "SuperGrok",
  description: "AI chat interface",
}

export default function DxPage() {
  return <DxChat />
}
