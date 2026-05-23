import { AppShell } from '@/components/layout/AppShell'
import { NOTES } from '@/libs/notes'
import { MINDMAPS } from '@/libs/mindmaps'

/**
 * (with-shell) 子组 layout——只有 URL 落在此组内的路由（首页 / notes / mindmaps / workflows）
 * 才会拿到 AppShell（含侧栏/顶栏/面包屑）；
 * 组内 page 调 notFound() 时，Next.js 寻最近 not-found.tsx，会冒到 (app)/not-found.tsx
 * ——它在父层，故不经过本 layout，AppShell 不渲染。
 */
export default async function WithShellLayout({ children }: { children: React.ReactNode }) {
  const notesTree = NOTES.getNotesNavTree()
  const mindmapsTree = MINDMAPS.getMindmapsNavTree()
  const notes = NOTES.getAllNoteMeta()

  return (
    <AppShell notesTree={notesTree} mindmapsTree={mindmapsTree} notes={notes}>
      {children}
    </AppShell>
  )
}
