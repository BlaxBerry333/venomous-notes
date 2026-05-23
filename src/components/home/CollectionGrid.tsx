'use client'

import { Icon } from '@iconify/react'
import { Reveal } from './Reveal'

/** 收藏区块 · design-spec §1 [collections] —— 三栏区块卡，滚动揭示 §4.2 */

const COLLECTIONS = [
  {
    id: 'notes',
    icon: 'ph:note',
    title: 'Notes',
    desc: '技术笔记与长文沉淀，按主题归档，支持全文检索。',
  },
  {
    id: 'mindmaps',
    icon: 'ph:tree-structure',
    title: 'Mind Maps',
    desc: '把零散知识连成结构，用可缩放的节点图组织全局视野。',
  },
  {
    id: 'workflows',
    icon: 'ph:flow-arrow',
    title: 'Workflows',
    desc: '可执行的流程文档，把团队约定固化成可追溯的步骤。',
  },
] as const

export function CollectionGrid({ notesCount }: { notesCount: number }) {
  const counts: Record<string, number> = {
    notes: notesCount,
    mindmaps: 0,
    workflows: 0,
  }

  return (
    <section className="py-[64px] pt-0 max-md:mt-0 max-md:py-[44px] max-md:pt-[8px]">
      <div className="mb-[28px] flex items-baseline gap-[14px]">
        <h2 className="text-fg text-[23px] font-semibold tracking-[-0.02em]">Collections</h2>
        <span className="bg-border h-px flex-1" />
      </div>
      <Reveal>
        <div className="grid grid-cols-3 gap-[16px] max-md:grid-cols-1">
          {COLLECTIONS.map((c) => (
            <div
              className="group bg-surface2 border-border hover:border-border2 relative flex flex-col gap-[12px] rounded-[10px] border px-[20px] py-[22px] text-left shadow-[var(--shadow-sm)] transition duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)]"
              key={c.id}
            >
              <span className="bg-primary-light border-primary-border text-accent grid h-[38px] w-[38px] place-items-center rounded-[9px] border transition duration-[250ms]">
                <Icon icon={c.icon} width={19} height={19} aria-hidden="true" />
              </span>
              <h3 className="text-fg group-hover:text-accent text-[15.5px] font-semibold tracking-[-0.01em] transition duration-[180ms] ease-out">
                {c.title}
              </h3>
              <p className="text-muted flex-1 text-[13px] leading-[1.6]">{c.desc}</p>
              <div className="mt-[2px] flex items-center justify-between">
                <span className="text-muted2 font-mono text-[11.5px]">{counts[c.id]} entries</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
