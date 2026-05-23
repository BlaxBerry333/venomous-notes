'use client'

import { useEffect, useRef } from 'react'
import { Position, getBezierPath, type EdgeProps } from '@xyflow/react'
import rough from 'roughjs'

function __hashId(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h) || 1
}

/**
 * 手绘箭头三角：顶点 (x,y) 落在 target handle 上，底边朝 source 方向偏移
 * 三角的 "指向" = 顶点方向 = 朝 target node 本体的方向（与 handle position 相反）
 */
function __arrowPath(x: number, y: number, position: Position, size = 14): string {
  const half = size * 0.55
  switch (position) {
    case Position.Left:
      // target handle 在 target node 左边 → target 本体在 right → 箭头指向 right
      return `M ${x},${y} L ${x - size},${y - half} L ${x - size},${y + half} Z`
    case Position.Right:
      // target handle 在 target node 右边 → target 本体在 left → 箭头指向 left
      return `M ${x},${y} L ${x + size},${y - half} L ${x + size},${y + half} Z`
    case Position.Top:
      // 箭头指向 down
      return `M ${x},${y} L ${x - half},${y - size} L ${x + half},${y - size} Z`
    case Position.Bottom:
      // 箭头指向 up
      return `M ${x},${y} L ${x - half},${y + size} L ${x + half},${y + size} Z`
    default:
      return `M ${x},${y} L ${x - size},${y - half} L ${x - size},${y + half} Z`
  }
}

/* sketch 边：rough.js bezier + 终点手绘三角（朝向 target 节点本体） */
export function SketchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) {
  const gRef = useRef<SVGGElement>(null)
  const [pathD] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  useEffect(() => {
    const g = gRef.current
    if (!g) return
    g.innerHTML = ''
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const rc = rough.svg(tempSvg)

    // 主线
    const lineDrawn = rc.path(pathD, {
      stroke: '__SK_STROKE__',
      strokeWidth: selected ? 2 : 1.3,
      roughness: 1.3,
      bowing: 1.5,
      seed: __hashId(id),
      fill: 'none',
    })
    lineDrawn.querySelectorAll('path').forEach((p) => {
      if (p.getAttribute('stroke') === '__SK_STROKE__') {
        p.removeAttribute('stroke')
        p.style.stroke = selected ? 'var(--accent)' : 'var(--muted)'
      }
      p.style.fill = 'none'
    })
    while (lineDrawn.firstChild) g.appendChild(lineDrawn.firstChild)

    // 箭头（指向 target node 本体）
    const arrowD = __arrowPath(targetX, targetY, targetPosition, 14)
    const arrowDrawn = rc.path(arrowD, {
      stroke: '__SK_STROKE__',
      fill: '__SK_FILL__',
      fillStyle: 'solid',
      strokeWidth: selected ? 1.6 : 1.2,
      roughness: 0.7,
      bowing: 0,
      seed: __hashId(id + '-arrow'),
    })
    arrowDrawn.querySelectorAll('path').forEach((p) => {
      const stroke = p.getAttribute('stroke')
      const fill = p.getAttribute('fill')
      if (stroke === '__SK_STROKE__') {
        p.removeAttribute('stroke')
        p.style.stroke = selected ? 'var(--accent)' : 'var(--muted)'
      }
      if (fill === '__SK_FILL__') {
        p.removeAttribute('fill')
        p.style.fill = selected ? 'var(--accent)' : 'var(--muted)'
      }
    })
    while (arrowDrawn.firstChild) g.appendChild(arrowDrawn.firstChild)
  }, [pathD, id, selected, targetX, targetY, targetPosition])

  return <g ref={gRef} className="react-flow__edge-path" />
}
