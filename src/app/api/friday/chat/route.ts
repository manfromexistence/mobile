import { NextRequest } from "next/server";
import { ZEN_BASE } from "@/lib/friday/models";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Server-side proxy to OpenCode Zen free models.
 * Streams the response back to the client as plain text chunks.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { model, messages, temperature } = body as {
    model?: string;
    messages?: { role: "user" | "assistant" | "system"; content: string }[];
    temperature?: number;
  };

  if (!model || !messages) {
    return new Response(JSON.stringify({ error: "model and messages are required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const upstream = await fetch(`${ZEN_BASE}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: typeof temperature === "number" ? temperature : 0.7,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(JSON.stringify({ error: `upstream ${upstream.status}`, body: text }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  // Transform the OpenAI-style SSE stream into a plain text stream of
  // the assistant deltas, so the client can append it directly.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // OpenAI SSE format: lines starting with "data: " separated by \n\n
          const parts = buffer.split("\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              /* ignore malformed chunk */
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache",
      "x-accel-buffering": "no",
    },
  });
}
