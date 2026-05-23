'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { NoteMeta } from '@/types'

/** 命令面板 · design-spec §4.8 —— ⌘K 搜索真实笔记，客户端内存过滤 */
export function CommandPalette({
  open,
  onClose,
  notes,
}: {
  open: boolean
  onClose: () => void
  notes: NoteMeta[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.slug[0] ?? '').toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [query, notes])

  const resultsRef = useRef(results)
  const activeIdxRef = useRef(activeIdx)
  useEffect(() => {
    resultsRef.current = results
  }, [results])
  useEffect(() => {
    activeIdxRef.current = activeIdx
  }, [activeIdx])

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement
      setQuery('')
      setActiveIdx(0)
      const t = setTimeout(() => inputRef.current?.focus(), 40)
      return () => clearTimeout(t)
    }
    restoreRef.current?.focus?.()
  }, [open])

  useEffect(() => setActiveIdx(0), [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const list = resultsRef.current
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((i) => Math.max(0, Math.min(i + 1, list.length - 1)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const r = list[activeIdxRef.current]
        if (r) {
          router.push(`/notes/${r.slug.join('/')}`)
          onClose()
        }
      } else if (e.key === 'Tab') {
        const f = panelRef.current?.querySelectorAll<HTMLElement>('input, button')
        if (!f || f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, router])

  const dur = reduced ? 0 : 0.18
  const activeOptionId = results[activeIdx]
    ? `cmdk-opt-${results[activeIdx].slug.join('-')}`
    : undefined

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(20,20,18,0.45)] pt-[14vh] backdrop-blur-[2px] transition duration-[250ms]"
          onClick={onClose}
          onMouseDown={(e) => e.preventDefault()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.15 }}
        >
          <motion.div
            ref={panelRef}
            className="bg-surface2 border-border2 w-[560px] max-w-[92vw] overflow-hidden rounded-[14px] border shadow-[var(--shadow-lg)] transition duration-[250ms]"
            role="dialog"
            aria-modal="true"
            aria-label="搜索笔记"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-border flex items-center gap-[11px] border-b px-[18px] py-4">
              <Icon
                icon="ph:magnifying-glass"
                width={18}
                height={18}
                className="text-muted flex-shrink-0"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索笔记、分类、标签…"
                aria-label="搜索"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="cmdk-listbox"
                aria-activedescendant={activeOptionId}
                className="text-fg placeholder:text-muted2 flex-1 border-none bg-transparent font-[inherit] text-[15px] focus:outline-none"
              />
              <kbd className="text-muted bg-surface border-border inline-flex items-center gap-px rounded-[5px] border px-1.5 py-0.5 font-mono text-[10.5px] transition duration-[250ms]">
                Esc
              </kbd>
            </div>

            <div
              className="max-h-[320px] overflow-y-auto p-2"
              id="cmdk-listbox"
              role="listbox"
              aria-label="搜索结果"
            >
              {results.length === 0 ? (
                <div className="text-muted2 p-8 text-center text-[13.5px]" role="status">
                  没有匹配的笔记
                </div>
              ) : (
                <>
                  <div className="text-muted2 px-3 pt-2 pb-1.5 text-[10.5px] font-semibold tracking-[0.12em] uppercase">
                    笔记
                  </div>
                  {results.map((n, i) => {
                    const sel = i === activeIdx
                    return (
                      <button
                        key={n.slug.join('/')}
                        id={`cmdk-opt-${n.slug.join('-')}`}
                        role="option"
                        aria-selected={sel}
                        className={`hover:bg-primary-light hover:text-fg flex w-full items-center gap-[11px] rounded-lg px-3 py-2.5 text-left transition duration-[250ms] ${
                          sel ? 'bg-primary-light text-fg' : 'text-fg2'
                        }`}
                        onMouseMove={() => setActiveIdx(i)}
                        onClick={() => {
                          router.push(`/notes/${n.slug.join('/')}`)
                          onClose()
                        }}
                      >
                        <Icon
                          icon="ph:file-text"
                          width={16}
                          height={16}
                          className={`flex-shrink-0 ${sel ? 'text-accent' : 'text-muted'}`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="text-[14px] font-medium">{n.title}</span>
                        </span>
                        <span className="text-muted2 font-mono text-[11.5px]">
                          {n.slug[0] ?? 'general'}
                        </span>
                      </button>
                    )
                  })}
                </>
              )}
            </div>

            <div className="border-border text-muted2 flex items-center gap-4 border-t px-4 py-2.5 text-[11.5px]">
              <span className="flex items-center gap-[5px]">
                <kbd className="text-muted bg-surface border-border inline-flex items-center gap-px rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] transition duration-[250ms]">
                  ↑
                </kbd>
                <kbd className="text-muted bg-surface border-border inline-flex items-center gap-px rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] transition duration-[250ms]">
                  ↓
                </kbd>
                选择
              </span>
              <span className="flex items-center gap-[5px]">
                <kbd className="text-muted bg-surface border-border inline-flex items-center gap-px rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] transition duration-[250ms]">
                  ↵
                </kbd>
                打开
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
