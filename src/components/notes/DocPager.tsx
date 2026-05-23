import Link from 'next/link'
import { Icon } from '@iconify/react'

export interface PagerNote {
  title: string
  slug: string
}

/* 上一篇 / 下一篇 · design-spec §1 [doc-pager] */
export function DocPager({ prev, next }: { prev?: PagerNote; next?: PagerNote }) {
  if (!prev && !next) return null

  return (
    <nav className="mt-5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1" aria-label="文档翻页">
      {prev ? (
        <Link
          href={`/notes/${prev.slug}`}
          className="group bg-surface2 border-border hover:border-primary-border flex flex-col gap-[5px] rounded-[10px] border px-[18px] py-4 transition duration-[250ms]"
        >
          <span className="text-muted flex items-center gap-[5px] text-[11.5px] font-semibold tracking-[0.08em] uppercase">
            <Icon icon="ph:arrow-left" width={13} height={13} aria-hidden="true" />
            上一篇
          </span>
          <span className="text-fg group-hover:text-accent text-[14.5px] font-semibold">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/notes/${next.slug}`}
          className="group bg-surface2 border-border hover:border-primary-border flex flex-col items-end gap-[5px] rounded-[10px] border px-[18px] py-4 text-right transition duration-[250ms]"
        >
          <span className="text-muted flex items-center gap-[5px] text-[11.5px] font-semibold tracking-[0.08em] uppercase">
            下一篇
            <Icon icon="ph:arrow-right" width={13} height={13} aria-hidden="true" />
          </span>
          <span className="text-fg group-hover:text-accent text-[14.5px] font-semibold">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
