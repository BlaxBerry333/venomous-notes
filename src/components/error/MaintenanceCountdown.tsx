'use client'

import { useEffect, useState } from 'react'

/**
 * 维护倒计时——untilMs 由 server 端 page.tsx 解析好的 epoch ms（避免 client/server 时区分歧）；
 * SSR 初始 null 避免 hydration 闪烁，useEffect 启动 tick 后才显示。
 */

function format(seconds: number): string {
  if (seconds <= 0) return '已结束'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export function MaintenanceCountdown({ untilMs }: { untilMs: number }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!Number.isFinite(untilMs) || untilMs <= 0) return
    const tick = () => setRemaining(Math.max(0, Math.floor((untilMs - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [untilMs])

  if (remaining === null) return null

  return (
    <div className="text-muted flex items-baseline gap-2 text-[13px]">
      <span>预计恢复倒计时</span>
      <span className="text-fg font-mono text-[15px] font-medium tracking-[0.04em] tabular-nums">
        {format(remaining)}
      </span>
    </div>
  )
}
