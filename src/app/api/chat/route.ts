import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"
import { getModel } from "@/lib/ai/providers"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages: any[]
      modelId?: string
      apiKey?: string
      providerKey?: string
      providerId?: string
    }
    const { messages, modelId, apiKey, providerKey } = body

    // BYOK: If a Google API key is provided, use Gemini multimodal
    if (apiKey) {
      const google = createGoogleGenerativeAI({ apiKey })

      const result = await streamText({
        model: google("gemini-2.0-flash-exp"),
        messages,
        tools: {
          generateImage: tool({
            description: "Generate an image based on a description",
            parameters: z.object({
              prompt: z.string().describe("The prompt to generate the image"),
            }),
            execute: ({ prompt }: { prompt: string }) => {
              return {
                url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
              }
            },
          }),
        },
      })

      return result.toTextStreamResponse()
    }

    // BYOK: If an OpenAI-compatible API key is provided
    if (providerKey) {
      const openai = createOpenAI({ apiKey: providerKey })

      const result = await streamText({
        model: openai("gpt-4o"),
        messages,
      })

      return result.toTextStreamResponse()
    }

    // Fall back to existing provider system using env vars
    const providerId =
      body.providerId || (modelId ? modelId.split("-")[0] : "opencode")
    const model = getModel(providerId as any, modelId || "opencode-default")

    if (!model) {
      return new Response("Model not found", { status: 400 })
    }

    const cleanedMessages = (messages || []).map((m: any) => ({
      role: m.role,
      content: m.content,
      ...(m.experimental_attachments
        ? { experimental_attachments: m.experimental_attachments }
        : {}),
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
