'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import rough from 'roughjs'

const W = 200
const MIN_H = 44
const RADIUS = 8

function __hashId(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h) || 1
}

function __roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M ${x + r},${y} H ${x + w - r} A ${r},${r} 0 0 1 ${x + w},${y + r} V ${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} H ${x + r} A ${r},${r} 0 0 1 ${x},${y + h - r} V ${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`
}

interface SketchNodeData {
  label: string
  editable?: boolean
  onCommit?: (id: string, label: string) => void
}

/** sketch 节点：单层容器 + 绝对定位 SVG（rough 描边）+ inline textarea 编辑；高度按文字撑开 */
export function SketchNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as SketchNodeData
  const seed = useMemo(() => __hashId(id), [id])
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(d.label)
  const [size, setSize] = useState({ w: W, h: MIN_H })

  useEffect(() => {
    if (!editing) setDraft(d.label)
  }, [d.label, editing])

  // 测容器实际高度 → 同步 SVG 让 rough 重画
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const h = Math.max(MIN_H, el.offsetHeight)
      setSize((s) => (s.h === h ? s : { w: W, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // rough.js 画矩形（依赖 size + selected）
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.innerHTML = ''
    const rc = rough.svg(svg)
    const drawn = rc.path(__roundedRectPath(3, 3, size.w - 6, size.h - 6, RADIUS), {
      stroke: '__SK_STROKE__',
      strokeWidth: selected ? 2 : 1.4,
      fill: '__SK_FILL__',
      fillStyle: 'solid',
      roughness: 1.4,
      bowing: 1.2,
      seed,
    })
    drawn.querySelectorAll('path').forEach((p) => {
      if (p.getAttribute('stroke') === '__SK_STROKE__') {
        p.removeAttribute('stroke')
        p.style.stroke = selected ? 'var(--accent)' : 'var(--ink)'
      }
      if (p.getAttribute('fill') === '__SK_FILL__') {
        p.removeAttribute('fill')
        p.style.fill = 'var(--surface)'
      }
    })
    svg.appendChild(drawn)
  }, [size.w, size.h, selected, seed])

  const commit = () => {
    const next = draft.trim()
    if (next && next !== d.label) d.onCommit?.(id, next)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(d.label)
    setEditing(false)
  }

  // 选中态文字 + 输入框文字同步 accent 色
  const textColor = selected ? 'var(--accent)' : undefined

  return (
    <div
      ref={containerRef}
      className="font-sketch relative flex min-h-[44px] items-center justify-center px-3 py-2 text-center text-[15px] leading-[1.35]"
      style={{ width: W, minHeight: MIN_H, color: textColor ?? 'var(--ink)' }}
      onDoubleClick={(e) => {
        if (d.editable && d.onCommit) {
          e.stopPropagation()
          setEditing(true)
        }
      }}
    >
      <svg
        width={size.w}
        height={size.h}
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              cancel()
            } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              commit()
            }
          }}
          autoFocus
          rows={Math.max(1, draft.split('\n').length)}
          className="nodrag nopan font-sketch relative w-full resize-none border-none bg-transparent text-center text-[15px] leading-[1.35] outline-none"
          style={{ color: textColor ?? 'var(--ink)' }}
        />
      ) : (
        <span className="relative break-words whitespace-pre-wrap">{d.label}</span>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'transparent', border: 'none', width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'transparent', border: 'none', width: 8, height: 8 }}
      />
    </div>
  )
}
