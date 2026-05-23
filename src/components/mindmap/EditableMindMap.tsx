'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Icon } from '@iconify/react'
import { MINDMAP } from '@/libs/mindmap'
import { saveMindmap } from '@/actions/mindmaps'
import { SketchNode } from './SketchNode'
import { SketchEdge } from './SketchEdge'
import type { MindmapSource } from '@/types'
import { MindMapHeader } from './MindMapHeader'

const nodeTypes = { sketch: SketchNode }
const edgeTypes = { sketch: SketchEdge }
const defaultEdgeOptions = { type: 'sketch' as const }

/* 编辑模式渲染——拖拽 / 加 / 删 / 连边 / 节点内 inline 改 label（textarea，⌘Enter 提交）/ 保存调 Server Action */
export function EditableMindMap({ slug, initial }: { slug: string[]; initial: MindmapSource }) {
  const layouted = useMemo(
    () => MINDMAP.layoutGraph(initial.nodes, initial.edges, { direction: 'LR' }),
    [initial],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layouted.nodes.map((n) => ({ ...n, type: 'sketch' })) as unknown as Node[],
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layouted.edges.map((e) => ({ ...e, type: 'sketch' })) as unknown as Edge[],
  )
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 节点 label 提交回调（注入到 data.onCommit；SketchNode 双击编辑后调用）
  const onCommitLabel = useCallback(
    (id: string, label: string) => {
      setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)))
      setDirty(true)
    },
    [setNodes],
  )

  // 把 editable+onCommit 注入到 nodes data；onCommitLabel 变化时同步刷新
  // 注：useNodesState 初始化只用一次，这里通过 setNodes 直接刷 data 即可
  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) =>
        n.data && (n.data as { onCommit?: unknown }).onCommit === onCommitLabel
          ? n
          : { ...n, data: { ...n.data, editable: true, onCommit: onCommitLabel } },
      ),
    )
  }, [onCommitLabel, setNodes])

  // 跟随 html.dark class 切 colorMode（给 Controls/MiniMap 用；sketch 节点/边走 CSS var）
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

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
      if (changes.some((c) => c.type === 'position' || c.type === 'remove' || c.type === 'add')) {
        setDirty(true)
      }
    },
    [onNodesChange],
  )

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes)
      if (changes.some((c) => c.type === 'remove' || c.type === 'add')) {
        setDirty(true)
      }
    },
    [onEdgesChange],
  )

  const onConnect = useCallback(
    (conn: Connection) => {
      if (!conn.source || !conn.target) return
      setEdges((eds) =>
        addEdge(
          { ...conn, id: `e-${conn.source}-${conn.target}-${Date.now()}`, type: 'sketch' },
          eds,
        ),
      )
      setDirty(true)
    },
    [setEdges],
  )

  const onAddNode = useCallback(() => {
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const last = nodes[nodes.length - 1]
    const pos = last ? { x: last.position.x + 240, y: last.position.y + 20 } : { x: 100, y: 100 }
    setNodes((ns) => [
      ...ns,
      {
        id,
        position: pos,
        data: { label: '新节点', editable: true, onCommit: onCommitLabel },
        type: 'sketch',
      } as Node,
    ])
    setDirty(true)
  }, [nodes, setNodes, onCommitLabel])

  const onSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    const source: MindmapSource = {
      title: initial.title,
      date: initial.date,
      tags: initial.tags,
      description: initial.description,
      nodes: nodes.map((n) => ({
        id: n.id,
        data: { label: (n.data as { label: string }).label },
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    }
    const result = await saveMindmap(slug, source)
    if (result.ok) {
      setDirty(false)
    } else {
      setError(result.error)
    }
    setSaving(false)
  }, [slug, nodes, edges, initial])

  const minimapNodeColor = useCallback(
    (n: Node) => {
      const accent = colorMode === 'dark' ? '#34c99b' : '#0f7b5f'
      const idle = colorMode === 'dark' ? '#3b3b35' : '#d8d8d1'
      return n.selected ? accent : idle
    },
    [colorMode],
  )

  const title = initial.title ?? slug.at(-1) ?? '思维导图'
  const category = slug[0] ?? 'general'

  return (
    <>
      <MindMapHeader
        slug={slug}
        title={title}
        category={category}
        description={initial.description}
        tags={initial.tags}
        editing
        dirty={dirty}
        saving={saving}
        error={error}
        onSave={onSave}
      />
      <ReactFlowProvider>
        <div className="border-border bg-surface relative h-[calc(100vh-220px)] min-h-[480px] w-full overflow-hidden rounded-xl border">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            colorMode={colorMode}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable
            nodesConnectable
            elementsSelectable
            deleteKeyCode={['Backspace', 'Delete']}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} />
            <MiniMap
              pannable
              zoomable
              nodeColor={minimapNodeColor}
              nodeStrokeColor={minimapNodeColor}
              nodeStrokeWidth={2}
            />
            <Controls />
          </ReactFlow>
          <button
            type="button"
            onClick={onAddNode}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-accent/10 text-accent hover:bg-accent/15 absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-[7px] px-3 py-[7px] text-[12.5px] font-medium shadow-[var(--shadow-sm)] transition duration-[250ms]"
          >
            <Icon icon="ph:plus" width={13} height={13} aria-hidden="true" />
            加节点
          </button>
        </div>
      </ReactFlowProvider>
    </>
  )
}
