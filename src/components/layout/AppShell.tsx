'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ReadingProgress } from './ReadingProgress'
import { CommandPalette } from './CommandPalette'
import type { Crumb } from './Breadcrumb'
import type { NavNode, NoteMeta } from '@/types'

/* 应用外壳 · design-spec §2 —— sidebar + topbar + main + 命令面板 */
export function AppShell({
  tree,
  notes,
  children,
}: {
  tree: NavNode[]
  notes: NoteMeta[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)

  const isDoc = pathname.startsWith('/notes/')

  /* 路由变化（移动端点导航）后收起抽屉 */
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  /* ⌘K / Ctrl+K 命令面板 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openSearch = useCallback(() => {
    setSidebarOpen(false)
    setCmdkOpen(true)
  }, [])

  const crumbs = useMemo<Crumb[]>(() => {
    if (!isDoc) return [{ label: '首页' }]
    const slug = pathname.replace(/^\/notes\//, '')
    const note = notes.find((n) => n.slug.join('/') === slug)
    return [
      { label: '首页', href: '/' },
      { label: slug.split('/')[0] || 'general' },
      { label: note?.title ?? slug.split('/').pop() ?? '文档' },
    ]
  }, [isDoc, pathname, notes])

  return (
    <div className="flex min-h-full">
      <a
        className="bg-surface2 text-fg border-border2 fixed top-2.5 left-2.5 z-[120] -translate-y-[160%] rounded-lg border px-3.5 py-2 text-[13px] font-semibold shadow-[var(--shadow-md)] focus-visible:translate-y-0"
        href="#main"
      >
        跳到正文
      </a>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(20,20,18,0.5)] backdrop-blur-[2px] md:hidden!"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar tree={tree} mobileOpen={sidebarOpen} onSearch={openSearch} />

      <div className="ml-[var(--sidebar-w)] flex min-w-0 flex-1 flex-col max-md:ml-0">
        <Topbar crumbs={crumbs} onMenuClick={() => setSidebarOpen(true)} />
        {isDoc && <ReadingProgress />}
        <main className="flex-1" id="main">
          {children}
        </main>
      </div>

      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} notes={notes} />
    </div>
  )
}
