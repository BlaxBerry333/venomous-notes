'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/types'

/* 本页目录 · design-spec §4.6 —— IntersectionObserver 驱动当前章节高亮 */
export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '')

  useEffect(() => {
    if (toc.length === 0) return
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const first = toc.find((t) => visible.has(t.id))
        if (first) {
          setActiveId(first.id)
        } else if (toc[0]?.id) {
          const firstEl = document.getElementById(toc[0].id)
          if (firstEl && firstEl.getBoundingClientRect().top > 0) {
            setActiveId(toc[0].id)
          }
        }
      },
      { rootMargin: '0px 0px -70%' },
    )
    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  const jump = (id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setActiveId(id)
  }

  return (
    <aside className="w-[220px] flex-shrink-0 max-md:hidden" aria-label="本页目录">
      <div className="sticky top-[calc(var(--topbar-h)+56px)]">
        <p className="text-muted mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase">
          本页目录
        </p>
        <div className="flex flex-col">
          {toc.map((item) => {
            const active = activeId === item.id
            const indent = item.depth >= 3 ? 'pl-[26px] text-[12.5px]' : 'pl-3.5'
            return (
              <button
                key={item.id}
                className={`border-border before:bg-accent relative border-l-2 py-[5px] pr-0 text-left text-[13px] transition-colors duration-200 before:absolute before:top-0 before:bottom-0 before:-left-0.5 before:w-0.5 before:transition-opacity before:duration-200 before:content-[''] ${indent} ${
                  active
                    ? 'text-accent before:opacity-100'
                    : 'text-muted hover:text-fg2 before:opacity-0'
                }`}
                aria-current={active ? 'true' : undefined}
                onClick={() => jump(item.id)}
                title={item.text}
              >
                {item.text}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
