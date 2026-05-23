'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

type ViewProps = {
  slug: string[]
  title: string
  category: string
  description?: string
  tags?: string[]
  editing: false
  onDelete: () => void
}
type EditProps = {
  slug: string[]
  title: string
  category: string
  description?: string
  tags?: string[]
  editing: true
  dirty: boolean
  saving: boolean
  error: string | null
  onSave: () => void
}

/** 共用按钮 class（与保存一致：实心 + rounded-md + px-2.5 py-1 + 字号字重） */
const PRIMARY_BTN =
  'bg-accent text-bg inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition hover:opacity-90 disabled:opacity-50'
const DANGER_BTN =
  'bg-red-500 text-white inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition hover:opacity-90 disabled:opacity-50'
const QUIET_BTN =
  'text-muted hover:text-fg hover:bg-surface2 rounded-md px-2 py-1 text-[12.5px] transition'

/** 单行 header：左 category/title/description/tags；右按钮区——view 给「编辑/删除」/ edit 给 ?/加节点/保存/退出 */
export function MindMapHeader(props: ViewProps | EditProps) {
  const canEdit = process.env.NODE_ENV === 'development'
  const slugStr = props.slug.join('/')
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (!helpOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHelpOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen])

  const tags = props.tags ?? []

  return (
    <div className="mb-3 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-muted2 font-mono text-[11px] tracking-[0.12em] uppercase">
          {props.category}
        </div>
        <h1 className="text-fg mt-0.5 truncate text-xl font-bold tracking-[-0.02em]">
          {props.title}
        </h1>
        {props.description && (
          <p className="text-muted mt-1 truncate text-[12.5px] leading-snug">{props.description}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-muted bg-surface border-border inline-flex items-center rounded-md border px-[9px] py-0.5 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap transition duration-[250ms]"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-1.5 pt-1">
        {props.editing ? (
          <>
            {props.error && <span className="mr-1 text-[12px] text-red-500">{props.error}</span>}
            {props.dirty && !props.saving && !props.error && (
              <span className="text-muted2 mr-1 text-[11.5px]">未保存</span>
            )}
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="text-muted hover:text-fg hover:bg-surface2 inline-flex h-7 w-7 items-center justify-center rounded-md transition"
              aria-label="操作说明"
              title="操作说明"
            >
              <Icon icon="ph:question" width={14} height={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={props.onSave}
              disabled={!props.dirty || props.saving}
              className={PRIMARY_BTN}
            >
              {props.saving && (
                <Icon
                  icon="ph:spinner"
                  width={12}
                  height={12}
                  className="animate-spin"
                  aria-hidden="true"
                />
              )}
              {props.saving ? '保存中' : '保存'}
            </button>
            <Link href={`/mindmaps/${slugStr}`} className={QUIET_BTN}>
              退出
            </Link>
          </>
        ) : (
          canEdit && (
            <>
              <Link href={`/mindmaps/${slugStr}?edit=1`} className={PRIMARY_BTN}>
                <Icon icon="ph:pencil-simple" width={13} height={13} aria-hidden="true" />
                编辑
              </Link>
              <button type="button" onClick={props.onDelete} className={DANGER_BTN}>
                <Icon icon="ph:trash" width={13} height={13} aria-hidden="true" />
                删除
              </button>
            </>
          )
        )}
      </div>

      {/* 编辑操作说明 modal —— 与新建思维导图弹框同款样式（居中 + p-6 单 padding） */}
      {helpOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,20,18,0.45)] backdrop-blur-[2px]"
          onClick={() => setHelpOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="编辑操作说明"
        >
          <div
            className="bg-surface2 border-border2 w-[440px] max-w-[92vw] rounded-[14px] border p-6 shadow-[var(--shadow-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-fg mb-4 text-[16px] font-semibold">编辑操作</h2>
            <ul className="text-muted space-y-2.5 text-[13px]">
              <li>
                <kbd className="bg-bg border-border text-muted mr-1 rounded border px-1 py-px font-mono text-[10.5px]">
                  双击节点
                </kbd>
                改 label（可换行）
              </li>
              <li>
                <kbd className="bg-bg border-border text-muted mr-1 rounded border px-1 py-px font-mono text-[10.5px]">
                  ⌘ / Ctrl + Enter
                </kbd>
                提交编辑 ·{' '}
                <kbd className="bg-bg border-border text-muted mx-1 rounded border px-1 py-px font-mono text-[10.5px]">
                  Esc
                </kbd>
                取消
              </li>
              <li>从节点 左/右边缘 拖出连线 → 落到另一节点</li>
              <li>
                选中节点/边后{' '}
                <kbd className="bg-bg border-border text-muted mx-1 rounded border px-1 py-px font-mono text-[10.5px]">
                  Del
                </kbd>{' '}
                /{' '}
                <kbd className="bg-bg border-border text-muted mx-1 rounded border px-1 py-px font-mono text-[10.5px]">
                  Backspace
                </kbd>{' '}
                删除
              </li>
              <li>
                <strong className="text-fg">加节点</strong> 按钮新增 ·{' '}
                <strong className="text-fg">保存</strong> 写回 JSON
              </li>
              <li className="text-muted2 pt-1">
                注：保存后下次加载位置会被 dagre 自动重排（只存逻辑结构）
              </li>
            </ul>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="bg-accent text-bg inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition hover:opacity-90"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
