'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

/**
 * 错误/状态页外壳——简化版顶栏（品牌 + GitHub + 主题切换）+ 主区；
 * 刻意不含侧栏 / 不含面包屑，与 AppShell（带 Sidebar+Breadcrumb）对位。
 */
export function StatusShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-bg-alpha border-border sticky top-0 z-30 flex h-[var(--topbar-h)] items-center border-b px-8 backdrop-blur-[12px] transition duration-[250ms] max-md:px-3.5">
        <Link href="/" className="flex items-center gap-[11px]" aria-label="返回首页">
          <span className="font-display text-fg text-[19px] font-[540] tracking-[-0.012em] whitespace-nowrap">
            Venomous Notes
          </span>
        </Link>
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
      <main className="flex flex-1 flex-col" id="main">
        {children}
      </main>
    </div>
  )
}
