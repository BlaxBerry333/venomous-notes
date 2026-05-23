import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MINDMAPS } from '@/libs/mindmaps'
import { MindMapPageClient } from '@/components/mindmap/MindMapPageClient'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return MINDMAPS.getAllMindmapSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const source = MINDMAPS.getMindmapSource(slug)
  const title = source?.title ?? slug.at(-1)
  return { title }
}

export default async function MindMapPage({ params }: Props) {
  const { slug } = await params
  const source = MINDMAPS.getMindmapSource(slug)
  if (!source) notFound()
  return (
    <Suspense fallback={null}>
      <MindMapPageClient slug={slug} source={source} />
    </Suspense>
  )
}
