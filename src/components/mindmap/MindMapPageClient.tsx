'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MindMapViewer } from '@/components/visualizer/MindMapViewer'
import { EditableMindMap } from './EditableMindMap'
import { MindMapHeader } from './MindMapHeader'
import { deleteMindmap } from '@/actions/mindmaps'
import type { MindmapSource } from '@/types'

/** 按 URL `?edit=1` 分发——view 模式：MindMapHeader + Viewer；edit 模式：EditableMindMap 自带 header */
export function MindMapPageClient({ slug, source }: { slug: string[]; source: MindmapSource }) {
  const params = useSearchParams()
  const router = useRouter()
  const canEdit = process.env.NODE_ENV === 'development'
  const editMode = canEdit && params.get('edit') === '1'

  const title = source.title ?? slug.at(-1) ?? '思维导图'
  const category = slug[0] ?? 'general'

  const onDelete = useCallback(async () => {
    if (!window.confirm(`确认删除「${title}」？\n此操作不可撤销。`)) return
    const result = await deleteMindmap(slug)
    if (result.ok) {
      router.push('/mindmaps')
    } else {
      window.alert(`删除失败：${result.error}`)
    }
  }, [slug, title, router])

  if (editMode) {
    return <EditableMindMap slug={slug} initial={source} />
  }
  return (
    <>
      <MindMapHeader
        slug={slug}
        title={title}
        category={category}
        description={source.description}
        tags={source.tags}
        editing={false}
        onDelete={onDelete}
      />
      <MindMapViewer source={source} />
    </>
  )
}
