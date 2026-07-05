import { streamText } from "ai"
import { getModel } from "@/lib/ai/providers"

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json()

    const providerId = modelId.split("-")[0]
    const model = getModel(providerId as any, modelId)

    if (!model) {
      return new Response("Model not found", { status: 400 })
    }

    // Clean up messages to strictly match ai-sdk format
    const cleanedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }))

    const result = await streamText({
      model: model as any,
      messages: cleanedMessages,
    })

    return result.toTextStreamResponse()
  } catch (err: any) {
    return new Response(err.message, { status: 500 })
  }
}
