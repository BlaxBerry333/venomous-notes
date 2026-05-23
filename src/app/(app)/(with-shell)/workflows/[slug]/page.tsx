import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Workflow: ${slug}` }
}

export default async function WorkflowPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="px-10 py-12">
      <h1 className="text-fg mb-6 text-2xl font-bold tracking-[-0.02em]">{slug}</h1>
      <div className="bg-surface2 border-border text-muted2 flex h-[520px] flex-col items-center justify-center gap-2.5 rounded-xl border">
        <div className="text-4xl opacity-[0.12]">⬦</div>
        <div className="text-[14px]">ReactFlow WorkflowViewer</div>
        <div className="text-[12px] opacity-50">Phase 3</div>
      </div>
    </div>
  )
}
