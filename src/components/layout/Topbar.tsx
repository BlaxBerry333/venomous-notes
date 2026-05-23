'use client'

import { Icon } from '@iconify/react'
import { Breadcrumb, type Crumb } from './Breadcrumb'
import { ThemeToggle } from '../theme/ThemeToggle'

/** 顶栏 · design-spec §1 [topbar] —— 56px 吸顶 */
export function Topbar({ crumbs, onMenuClick }: { crumbs: Crumb[]; onMenuClick: () => void }) {
  return (
    <header className="bg-bg-alpha border-border sticky top-0 z-30 flex h-[var(--topbar-h)] items-center border-b px-8 backdrop-blur-[12px] transition duration-[250ms] max-md:px-3.5">
      <button
        className="text-fg2 hover:bg-surface mr-1.5 hidden h-[34px] w-[34px] place-items-center rounded-lg transition duration-[250ms] max-md:grid md:hidden!"
        onClick={onMenuClick}
        aria-label="打开侧栏导航"
      >
        <Icon icon="ph:list" width={20} height={20} aria-hidden="true" />
      </button>
      <Breadcrumb crumbs={crumbs} />
      <div className="ml-auto flex items-center gap-1">
        <a
          className="text-muted hover:bg-surface hover:text-fg grid h-[34px] w-[34px] place-items-center rounded-lg transition duration-[250ms]"
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label="代码仓库"
        >
          <Icon icon="ph:github-logo" width={17} height={17} aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
