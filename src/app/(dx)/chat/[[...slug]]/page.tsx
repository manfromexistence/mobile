import type { Metadata } from "next"

import { Chat } from "@/features/dx/components/chat"

export const metadata: Metadata = {
  title: "SuperGrok",
  description: "AI chat interface",
}

export function generateStaticParams() {
  return [{ slug: [] }]
}

export default function ChatPage() {
  return <Chat />
}
