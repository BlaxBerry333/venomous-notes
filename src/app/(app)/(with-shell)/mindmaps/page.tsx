import Link from 'next/link'
import { Icon } from '@iconify/react'
import { MINDMAPS } from '@/libs/mindmaps'

export default function MindmapsIndexPage() {
  const all = MINDMAPS.getAllMindmapMeta()

  if (all.length === 0) {
    return (
      <div className="border-border2 mt-8 rounded-[14px] border border-dashed px-7 py-16 text-center">
        <div className="text-fg2 text-[14px] font-semibold">还没有思维导图</div>
        <div className="text-muted mt-1.5 text-[12.5px]">
          在 <code className="text-accent font-mono text-[0.85em]">content/mindmaps/</code> 下加{' '}
          <code className="text-accent font-mono text-[0.85em]">.json</code>{' '}
          文件，或点上方「新建」按钮。
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 grid gap-3 max-md:grid-cols-1 md:grid-cols-2">
      {all.map((m) => (
        <Link
          key={m.slug.join('/')}
          href={`/mindmaps/${m.slug.join('/')}`}
          className="bg-surface border-border hover:border-border2 group flex flex-col gap-2 rounded-xl border p-4 transition duration-[250ms]"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-fg group-hover:text-accent text-[15px] font-semibold tracking-[-0.01em] transition">
              {m.title}
            </h3>
            <Icon
              icon="ph:tree-structure"
              width={18}
              height={18}
              className="text-muted2 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
          {m.description && (
            <p className="text-muted text-[12.5px] leading-[1.6]">{m.description}</p>
          )}
          <div className="text-muted2 mt-1 flex items-center gap-2.5 font-mono text-[11px]">
            <span>{m.slug[0] ?? 'general'}</span>
            {m.tags.length > 0 && <span>·</span>}
            {m.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}
