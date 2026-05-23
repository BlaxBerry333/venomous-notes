'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { createMindmap } from '@/actions/mindmaps'

const SEG_RE = /^[a-zA-Z0-9\-_]+$/

/* 新建思维导图弹框——填 path（如 `frontend/learning-path`）+ 标题，调 createMindmap 落空模板，跳转 */
export function NewMindMapDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [path, setPath] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setPath('')
      setTitle('')
      setError(null)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const parts = path
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length === 0 || !parts.every((s) => SEG_RE.test(s))) {
      setError('路径每段必须是字母/数字/横线/下划线，用「/」分隔')
      setLoading(false)
      return
    }
    const filename = parts[parts.length - 1]
    const ttl = title.trim() || filename

    const result = await createMindmap(parts, {
      title: ttl,
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      description: '',
      nodes: [{ id: 'root', data: { label: ttl } }],
      edges: [],
    })
    if (result.ok) {
      router.push(`/mindmaps/${parts.join('/')}`)
      onClose()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,20,18,0.45)] backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="新建思维导图"
    >
      <form
        className="bg-surface2 border-border2 w-[440px] max-w-[92vw] rounded-[14px] border p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <h2 className="text-fg mb-4 text-[16px] font-semibold">新建思维导图</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-muted text-[12px]">路径</span>
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="frontend/learning-path"
              required
              className="bg-surface border-border text-fg focus:border-accent rounded-md border px-3 py-2 text-[13.5px] transition outline-none"
            />
            <span className="text-muted2 text-[11px]">
              用「/」分隔，最终对应 content/mindmaps/&lt;path&gt;.json
            </span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-muted text-[12px]">标题</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="（可选，留空时默认为文件名）"
              className="bg-surface border-border text-fg focus:border-accent rounded-md border px-3 py-2 text-[13.5px] transition outline-none"
            />
          </label>
          {error && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-red-500">
              <Icon icon="ph:warning" width={14} height={14} aria-hidden="true" />
              {error}
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-muted hover:text-fg rounded-md px-3 py-1.5 text-[13px] transition"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-bg inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {loading && (
              <Icon
                icon="ph:spinner"
                width={14}
                height={14}
                className="animate-spin"
                aria-hidden="true"
              />
            )}
            创建
          </button>
        </div>
      </form>
    </div>
  )
}
