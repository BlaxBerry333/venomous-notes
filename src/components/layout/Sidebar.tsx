'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { NavNode } from '@/types'
import { NewMindMapDialog } from '@/components/mindmap/NewMindMapDialog'

/* 侧栏 · design-spec §1 [sidebar] —— 分区 Tabs + 导航树 / 空状态；移动端抽屉 */

const SECTIONS = [
  { id: 'notes', label: 'Notes', icon: 'ph:note', cn: '笔记' },
  { id: 'mindmaps', label: 'Maps', icon: 'ph:tree-structure', cn: '思维导图' },
  { id: 'workflows', label: 'Flow', icon: 'ph:flow-arrow', cn: '工作流' },
] as const
type SectionId = (typeof SECTIONS)[number]['id']

function countFiles(nodes: NavNode[]): number {
  return nodes.reduce((s, n) => s + (n.type === 'file' ? 1 : countFiles(n.children ?? [])), 0)
}
function folderHasActive(node: NavNode, pathname: string, section: SectionId): boolean {
  if (node.type === 'file') return `/${section}/${node.slug}` === pathname
  return node.children?.some((c) => folderHasActive(c, pathname, section)) ?? false
}

function sectionFromPath(pathname: string): SectionId | null {
  if (pathname.startsWith('/mindmaps/') || pathname === '/mindmaps') return 'mindmaps'
  if (pathname.startsWith('/workflows/') || pathname === '/workflows') return 'workflows'
  if (pathname.startsWith('/notes/') || pathname === '/notes') return 'notes'
  return null
}

function FileNode({
  node,
  reduced,
  section,
}: {
  node: NavNode
  reduced: boolean
  section: SectionId
}) {
  const pathname = usePathname()
  const href = `/${section}/${node.slug}`
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`hover:bg-surface2 hover:text-fg relative block w-full overflow-hidden rounded-[7px] py-[7px] pr-2.5 pl-[22px] text-left text-[13.5px] text-ellipsis whitespace-nowrap transition duration-[250ms] ${
        active ? 'text-accent font-medium' : 'text-muted'
      }`}
      aria-current={active ? 'page' : undefined}
      title={node.title ?? node.name}
    >
      {active &&
        (reduced ? (
          <span className="bg-accent absolute top-[7px] bottom-[7px] left-1.5 w-0.5 rounded-[2px]" />
        ) : (
          <motion.span
            layoutId="nav-active"
            className="bg-accent absolute top-[7px] bottom-[7px] left-1.5 w-0.5 rounded-[2px]"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        ))}
      {node.title ?? node.name}
    </Link>
  )
}

