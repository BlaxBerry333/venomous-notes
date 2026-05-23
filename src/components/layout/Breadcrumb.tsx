import Link from 'next/link'
import { Fragment } from 'react'
import { Icon } from '@iconify/react'

export interface Crumb {
  label: string
  href?: string
}

/** 面包屑 · design-spec §1 [topbar]（移动端 CSS 隐藏） */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      className="text-muted flex min-w-0 items-center gap-[7px] text-[13px] max-md:hidden"
      aria-label="面包屑"
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span className="text-muted2 inline-flex flex-shrink-0" aria-hidden="true">
                <Icon icon="ph:caret-right" width={13} height={13} />
              </span>
            )}
            {last || !c.href ? (
              <span className="text-fg2 overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="text-muted hover:text-accent">
                {c.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
