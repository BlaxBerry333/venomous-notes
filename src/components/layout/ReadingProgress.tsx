'use client'

import { useEffect, useRef } from 'react'

/** 阅读进度条 · design-spec §4.7 —— ref 直写 width，rAF 节流，绕开重渲染 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const pct = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="bg-accent fixed top-0 right-0 left-[var(--sidebar-w)] z-40 h-0.5 w-0 transition-[width] duration-100 ease-linear max-md:left-0"
      aria-hidden="true"
    />
  )
}
