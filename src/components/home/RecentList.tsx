'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Reveal } from './Reveal'
import type { NoteMeta } from '@/types'

/** 近期笔记 · design-spec §1 [recent] —— 编辑式列表，逐行滚动揭示 §4.2 */

function fmtDate(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime()) || d.getFullYear() <= 1970) return null
  return d.toISOString().slice(0, 10)
}

function NoteRow({ note }: { note: NoteMeta }) {
  const category = note.slug[0] ?? 'general'
  const date = fmtDate(note.date)
  return (
    <Link
      href={`/notes/${note.slug.join('/')}`}
      className="group border-border hover:bg-surface hover:border-b-border2 flex w-full items-center gap-[20px] rounded-[8px] border-b px-[14px] py-[18px] text-left transition duration-[180ms] ease-out hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-[6px] flex items-center gap-[10px]">
          <span className="text-muted bg-surface border-border inline-flex items-center rounded-[6px] border px-[9px] py-[2px] text-[11px] font-medium tracking-[0.01em] whitespace-nowrap transition duration-[250ms]">
            {category}
          </span>
          <h3 className="text-fg group-hover:text-accent text-[15.5px] font-semibold tracking-[-0.01em] transition duration-[180ms] ease-out">
            {note.title}
          </h3>
        </div>
        {note.description && (
          <p className="text-muted overflow-hidden text-[13px] leading-[1.55] text-ellipsis whitespace-nowrap">
            {note.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-[14px]">
        {date && <span className="text-muted2 font-mono text-[12px]">{date}</span>}
        <Icon
          icon="ph:arrow-right"
          className="text-muted2 group-hover:text-accent -translate-x-[4px] opacity-0 transition duration-[180ms] ease-out group-hover:translate-x-0 group-hover:opacity-100"
          width={15}
          height={15}
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

export function RecentList({ notes }: { notes: NoteMeta[] }) {
  return (
    <section className="py-[64px] max-md:py-[44px]">
      <div className="mb-[28px] flex items-baseline gap-[14px]">
        <h2 className="text-fg text-[23px] font-semibold tracking-[-0.02em]">Recent</h2>
        <span className="bg-border h-px flex-1" />
        <span className="text-muted2 font-mono text-[12px]">{notes.length}</span>
      </div>
      <div className="border-border border-t">
        {notes.map((n, i) => (
          <Reveal key={n.slug.join('/')} delay={i * 0.05}>
            <NoteRow note={n} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