function FolderNode({
  node,
  reduced,
  section,
}: {
  node: NavNode
  reduced: boolean
  section: SectionId
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(
    () => node.children?.some((c) => folderHasActive(c, pathname, section)) ?? true,
  )
  useEffect(() => {
    if (node.children?.some((c) => folderHasActive(c, pathname, section))) setOpen(true)
  }, [pathname, node, section])
  return (
    <div>
      <button
        className="text-fg2 hover:bg-surface2 flex w-full items-center gap-1.5 rounded-[7px] px-2.5 py-[7px] text-left text-[13.5px] font-medium transition duration-[250ms]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Icon
          icon="ph:caret-right"
          width={12}
          height={12}
          className={`text-muted2 flex-shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        />
        <Icon icon="ph:folder-simple" width={14} height={14} aria-hidden="true" />
        <span>{node.name}</span>
      </button>
      {open && (
        <div className="pl-3">
          <NavNodes nodes={node.children ?? []} reduced={reduced} section={section} />
        </div>
      )}
    </div>
  )
}

function NavNodes({
  nodes,
  reduced,
  section,
}: {
  nodes: NavNode[]
  reduced: boolean
  section: SectionId
}) {
  return (
    <>
      {nodes.map((n) =>
        n.type === 'folder' ? (
          <FolderNode key={`folder-${n.name}`} node={n} reduced={reduced} section={section} />
        ) : (
          <FileNode key={`file-${n.slug ?? n.name}`} node={n} reduced={reduced} section={section} />
        ),
      )}
    </>
  )
}

function EmptyState({ section }: { section: (typeof SECTIONS)[number] }) {
  return (
    <div className="flex flex-col items-center px-6 py-[52px] text-center">
      <span className="bg-bg border-border text-muted2 grid h-[44px] w-[44px] place-items-center rounded-xl border">
        <Icon icon={section.icon} width={20} height={20} aria-hidden="true" />
      </span>
      <p className="text-muted mt-3.5 text-[13px] font-medium">暂无{section.cn}</p>
      <p className="text-muted2 mt-[5px] text-[11.5px] leading-[1.5]">内容添加后会自动出现在这里</p>
    </div>
  )
}

export function Sidebar({
  notesTree,
  mindmapsTree,
  mobileOpen,
  onSearch,
}: {
  notesTree: NavNode[]
  mindmapsTree: NavNode[]
  mobileOpen: boolean
  onSearch: () => void
}) {
  const reduced = useReducedMotion() ?? false
  const pathname = usePathname()
  const [section, setSection] = useState<SectionId>('notes')
  const [newMapOpen, setNewMapOpen] = useState(false)
  const canEditMindmap = process.env.NODE_ENV === 'development'

  // 进入对应顶级路由时自动切到对应 tab
  useEffect(() => {
    const sec = sectionFromPath(pathname)
    if (sec) setSection(sec)
  }, [pathname])

  const treeMap: Record<SectionId, NavNode[]> = {
    notes: notesTree,
    mindmaps: mindmapsTree,
    workflows: [],
  }
  const activeTree = treeMap[section]
  const counts: Record<SectionId, number> = {
    notes: countFiles(notesTree),
    mindmaps: countFiles(mindmapsTree),
    workflows: 0,
  }

  return (
    <aside
      className={`bg-surface border-border fixed top-0 left-0 z-20 flex h-screen w-[var(--sidebar-w)] flex-col border-r transition duration-[250ms] max-md:z-[60] ${
        mobileOpen
          ? 'max-md:translate-x-0 max-md:shadow-[var(--shadow-lg)]'
          : 'max-md:-translate-x-full'
      }`}
      aria-label="侧栏"
    >
      <Link
        href="/"
        className="flex h-16 flex-shrink-0 items-center gap-[11px] px-5"
        aria-label="返回首页"
      >
        <span className="font-display text-fg text-[19px] font-[540] tracking-[-0.012em] whitespace-nowrap">
          Venomous Notes
        </span>
      </Link>

      <button
        className="bg-surface2 border-border text-muted hover:border-border2 mx-4 mt-1 mb-3.5 flex h-[38px] items-center gap-[9px] rounded-lg border px-[11px] text-left text-[13px] transition duration-[250ms]"
        onClick={onSearch}
        aria-label="搜索笔记"
      >
        <Icon icon="ph:magnifying-glass" width={15} height={15} aria-hidden="true" />
        <span className="flex-1">搜索笔记…</span>
        <kbd className="text-muted bg-surface border-border inline-flex items-center gap-px rounded-[5px] border px-1.5 py-0.5 font-mono text-[10.5px] transition duration-[250ms]">
          ⌘K
        </kbd>
      </button>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="bg-bg border-border mx-4 mb-0.5 flex gap-0.5 rounded-[9px] border p-[3px] transition duration-[250ms]"
          role="tablist"
          aria-label="内容分区"
        >
          {SECTIONS.map((s) => {
            const sel = s.id === section
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={sel}
                className={`flex h-[30px] flex-1 items-center justify-center gap-[5px] rounded-md text-[12px] font-medium transition duration-[250ms] ${
                  sel
                    ? 'bg-surface2 text-accent shadow-[var(--shadow-sm)]'
                    : 'text-muted hover:text-fg2'
                }`}
                onClick={() => setSection(s.id)}
              >
                <Icon icon={s.icon} width={14} height={14} aria-hidden="true" />
                <span>
                  {s.label}
                  {counts[s.id] > 0 && (
                    <span className="text-muted2 ml-1 font-mono text-[10px]">{counts[s.id]}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pt-2.5 pb-6" aria-label="文档导航">
          {section === 'mindmaps' && canEditMindmap && (
            <button
              type="button"
              onClick={() => setNewMapOpen(true)}
              className="bg-accent/10 text-accent hover:bg-accent/15 mb-2 flex w-full items-center justify-center gap-1.5 rounded-[7px] py-[7px] text-[12.5px] font-medium transition duration-[250ms]"
            >
              <Icon icon="ph:plus" width={13} height={13} aria-hidden="true" />
              新建思维导图
            </button>
          )}
          {activeTree.length === 0 ? (
            <EmptyState section={SECTIONS.find((s) => s.id === section)!} />
          ) : (
            <NavNodes nodes={activeTree} reduced={reduced} section={section} />
          )}
        </nav>
      </div>

      <div className="border-border text-muted2 flex flex-shrink-0 items-center justify-between border-t px-5 py-3 text-[11px]">
        <span>v0.1.0</span>
        <span className="flex items-center gap-1.5">
          <span className="bg-accent h-1.5 w-1.5 rounded-full" />
          Local
        </span>
      </div>

      <NewMindMapDialog open={newMapOpen} onClose={() => setNewMapOpen(false)} />
    </aside>
  )
}
