'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { MINDMAP } from '@/libs/mindmap'
import { SketchNode } from '@/components/mindmap/SketchNode'
import { SketchEdge } from '@/components/mindmap/SketchEdge'
import type { MindmapSource } from '@/types'

const nodeTypes = { sketch: SketchNode }
const edgeTypes = { sketch: SketchEdge }

/* 思维导图渲染（view-only）—— sketch 节点+边 + dagre 横向布局；跟随 html.dark 切 colorMode；不渲染 MiniMap（仅编辑模式需要） */
export function MindMapViewer({ source }: { source: MindmapSource }) {
  const { nodes, edges } = useMemo(() => {
    const l = MINDMAP.layoutGraph(source.nodes, source.edges, { direction: 'LR' })
    return {
      nodes: l.nodes.map((n) => ({
        ...n,
        type: 'sketch',
        data: { ...n.data, editable: false },
      })),
      edges: l.edges.map((e) => ({ ...e, type: 'sketch' })),
    }
  }, [source.nodes, source.edges])

  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const sync = () =>
      setColorMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <ReactFlowProvider>
      <div className="border-border bg-surface h-[calc(100vh-220px)] min-h-[480px] w-full overflow-hidden rounded-xl border">
        <ReactFlow
          nodes={nodes as unknown as Node[]}
          edges={edges as unknown as Edge[]}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode={colorMode}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
