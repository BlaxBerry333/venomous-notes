// Mock — Phase 4 will use streamText with action-specific system prompts
export async function POST(req: Request) {
  const { action } = (await req.json()) as { action: string }
  const encoder = new TextEncoder()
  const reply = `[Mock ${action}] Phase 4 将接入真实 AI 工具栏处理。`

  const stream = new ReadableStream({
    start(ctrl) {
      ctrl.enqueue(encoder.encode(`0:"${reply}"\n`))
      ctrl.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'))
      ctrl.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  })
}
