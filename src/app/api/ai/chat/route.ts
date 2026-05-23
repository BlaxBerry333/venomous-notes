// Mock streaming — Phase 4 will use streamText(claude-sonnet-4-6)
export async function POST() {
  const encoder = new TextEncoder()
  const chunks = [
    '这是 ',
    'AI 助手',
    '的模拟响应。\n\n',
    '**Phase 4** 将接入 Claude claude-sonnet-4-6 实现真实流式对话。',
  ]
  let i = 0

  const stream = new ReadableStream({
    start(ctrl) {
      const tick = setInterval(() => {
        if (i < chunks.length) {
          ctrl.enqueue(encoder.encode(`0:"${chunks[i++]}"\n`))
        } else {
          ctrl.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'))
          clearInterval(tick)
          ctrl.close()
        }
      }, 120)
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
