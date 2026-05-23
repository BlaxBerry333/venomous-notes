import { NOTES } from '@/libs/notes'
import { Hero, type Stat } from '@/components/home/Hero'
import { CollectionGrid } from '@/components/home/CollectionGrid'
import { RecentList } from '@/components/home/RecentList'
import type { NoteMeta } from '@/types'

function updatedLabel(notes: NoteMeta[]): string {
  const latest = notes.find((n) => new Date(n.date).getFullYear() > 1970)
  if (!latest) return '—'
  return new Date(latest.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function HomePage() {
  const notes = NOTES.getAllNoteMeta()
  const categories = Array.from(new Set(notes.map((n) => n.slug[0] ?? 'general')))
  const stats: Stat[] = [
    { label: 'Notes', value: String(notes.length) },
    { label: 'Categories', value: String(categories.length) },
    { label: 'Updated', value: updatedLabel(notes) },
  ]

  return (
    <>
      <div
        className="pointer-events-none fixed -top-[240px] -right-[200px] z-0 h-[1040px] w-[1040px] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_66%)] transition duration-[250ms] max-md:-top-[200px] max-md:-right-[200px] max-md:h-[560px] max-md:w-[560px]"
        aria-hidden="true"
      />
      <div className="relative z-[1] mx-auto max-w-[920px] px-[48px] max-md:px-[20px]">
        <div className="flex min-h-[calc(100vh-var(--topbar-h))] flex-col max-md:min-h-[auto]">
          <Hero stats={stats} />
          <CollectionGrid notesCount={notes.length} />
        </div>

        {notes.length > 0 ? (
          <RecentList notes={notes} />
        ) : (
          <section className="py-[64px] max-md:py-[44px]">
            <div className="border-border2 rounded-[14px] border border-dashed px-[28px] py-[64px] text-center">
              <div className="text-fg2 text-[14px] font-semibold">还没有笔记</div>
              <div className="text-muted mt-[6px] text-[12.5px]">
                在 <code className="text-accent font-mono text-[0.85em]">content/notes/</code>{' '}
                下添加 <code className="text-accent font-mono text-[0.85em]">.mdx</code>{' '}
                文件，笔记会自动出现在这里。
              </div>
            </div>
          </section>
        )}

        <footer className="border-border text-muted2 mt-[32px] flex items-center justify-between border-t py-[32px] text-[12px] transition duration-[250ms] max-md:flex-col max-md:items-start max-md:gap-[10px]">
          <span>Venomous Notes · 个人技术知识库</span>
          <span className="text-muted flex items-center gap-[6px]">
            <span className="bg-accent h-[6px] w-[6px] rounded-full" />
            本地运行 · v0.1.0
          </span>
        </footer>
      </div>
    </>
  )
}
